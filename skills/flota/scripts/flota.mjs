#!/usr/bin/env node
// La flota: flujo coordinador (Claude) + ejecutor (Codex) para CUALQUIER proyecto con Git.
//   El coordinador escribe la ficha → Codex la EJECUTA en una copia aparte (git worktree) → PUERTAS automáticas del proyecto
//   → REVISIÓN de solo lectura con otro modelo (veredicto en JSON) → el coordinador verifica cada hallazgo y DECIDE.
// Este script hace los pasos mecánicos y deja un informe. Nunca guarda cambios (commit), nunca sube, nunca fusiona.
//
// Uso (desde cualquier carpeta del repositorio):
//   node flota.mjs todo <ficha.md> [--base rama] [--puertas "orden"] [--riesgo normal|critico] [--complejidad simple|normal|compleja]
//   node flota.mjs simulacro <ficha.md> [--base rama]      enseña lo que haría, sin gastar nada
//   node flota.mjs ejecutar <ficha.md> [--base rama] [--ronda N]
//   node flota.mjs puertas [--dir carpeta] [--puertas "orden"]
//   node flota.mjs revisar <ficha.md> --dir carpeta [--riesgo …] [--ronda N]
//   node flota.mjs limpiar <ficha.md> [--ronda N]          quita la copia de trabajo y su rama local
//
// Puertas: --puertas "orden" si se da; si no, scripts/verificar.mjs del proyecto; si no, los scripts de package.json
// (verificar, o typecheck/tsc + lint + test + build); si no, pytest. Modelos (cambiables con variables de entorno):
//   simple → FLOTA_SIMPLE (gpt-6-luna, esfuerzo bajo) · normal → FLOTA_EJECUTOR (gpt-6.1-sol, medio) · compleja → FLOTA_EJECUTOR, alto
//   revisión normal → FLOTA_REVISOR (gpt-6-luna, medio) · revisión crítica → FLOTA_CRITICO (gpt-6-astra, alto).
import { spawnSync } from "node:child_process";
import { existsSync, lstatSync, mkdirSync, readFileSync, rmdirSync, symlinkSync, unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const aqui = dirname(fileURLToPath(import.meta.url));
const win = process.platform === "win32";
const M = {
  simple: process.env.FLOTA_SIMPLE ?? "gpt-6-luna",
  ejecutor: process.env.FLOTA_EJECUTOR ?? "gpt-6.1-sol",
  revisor: process.env.FLOTA_REVISOR ?? "gpt-6-luna",
  critico: process.env.FLOTA_CRITICO ?? "gpt-6-astra",
};
const ESFUERZOS = ["low", "medium", "high", "xhigh"];
const decir = (t) => console.log(`\n▶ ${t}`);
const fallar = (t) => { console.error(`\n✘ ${t}`); process.exit(1); };

const [orden, ...resto] = process.argv.slice(2);
const opcion = (n, d) => { const i = resto.indexOf(n); return i >= 0 ? resto[i + 1] : d; };
const posicional = resto.find((a, i) => !a.startsWith("--") && !(i > 0 && resto[i - 1].startsWith("--")));

function git(args, cwd) {
  const r = spawnSync("git", args, { cwd, encoding: "utf8" });
  if (r.status !== 0) throw new Error(`git ${args.join(" ")}: ${(r.stderr || "").trim()}`);
  return r.stdout.trim();
}
const raiz = (() => { try { return git(["rev-parse", "--show-toplevel"], process.cwd()); } catch { return fallar("Esto no es un repositorio Git: la flota necesita Git para trabajar en una copia aparte."); } })();
const repo = basename(raiz);
const zona = join(tmpdir(), "flota", repo);

/** Codex sin pasar por el shell (en Windows `codex` es un .cmd y los textos largos se estropean al entrecomillarlos). */
function ordenDeCodex() {
  if (win) {
    const donde = spawnSync("where", ["codex"], { encoding: "utf8" }).stdout?.split(/\r?\n/).find((l) => l.trim().endsWith("codex.cmd"));
    if (donde) {
      const js = join(dirname(donde.trim()), "node_modules", "@openai", "codex", "bin", "codex.js");
      if (existsSync(js)) return [process.execPath, [js]];
    }
  }
  return ["codex", []];
}

/** Codex sin interacción: el texto va por la entrada estándar (`-`), nunca como argumento. */
function codex(modelo, sandbox, cwd, texto, { esquema, salida, registro, esfuerzo } = {}) {
  const [cmd, base] = ordenDeCodex();
  const args = [...base, "exec", "-m", modelo, "-s", sandbox, "--ephemeral", "--color", "never", "-C", cwd];
  if (esfuerzo) args.push("-c", `model_reasoning_effort="${esfuerzo}"`);
  if (esquema) args.push("--output-schema", esquema);
  if (salida) args.push("-o", salida);
  args.push("-");
  const r = spawnSync(cmd, args, { input: texto, encoding: "utf8", maxBuffer: 256 * 1024 * 1024, timeout: 40 * 60_000 });
  if (registro) writeFileSync(registro, `${r.stdout ?? ""}\n${r.stderr ?? ""}`);
  return r;
}

function fichaDe(ruta) {
  const abs = resolve(ruta);
  if (!existsSync(abs)) fallar(`No existe la ficha ${ruta}`);
  const texto = readFileSync(abs, "utf8");
  const id = (basename(abs).match(/^(T-\d+)/i) ?? [])[1]?.toUpperCase() ?? basename(abs, ".md");
  const riesgo = (texto.match(/^\s*[-*]?\s*\**riesgo\**\s*:\s*\**\s*(normal|cr[ií]tico)/im) ?? [])[1];
  const complejidad = (texto.match(/^\s*[-*]?\s*\**complejidad\**\s*:\s*\**\s*(simple|normal|compleja)/im) ?? [])[1]?.toLowerCase();
  return { abs, texto, id, complejidad: complejidad ?? "normal", riesgo: riesgo?.toLowerCase().startsWith("cr") ? "critico" : "normal" };
}

const perfilEjecucion = (complejidad, esfuerzo) => {
  const p = { simple: { modelo: M.simple, esfuerzo: "low" }, normal: { modelo: M.ejecutor, esfuerzo: "medium" }, compleja: { modelo: M.ejecutor, esfuerzo: "high" } }[complejidad];
  if (!p) fallar(`Complejidad desconocida «${complejidad}» (simple, normal o compleja).`);
  if (esfuerzo && !ESFUERZOS.includes(esfuerzo)) fallar(`Esfuerzo desconocido «${esfuerzo}».`);
  return { ...p, esfuerzo: esfuerzo ?? p.esfuerzo };
};
const perfilRevision = (riesgo) => (riesgo === "critico" ? { modelo: M.critico, esfuerzo: "high" } : { modelo: M.revisor, esfuerzo: "medium" });

const rutas = (ficha, ronda) => {
  const rama = `flota/${ficha.id.toLowerCase()}${ronda > 1 ? `-r${ronda}` : ""}`;
  const copia = join(zona, "copias", rama.replace("/", "-"));
  const informe = join(zona, "informes", ficha.id, `ronda-${ronda}`);
  return { rama, copia, informe };
};

/** Las comprobaciones automáticas que el proyecto ya tiene, en orden de preferencia. */
function detectarPuertas(dir) {
  const propia = opcion("--puertas");
  if (propia) return [{ nombre: "puertas indicadas", cmd: propia }];
  if (existsSync(join(dir, "scripts", "verificar.mjs"))) return [{ nombre: "verificar del proyecto", cmd: "node scripts/verificar.mjs --sin-version" }];
  const pkg = join(dir, "package.json");
  if (existsSync(pkg)) {
    const s = JSON.parse(readFileSync(pkg, "utf8")).scripts ?? {};
    if (s.verificar) return [{ nombre: "verificar", cmd: "npm run verificar" }];
    const l = [];
    if (s.typecheck) l.push({ nombre: "tipos", cmd: "npm run typecheck" });
    else if (existsSync(join(dir, "tsconfig.json"))) l.push({ nombre: "tipos", cmd: "npx tsc --noEmit" });
    if (s.lint) l.push({ nombre: "lint", cmd: "npm run lint" });
    if (s.test && !/no test specified/.test(s.test)) l.push({ nombre: "pruebas", cmd: "npm test" });
    if (s.build) l.push({ nombre: "compilación", cmd: "npm run build" });
    if (l.length) return l;
  }
  if (["pyproject.toml", "pytest.ini", "setup.cfg"].some((f) => existsSync(join(dir, f)))) return [{ nombre: "pytest", cmd: "python -m pytest -q" }];
  return [];
}

function ejecutar(ficha, { base, ronda = 1, simulacro = false } = {}) {
  const perfil = perfilEjecucion(opcion("--complejidad", ficha.complejidad), opcion("--esfuerzo"));
  const { rama, copia, informe } = rutas(ficha, ronda);
  const origen = base ?? git(["rev-parse", "--abbrev-ref", "HEAD"], raiz);
  const lista = detectarPuertas(raiz).map((p) => p.cmd).join(" · ") || "(ninguna detectada)";
  if (simulacro) {
    console.log(`[simulacro] copia: git worktree add ${copia} -b ${rama} ${origen}`);
    console.log(`[simulacro] Codex ${perfil.modelo} (esfuerzo ${perfil.esfuerzo}, escritura solo en la copia) con la ficha ${ficha.abs}`);
    console.log(`[simulacro] puertas: ${lista}`);
    return { copia, rama, informe };
  }
  if (existsSync(copia)) fallar(`Ya existe la copia ${copia}. Si es de una ronda anterior, usa --ronda N o «limpiar».`);
  mkdirSync(dirname(copia), { recursive: true });
  mkdirSync(informe, { recursive: true });
  decir(`Copia de trabajo ${copia} (rama ${rama}, desde ${origen})`);
  git(["worktree", "add", copia, "-b", rama, origen], raiz);
  for (const d of ["node_modules"]) if (existsSync(join(raiz, d)) && !existsSync(join(copia, d))) {
    try { symlinkSync(join(raiz, d), join(copia, d), "junction"); } catch (e) { console.warn(`(No se pudo enlazar ${d}: ${e.message}.)`); }
  }
  const instrucciones = ["AGENTS.md", "CLAUDE.md"].filter((f) => existsSync(join(copia, f)));
  const preambulo = `Eres el EJECUTOR de la flota. Trabajas en una copia aparte del repositorio «${repo}» (rama ${rama}). Reglas fijas:
- Haz SOLO lo que pide la ficha, con cambios mínimos y centrados. No renombres ni muevas archivos que la ficha no mencione.
- NO hagas commit, no cambies de rama, no subas nada, no instales paquetes y no uses la red.
- NO toques la versión ni los registros de cambios (package.json "version", CHANGELOG, diarios, estado): los actualiza el coordinador al guardar.
- ${instrucciones.length ? `Lee y respeta las reglas del proyecto en ${instrucciones.join(" y ")}.` : "Respeta las convenciones del código que ya existe."}
- No debilites ni borres pruebas para que pasen. Si una prueba existente falla por tu cambio, corrige tu cambio.
- Los textos para personas, en el idioma del proyecto.
- Antes de terminar ejecuta las comprobaciones del proyecto (${lista}). Responde con: qué cambiaste, archivo por archivo; qué pruebas añadiste; el resultado exacto de los comandos; y los riesgos o dudas que veas.

FICHA DE LA TAREA:
`;
  decir(`Codex (${perfil.modelo}, esfuerzo ${perfil.esfuerzo}) ejecuta la ficha ${ficha.id}… (puede tardar varios minutos)`);
  const r = codex(perfil.modelo, "workspace-write", copia, preambulo + ficha.texto, { esfuerzo: perfil.esfuerzo, salida: join(informe, "resultado-codex.txt"), registro: join(informe, "ejecucion-codex.log") });
  if (r.status !== 0) console.warn(`Codex terminó con código ${r.status}. Mira ${join(informe, "ejecucion-codex.log")}`);
  return { copia, rama, informe, ok: r.status === 0 };
}

function puertas(dir) {
  const lista = detectarPuertas(dir);
  if (!lista.length) { console.warn("No se han detectado comprobaciones automáticas en este proyecto. Indícalas con --puertas \"orden\"."); return undefined; }
  let ok = true;
  for (const p of lista) {
    decir(`Puerta: ${p.nombre} (${p.cmd})`);
    const r = spawnSync(p.cmd, { cwd: dir, stdio: "inherit", shell: true, env: { ...process.env, CI: "true" } });
    console.log(r.status === 0 ? `✔ ${p.nombre}` : `✘ ${p.nombre} (código ${r.status})`);
    ok &&= r.status === 0;
  }
  return ok;
}

function revisar(ficha, dir, { ronda = 1 } = {}) {
  const riesgo = opcion("--riesgo", ficha.riesgo);
  const { modelo, esfuerzo } = perfilRevision(riesgo);
  const { informe } = rutas(ficha, ronda);
  mkdirSync(informe, { recursive: true });
  const salida = join(informe, `revision-${modelo}.json`);
  const criterios = `Eres el REVISOR de la flota (SOLO LECTURA: no modifiques nada). Revisa los cambios sin guardar de esta copia (\`git status\`, \`git diff\` y los archivos nuevos) frente a la ficha.
Busca problemas REALES y demostrables, con archivo, línea y el escenario concreto; no estilo ni preferencias. Orden: (1) que haga lo que pide la ficha sin romper lo que ya funciona; (2) permisos y propiedad de los datos; (3) dinero y carreras entre peticiones simultáneas; (4) datos personales y secretos; (5) validación de entradas, inyección y XSS; (6) pruebas que no prueban lo que dicen o que se han debilitado; (7) casos límite del entorno real (proxies, puertos, zonas horarias, mayúsculas).
NO cuentes como hallazgo que falten la versión, el CHANGELOG, el diario o el estado: los pone el coordinador al guardar.
Veredicto: «aprobar» si no hay problemas graves; «cambios» si los hay (ordénalos por gravedad); «rechazar» si el enfoque es erróneo. Responde en español con el JSON pedido.

FICHA DE LA TAREA:
${ficha.texto}`;
  decir(`Revisión (${riesgo}) con ${modelo}, esfuerzo ${esfuerzo}, solo lectura…`);
  const r = codex(modelo, "read-only", dir, criterios, { esquema: join(aqui, "..", "veredicto.schema.json"), salida, esfuerzo, registro: join(informe, `revision-${modelo}.log`) });
  if (r.status !== 0 || !existsSync(salida)) { console.warn(`La revisión no terminó bien (código ${r.status}). Mira ${join(informe, `revision-${modelo}.log`)}`); return null; }
  const v = JSON.parse(readFileSync(salida, "utf8"));
  console.log(`\nVEREDICTO de ${modelo}: ${v.veredicto}\n${v.resumen}`);
  for (const h of v.hallazgos) console.log(`  [${h.gravedad}] ${h.archivo}: ${h.problema}`);
  return v;
}

function resumen(ficha, ronda, d) {
  const { informe } = rutas(ficha, ronda);
  const l = [`# ${ficha.id} · ronda ${ronda} · ${repo}`, "", `- Copia de trabajo: \`${d.copia}\` (rama \`${d.rama}\`)`,
    `- Puertas: ${d.puertas === undefined ? "no detectadas" : d.puertas ? "**pasan**" : "**NO pasan**"}`,
    `- Revisión: ${d.revision ? `**${d.revision.veredicto}** — ${d.revision.resumen}` : "no disponible"}`, "",
    "## Hallazgos del revisor (el coordinador los verifica uno a uno)"];
  for (const h of d.revision?.hallazgos ?? []) l.push(`- [${h.gravedad}] \`${h.archivo}\`: ${h.problema}`);
  if (!d.revision?.hallazgos?.length) l.push("- (ninguno)");
  l.push("", "## Decide el coordinador", "Aprobar (guardar, versión, PR) · otra ronda (máximo tres) · rechazar.");
  writeFileSync(join(informe, "resumen.md"), l.join("\n") + "\n");
  console.log(`\nInforme: ${join(informe, "resumen.md")}\nCopia: ${d.copia}`);
}

switch (orden) {
  case "todo": {
    if (!posicional) fallar("Falta la ficha: node flota.mjs todo <ficha.md>");
    const ficha = fichaDe(posicional);
    const ronda = Number(opcion("--ronda", "1"));
    const e = ejecutar(ficha, { base: opcion("--base"), ronda });
    const ok = puertas(e.copia);
    const v = revisar(ficha, e.copia, { ronda });
    resumen(ficha, ronda, { ...e, puertas: ok, revision: v });
    break;
  }
  case "simulacro": {
    if (!posicional) fallar("Falta la ficha.");
    const ficha = fichaDe(posicional);
    console.log(`Repositorio ${repo} · ficha ${ficha.id} (riesgo ${ficha.riesgo}, complejidad ${ficha.complejidad})`);
    const e = ejecutar(ficha, { base: opcion("--base"), simulacro: true });
    const { modelo, esfuerzo } = perfilRevision(opcion("--riesgo", ficha.riesgo));
    console.log(`[simulacro] revisión de solo lectura con ${modelo} (esfuerzo ${esfuerzo}) → ${e.informe}`);
    break;
  }
  case "ejecutar": {
    if (!posicional) fallar("Falta la ficha.");
    const e = ejecutar(fichaDe(posicional), { base: opcion("--base"), ronda: Number(opcion("--ronda", "1")) });
    console.log(`\nListo. Cambios sin guardar en ${e.copia}`);
    break;
  }
  case "puertas": {
    const ok = puertas(resolve(opcion("--dir", raiz)));
    process.exit(ok === false ? 1 : 0);
    break;
  }
  case "revisar": {
    if (!posicional) fallar("Falta la ficha.");
    const v = revisar(fichaDe(posicional), resolve(opcion("--dir", raiz)), { ronda: Number(opcion("--ronda", "1")) });
    process.exit(v ? 0 : 1);
    break;
  }
  case "limpiar": {
    if (!posicional) fallar("Falta la ficha.");
    const { copia, rama } = rutas(fichaDe(posicional), Number(opcion("--ronda", "1")));
    // PRIMERO se quitan los enlaces (junction) a las dependencias del proyecto, sin seguirlos. En Windows,
    // `git worktree remove --force` con el enlace dentro puede borrar el contenido de node_modules del
    // proyecto original (pasó el 18-10-2026 en Lona: hubo que reinstalar con npm ci).
    for (const d of ["node_modules"]) {
      const enlace = join(copia, d);
      let esEnlace = false;
      try { esEnlace = lstatSync(enlace).isSymbolicLink(); } catch { /* no existe */ }
      if (esEnlace) { try { unlinkSync(enlace); } catch { rmdirSync(enlace); } }
      else if (existsSync(enlace)) fallar(`${enlace} no es un enlace: revísalo a mano antes de quitar la copia.`);
    }
    if (existsSync(copia)) git(["worktree", "remove", "--force", copia], raiz);
    try { git(["branch", "-D", rama], raiz); } catch { /* ya no existe o está subida y fusionada */ }
    console.log(`Copia ${copia} y rama local ${rama} quitadas.`);
    break;
  }
  default:
    console.log(readFileSync(fileURLToPath(import.meta.url), "utf8").split("\n").filter((l) => l.startsWith("//")).map((l) => l.slice(3)).join("\n"));
    process.exit(orden ? 2 : 0);
}

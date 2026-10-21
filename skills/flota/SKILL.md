---
name: flota
description: Flujo de trabajo en equipo «coordinador + ejecutor» para cualquier proyecto con Git. El coordinador (Claude, o Codex si Claude no está) escribe una ficha; Codex la ejecuta en una copia aparte; pasan las comprobaciones automáticas del proyecto y una revisión de solo lectura con otro modelo; el coordinador verifica cada hallazgo, decide, abre el PR y fusiona con el CI en verde. Úsala cuando el usuario escriba /flota seguido de una tarea, o pida «que lo haga Codex», «lanza la flota» o «el flujo con Codex».
---

# /flota — el flujo de trabajo del equipo

Petición del dueño (18-10-2026): «comienza el flujo de trabajo que creamos con Codex… me gustaría poder invocar ese flujo con alguna skill… debe ser para todo el equipo y poderlo usar en todos los proyectos».

## Para qué sirve
- **El coordinador planifica y decide; el ejecutor programa.** El coordinador gasta poco; Codex trabaja con sus propios créditos.
- **Ninguna IA da el visto bueno final sola.** Se suman las puertas automáticas del proyecto, la revisión de otro modelo en solo lectura y la verificación del coordinador.
- **Todo pasa en una copia aparte** (git worktree en la carpeta temporal del sistema). La carpeta del proyecto no se toca hasta que el coordinador decide guardar.

**Quién coordina:** Claude por defecto. Si Claude no tiene cupo, coordina Codex desde una sesión interactiva. El ejecutor y el revisor son siempre sesiones aparte (`codex exec`), nunca la del coordinador.

Habla con el usuario en su idioma y sin jerga: puede no saber programar.

## Herramientas de la skill
Todas están en la carpeta de esta skill, junto a este archivo:
- `scripts/flota.mjs`: el motor. Se ejecuta desde la carpeta del proyecto: `node <carpeta de la skill>/scripts/flota.mjs …`.
- `plantilla-ficha.md`: la plantilla de la ficha.
- `veredicto.schema.json`: el formato de la respuesta del revisor.

Si el proyecto ya trae su propio motor (`scripts/flota.mjs`, como Lona), usa el del proyecto: tiene sus reglas y su panel. La forma de trabajar es la misma.

Requisitos:
- Git y Node instalados;
- Codex CLI (`codex --version`) con sesión iniciada.

Si falta Codex, díselo al usuario y para.

## Uso
`/flota <qué hay que hacer, con las palabras del usuario>`

Si no dice la tarea, pregunta cuál en una línea o propón la más útil del estado del proyecto que no choque con nadie.

## Pasos (en este orden)

### 0. Situarse y no chocar con nadie
- Lee `AGENTS.md` y `CLAUDE.md` del proyecto: tienen sus reglas, cómo se fusiona y qué no se toca.
- Ejecuta `git fetch` y mira el estado del proyecto (`docs/ESTADO.md` o equivalente, si existe).
- Revisa los PR abiertos (`gh pr list --state open`) y los traspasos recientes de otros asistentes.
- Anota qué archivos están tocando otros: van en «Fuera de alcance» de la ficha.
- Si la tarea pisa un trabajo en curso, **no la lances**: avisa y propón otra.
- Como mucho, **dos tareas de flota a la vez**, y nunca dos sobre los mismos archivos.

### 1. Ficha
- Copia `plantilla-ficha.md` a la carpeta de tareas del proyecto: `docs/tareas/` si existe; si no, créala. Nombre: `T-NNN-<tema>.md`, con el siguiente número libre.
- **Complejidad:**
  - simple (mecánica o de texto) → modelo económico, esfuerzo bajo;
  - normal → modelo normal, esfuerzo medio;
  - compleja → modelo normal, esfuerzo alto.
- **Riesgo crítico** si toca dinero, permisos, datos personales, secretos, migraciones o envíos masivos: entonces revisa el modelo de seguridad, con esfuerzo alto.
- **«Petición»:** las palabras literales del usuario y la fecha.
- **«Qué hay que cambiar»:** archivos y cambios concretos.
- **«Fuera de alcance»:** lo que otros están tocando.
- **«Pruebas exigidas»:** las que demuestran el cambio; si se arregla un fallo, una prueba que fallaría sin el arreglo.
- **No pidas a Codex** la versión, el CHANGELOG ni el diario: los pones tú al guardar.
- **Nunca** se pide al ejecutor tocar dominios, DNS, claves, despliegues ni bases de datos reales.

### 2. Simulacro (gratis)
```
node <skill>/scripts/flota.mjs simulacro docs/tareas/T-NNN-….md --base origin/<rama principal>
```
Comprueba tres cosas:
- que la copia sale de la rama principal actualizada;
- que el modelo encaja con la complejidad;
- que se han detectado las puertas correctas.

Si no hay puertas, búscalas en `package.json` o en el README y pásalas con `--puertas "orden1 && orden2"`.

### 3. Ejecución
```
node <skill>/scripts/flota.mjs todo docs/tareas/T-NNN-….md --base origin/<rama principal>
```
- **Siempre en segundo plano**, porque tarda minutos.
- Avisa al usuario en una línea de que Codex está trabajando y con qué modelo.
- El script crea la copia en `%TEMP%\flota\<repo>\copias\flota-t-nnn` (o `/tmp/flota/…`) y deja el informe en `…\informes\T-NNN\ronda-N\`.
- **Nunca** guarda cambios, ni sube, ni fusiona.

### 4. Verificar y decidir (coordinador)
- Lee `resumen.md`, `resultado-codex.txt` y el JSON del revisor.
- **Revisa tú el diff completo** (`git -C <copia> diff`): que haga lo que pide la ficha y nada más.
- Busca también lo que el revisor no vio. En el estreno, Luna no vio que una redirección arrastraba el puerto interno del servidor.
- **Cada hallazgo se comprueba en el código**, nunca se acepta a ciegas.
- Una puerta que falla puede ser un falso fallo del entorno (en Windows, los finales de línea). Compruébalo antes de rechazar.
- Decide una de tres:
  - **aprobar**;
  - **otra ronda**: añade los hallazgos a la ficha y lanza `ejecutar --ronda 2`; tres rondas como máximo;
  - **rechazar**, explicando por qué.

  Si el arreglo es de pocas líneas, puedes hacerlo tú en la copia, siempre con su prueba.

### 5. Guardar, PR, CI y fusión
- En la copia:
  - sube la versión y añade el CHANGELOG, el diario y el estado, si el proyecto los lleva;
  - haz el commit siguiendo las convenciones del proyecto, con una línea que diga que lo ejecutó Codex por la flota, y termínalo con la línea de coautoría que indique el sistema;
  - `git push -u origin flota/t-nnn`.
- Abre un PR contra la rama principal con: objetivo, cambios, puertas, hallazgos del revisor con su respuesta, y la firma que pida el sistema.
- Vigila el CI en segundo plano. **Nunca se fusiona en rojo.**
- **Fusiona solo si el dueño lo tiene autorizado en ese proyecto.** Míralo en sus reglas o en la memoria; en Lona, Claude fusiona con el CI en verde desde el 18-10-2026. Si no hay autorización, deja el PR listo y pide el «sí».
- **Publicar en producción lo decide siempre el dueño**, con su «sí» concreto.

### 6. Recoger
```
node <skill>/scripts/flota.mjs limpiar docs/tareas/T-NNN-….md
```
Hazlo después de fusionar. Quita la copia y su rama local.

**Nunca quites la copia a mano** (`git worktree remove`, `rm -rf` o el Explorador). Tiene un enlace a `node_modules` del proyecto, y en Windows Git puede seguirlo y vaciar las dependencias del proyecto original: pasó el 18-10-2026. `limpiar` quita primero el enlace sin seguirlo.

### 7. Contarlo
En pocas líneas y sin jerga:
- qué se pidió;
- qué hizo Codex;
- qué encontró la revisión;
- qué decidiste y por qué;
- el enlace a lo publicado o a la demo;
- qué le toca al usuario.

# Guía Operativa para Asistentes de IA (Claude Code): Creación de Video Programático con Remotion

Esta guía establece el marco operativo, los principios técnicos, los flujos de trabajo paso a paso y las reglas estrictas de desarrollo que un asistente de IA (como Claude Code, Antigravity o Codex) debe seguir obligatoriamente al generar, modificar y renderizar composiciones de video con Remotion.

---

## 1. Objetivo y Ámbito de Aplicación

### Objetivo
Capacitar al asistente de IA para actuar como un director de movimiento y desarrollador de video automatizado, convirtiendo instrucciones en lenguaje natural en código TypeScript/React determinista, modular, de alta calidad y libre de errores de renderizado en Remotion [81, 118, 150, 233].

### Ámbito de Aplicación (Casos de Uso Ideales)
* **Demostraciones y Lanzamientos de Producto**: Videos explicativos con maquetas, características, banners animados e interfaces UI [34, 234, 244].
* **Visualización de Datos e Infografías**: Gráficos de barras animados, contadores numéricos, diagramas y tablas de clasificación dinámicas [234, 244, 251, 265].
* **Contenido para Redes Sociales**: Clips verticales u horizontales (TikTok, Instagram Reels, YouTube Shorts) con subtítulos dinámicos estilo Whisper, resaltado palabra por palabra y Lower Thirds [34, 117, 185, 226, 244].
* **Generación de Video en Lote (Batch Processing)**: Automatización de composiciones a partir de fuentes de datos (archivos CSV, bases de datos o JSON) [235, 245].
* **Intros, Outros y Elementos Recurrentes**: Tarjetas de título, explicadores de arquitectura y animaciones de marca [152, 240, 250].

### Lo que NO Cubre el Ámbito (Límites de Uso)
* Edición tradicional de video basada en metraje continuo complejo, vlogs o contenido sin estructura programática [240, 250, 255].
* Proyectos artísticos no deterministas basados en interacción en tiempo real del usuario o efectos de entrada/salida no cuantificables [50, 56, 67].

---

## 2. Proceso Paso a Paso

```
[Fase 1: Configuración] ---> [Fase 2: Planificación] ---> [Fase 3: Desarrollo] ---> [Fase 4: Vista Previa] ---> [Fase 5: Renderizado]
   Instalar Skills              Definir Plan Mode           Código React/TSX              Studio Preview              CLI / Lambda
```

### Paso 1: Configuración del Entorno e Instalación de Skills
1. **Verificar dependencias**: Asegurar que Node.js (18+) y el asistente de código estén listos [83].
2. **Instalar Remotion Agent Skills**: Ejecutar el comando oficial de instalación de skills en la terminal para dotar al asistente del contexto técnico de Remotion:
   ```bash
   npx skills add remotion-dev/skills
   ```
   *(Alternativamente: `npx -y @remotion/agent-skills@latest install` o colocar la skill en `.claude/skills/remotion-video/skill.md` o `CLAUDE.md`) [17, 92, 122, 186, 231].*
3. **Inicializar Proyecto**: Crear el proyecto con la plantilla deseada:
   ```bash
   npx create-video@latest --yes --blank mi-video
   ```
   *O `bun create video` [23, 45, 70, 279].*

### Paso 2: Planificación y Análisis de Requisitos (Plan Mode)
1. **Activar el Modo Plan**: No escribir código directamente. El agente debe estructurar primero la narrativa, la línea de tiempo y la arquitectura visual [94, 102, 104].
2. **Establecer Parámetros de Composición**:
   * Tasa de fotogramas (`fps`): 30 fps (estándar) o 24 fps (sensación cinematográfica) [84, 123, 279].
   * Duración total (`durationInFrames`): Ejemplo: 15 segundos × 30 fps = 450 fotogramas [84, 151, 157].
   * Dimensiones (`width` x `height`): 1920x1080 (horizontal) o 1080x1920 (vertical) [34, 84, 185].
3. **Estructura por Escenas**: Dividir la línea de tiempo en bloques lógicos (ej. Escena 1: Hook [0-3s], Escena 2: Contenido [3-12s], Escena 3: CTA [12-15s]) [34, 185, 196].

### Paso 3: Desarrollo de Composiciones React
1. **Definir la Raíz**: Registrar la composición en `Root.tsx` configurando `id`, `component`, `durationInFrames`, `fps`, `width`, `height`, y `defaultProps` [84, 119].
2. **Estructura de Componentes**: Utilizar `<AbsoluteFill>` para capas, `<Sequence>` para desfases temporales y `<Series>` o `<TransitionSeries>` para secuencias encadenadas [10, 82, 119, 279, 353].
3. **Animación Basada en Fotogramas**:
   * Acceder al fotograma actual con `useCurrentFrame()` y a la configuración con `useVideoConfig()` [1, 51, 119, 165].
   * Calcular valores numéricos con `interpolate()` o dinámicos con `spring()` [1, 30, 51, 119, 279].
4. **Carga y Gestión de Activos**:
   * Almacenar imágenes, audios, videos y fuentes en la carpeta `public/` y acceder mediante `staticFile("ruta/activo.ext")` [28, 109, 115, 279].
   * Utilizar `<Img>` de `remotion` y `<Video>`, `<Audio>` u `<OffthreadVideo>` de `@remotion/media` [32, 109, 279].
5. **Datos y Activos Asíncronos**:
   * Utilizar `calculateMetadata` para calcular la duración o dimensiones antes de renderizar [279, 309].
   * Si se hace fetching en el componente, envolver con `useDelayRender()` y llamar a `continueRender()` al finalizar o `cancelRender(error)` en caso de fallo [14, 31, 106, 279, 284].

### Paso 4: Vista Previa e Iteración Conversacional
1. Iniciar el servidor de desarrollo e inspección visual:
   ```bash
   npx remotion studio
   ```
2. Navegar a `http://localhost:3000` y recorrer la línea de tiempo [124, 187, 279].
3. Corregir desviaciones mediante instrucciones precisas en el chat (ej. "Aumenta la amortiguación del spring a 20 y añade un fade-in de 15 fotogramas") [124, 138, 185, 198].
4. Realizar pruebas rápidas de fotograma congelado en la CLI:
   ```bash
   npx remotion still mi-composicion --frame=45 --scale=0.25
   ```
   *[279]*

### Paso 5: Renderizado y Exportación
1. **Renderizado Local**: Exportar el video final a MP4 mediante la CLI:
   ```bash
   npx remotion render mi-composicion out/video.mp4
   ```
   *[184, 279]*
2. **Renderizado Escalable en la Nube**: Para producciones masivas o de alta velocidad, utilizar `@remotion/lambda` (AWS) o `@remotion/cloudrun` (Google Cloud) [15, 252].

---

## 3. Reglas Obligatorias y Errores a Evitar

### 🚨 Reglas Obligatorias (Principios Fundamentales)
1. **Determinismo Estricto por Fotograma**: Todo elemento visual DEBE ser una función pura de `(frame, props, useVideoConfig())`. Acceder al tiempo ÚNICAMENTE a través de `useCurrentFrame()` [29, 51, 56, 279, 353].
2. **Clamping Obligatorio en `interpolate()`**: Al usar `interpolate()`, agregar siempre `{ extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }` para evitar que los valores se desborden fuera del rango [1, 2, 279].
3. **Uso Exclusivo de `staticFile()`**: Cargar activos locales desde `public/` usando siempre la función auxiliar `staticFile()` [28, 109, 115, 279].
4. **Control de Manejadores Asíncronos**: Todo `delayRender()` DEBE estar emparejado con un `continueRender()` y capturado en un bloque `try/catch` con `cancelRender(error)` para evitar cuelgues por timeout (30s) [14, 106, 111, 284, 300].
5. **Estilos Inline e Individuales para Editabilidad en Studio**: Colocar las llamadas a `interpolate()` de forma inline dentro de `style` y animar propiedades de transformación individuales (`scale`, `translateY`, `rotate`) en lugar de cadenas compuestas [279].
6. **Propiedades Aceleradas por GPU**: Animar únicamente `transform` y `opacity` para garantizar 60 fps y evitar recálculos de maquetación (reflows) [28, 162].

### ❌ Errores Críticos a Evitar (Prohibiciones Absolutas)
* **PROHIBIDO usar Animaciones o Transiciones CSS**: NUNCA usar `animation:`, `@keyframes`, `transition:` ni clases animadas de Tailwind. Remotion renderiza fotogramas individuales de forma independiente sin reloj de pared; las animaciones CSS se congelan, parpadean o no avanzan [50, 54, 107, 112, 279, 313].
* **PROHIBIDO usar Temporizadores JS o Código No Determinista**: NUNCA usar `setTimeout`, `setInterval`, `requestAnimationFrame`, `Date.now()` ni `Math.random()` sin semilla. Usar `random(seed)` de Remotion o funciones basadas en `frame` [50, 56, 59, 125, 279].
* **PROHIBIDO usar Etiquetas Nativas HTML5 `<video>` o `<audio>`**: NUNCA usar etiquetas HTML5 puras para reproducción de medios. Usar siempre `<OffthreadVideo>` / `<Video>` y `<Audio>` importados de `@remotion/media` [32, 109, 114, 279].
* **PROHIBIDO usar Unidades CSS Relativas al Viewport**: NUNCA usar `vw`, `vh`, `vmin`, `vmax`. Las composiciones tienen dimensiones fijas en píxeles. Usar `%`, `px` o `em` [67].
* **PROHIBIDO Omitir Desfases en Secuencias**: No omitir la propiedad `from` en las `<Sequence>`. Sin `from`, todas las secuencias se inician en el fotograma 0 y se ejecutan simultáneamente [151, 157].

---

## 4. Checklist antes de Entregar el Resultado

El asistente de IA debe verificar mecánicamente cada uno de estos puntos antes de considerar finalizada la composición:

- [ ] **Determinismo**: ¿Todas las animaciones dependen directamente de `useCurrentFrame()`? [51, 279]
- [ ] **Cero CSS Tradicional**: ¿Se han eliminado por completo `transition`, `@keyframes` y clases de animación CSS/Tailwind? [50, 108, 279]
- [ ] **Clamping de Rangos**: ¿Todas las llamadas a `interpolate()` incluyen `extrapolateLeft: 'clamp'` y `extrapolateRight: 'clamp'`? [1, 2, 279]
- [ ] **Ruta de Activos**: ¿Todos los activos locales residen en `public/` y se acceden con `staticFile()`? [28, 109, 279]
- [ ] **Componentes de Medios**: ¿Se utilizan componentes de `@remotion/media` (`<Audio>`, `<Video>`, `<OffthreadVideo>`) en lugar de etiquetas nativas HTML5? [109, 279]
- [ ] **Manejo de Tareas Asíncronas**: ¿Cada `delayRender()` / `useDelayRender()` tiene un `continueRender()` garantizado y un `cancelRender()` en caso de error? [106, 111, 284]
- [ ] **Semillado de Aleatoriedad**: ¿Se ha sustituido cualquier `Math.random()` por `random(seed)` emparejado con el fotograma o ID de elemento? [59, 125, 279]
- [ ] **Rendimiento de Composición**: ¿Las propiedades animadas se limitan a `transform` y `opacity` (sin alterar `width`, `height` o `margin` durante la animación)? [28, 162]
- [ ] **Verificación Estática**: ¿El código pasa la comprobación de tipos de TypeScript (`npm run typecheck`) sin advertencias ni errores? [62, 269]
- [ ] **Prueba de Smoke/Studio**: ¿Se verificó que la vista previa en Remotion Studio (`npx remotion studio`) carga correctamente sin pantallas negras ni errores de timeout? [124, 187, 279]

---

## 5. Plantillas Reutilizables

### Plantilla 1: Prompt Estructurado para Claude Code
*(Copiar y personalizar para solicitar la creación de un video completo)*

```text
Lee la skill de remotion-best-practices y crea un video de [DURACIÓN_EN_SEGUNDOS] segundos.

Perfil del Video:
- Título: [NOMBRE_PROYECTO]
- Objetivo: [DESCRIPCIÓN_OBJETIVO]
- Activos en public/: [public/logo.png, public/voiceover.mp3]

Requisitos por Escenas:
- Escena 1 (0-[X]s): Fondo azul oscuro (#0a1628), logotipo en el centro haciendo fade-in con glow, texto del título apareciendo con typewriter.
- Escena 2 ([X]-[Y]s): Transición suave hacia los aspectos destacados, apareciendo insignias una por una con spring.
- Escena 3 ([Y]-[Z]s): Llamado a la acción (CTA) con texto explicativo y enlace web, desvanecimiento final.

Estilo Visual:
- Color Principal: [HEX_COLOR_1]
- Color Secundario / Acento: [HEX_COLOR_2]
- Tipografía: Sans-serif moderna (Inter o similar)
- Formato de Exportación: [1920x1080 o 1080x1920], [30]fps, Composición nombrada "[NOMBRE_COMPOSICION]".
```
*[34, 185, 196]*

---

### Plantilla 2: Componente React/Remotion Estándar
*(Estructura base idónea para animaciones deterministas)*

```tsx
import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { Img } from 'remotion';

interface PromoProps {
  title: string;
  primaryColor: string;
}

export const MainScene: React.FC<PromoProps> = ({ title, primaryColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Fade-in de opacidad mediante interpolate con clamp
  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 2. Movimiento de escala fluido mediante física de muelles (spring)
  const scale = spring({
    frame: frame - 5, // Desfase de 5 fotogramas
    fps,
    config: {
      damping: 12,
      stiffness: 100,
    },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0a1628',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Logotipo desde carpeta public/ */}
      <Img
        src={staticFile('logo.png')}
        style={{
          width: 120,
          height: 120,
          opacity,
          transform: `scale(${scale})`,
          marginBottom: 20,
        }}
      />

      {/* Texto animado */}
      <h1
        style={{
          color: primaryColor,
          fontSize: 64,
          fontFamily: 'Inter, sans-serif',
          opacity,
        }}
      >
        {title}
      </h1>
    </AbsoluteFill>
  );
};
```
*[1, 51, 165, 258]*

---

### Plantilla 3: Carga Asíncrona Robusta con `useDelayRender()`
*(Patrón seguro para fetching de datos o recursos externos)*

```tsx
import React, { useEffect, useState } from 'react';
import {
  AbsoluteFill,
  cancelRender,
  continueRender,
  useDelayRender,
} from 'remotion';

export const AsyncDataComponent: React.FC = () => {
  const [data, setData] = useState<string | null>(null);
  const { delayRender, continueRender: resolveRender } = useDelayRender();
  const [handle] = useState(() => delayRender('Cargando datos remotos API'));

  useEffect(() => {
    let isMounted = true;

    fetch('https://api.example.com/stats')
      .then((res) => res.json())
      .then((json) => {
        if (isMounted) {
          setData(json.message);
          resolveRender(handle); // Liberar el bloqueo de renderizado
        }
      })
      .catch((err) => {
        // Cancelar el renderizado inmediatamente con mensaje explicativo
        cancelRender(err);
      });

    return () => {
      isMounted = false;
    };
  }, [handle, resolveRender]);

  if (!data) {
    return null;
  }

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <h2 style={{ color: 'white', fontSize: 48 }}>{data}</h2>
    </AbsoluteFill>
  );
};
```
*[106, 111, 286]*

---

## 6. Preguntas que Debe Hacer el Asistente si Faltan Datos

Si la solicitud del usuario es ambigua o incompleta, el asistente de IA DEBE detenerse y solicitar aclaración sobre los siguientes datos críticos:

1. **Duración del Video**: "¿Cuál es la duración exacta deseada para el video (en segundos o número total de fotogramas)?" [15, 196]
2. **Relación de Aspecto y Resolución**: "¿Qué formato de pantalla necesitas? (Ejemplos: Horizontal 1920x1080 para YouTube/web, Vertical 1080x1920 para TikTok/Reels/Shorts, o Cuadrado 1080x1080)?" [34, 185]
3. **Tasa de Fotogramas (`fps`)**: "¿A cuántos fotogramas por segundo debemos configurar la composición (30 fps estándar o 24 fps cinematográfico)?" [84, 123]
4. **Paleta de Colores de Marca**: "¿Cuáles son los códigos de color hexadecimales (`#HEX`) de la marca para fondos, textos y acentos?" [15, 34, 185, 196]
5. **Ubicación de Activos Existentes**: "¿Tienes logotipos, imágenes, audios o fuentes específicas en la carpeta `public/` que debamos utilizar?" [34, 109, 115]
6. **Estructura del Guion o Tiempos**: "¿Existe una secuencia específica de tiempos para cada escena o prefieres que proponga una distribución automática de contenidos?" [34, 93, 196]

---

## 7. Ejemplos Buenos y Malos

### Ejemplo 1: Animación de Entrada / Opacidad
* **MALO ❌ (Rompe el renderizado)**:
  ```tsx
  // Incorrección: Uso de CSS transition tradicional
  <div style={{ transition: 'all 0.5s ease', opacity: show ? 1 : 0 }}>
    Texto
  </div>
  ```
  *Motivo del fallo*: Las transiciones CSS no responden al índice de fotograma durante la extracción congelada del renderizador headless [50, 54, 313].

* **BUENO ✅ (Determinista)**:
  ```tsx
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return <div style={{ opacity }}>Texto</div>;
  ```
  *Motivo de éxito*: El valor de opacidad es una función pura del fotograma actual [51, 55, 258].

---

### Ejemplo 2: Inserción de Activos de Video
* **MALO ❌ (Pantalla negra / Desincronización)**:
  ```tsx
  // Incorrección: Uso de etiqueta nativa HTML5 <video>
  <video src="./assets/background.mp4" autoPlay loop />
  ```
  *Motivo del fallo*: Produce pantallas negras, falta de sonido y errores de congelamiento durante la renderización paralela [109, 114].

* **BUENO ✅ (Procesamiento por fotograma)**:
  ```tsx
  import { OffthreadVideo } from 'remotion';
  import { staticFile } from 'remotion';

  <OffthreadVideo src={staticFile('background.mp4')} />;
  ```
  *Motivo de éxito*: `@remotion/media` o `<OffthreadVideo>` garantizan la decodificación exacta por fotograma a través de procesos aislados [32, 109, 279].

---

### Ejemplo 3: Operaciones Asíncronas
* **MALO ❌ (Fuga de manejadores y Timeout)**:
  ```tsx
  // Incorrección: delayRender fuera de hooks o sin manejo de catch
  const handle = delayRender();
  fetch('/api/data').then(() => continueRender(handle));
  ```
  *Motivo del fallo*: Si la API falla, la renderización se bloquea durante 30 segundos hasta fallar por timeout [106, 285, 290].

* **BUENO ✅ (Cancelación segura de errores)**:
  ```tsx
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  useEffect(() => {
    const handle = delayRender('Fetching API');
    fetch('/api/data')
      .then((r) => r.json())
      .then(() => continueRender(handle))
      .catch((err) => cancelRender(err));
  }, []);
  ```
  *Motivo de éxito*: Cancela el render inmediatamente con un mensaje de error claro si la petición falla [106, 111, 286].

---

## 8. Hechos y Consejos Respaldados por Varias Fuentes

Los siguientes principios representan consensos técnicos validados por múltiples fuentes del cuaderno:

1. **Determinismo por Fotograma Puro**: Remotion trata cada fotograma como una función matemática pura independiente. Todas las transformaciones e interfaces deben derivarse exclusivamente del fotograma actual accesible mediante `useCurrentFrame()` [29, 56, 118, 151, 157, 252, 279].
2. **Incompatibilidad Total con Animaciones CSS**: Las animaciones basadas en reloj de pared (`@keyframes`, `transition`, `setTimeout`, `setInterval`, `requestAnimationFrame`) destruyen el determinismo de la renderización sin cabeza (headless), provocando fotogramas congelados, parpadeos o desincronización [50, 54, 56, 107, 112, 254, 279, 309, 313, 331].
3. **Carga Obligatoria con `staticFile()`**: Todos los recursos locales (imágenes, fuentes, audios, videos) deben guardarse en la carpeta `public/` y referenciarse mediante `staticFile()` para garantizar que los trabajadores de renderizado paralelo en la nube (Lambda/Cloud Run) resuelvan las rutas correctamente [28, 109, 110, 115, 279].
4. **Gestión Estricta de Timeouts en Tareas Asíncronas**: Los bloqueos creados por `delayRender()` deben liberarse con `continueRender()` antes del límite por defecto de 30 segundos o abortarse con `cancelRender()` para evitar que los procesos en segundo plano se cuelguen [14, 106, 110, 111, 284, 300, 305].
5. **Naturaleza del Flujo Asistido por IA**: La integración de asistentes de código (Claude Code) con Remotion no funciona mediante la "alucinación de píxeles" (como Sora o Runway), sino mediante la generación de código estructurado React/TypeScript que luego es ejecutado de forma transparente y determinista por Remotion [91, 94, 118, 142, 168, 233].

---

## 9. Aspectos NO Cubiertos por las Fuentes

De acuerdo con las fuentes disponibles en este cuaderno, los siguientes aspectos **NO están cubiertos** y deben indicarse claramente si el usuario los consulta:

* **Integración Nativa Directa con Modelos de Video Generativo Externos**: Las fuentes no detallan cómo canalizar pipelines de IA generativa de video pixel-level (como Sora, Runway Gen-2/Gen-3 o Pika) dentro del código de Remotion más allá de tratar sus exportaciones como archivos de video estáticos pre-renderizados.
* **Flujos de Edición de Video Basados en Metraje Pesado No Estructurado**: No hay procedimientos documentados para la edición automatizada de metraje multicámara grabado sin guion o contenido vlog complejo sin reglas de plantilla [240, 250, 255].
* **Configuración de Servidores On-Premise Propietarios para GPU**: Las fuentes cubren la renderización local CLI, AWS Lambda y Google Cloud Run, pero no incluyen especificaciones para infraestructuras privadas de renderizado distribuidas en clústeres GPU propios [252].
* **Auditoría Legal Extensa de Licencias Corporativas**: Únicamente se menciona la regla comercial básica (empresas de 4 o más empleados requieren licencia comercial de Remotion), sin detallar implicaciones de derechos de autor para fuentes o activos de terceros [231, 238, 248].
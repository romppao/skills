---
name: colorizacion-davinci
description: "Guía operativa técnica para colorización y gestión de color en DaVinci Resolve (versiones 19 y 20). Cubre flujos scene-referred (DWG / ACES), corrección primaria, secundaria, calibración objetiva de tonos de piel sobre vectorscopio (123°), ColorSlice, emulación analógica, y arquitectura óptima de árboles de nodos."
---

# Guía Operativa para el Asistente de IA: Colorización y Gestión de Color en DaVinci Resolve

Esta guía establece los estándares técnicos, flujos de trabajo y protocolos de toma de decisiones para un Asistente de IA especializado en la página de Color de DaVinci Resolve (versiones 19 y 20). Toda instrucción y recomendación expresada en este documento proviene estrictamente de las fuentes analizadas del proyecto.

---

## 1. Objetivo y Ámbito de Aplicación

### Objetivo
Servir como manual de operaciones estandarizado para que el Asistente de IA asesore, configure y ejecute proyectos de colorización en DaVinci Resolve de forma tónicamente coherente, matemáticamente precisa y alineada con los estándares de la industria cinematográfica y audiovisual [6, 112, 238, 248].

### Ámbito de Aplicación
* **Flujos de Trabajo:** Producciones publicitarias, documentales, cortometrajes y largometrajes cinematográficos [113, 114, 238].
* **Plataformas y Entornos:** DaVinci Resolve y DaVinci Resolve Studio (versiones 19 y 20) [2, 112, 181].
* **Áreas Técnicas Cubiertas:**
  * Gestión de color de escena (*Scene-Referred Color Management*): DaVinci Wide Gamut (DWG) / DaVinci Intermediate y ACES (ACEScc / ACEScct) [6-8, 214, 237, 242].
  * Corrección de color primaria y secundaria [48, 116, 238-240].
  * Uso de instrumental de diagnóstico (WaveformMonitor, RGB Parade, Vectorscope) y calibración de tonos de piel [52-54, 121, 244-246].
  * Herramientas avanzadas de Resolve 19 y 20 (ColorSlice, Film Look Creator, Node Stacks, IntelliTrack AI, Defocus Background) [4, 5, 21, 22, 166, 173, 178].

---

## 2. Proceso Paso a Paso (Flujo de Trabajo Secuencial)

El flujo de trabajo debe seguir estrictamente un orden secuencial lineal para proteger la integridad de la señal de imagen y evitar la amplificación de artefactos [238, 239].

```
┌─────────────────────────────────────────────────────────────────────────┐
│ FASE 1: Configuración del Sistema y Gestión de Color (Color Management) │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ FASE 2: Normalización y Corrección Primaria (Balancing & Matching)      │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ FASE 3: Aislamiento Secundario y Calibración de Pieles                  │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ FASE 4: Gradación Creativa, Look Development y Emulación de Film (FPE)  │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ FASE 5: Texturizado Analógico y Transformación de Salida (Output)       │
└─────────────────────────────────────────────────────────────────────────┘
```

### Fase 1: Configuración del Sistema y Gestión de Color
1. **Definir el Espacio de Trabajo:** Seleccionar la arquitectura de color antes de importar o editar cualquier toma [6, 208, 248].
   * *Opción A (Recomendada para proyectos nativos en Resolve):* **DaVinci YRGB Color Managed**. Ajustar *Color Processing Mode* en SDR o HDR y seleccionar *DaVinci Wide Gamut / DaVinci Intermediate* como espacio de trabajo de timeline [8, 127-128, 214, 219].
   * *Opción B (Recomendada para flujos mutidisciplinarios/VFX):* **ACEScc** o **ACEScct** [6, 9, 216, 237, 243].
   * *Opción C (Manual mediante nodos):* DaVinci YRGB estándar aplicando nodos *Color Space Transform* (CST) al inicio (Input CST) y al final (Output CST) [149-151, 214].
2. **Asignación de Espacios de Entrada (IDT / Input Color Space):** Verificar en el Media Pool que cada clip tenga asignado correctamente el perfil de color nativo del sensor de origen (ej. REDWideGamutRGB/Log3G10, Blackmagic Design Film Gen 1, Sony S-Gamut3.Cine/S-Log3, ARRI LogC3/LogC4, Fujifilm F-Log/F-Log2) [8, 128-130, 176, 248].

### Fase 2: Normalización y Corrección de Color Primaria
1. **Anclaje de Rango Dinámico:**
   * Utilizar la herramienta *Waveform* para fijar el nivel de negros (Sombras / Lift) y el punto de blancos (Luces / Gain) [41, 118-119, 240].
   * Ajustar el tono medio (Gamma / Midtone) para exponer adecuadamente al sujeto sin cortar detalle en sombras ni luces [41, 240].
2. **Balance de Blancos y Tinte:**
   * Neutralizar dominantes de color no deseadas ajustando la temperatura Kelvin y el tinte verde/magenta [41, 240].
   * Verificar en el *RGB Parade* o *RGB Waveform* que los canales R, G y B se superpongan uniformemente en superficies neutras/grises [118-119, 240].
3. **Igualación de Tomas (*Shot Matching*):**
   * Comparar clips vecinos usando la función *Image Wipe* o la vista *Split Screen* [120, 138, 154].
   * Ajustar contrase y balance primario para lograr continuidad visual fluida a lo largo de la escena [116, 120, 240, 262].

### Fase 3: Aislamiento Secundario y Calibración de Pieles
1. **Aislamiento de Tonos de Piel:**
   * Crear un nodo secundario dedicado. Utilizar un calificador 3D/HSL o una máscara *Power Window* circular sobre la piel del sujeto [121, 246].
   * Activar el modo *Highlight* para confirmar que solo se haya seleccionado tejido dérmico (excluyendo cabello, ropa y fondo) [121, 246].
2. **Evaluación en Vectorscopio:**
   * Habilitar la opción *Show Skin Tone Indicator* en los ajustes del Vectorscopio [122, 257].
   * Ajustar los controles de tinte/hue o curvas *Hue vs Hue* hasta que el centro del plot de la piel se alinee sobre la línea de **123° (+I axis)** [123, 244-246, 251, 257].
3. **Gradación Vectorial con ColorSlice:**
   * Utilizar la paleta *ColorSlice* de 7 vectores (Red, Green, Blue, Cyan, Magenta, Yellow, Skin) para ajustar densidad y saturación de forma sustractiva [5, 19, 99, 139, 173].
   * Si la piel invade vectores vecinos (Red o Yellow), ajustar el control *Center* del vector contiguo para suavizar la transición sin generar artefactos ni bordes duros [20, 36, 106, 139].

### Fase 4: Gradación Creativa, Look Development y Emulación de Film
1. **Construcción del Aspecto Narrativo:**
   * Aplicar esquemas de color cromáticos intencionados (ej. paleta complementaria *Teal and Orange*, tonos análogos o desaturación estilizada) en nodos posteriores a la corrección primaria [45, 58, 241, 262].
2. **Aplicación de Emulación de Película (Film Print Emulation - FPE) / Film Look Creator:**
   * Aplicar *Film Look Creator* o LUTs 3D tetraédricas FPE (ej. Kodak 2383 / Fuji 3513) en la etapa de Look [2, 21, 101, 178, 248].
   * Configurar balance tonal, saturación sustractiva (*Subtractive Saturation*), contraste de riqueza (*Richness*) y *Bleach Bypass* según la intención dramática [2, 102-103, 141, 178].

### Fase 5: Texturizado Analógico y Transformación de Salida
1. **Efectos Ópticos y Textura:**
   * Configurar parámetros de grano analógico (*Film Grain*), halación (*Halation* - resplandor rojo en bordes de alto contraste) y *Bloom* (difusión de luz en altas luces) [21, 103, 143, 147, 261].
   * Aplicar inestabilidades mecánicas como parpadeo (*Flicker*) o bamboleo de chasis (*Gate Weave*) si el proyecto lo requiere [21, 101, 178].
2. **Mapeo de Display y Entrega:**
   * Verificar que la señal pase por la transformación de salida (*Output Display Transform*) correspondiente al estándar de entrega final: SDR Rec.709 Gamma 2.4, HDR ST 2084 PQ (1000/4000 nits) o DCI-P3 [8, 132-133, 239, 248].

---

## 3. Reglas Obligatorias y Errores que Debe Evitar

### Reglas Obligatorias (Mandatorias)
1. **Orden de Operaciones Inflexible:** La corrección de color técnica SIEMPRE precede al *Color Grading* creativo [44, 49, 62, 98, 238, 248].
2. **Coherencia en Gestión de Color:** Un único sistema debe ser el "propietario" de la cadena de transformación del proyecto (DaVinci YRGB Color Managed, ACES o CSTs explícitos) [6, 7].
3. **Verificación Objetiva con Scopes:** Nunca confiar de forma exclusiva en la percepción ocular o en monitores no calibrados; las decisiones de luminancia y croma deben ser validadas en el Waveform, RGB Parade y Vectorscopio [52, 92, 208, 244, 262].
4. **Respeto a los Tonos de Memoria:** Los tonos de piel, el cielo y la vegetación son colores de memoria profundamente arraigados en la percepción humana; deben mantenerse naturales salvo exigencia narrativa explícita [124, 144].
5. **Uso de Saturación Sustractiva:** Al aplicar alta saturación, utilizar modelos sustractivos (como los de *ColorSlice* o *Film Look Creator*) que reducen la luminancia a medida que aumenta la saturación, evitando que los colores se vuelvan artificialmente brillantes o deslavados [5, 34, 102, 173, 202].

### Errores Críticos que Debe Evitar (Anti-Patrones)
* ❌ **Mezclar ACES y DaVinci Color Management simultáneamente** sin un nodo/puente técnico documentado, lo que genera conversiones dobles y aplastamiento de señal [6, 11, 13].
* ❌ **Apilar CSTs o LUTs redundantes:** Dejar activadas transformaciones antiguas en el árbol de nodos tras cambiar la gestión de color del proyecto [7, 11, 13].
* ❌ **Graduar antes de balancear:** Intentar corregir fallos de balance de blancos o exposición mediante herramientas creativas o *Color Warper* [208, 210].
* ❌ **Modificar la gestión de color a mitad de proyecto bloqueado:** Cambiar el espacio de trabajo en una línea de tiempo ya aprobada altera el contraste, la saturación y la respuesta de las LUTs de todas las tomas [9, 10, 13].
* ❌ **Sobre-calificación y bordes duros en pieles:** Ajustar la saturación o el tono de la piel con selectores HSL muy estrechos, creando transiciones plásticas o artefactos de ruido en rostros [35, 36, 124, 210].
* ❌ **Aplicar LUTs de Rec.709 sobre tomas LOG no transformadas:** Produce imágenes aplastadas, con negros recortados y altas luces quemadas [11, 125].

---

## 4. Checklist Antes de Entregar el Resultado

El Asistente de IA debe ejecutar esta lista de comprobación antes de dar por finalizado un proyecto o entregar una propuesta de colorización [55, 208-210, 248]:

- [ ] **1. Verificación de Gestión de Color:** ¿Todos los clips de la línea de tiempo tienen su perfil de entrada (*Input Color Space*) correctamente identificado en el Media Pool? [8, 128-130, 248]
- [ ] **2. Comprobación de Rango Dinámico (Waveform/Parade):** ¿Se han verificado los niveles para asegurar que no existan negros aplastados inintencionados (0 nits / 0 RGB) ni luces recortadas (*clipping*)? [55, 118, 240]
- [ ] **3. Balance y Continuidad de Blancos:** ¿Todas las tomas de la misma escena presentan una temperatura de color y tinte coherentes entre planos contiguos? [48, 89, 116, 240]
- [ ] **4. Validación de Tonos de Piel en Vectorscopio:** ¿Las muestras aisladas de piel se alinean sobre o junto a la línea de 123° (*Skin Tone Line*) con un nivel de saturación razonable (por debajo del límite del 50%)? [122-123, 245-246, 257]
- [ ] **5. Inspección de Artefactos Visuales:** Al revisar la imagen a pantalla completa, ¿está libre de solapamientos cromáticos, ruido excesivo en sombras, falso contorno (*banding*) o halos plásticos alrededor de los rostros? [209-210]
- [ ] **6. Verificación del Nodo de Salida (Output Transform):** ¿El espacio de color de salida (*Output Color Space*) coincide de manera exacta con las especificaciones del entregable (ej. Rec.709 Gamma 2.4 para Web/Broadcast SDR, ST 2084 para HDR)? [8, 132-133, 248]
- [ ] **7. Limpieza del Node Graph:** ¿Todos los nodos están etiquetados según su función y los nodos desactivados/experimentales han sido eliminados o consolidados? [208, 210]

---

## 5. Plantillas Reutilizables de Estructuras de Nodos

### Plantilla A: Estructura Básica en Serie (4 Nodos)
Ideal para proyectos rápidos, clips de cámara única y correcciones fundamentales [117, 134, 208].

```
[Node 01: BAL] ──► [Node 02: PRIM] ──► [Node 03: LOOK] ──► [Node 04: OUT/FPE]
```
* **Node 01 (BAL):** Balance de Blancos, Tinte y Exposición básica [118, 240].
* **Node 02 (PRIM):** Ajustes primarios (Contraste, Pivot, Rango Dinámico en Primaries/Log) [111, 240].
* **Node 03 (LOOK):** Estilización creativa (Split Tone, Color Warper, paleta de color) [57, 207, 241].
* **Node 04 (OUT/FPE):** Emulación de película, densidad o ajuste de salida final [21, 101, 248].

---

### Plantilla B: Arbol Completo de Nodos en Paralelo y Capas (Estructura Profesional)
Recomendada para largometrajes, comerciales de alto nivel y tomas complejas con múltiples elementos secundarios [144, 248].

```
                  ┌─► [Node 02: HL (Luces)] ────┐
                  │                             ├─► (Parallel Mixer) ─► [Node 05: SAT]
[Node 01: BAL] ───┼─► [Node 03: SH (Sombras)] ──┘                           │
                  │                                                         │
                  └─► [Node 04: MATCH] ─────────────────────────────────────┘
                                                                            │
                                                                            ▼
                                                ┌─► [Node 06: SKIN (Piel)] ─┐
                                                │                           │
                                                ├─► [Node 07: SKY (Cielo)] ─┼─► (Parallel Mixer)
                                                │                           │
                                                └─► [Node 08: GRASS (Pasto)]┘
                                                                            │
                                                                            ▼
[Node 12: OUT/FPE] ◄── [Node 11: TEXTURE] ◄── [Node 10: LOOK] ──────────────┘
```

#### Descripción de Capas:
* **Fase Primaria (Nodos 01 a 05):** Normalización, balance de altas luces/sombras en ramas paralelas y ajuste de saturación global [144, 240].
* **Fase Secundaria (Nodos 06 a 08):** Nodos en paralelo dedicados a colores de memoria (Piel, Cielo, Vegetación) aislados mediante calificadores o *ColorSlice* [139, 144].
* **Fase de Aspecto y Textura (Nodos 10 a 12):** Gradación narrativa, emulación de película, halación, grano analógico y salida final [101, 143, 147, 248].

---

### Plantilla C: Configuración con Node Stacks (DaVinci Resolve 20)
Organización por capas secuenciales en el Node Graph Stack de Resolve 20 [22, 146, 174].

```
┌─────────────────────────────────────────────────────────────────────────┐
│ STACK LAYER 1: PRIMARIES (Balancing, Normalization, Exposure, Contrast) │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ STACK LAYER 2: SECONDARIES (Skin Calibration, ColorSlice, Isolations)   │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ STACK LAYER 3: LOOK & TEXTURE (Film Look Creator, Halation, Grain)      │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Preguntas que Debe Hacer si Faltan Datos

Cuando el usuario o la producción no proporcione especificaciones completas, el Asistente de IA debe formular las siguientes preguntas antes de proponer o ejecutar ajustes de color [6, 12, 128, 208, 248]:

1. **Sobre la Cámara y Formato de Origen:**
   * *"¿Con qué cámara y perfil de color fue grabado el material (ej. ARRI LogC4, RED IPP2 Log3G10, Sony S-Log3, BRAW, Canon Log 2)? "* [8, 128, 130]
   * *"¿Las tomas contienen metadatos integrados o es necesario aplicar un espacio de entrada manual (*Input Color Space*)?"* [8, 128, 129]
2. **Sobre la Gestión de Color del Proyecto:**
   * *"¿Qué arquitectura de gestión de color prefieres utilizar en este proyecto: DaVinci YRGB Color Managed (DWG), ACES (ACEScc/ACEScct) o un flujo manual con CSTs?"* [6, 7, 215, 237]
3. **Sobre el Entregable y Destino de Exhibición:**
   * *"¿Cuál es el estándar de entrega final y el entorno de visualización objetivo (ej. SDR Rec.709 Gamma 2.4 para web/TV, DCI-P3 para proyección de cine, o HDR10 ST 2084 PQ)?"* [8, 132-133, 239, 248]
4. **Sobre la Intención Estética y Referencias Visuales:**
   * *"¿Existe una película, referencia visual o biblia de estilo que guíe la gradación creativa (ej. emulación de película analógica Kodak 2383, contraste complementario Teal & Orange, estilo desaturado o clave alta)?"* [21, 45, 58, 247, 262]

---

## 7. Ejemplos Buenos y Malos (Casos de Estudio Practicos)

### Caso 1: Calibración de Tonos de Piel
* **Mal Ejemplo:** Aplicar un *Color Warper* global o un *Hue vs Hue* agresivo sobre todo el cuadro para calentar la cara de un actor, desplazando los amarillos y rojos en la ropa y el fondo, creando bordes plastificados en la mandíbula y ruido en sombras [35, 36, 124, 210].
* **Buen Ejemplo:** Aislar la piel mediante un nodo secundario (*Power Window* o calificador 3D), verificar el plot en el Vectorscopio con la línea de 123° (*Skin Tone Line*) activada, y utilizar el vector *Skin* de *ColorSlice* o pequeños retoques en *Gain/Tint* dentro del nodo aislado para alinear la piel sin afectar elementos circundantes [121-123, 139, 246, 257].

### Caso 2: Integración de Material Multicámara (LOG + Rec.709)
* **Mal Ejemplo:** Aplicar una LUT de estilo creativo (*Creative LUT*) de Rec.709 directamente sobre un nodo de material LOG y luego intentar ajustar la exposición subiendo la ganancia en un nodo posterior [11, 125].
* **Buen Ejemplo:** Configurar la gestión de color del proyecto en *DaVinci YRGB Color Managed*, definir el *Input Color Space* específico para cada cámara en el Media Pool (normalizando las tomas LOG a un espacio de trabajo unificado DWG/Intermediate) y aplicar la gradación creativa downstream sobre la señal normalizada [8, 128, 131, 214].

### Caso 3: Uso de Emulación de Película Analógica
* **Mal Ejemplo:** Colocar el efecto *Film Look Creator* o una LUT de emulación FPE al inicio del árbol de nodos, antes del balance de blancos y la corrección de exposición [98, 208].
* **Buen Ejemplo:** Insertar *Film Look Creator* en la capa final de Look (*Group Post-Clip* o nodo posterior a las primarias y secundarias), ajustando la saturación sustractiva, el *Skin Bias* y la halación de forma integrada con el balance previo [2, 21, 101, 147, 178].

---

## 8. Hechos y Consejos Respaldados por Múltiples Fuentes

Los siguientes conceptos están confirmados y respaldados de forma cruzada por dos o más fuentes de la biblioteca del proyecto:

1. **Diferencia Fundamental entre Corrección y Gradación de Color:**
   * La *Corrección de Color* es un proceso técnico, purificador y objetivo para corregir errores de rodaje y lograr neutralidad [43, 48, 75, 87, 96, 116, 240].
   * El *Color Grading* es un proceso artístico, estilístico y subjetivo para transmitir emociones e intenciones narrativas [44, 48, 76, 88, 241, 262].
   * *Fuentes que lo respaldan:* Retouch4me, Boris FX, MasterClass, Vimeo, Dehancer, Indie Film Hustle, Steve Ramsden, RedShark News, Blackmagic Design Guide [43-48, 75-76, 87-88, 96, 116, 240, 262].

2. **La Línea de Tono de Piel (*Skin Tone Line*) y la Hemoglobina:**
   * La pigmentación dérmica de todas las etnias humanas comparte exactamente la misma fase cromática en el Vectorscopio (alrededor de los **123° / posición 10:30** entre el rojo y el amarillo) debido a la hemoglobina de la sangre subdérmica [108-109, 244-245, 250, 257].
   * Las variaciones entre tonos de piel claros y oscuros se deben a la concentración de melanina, la cual afecta a la luminancia y la saturación, pero no al ángulo de tono (*Hue*) [109, 245, 250, 257].
   * *Fuentes que lo respaldan:* AaronWilliams.tv, ResearchGate, Technical Frameworks Markdown, Pull My Focus, Photoshop Training Channel [1, 108-109, 244-245, 250, 257].

3. **Modelo de Saturación Sustractiva (*Subtractive Saturation*):**
   * A diferencia del modelo aditivo digital tradicional (donde aumentar la saturación añade luz y puede provocar que los colores se vuelvan chillones o se quemen), el modelo sustractivo imita la película fotográfica reduciendo la luminancia a medida que aumenta la saturación, logrando colores más profundos y ricos [5, 34, 102, 173, 202].
   * Herramientas como *ColorSlice* y *Film Look Creator* de DaVinci Resolve 19/20 implementan saturación sustractiva de forma nativa [5, 99, 102, 173].
   * *Fuentes que lo respaldan:* MONONODES, Mixing Light, Team 2 Films (YouTube), Blackmagic Design New Features Guide, ProVideo Coalition, Advanced Color Grading Architecture Markdown [5, 18, 34, 99, 102, 107, 173].

4. **Comparativa de Arquitecturas de Color: DWG vs. ACES:**
   * **DaVinci Wide Gamut (DWG):** Diseñado específicamente para Resolve; abarca un espacio de color más amplio que todos los sensores de cámara existentes sin extenderse a colores físicamente imposibles, manteniendo transformaciones de salida más neutras y transparentes [8, 213, 217, 227-228].
   * **ACES (Academy Color Encoding System):** Estándar abierto de la industria para intercambio entre múltiples estudios y VFX; aporta su propia curva cromática tonal característica en el RRT/ODT [6, 9, 216, 227, 242-243].
   * *Fuentes que lo respaldan:* Frame.io Insider, DaVinci Resolve Club, CinApex Workflow Guide, Lift Gamma Gain Forum, r/colorists Reddit [6, 8, 9, 213, 216, 227-228, 242-243].

---

## 9. Aspectos No Cubiertos por las Fuentes

Para mantener la honestidad y rigurosidad técnica sin inventar información, se indica explícitamente que los siguientes temas **NO están presentes ni cubiertos** en las fuentes de este cuaderno:

1. **Rendimiento y Benchmarks de Hardware GPU No Apple/Nvidia:** No se proporcionan datos ni recomendaciones sobre tarjetas gráficas AMD Radeon, Intel Arc u otros procesadores de escritorio en Windows/Linux (las fuentes solo mencionan aceleración específica para Apple Silicon M-series y GPUs NVIDIA RTX) [24, 176-177, 185].
2. **Código Scripting Completo en Python / C++ para la API de Resolve:** Aunque las fuentes listan las capacidades de la API de scripting de Resolve 19/20 (gestión de grupos, consulta de grafos, exportación de LUTs), no contienen ejemplos de código ejecutable ni sintaxis completa para scripts automáticos en Python [167, 191].
3. **Mezcla y Masterización de Audio Multicanal Avanzado:** Aparte de las funciones IA de Fairlight (IntelliTrack Audio Panning, Music Remixer FX, Dialogue Separator FX y Ambisonics integrado), las fuentes no detallan normas broadcast de sonoridad LUFS ni ecualización de mezcla de sonido profesional [3, 24, 180, 190, 199].
4. **Calibración Física de Monitores de Estudio:** Las fuentes especifican los estándares de temperatura D65 6500K y curvas gamma (2.4, ST 2084 PQ), pero no incluyen manuales de uso ni procedimientos para sondas de calibración física por hardware como Klein K10-A, Calman o LightSpace [133, 248].

---
*Fin de la Guía Operativa para el Asistente de IA.*

# Skills Suite para Agentes de Inteligencia Artificial

Colección exhaustiva de **206 skills especializadas** para agentes de IA (**Claude Code, Codex, Antigravity, OpenCode, Cursor y Copilot**).

Este repositorio centraliza las instrucciones, herramientas y plantillas operativas para desarrollo de software, vídeo programático, neuro-retención en redes sociales, backend reactivo con Convex, diseño frontend anti-slop e investigación científica.

---

## 🚀 Instalación Rápida

### 1. Con el gestor de paquetes de skills (`npx skills`)

Para instalar todas las skills globalmente en tu entorno:
```bash
npx skills add romppao/skills -g
```

Para instalar una skill específica (por ejemplo, `retention-engine` o `remotion-best-practices`):
```bash
npx skills add romppao/skills --skill retention-engine
npx skills add romppao/skills --skill remotion-best-practices
```

### 2. Para Claude Code en la nube / GitHub
Si tu sesión de Claude corre en un contenedor conectado a GitHub, puedes clonar o referenciar este repositorio directamente:
```bash
git clone https://github.com/romppao/skills.git
cp -r skills/* .claude/skills/
```

---

## 📦 Categorías Destacadas

### 🎬 Vídeo, Animación y Redes Sociales
* **`retention-engine`**: Framework de neuro-retención en vídeo corto (Reels/TikTok) fusionado con **Meta FAIR TRIBE v2** (`facebookresearch/tribev2`). Estructura en 3 actos (Hook Bubblegum sin traición cognitiva, estrategia Lollipop y Payoff de conversión).
* **`remotion-best-practices` / `remotion-video`**: Suite completa de vídeo programático en React/TypeScript (subtítulos animados, mapas, exportación MP4 y studio).
* **`whisper-transcribe`**: Transcripción de voz a texto en local para vídeos y audios con OpenAI Whisper.
* **`video-use`**: Edición y montaje audiovisual conversacional.
* **`hyperframes` (Suite de 9 módulos)**: Creación de vídeo interactivo y composiciones ligeras mediante estándares web.
* **`gbro-collage-broll`**: B-Roll con estética de collage de papel, fotocopiadora y texturas analógicas.

### 🎨 Diseño, Frontend y Estética Anti-Slop
* **`design-taste-frontend` / `gpt-taste` / `stitch-design-taste`**: Interfaces limpias, tipografía cuidada y maquetación de alto nivel que erradica la apariencia genérica de IA.
* **`beui` / `beui-pro` / `magic-ui` / `rare-ui`**: Catálogo de componentes animados listos para integrar.
* **`image-humanizer`**: Transformación de prompts visuales con especificaciones de fotografía real (lentes, grano analógico, iluminación imperfecta).

### ⚡ Backend y Datos (Convex Specialist)
* **Suite Convex (30+ skills)**: Modelado reactivo de esquemas (`convex-design`), migraciones sin pérdida (`convex-migrate`), auditoría de seguridad (`convex-authz`), pasarelas de pago (`convex-billing`) y monitorización.

### 🧠 Ingeniería de Software y Hábitos de Calidad
* **`ponytail` (Suite completa)**: Modo desarrollador senior pragmático (la solución más simple y completa que resuelve el problema sin sobreingeniería).
* **`karpathy-guidelines`**: Principios operativos para evitar errores comunes de programación con LLMs.
* **`verification-before-completion`**: Comprobación obligatoria antes de declarar tareas finalizadas.
* **`systematic-debugging`**: Diagnóstico sistemático de errores paso a paso.

---

## 📂 Estructura del Repositorio

```text
skills/
├── skills/
│   ├── retention-engine/
│   │   ├── SKILL.md
│   │   ├── references/
│   │   ├── scripts/
│   │   └── tribev2/
│   ├── remotion-best-practices/
│   ├── whisper-transcribe/
│   ├── ponytail/
│   └── ... (206 skills)
└── README.md
```

---

## 📄 Licencia

Este repositorio recopila herramientas de código abierto bajo licencias MIT, Apache 2.0 y CC-BY-NC-4.0 (para componentes específicos de investigación como TRIBE v2).

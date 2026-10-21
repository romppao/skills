# Opciones y Modelos de Whisper

| Modelo | Tamaño VRAM / RAM | Velocidad Relativa | Precisión Recomendada |
| :--- | :--- | :--- | :--- |
| `tiny` | ~1 GB | 32x | Pruebas ultrarrápidas |
| `base` | ~1 GB | 16x | **Por defecto** - Óptimo para vídeos de redes y podcasts claros |
| `small` | ~2 GB | 6x | Recomendado para vídeos con ruido de fondo o música |
| `medium` | ~5 GB | 2x | Alta precisión para charlas técnicas |
| `turbo` | ~6 GB | 8x | Última generación de OpenAI, muy rápido y casi nivel large |
| `large` | ~10 GB | 1x | Máxima precisión multilingüe |

## Detección Automática de Idioma
Whisper detecta automáticamente el idioma hablado en los primeros 30 segundos. Si conoces el idioma de antemano (ej. español), indicar `--language es` ahorra tiempo de cálculo y mejora la precisión.

# TRIBE v2: La Base Neurocientífica de Retention-Engine

Este documento detalla la arquitectura científica y el fundamento neurocognitivo del modelo **TRIBE v2** (*TRImodal Brain Encoder v2*), desarrollado por **Meta FAIR** (Fundamental AI Research) y el **Laboratoire de Neurosciences Cognitives et Computationnelles (ENS Paris)**, integrado como motor teórico y de evaluación en la skill `retention-engine`.

---

## 1. Ficha del Modelo y Referencia Académica

* **Título:** *A foundation model of vision, audition, and language for in-silico neuroscience*
* **Autores:** Stéphane d'Ascoli, Jérémy Rapin, Yohann Benchetrit, Teon Brooks, Katelyn Begany, Joséphine Raugel, Hubert Banville, Jean-Rémi King.
* **Instituciones:** Meta Fundamental AI Research (FAIR) & École Normale Supérieure (ENS, Paris).
* **Preprint / Paper:** [arXiv:2605.04326](https://arxiv.org/abs/2605.04326)
* **Repositorio oficial:** `https://github.com/facebookresearch/tribev2.git`
* **Pesos en Hugging Face:** `facebook/tribev2`
* **Licencia:** CC-BY-NC-4.0

---

## 2. Conjunto de Datos y Entrenamiento

* **Sujetos:** Más de **720 voluntarios humanos** en estudios naturalistas independientes (Algonauts, Lahner, BOLD5000, etc.).
* **Tiempo de escaneo fMRI:** Más de **1.100 horas** de registros de resonancia magnética funcional (fMRI) de cuerpo entero / cerebro completo.
* **Resolución cortical:** Mapeo continuo sobre la malla cortical estándar **fsaverage5** (~20.484 vértices) y vóxeles corticales de alta resolución (~70.000 puntos).
* **Compensación hemodinámica:** Retardo hemodinámico calibrado de **5 segundos** (el desfase natural entre el estímulo audiovisual sensorial y la oxigenación en sangre registrada por fMRI).

---

## 3. Arquitectura Trimodal

TRIBE v2 procesa el flujo continuo del vídeo a través de 3 espinas dorsales (*backbones*) estado del arte:

```
┌────────────────────────────────────────────────────────┐
│                   VÍDEO DE ENTRADA                     │
└───────┬───────────────────┬────────────────────┬───────┘
        │                   │                    │
        ▼ (Vídeo)           ▼ (Audio)            ▼ (Texto transcrito)
┌───────────────┐   ┌───────────────┐    ┌───────────────┐
│ Video-JEPA 2  │   │ Wav2Vec-BERT  │    │   LLaMA 3.2   │
│ (Córtex visual│   │ (Córtex audit.│    │ (Córtex ling. │
│  V1, V2, MT)  │   │  A1, STG)     │    │  Wernicke, IFG│
└───────┬───────┘   └───────┬───────┘    └───────┬───────┘
        │                   │                    │
        └───────────────────┼────────────────────┘
                            ▼
              ┌───────────────────────────┐
              │   FUSION TRANSFORMER      │
              │  (Integración Trimodal)   │
              └─────────────┬─────────────┘
                            ▼
              ┌───────────────────────────┐
              │    PROYECCIÓN CORTICAL    │
              │  fsaverage5 (~20k vértices│
              │  y ~70k vóxeles fMRI)     │
              └───────────────────────────┘
```

1. **Visión (`Video-JEPA 2`):** Captura dinámica espaciotemporal, cambios de plano, velocidad angular, contrastes de brillo y movimiento cinético.
2. **Audición (`Wav2Vec-BERT`):** Procesa fonética, cambios de tono, silencios, golpes secos (*foley*), transiciones musicales y volumen.
3. **Lenguaje (`LLaMA 3.2`):** Modela la semántica continua palabra por palabra, coherencia del discurso, expectativas contextuales y entropía narrativa.

---

## 4. Correlación Neurocientífica con la Fórmula de los 3 Actos

| Fase del Vídeo | Segundo | Región Cerebral Estimulada (TRIBE v2) | Fenómeno Psicológico | Regla en `retention-engine` |
| :--- | :--- | :--- | :--- | :--- |
| **Hook Bubblegum** | `0 - 3s` | Córtex visual primario (V1/V2), Córtex auditivo primario (A1), Amígdala. | Alerta inmediata y fijación de atención sin sobrecarga. | Apertura de alto contraste, pregunta o contradicción sin gritos falsos. |
| **El Puente** | `3 - 5s` | Giro Temporal Superior (STG), Córtex Prefrontal Dorsolateral (dlPFC). | **Verificación de expectativa.** Si el estímulo decae, la oxigenación cae en picado («traición cognitiva»). | Evitar rodeos: demostrar inmediatamente la premisa del gancho. |
| **Estrategia Lollipop** | `5 - 28s` | Red Atencional Frontoparietal, Estriado Ventral (Circuito de Dopamina). | **Micro-renovación de interés.** La habituación neuronal ocurre a los 2.5s si no hay novedad sensorial. | Cortes de ángulo, contrastes visuales o giros de tesis cada 2–3 segundos. |
| **Payoff de Conversión** | `28 - 40s` | Red Neuronal por Defecto (DMN), Giro Angular, Corteza Cingulada Posterior. | **Cierre cognitivo y consolidación de memoria.** Satisfacción de la promesa inicial. | Recompensa clara, aprendizaje retenido y llamada a la comunidad orgánica. |

---

## 5. Uso del Código de Inferencia TRIBE v2

El código completo del repositorio oficial se encuentra en `tribev2/`. Para ejecutar predicción directa sobre un archivo multimedia:

```python
from tribev2.demo_utils import TribeModel

# 1. Cargar el modelo preentrenado desde Hugging Face
model = TribeModel.from_pretrained("facebook/tribev2", cache_folder="./cache")

# 2. Generar eventos desde el vídeo (extrae vídeo, audio y transcribe texto automáticamente)
events_df = model.get_events_dataframe(video_path="mi_reel_lona.mp4")

# 3. Predecir activación cortical en 20.000 vértices de fsaverage5
predictions, segments = model.predict(events=events_df)

# predictions.shape es (n_pasos_tiempo, n_vértices_corticales)
print("Predicciones corticales calculadas con desfase hemodinámico de 5s:", predictions.shape)
```

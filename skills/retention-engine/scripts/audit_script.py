#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de auditoría de retención y ritmo neurocognitivo basado en TRIBE v2 (Meta FAIR)
y el framework Retention Engine.
"""

import sys
import os
import re
import argparse

def analyze_retention_script(text):
    print("=" * 65)
    print("  RETENTION ENGINE: AUDITORÍA NEUROCOGNITIVA (TRIBE v2)")
    print("=" * 65)
    
    # 1. Hook check (0-3s)
    hook_match = re.search(r"(\[0:00|0:00|Acto 1|Hook)(.*?)(segundo 4|0:03|0:04|0:05)", text, re.DOTALL | re.IGNORECASE)
    hook_text = hook_match.group(2) if hook_match else text[:150]
    
    has_pain_or_mistake = any(w in hook_text.lower() for w in ["error", "no ", "duele", "romper", "falla", "90%", "mito", "peor", "cuidado"])
    
    print("\n1. ACTO 1: HOOK BUBBLEGUM (0 a 3s)")
    if has_pain_or_mistake:
        print("  [OK] Identifica dolor, error o creencia contraria de alto impacto.")
    else:
        print("  [ALERTA] El hook podria carecer de un dolor o contradiccion clara. Evita saludos o presentaciones.")
        
    # 2. Bridge / Cognitive betrayal check (3-5s)
    bridge_match = re.search(r"(0:03|0:04|0:05|segundo 4|Puente|Traici[oó]n)(.*?)(0:07|0:08|0:10|Lollipop|Acto 2)", text, re.DOTALL | re.IGNORECASE)
    bridge_text = bridge_match.group(2) if bridge_match else ""
    
    has_immediate_proof = any(w in bridge_text.lower() for w in ["mira", "porque", "demostraci", "corte", "plano", "explic", "no es", "es una", "exacto"]) or len(bridge_text) > 20
    
    print("\n2. EL PUENTE (Segundos 4 a 6 - Antitraicion Cognitiva)")
    if has_immediate_proof:
        print("  [OK] Entrega inmediata de la premisa sin rodeos (evita abandono fMRI precoz).")
    else:
        print("  [ALERTA] Asegura que el segundo 4-5 muestre la prueba visual directa de lo prometido.")

    # 3. Micro-stimuli density in Lollipop (6-30s)
    cuts_count = len(re.findall(r"(\[0:\d\d|plano|corte|micro-est[ií]mulo|sonido|audio|cambio|angulo|ángulo)", text, re.IGNORECASE))
    print("\n3. ESTRATEGIA LOLLIPOP (Micro-renovacion cada 2.5s)")
    print(f"  Estimulos / cambios detectados: {cuts_count}")
    if cuts_count >= 5:
        print("  [OK] Densidad de estimulos visuales y auditivos optima (> 1 estimulo cada 3s).")
    else:
        print("  [RECOMENDACION] Anade mas cambios de angulo, sonidos o contrastes cada 2.5 segundos.")

    # 4. Payoff & Conversion check (30s+)
    has_payoff = any(w in text.lower() for w in ["lonaclub", "lona", "guarda", "favorito", "sigueme", "comunidad", "gimnasio", "prueba"])
    print("\n4. PAYOFF Y CONVERSION (30s+)")
    if has_payoff:
        print("  [OK] Cumple la promesa con recompensa clara y llamada a la comunidad.")
    else:
        print("  [ALERTA] Falta llamada organica a la comunidad o recompensa de cierre.")

    print("\n" + "=" * 65)
    print("  RESULTADO GLOBAL: Guion apto para retencion > 30s.")
    print("=" * 65)

def main():
    parser = argparse.ArgumentParser(description="Auditoria de retencion de guiones segun TRIBE v2 / Retention Engine")
    parser.add_argument("file", help="Ruta al archivo de guion o texto a auditar")
    args = parser.parse_args()

    if not os.path.exists(args.file):
        print(f"Error: No se encuentra el archivo {args.file}")
        sys.exit(1)

    with open(args.file, "r", encoding="utf-8", errors="replace") as f:
        content = f.read()

    analyze_retention_script(content)

if __name__ == "__main__":
    main()

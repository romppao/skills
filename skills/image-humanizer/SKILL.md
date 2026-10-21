---
name: image-humanizer
version: 0.1.0
description: >
  Transform generic AI image prompts into realistic, photography-grounded ones.
  Detects AI-prone patterns (beauty modifiers, resolution spam, platform tags)
  and injects film stocks, lens specs, lighting conditions, and imperfections.
  Use when generating images with Midjourney, DALL-E, Stable Diffusion, or
  any AI image generator to get more natural, less "AI-looking" results.
license: MIT
---

# Image Humanizer: fix AI image prompts

Transform generic prompts into photography-grounded ones that produce realistic results.

## Quick usage

```bash
# Transform a prompt
node {baseDir}/src/cli.js transform "a woman in a coffee shop"

# Analyze what's wrong
node {baseDir}/src/cli.js analyze "beautiful portrait, 8k, trending on artstation"

# Get suggestions
node {baseDir}/src/cli.js suggest "a man walking down the street"

# List available modifiers
node {baseDir}/src/cli.js modifiers
```

## What it fixes

| Pattern | Problem |
|---------|---------|
| Generic subject | "a woman" → AI default face |
| Beauty modifiers | "beautiful, stunning" → over-processed |
| Resolution spam | "8K, 4K" → over-sharpening |
| Platform tags | "trending on artstation" → stylized digital art |
| Generic lighting | "cinematic lighting" → meaningless |
| No imperfections | Perfect = AI smooth |

## What it adds

**Camera/film:** Kodak Portra 400, Fuji Superia, Leica M6, disposable camera

**Lenses:** 50mm f/1.4, 85mm portrait, vintage glass with character

**Lighting:** Golden hour, overcast diffusion, harsh midday, mixed sources

**Imperfections:** Film grain, light leaks, motion blur, dust, scratches

**Human details:** Visible pores, wrinkles, asymmetry, skin texture

**Composition:** Off-center, candid, documentary style

## Example

Before:
> a woman in a coffee shop

After:
> a woman in her 30s with visible laugh lines at a worn wooden table at a busy coffee shop with steamed windows, shot on Kodak Portra 400, 50mm f/1.4, golden hour side light, film grain, slight motion blur, candid framing, visible pores, natural wrinkles

## Options

```bash
--style=<film|digital|phone>    Photography style (default: film)
--mood=<natural|moody|harsh>    Lighting mood (default: natural)
--imperfections=<low|medium|high>  Imperfection level (default: medium)
--json                          Output as JSON
```

## API

```javascript
import { humanize, transformPrompt, analyzePrompt } from 'image-humanizer';

// Quick transform
const prompt = humanize('a man on the street');

// Full transform with options
const result = transformPrompt('a woman in a coffee shop', {
  style: 'film',
  mood: 'natural',
  imperfectionLevel: 'medium',
});
console.log(result.transformed);

// Just analyze
const analysis = analyzePrompt('beautiful portrait, 8k');
console.log(analysis.score); // 0-100
```

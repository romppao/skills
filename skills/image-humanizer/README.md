# image-humanizer

Transform generic AI image prompts into realistic, human-looking outputs.

The same concept as [humanizer](https://github.com/brandonwise/humanizer) for text, but for image prompts. Detects AI-prone patterns and injects realism modifiers that push generators toward more natural results.

## The problem

Generic prompts like "a woman in a coffee shop" produce that unmistakable AI look:
- Over-smoothed skin
- Perfect symmetry
- Generic lighting
- Missing imperfections
- That plastic, rendered quality

This tool fixes that.

## Install

```bash
git clone https://github.com/brandonwise/image-humanizer.git
cd image-humanizer
npm install

# Run directly
node src/cli.js transform "your prompt here"

# Or install globally
npm install -g .
image-humanizer transform "your prompt here"
```

## Usage

### Transform a prompt

```bash
image-humanizer transform "a woman in a coffee shop"
```

**Before:** "a woman in a coffee shop"  
Score: 🔴 70/100

**After:** "a woman in her 30s with visible laugh lines at a worn wooden table at a busy coffee shop with steamed windows, shot on Kodak Portra 400, 50mm f/1.4, golden hour side light, film grain, slight motion blur, candid framing, visible pores, natural wrinkles"  
Score: 🟢 0/100

### Analyze a prompt

```bash
image-humanizer analyze "beautiful portrait, 8k, trending on artstation"
```

Shows what's wrong:
- ⚠️ Overused beauty modifiers
- ⚠️ 8K/4K resolution spam
- ⚠️ Trending/ArtStation clichés
- ⚠️ No camera/lens reference
- ⚠️ No imperfections

### Get suggestions

```bash
image-humanizer suggest "a man walking down the street"
```

Returns recommended additions for camera, lighting, imperfections, and composition.

### List available modifiers

```bash
image-humanizer modifiers
```

Shows all available realism modifiers by category.

## AI-prone patterns detected

| Pattern | Why it's bad |
|---------|--------------|
| Generic subject | "a woman" → AI default face |
| Generic location | "coffee shop" → AI default interior |
| Beauty modifiers | "beautiful, stunning" → over-processed |
| Hyper-realistic | Often produces opposite effect |
| 8K/4K spam | Triggers over-sharpening |
| Trending/ArtStation | Pulls toward stylized digital art |
| Generic lighting | "cinematic lighting" is meaningless |
| No imperfections | Perfectly clean = AI smooth |
| No camera specs | Generic rendering |
| Direct camera gaze | Posed, artificial look |

## Realism modifiers injected

- **Camera/film:** Kodak Portra 400, Leica M6, 35mm, disposable camera
- **Lenses:** 50mm f/1.4, 85mm portrait lens, vintage lens character
- **Lighting:** Golden hour, overcast soft light, harsh midday, mixed sources
- **Imperfections:** Film grain, light leaks, slight blur, dust, scratches
- **Human details:** Visible pores, wrinkles, asymmetry, skin texture
- **Composition:** Off-center, candid, documentary style, environmental portrait

## Options

```bash
--style=<film|digital|phone>      Photography style (default: film)
--mood=<natural|moody|harsh>      Lighting mood (default: natural)
--imperfections=<low|medium|high> Imperfection level (default: medium)
--json                            Output as JSON
```

## API

```javascript
import { transformPrompt, analyzePrompt, getSuggestions } from 'image-humanizer';

// Transform
const result = transformPrompt('a woman in a coffee shop', {
  style: 'film',
  mood: 'natural',
  imperfectionLevel: 'medium',
});
console.log(result.transformed);

// Analyze
const analysis = analyzePrompt('beautiful portrait, 8k');
console.log(analysis.score);  // 0-100
console.log(analysis.issues); // Array of problems

// Quick transform
import { humanize } from 'image-humanizer';
const prompt = humanize('a man on the street');
```

## Why this works

AI image generators are trained on captioned photos. When you use photography-specific language (film stocks, lens characteristics, lighting conditions), you're essentially telling the model "make this look like photos that were described this way" — which were real photos with real imperfections.

The more specific and photography-grounded your prompt, the less the model falls back on its default "AI art" aesthetic.

## License

MIT

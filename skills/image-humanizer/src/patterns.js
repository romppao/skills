/**
 * patterns.js — AI image prompt pattern detection
 * 
 * Detects generic, AI-prone patterns in image prompts that typically
 * result in that unmistakable "AI look."
 */

// Patterns that lead to AI-looking images
export const AI_PRONE_PATTERNS = [
  {
    id: 'generic-subject',
    name: 'Generic subject',
    description: 'Unspecific subject without distinguishing details',
    weight: 4,
    regex: /^(a |an )?(woman|man|person|girl|boy|child|people)\b(?! (with|wearing|holding|in their|who))/i,
    suggestion: 'Add specific details: age, expression, clothing, action, distinguishing features',
  },
  {
    id: 'generic-location',
    name: 'Generic location',
    description: 'Vague location without atmosphere or specifics',
    weight: 3,
    regex: /\b(in a |at a |at the )?(coffee shop|restaurant|office|room|street|park|beach|forest|city)\b(?! (with|where|that|filled))/i,
    suggestion: 'Add atmosphere: time of day, weather, condition (worn, modern, cluttered), specific details',
  },
  {
    id: 'beautiful-modifier',
    name: 'Overused beauty modifiers',
    description: '"Beautiful", "stunning", "gorgeous" lead to over-processed looks',
    weight: 5,
    regex: /\b(beautiful|stunning|gorgeous|amazing|incredible|breathtaking|perfect)\b/gi,
    suggestion: 'Remove or replace with specific qualities: weathered, sun-dappled, candid, lived-in',
  },
  {
    id: 'hyper-realistic',
    name: 'Hyper-realistic trap',
    description: '"Hyper-realistic" often produces the opposite effect',
    weight: 4,
    regex: /\b(hyper[- ]?realistic|ultra[- ]?realistic|photo[- ]?realistic)\b/gi,
    suggestion: 'Use specific camera/film references instead: "shot on Kodak Portra 400", "Leica M6"',
  },
  {
    id: '8k-4k',
    name: '8K/4K resolution spam',
    description: 'Resolution tags rarely help and can trigger over-sharpening',
    weight: 3,
    regex: /\b(8k|4k|hd|uhd|high resolution|highly detailed)\b/gi,
    suggestion: 'Remove. Use film grain, lens characteristics instead for quality',
  },
  {
    id: 'trending-artstation',
    name: 'Trending/ArtStation clichés',
    description: 'These tags pull toward stylized digital art, not realism',
    weight: 4,
    regex: /\b(trending on artstation|artstation|deviantart|cgsociety|unreal engine|octane render)\b/gi,
    suggestion: 'Remove for realistic photos. Use photography-specific references instead',
  },
  {
    id: 'cinematic-lighting',
    name: 'Generic lighting terms',
    description: '"Cinematic lighting" is vague and overused',
    weight: 3,
    regex: /\b(cinematic lighting|dramatic lighting|professional lighting|studio lighting)\b/gi,
    suggestion: 'Be specific: "golden hour side light", "harsh midday sun", "overcast soft light", "single bare bulb"',
  },
  {
    id: 'portrait-generic',
    name: 'Generic portrait terms',
    description: 'Plain portrait terms lack character',
    weight: 3,
    regex: /\b(portrait of|headshot of|photo of)\b/gi,
    suggestion: 'Add context: "candid portrait", "environmental portrait", "passport-style photo", "caught mid-laugh"',
  },
  {
    id: 'style-stacking',
    name: 'Style keyword stacking',
    description: 'Too many style keywords fight each other',
    weight: 3,
    detect(prompt) {
      const styleWords = prompt.match(/\b(style|aesthetic|vibe|mood|tone|look|feel)\b/gi) || [];
      return styleWords.length > 2;
    },
    suggestion: 'Pick one clear style direction instead of stacking multiple',
  },
  {
    id: 'missing-imperfection',
    name: 'No imperfections',
    description: 'Perfectly clean prompts yield AI-smooth results',
    weight: 4,
    detect(prompt) {
      const imperfectionWords = /\b(worn|scratched|faded|dusty|dirty|messy|wrinkled|weathered|aged|vintage|grain|noise|blur|soft focus|imperfect)\b/i;
      return !imperfectionWords.test(prompt);
    },
    suggestion: 'Add imperfections: film grain, slight blur, worn surfaces, natural mess',
  },
  {
    id: 'missing-camera',
    name: 'No camera/lens reference',
    description: 'Missing photography specs leads to generic rendering',
    weight: 3,
    detect(prompt) {
      const cameraWords = /\b(shot on|filmed|captured|35mm|50mm|85mm|f\/\d|aperture|leica|canon|nikon|hasselblad|kodak|fuji|portra|ektar|tri-x)\b/i;
      return !cameraWords.test(prompt);
    },
    suggestion: 'Add camera specs: "shot on 35mm f/1.8", "Kodak Portra 400", "vintage Polaroid"',
  },
  {
    id: 'symmetry-trap',
    name: 'Symmetry/centered composition',
    description: 'Centered, symmetrical compositions feel artificial',
    weight: 2,
    regex: /\b(centered|symmetrical|perfectly balanced|in the middle|facing camera directly)\b/gi,
    suggestion: 'Use off-center composition, rule of thirds, candid angles',
  },
  {
    id: 'direct-gaze',
    name: 'Direct camera gaze',
    description: 'Subject staring at camera often looks posed/artificial',
    weight: 2,
    regex: /\b(looking at camera|staring at camera|eye contact|facing forward|looking directly)\b/gi,
    suggestion: 'Try: "looking away", "caught unaware", "profile view", "looking down at hands"',
  },
];

// Positive patterns that suggest realism awareness
export const REALISM_INDICATORS = [
  { regex: /\b(candid|unposed|caught|moment|spontaneous)\b/i, weight: 2 },
  { regex: /\b(35mm|50mm|85mm|f\/\d\.\d)\b/i, weight: 3 },
  { regex: /\b(kodak|fuji|portra|ektar|tri-x|ilford)\b/i, weight: 3 },
  { regex: /\b(grain|noise|soft focus|slight blur|motion blur)\b/i, weight: 2 },
  { regex: /\b(worn|weathered|aged|vintage|faded|dusty)\b/i, weight: 2 },
  { regex: /\b(golden hour|overcast|harsh light|mixed lighting)\b/i, weight: 2 },
  { regex: /\b(wrinkles|pores|freckles|asymmetric|imperfect)\b/i, weight: 2 },
  { regex: /\b(leica|hasselblad|contax|pentax|mamiya)\b/i, weight: 2 },
  { regex: /\b(documentary|street photography|photojournalism)\b/i, weight: 2 },
];

/**
 * Analyze a prompt for AI-prone patterns
 */
export function analyzePrompt(prompt) {
  const issues = [];
  let aiScore = 0;
  let realismScore = 0;

  // Check AI-prone patterns
  for (const pattern of AI_PRONE_PATTERNS) {
    let match = false;
    
    if (pattern.detect) {
      match = pattern.detect(prompt);
    } else if (pattern.regex) {
      match = pattern.regex.test(prompt);
    }

    if (match) {
      issues.push({
        id: pattern.id,
        name: pattern.name,
        description: pattern.description,
        weight: pattern.weight,
        suggestion: pattern.suggestion,
      });
      aiScore += pattern.weight;
    }
  }

  // Check realism indicators
  for (const indicator of REALISM_INDICATORS) {
    if (indicator.regex.test(prompt)) {
      realismScore += indicator.weight;
    }
  }

  // Calculate final score (0-100, higher = more AI-prone)
  const rawScore = Math.max(0, aiScore - realismScore);
  const normalizedScore = Math.min(100, Math.round(rawScore * 5));

  return {
    score: normalizedScore,
    aiScore,
    realismScore,
    issues,
    issueCount: issues.length,
  };
}

export default { analyzePrompt, AI_PRONE_PATTERNS, REALISM_INDICATORS };

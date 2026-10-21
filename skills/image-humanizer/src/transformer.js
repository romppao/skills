/**
 * transformer.js — Transform generic prompts into realistic ones
 * 
 * Takes an AI-prone prompt and transforms it by:
 * 1. Removing problematic patterns
 * 2. Adding realism modifiers
 * 3. Restructuring for better results
 */

import { analyzePrompt, AI_PRONE_PATTERNS } from './patterns.js';
import {
  CAMERAS,
  LENSES,
  LIGHTING,
  IMPERFECTIONS,
  HUMAN_DETAILS,
  COMPOSITION,
  ENVIRONMENT,
  STYLES,
  getRandomModifiers,
} from './modifiers.js';

/**
 * Detect if prompt contains a human subject
 */
function hasHumanSubject(prompt) {
  return /\b(woman|man|person|girl|boy|child|people|portrait|face|model|figure)\b/i.test(prompt);
}

/**
 * Detect if prompt is for a landscape/scene
 */
function isLandscape(prompt) {
  return /\b(landscape|scenery|vista|horizon|mountain|ocean|forest|desert|cityscape|skyline)\b/i.test(prompt);
}

/**
 * Remove problematic phrases from prompt
 */
function cleanPrompt(prompt) {
  let cleaned = prompt;

  // Remove resolution spam
  cleaned = cleaned.replace(/\b(8k|4k|hd|uhd|high resolution|highly detailed)\b,?\s*/gi, '');
  
  // Remove trending/platform tags
  cleaned = cleaned.replace(/\b(trending on artstation|artstation|deviantart|cgsociety|unreal engine|octane render)\b,?\s*/gi, '');
  
  // Remove hyper-realistic traps
  cleaned = cleaned.replace(/\b(hyper[- ]?realistic|ultra[- ]?realistic|photo[- ]?realistic)\b,?\s*/gi, '');
  
  // Remove overused beauty modifiers
  cleaned = cleaned.replace(/\b(beautiful|stunning|gorgeous|amazing|incredible|breathtaking|perfect)\b,?\s*/gi, '');
  
  // Remove generic lighting terms
  cleaned = cleaned.replace(/\b(cinematic lighting|dramatic lighting|professional lighting|studio lighting)\b,?\s*/gi, '');
  
  // Clean up multiple commas and spaces
  cleaned = cleaned.replace(/,\s*,/g, ',');
  cleaned = cleaned.replace(/\s+/g, ' ');
  cleaned = cleaned.replace(/^[,\s]+|[,\s]+$/g, '');

  return cleaned;
}

/**
 * Add specificity to generic subjects
 */
function enhanceSubject(prompt) {
  let enhanced = prompt;

  // Enhance generic woman/man
  enhanced = enhanced.replace(
    /\ba (woman|man)\b(?! (with|wearing|holding|in|who|aged|around))/gi,
    (match, subject) => {
      const ages = ['in her 30s', 'in his 40s', 'middle-aged', 'elderly', 'young adult'];
      const details = ['with visible laugh lines', 'with weathered hands', 'with tired eyes', 'with an asymmetric smile'];
      const age = ages[Math.floor(Math.random() * ages.length)];
      const detail = details[Math.floor(Math.random() * details.length)];
      return `a ${subject} ${age} ${detail}`;
    }
  );

  // Enhance generic person
  enhanced = enhanced.replace(
    /\ba person\b(?! (with|wearing|holding|in|who))/gi,
    () => {
      const types = [
        'a tired office worker',
        'a weathered farmer',
        'a distracted commuter',
        'a street vendor',
        'someone caught mid-thought',
      ];
      return types[Math.floor(Math.random() * types.length)];
    }
  );

  return enhanced;
}

/**
 * Add context to generic locations
 */
function enhanceLocation(prompt) {
  let enhanced = prompt;

  const locationEnhancements = {
    'coffee shop': [
      'a worn wooden table at a busy coffee shop with steamed windows',
      'a quiet corner of a cluttered independent coffee shop',
      'a formica counter at a 24-hour diner',
    ],
    'office': [
      'a fluorescent-lit cubicle with papers everywhere',
      'a messy home office with coffee rings on the desk',
      'a sterile open-plan office with harsh lighting',
    ],
    'street': [
      'a rain-slicked city street at dusk',
      'a sun-bleached sidewalk in midday heat',
      'a busy crosswalk during rush hour',
    ],
    'park': [
      'a patchy grass park with worn benches',
      'an overgrown corner of an urban park',
      'a muddy path through a city park after rain',
    ],
  };

  for (const [generic, specifics] of Object.entries(locationEnhancements)) {
    const regex = new RegExp(`\\b(in a|at a|at the) ${generic}\\b`, 'gi');
    if (regex.test(enhanced)) {
      const specific = specifics[Math.floor(Math.random() * specifics.length)];
      enhanced = enhanced.replace(regex, `at ${specific}`);
      break;
    }
  }

  return enhanced;
}

/**
 * Build camera/technical section
 */
function buildTechnicalModifiers(options = {}) {
  const {
    style = 'film',  // film, digital, phone
    mood = 'natural', // natural, moody, harsh
  } = options;

  const parts = [];

  // Camera/film stock
  if (style === 'film') {
    parts.push(getRandomModifiers(CAMERAS.film, 1)[0]);
  } else if (style === 'digital') {
    parts.push(getRandomModifiers(CAMERAS.modern, 1)[0]);
  } else {
    parts.push('smartphone photo');
  }

  // Lens (not for phone)
  if (style !== 'phone') {
    parts.push(getRandomModifiers(LENSES, 1)[0]);
  }

  // Lighting based on mood
  if (mood === 'moody') {
    parts.push(getRandomModifiers(LIGHTING.moody, 1)[0]);
  } else if (mood === 'harsh') {
    parts.push(getRandomModifiers(LIGHTING.artificial, 1)[0]);
  } else {
    parts.push(getRandomModifiers(LIGHTING.natural, 1)[0]);
  }

  return parts.filter(Boolean);
}

/**
 * Build imperfection modifiers
 */
function buildImperfections(intensity = 'medium') {
  const parts = [];
  const count = intensity === 'high' ? 3 : intensity === 'low' ? 1 : 2;

  parts.push(...getRandomModifiers(IMPERFECTIONS.film, 1));
  
  if (count >= 2) {
    parts.push(...getRandomModifiers(IMPERFECTIONS.focus, 1));
  }
  
  if (count >= 3) {
    parts.push(...getRandomModifiers(IMPERFECTIONS.surface, 1));
  }

  return parts;
}

/**
 * Main transformation function
 */
export function transformPrompt(prompt, options = {}) {
  const {
    style = 'film',
    mood = 'natural',
    imperfectionLevel = 'medium',
    preserveOriginal = false,
  } = options;

  // Analyze original
  const analysis = analyzePrompt(prompt);
  
  // Start with cleaned prompt
  let transformed = preserveOriginal ? prompt : cleanPrompt(prompt);
  
  // Enhance subjects and locations
  const isHuman = hasHumanSubject(prompt);
  transformed = enhanceSubject(transformed);
  transformed = enhanceLocation(transformed);
  
  // Build modifier sections
  const technical = buildTechnicalModifiers({ style, mood });
  const imperfections = buildImperfections(imperfectionLevel);
  const composition = getRandomModifiers(COMPOSITION.natural, 1);
  
  // Add human details if applicable
  const humanDetails = isHuman ? getRandomModifiers(HUMAN_DETAILS, 2) : [];
  
  // Combine everything
  const allModifiers = [
    ...technical,
    ...imperfections,
    ...composition,
    ...humanDetails,
  ].filter(Boolean);
  
  // Build final prompt
  const finalPrompt = [transformed, ...allModifiers].join(', ');
  
  // Analyze transformed prompt
  const newAnalysis = analyzePrompt(finalPrompt);
  
  return {
    original: prompt,
    transformed: finalPrompt,
    originalScore: analysis.score,
    newScore: newAnalysis.score,
    improvement: analysis.score - newAnalysis.score,
    issuesFixed: analysis.issues.map(i => i.name),
    modifiersAdded: allModifiers,
  };
}

/**
 * Quick transform with defaults
 */
export function humanize(prompt) {
  return transformPrompt(prompt).transformed;
}

/**
 * Get just suggestions without transforming
 */
export function getSuggestions(prompt) {
  const analysis = analyzePrompt(prompt);
  const isHuman = hasHumanSubject(prompt);
  
  const suggestions = {
    issues: analysis.issues,
    score: analysis.score,
    recommendedAdditions: {
      camera: getRandomModifiers(CAMERAS.film, 2),
      lighting: getRandomModifiers(LIGHTING.natural, 2),
      imperfections: getRandomModifiers(IMPERFECTIONS.film, 2),
      composition: getRandomModifiers(COMPOSITION.natural, 2),
    },
  };
  
  if (isHuman) {
    suggestions.recommendedAdditions.humanDetails = getRandomModifiers(HUMAN_DETAILS, 3);
  }
  
  return suggestions;
}

export default { transformPrompt, humanize, getSuggestions };

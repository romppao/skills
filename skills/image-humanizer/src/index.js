/**
 * image-humanizer
 * 
 * Transform generic AI image prompts into realistic, human-looking outputs.
 */

export { analyzePrompt, AI_PRONE_PATTERNS, REALISM_INDICATORS } from './patterns.js';
export { transformPrompt, humanize, getSuggestions } from './transformer.js';
export {
  CAMERAS,
  LENSES,
  LIGHTING,
  IMPERFECTIONS,
  HUMAN_DETAILS,
  COMPOSITION,
  ENVIRONMENT,
  STYLES,
  getRandomModifiers,
  getBalancedModifiers,
} from './modifiers.js';

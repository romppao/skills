#!/usr/bin/env node
/**
 * image-humanizer CLI
 * 
 * Transform generic AI image prompts into realistic, human-looking outputs.
 * 
 * Usage:
 *   image-humanizer transform "a woman in a coffee shop"
 *   image-humanizer analyze "beautiful portrait, 8k, trending on artstation"
 *   image-humanizer suggest "a man walking down the street"
 */

import { analyzePrompt } from './patterns.js';
import { transformPrompt, getSuggestions } from './transformer.js';
import {
  CAMERAS,
  LENSES,
  LIGHTING,
  IMPERFECTIONS,
  HUMAN_DETAILS,
  STYLES,
  getRandomModifiers,
} from './modifiers.js';

// Parse command line args
const args = process.argv.slice(2);
const command = args[0];
const prompt = args.slice(1).join(' ');

// Help text
const HELP = `
image-humanizer — Transform AI image prompts for realistic outputs

USAGE:
  image-humanizer <command> "<prompt>"

COMMANDS:
  transform    Transform a prompt with realism modifiers
  analyze      Analyze a prompt for AI-prone patterns
  suggest      Get suggestions without transforming
  modifiers    List available realism modifiers
  examples     Show example transformations
  help         Show this help message

OPTIONS:
  --style=<film|digital|phone>    Photography style (default: film)
  --mood=<natural|moody|harsh>    Lighting mood (default: natural)
  --imperfections=<low|medium|high>  Imperfection level (default: medium)
  --json                          Output as JSON

EXAMPLES:
  image-humanizer transform "a woman in a coffee shop"
  image-humanizer analyze "beautiful portrait, 8k, artstation"
  image-humanizer transform "city street at night" --style=film --mood=moody
`;

// Score badge
function getBadge(score) {
  if (score <= 20) return '🟢';
  if (score <= 40) return '🟡';
  if (score <= 60) return '🟠';
  return '🔴';
}

// Parse options from args
function parseOptions(args) {
  const options = {
    style: 'film',
    mood: 'natural',
    imperfectionLevel: 'medium',
    json: false,
  };

  for (const arg of args) {
    if (arg.startsWith('--style=')) {
      options.style = arg.split('=')[1];
    } else if (arg.startsWith('--mood=')) {
      options.mood = arg.split('=')[1];
    } else if (arg.startsWith('--imperfections=')) {
      options.imperfectionLevel = arg.split('=')[1];
    } else if (arg === '--json') {
      options.json = true;
    }
  }

  return options;
}

// Commands
function cmdTransform(prompt, options) {
  if (!prompt) {
    console.error('Error: Please provide a prompt to transform');
    process.exit(1);
  }

  const result = transformPrompt(prompt, options);

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  console.log(`
┌──────────────────────────────────────────────┐
│         IMAGE PROMPT HUMANIZER               │
└──────────────────────────────────────────────┘

ORIGINAL:
  "${result.original}"
  
  Score: ${getBadge(result.originalScore)} ${result.originalScore}/100 (higher = more AI-prone)

TRANSFORMED:
  "${result.transformed}"
  
  Score: ${getBadge(result.newScore)} ${result.newScore}/100
  Improvement: ${result.improvement > 0 ? '+' : ''}${result.improvement} points

ISSUES FIXED:
${result.issuesFixed.length ? result.issuesFixed.map(i => `  • ${i}`).join('\n') : '  (none)'}

MODIFIERS ADDED:
${result.modifiersAdded.map(m => `  + ${m}`).join('\n')}
`);
}

function cmdAnalyze(prompt, options) {
  if (!prompt) {
    console.error('Error: Please provide a prompt to analyze');
    process.exit(1);
  }

  const analysis = analyzePrompt(prompt);

  if (options.json) {
    console.log(JSON.stringify(analysis, null, 2));
    return;
  }

  console.log(`
┌──────────────────────────────────────────────┐
│          PROMPT ANALYSIS                     │
└──────────────────────────────────────────────┘

PROMPT:
  "${prompt}"

SCORE: ${getBadge(analysis.score)} ${analysis.score}/100
  AI-prone patterns: ${analysis.aiScore}
  Realism indicators: ${analysis.realismScore}

${analysis.issues.length ? `ISSUES FOUND (${analysis.issueCount}):` : 'NO ISSUES FOUND ✓'}
${analysis.issues.map(issue => `
  ⚠️  ${issue.name} (weight: ${issue.weight})
      ${issue.description}
      → ${issue.suggestion}
`).join('')}
`);
}

function cmdSuggest(prompt, options) {
  if (!prompt) {
    console.error('Error: Please provide a prompt');
    process.exit(1);
  }

  const suggestions = getSuggestions(prompt);

  if (options.json) {
    console.log(JSON.stringify(suggestions, null, 2));
    return;
  }

  console.log(`
┌──────────────────────────────────────────────┐
│          SUGGESTIONS                         │
└──────────────────────────────────────────────┘

PROMPT: "${prompt}"
SCORE: ${getBadge(suggestions.score)} ${suggestions.score}/100

${suggestions.issues.length ? `FIX THESE:` : ''}
${suggestions.issues.map(i => `  ⚠️  ${i.name}: ${i.suggestion}`).join('\n')}

RECOMMENDED ADDITIONS:

  📷 Camera/Film:
${suggestions.recommendedAdditions.camera.map(m => `     + ${m}`).join('\n')}

  💡 Lighting:
${suggestions.recommendedAdditions.lighting.map(m => `     + ${m}`).join('\n')}

  🎞️ Imperfections:
${suggestions.recommendedAdditions.imperfections.map(m => `     + ${m}`).join('\n')}

  📐 Composition:
${suggestions.recommendedAdditions.composition.map(m => `     + ${m}`).join('\n')}
${suggestions.recommendedAdditions.humanDetails ? `
  👤 Human Details:
${suggestions.recommendedAdditions.humanDetails.map(m => `     + ${m}`).join('\n')}` : ''}
`);
}

function cmdModifiers() {
  console.log(`
┌──────────────────────────────────────────────┐
│          REALISM MODIFIERS                   │
└──────────────────────────────────────────────┘

📷 CAMERAS & FILM:
${Object.entries(CAMERAS).map(([cat, items]) => 
  `  ${cat}:\n${items.slice(0, 5).map(i => `    • ${i}`).join('\n')}`
).join('\n')}

🔭 LENSES:
${LENSES.slice(0, 8).map(l => `  • ${l}`).join('\n')}

💡 LIGHTING:
${Object.entries(LIGHTING).map(([cat, items]) =>
  `  ${cat}:\n${items.slice(0, 4).map(i => `    • ${i}`).join('\n')}`
).join('\n')}

🎞️ IMPERFECTIONS:
${Object.entries(IMPERFECTIONS).map(([cat, items]) =>
  `  ${cat}:\n${items.slice(0, 4).map(i => `    • ${i}`).join('\n')}`
).join('\n')}

👤 HUMAN DETAILS:
${HUMAN_DETAILS.slice(0, 8).map(h => `  • ${h}`).join('\n')}

🎬 STYLES:
${STYLES.slice(0, 8).map(s => `  • ${s}`).join('\n')}
`);
}

function cmdExamples() {
  const examples = [
    'a woman in a coffee shop',
    'beautiful portrait of a man, 8k, trending on artstation',
    'city street at night',
    'person walking through a forest',
    'photo of a child playing',
  ];

  console.log(`
┌──────────────────────────────────────────────┐
│          EXAMPLE TRANSFORMATIONS             │
└──────────────────────────────────────────────┘
`);

  for (const example of examples) {
    const result = transformPrompt(example);
    console.log(`
BEFORE: "${example}"
  Score: ${getBadge(result.originalScore)} ${result.originalScore}/100

AFTER:  "${result.transformed}"
  Score: ${getBadge(result.newScore)} ${result.newScore}/100
${'─'.repeat(60)}`);
  }
}

// Main
const options = parseOptions(args);
const promptText = args.filter(a => !a.startsWith('--')).slice(1).join(' ');

switch (command) {
  case 'transform':
  case 't':
    cmdTransform(promptText, options);
    break;
  case 'analyze':
  case 'a':
    cmdAnalyze(promptText, options);
    break;
  case 'suggest':
  case 's':
    cmdSuggest(promptText, options);
    break;
  case 'modifiers':
  case 'm':
    cmdModifiers();
    break;
  case 'examples':
  case 'e':
    cmdExamples();
    break;
  case 'help':
  case '-h':
  case '--help':
  case undefined:
    console.log(HELP);
    break;
  default:
    console.error(`Unknown command: ${command}`);
    console.log(HELP);
    process.exit(1);
}

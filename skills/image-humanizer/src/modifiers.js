/**
 * modifiers.js — Realism modifiers for AI image prompts
 * 
 * Photography-specific vocabulary that pushes AI image generators
 * toward more realistic, human-looking outputs.
 */

// Camera and lens specifications
export const CAMERAS = {
  film: [
    'shot on 35mm film',
    'shot on Kodak Portra 400',
    'shot on Kodak Ektar 100',
    'shot on Fuji Pro 400H',
    'shot on Ilford HP5',
    'shot on Kodak Tri-X 400',
    'shot on Cinestill 800T',
    'vintage Polaroid',
    'instant film photograph',
    'disposable camera photo',
  ],
  professional: [
    'shot on Leica M6',
    'shot on Hasselblad 500C',
    'shot on Contax T2',
    'shot on Mamiya RB67',
    'shot on Canon AE-1',
    'shot on Nikon FM2',
    'shot on Pentax K1000',
    'medium format film',
    'large format photograph',
  ],
  modern: [
    'shot on iPhone',
    'smartphone photo',
    'DSLR photograph',
    'mirrorless camera',
    'point and shoot camera',
  ],
};

export const LENSES = [
  '35mm lens',
  '50mm f/1.4',
  '50mm f/1.8',
  '85mm portrait lens',
  '24mm wide angle',
  '135mm telephoto',
  'f/2.8 aperture',
  'f/1.4 shallow depth of field',
  'wide open aperture',
  'bokeh background',
  'tilt-shift lens',
  'vintage lens with character',
];

// Lighting conditions
export const LIGHTING = {
  natural: [
    'golden hour light',
    'blue hour',
    'harsh midday sun',
    'overcast soft light',
    'window light',
    'dappled sunlight through trees',
    'backlit silhouette',
    'side lighting',
    'natural ambient light',
    'cloudy day diffused light',
  ],
  artificial: [
    'single bare bulb',
    'fluorescent office lighting',
    'tungsten warm light',
    'neon sign glow',
    'streetlight at night',
    'mixed color temperature',
    'practical lights in frame',
    'flash photography',
    'harsh camera flash',
    'ring light catchlights',
  ],
  moody: [
    'low key lighting',
    'chiaroscuro',
    'Rembrandt lighting',
    'dramatic shadows',
    'rim light',
    'lens flare',
    'light leak',
  ],
};

// Imperfections and texture
export const IMPERFECTIONS = {
  film: [
    'film grain',
    'subtle noise',
    'light leaks',
    'dust and scratches',
    'slight overexposure',
    'underexposed shadows',
    'color shift',
    'halation',
    'vignette',
  ],
  focus: [
    'slight motion blur',
    'soft focus',
    'out of focus background',
    'shallow depth of field',
    'slightly out of focus',
    'focus falloff',
    'subject blur from movement',
  ],
  physical: [
    'lens distortion',
    'chromatic aberration',
    'barrel distortion',
    'vintage lens flaws',
    'soft corners',
    'coma',
  ],
  surface: [
    'worn surfaces',
    'weathered',
    'scratched',
    'faded colors',
    'dusty',
    'dirty',
    'water stains',
    'patina',
    'rust',
    'peeling paint',
  ],
};

// Human imperfections
export const HUMAN_DETAILS = [
  'visible pores',
  'skin texture',
  'natural wrinkles',
  'laugh lines',
  'freckles',
  'moles',
  'under-eye circles',
  'stray hairs',
  'asymmetric features',
  'natural skin tone variation',
  'subtle redness',
  'visible veins',
  'chapped lips',
  'sweat',
  'goosebumps',
];

// Composition and framing
export const COMPOSITION = {
  natural: [
    'off-center composition',
    'rule of thirds',
    'negative space',
    'candid framing',
    'environmental portrait',
    'unposed',
    'caught in the moment',
    'documentary style',
    'street photography',
  ],
  angles: [
    'eye level',
    'slightly below eye level',
    'three-quarter view',
    'profile view',
    'over the shoulder',
    'from behind',
    'birds eye view',
    'worms eye view',
  ],
  distance: [
    'close-up',
    'medium shot',
    'full body',
    'wide establishing shot',
    'intimate distance',
    'personal space',
  ],
};

// Context and environment details
export const ENVIRONMENT = {
  clutter: [
    'cluttered background',
    'messy desk',
    'lived-in space',
    'papers scattered',
    'coffee cups',
    'personal belongings visible',
    'everyday objects',
    'natural mess',
  ],
  atmosphere: [
    'hazy atmosphere',
    'dusty air',
    'steam',
    'smoke',
    'fog',
    'rain',
    'condensation on windows',
    'breath visible in cold',
  ],
  time: [
    'early morning',
    'late afternoon',
    'dusk',
    'middle of the night',
    'rush hour',
    'quiet Sunday morning',
  ],
};

// Photography styles that suggest realism
export const STYLES = [
  'documentary photography',
  'street photography',
  'photojournalism',
  'candid photography',
  'snapshot aesthetic',
  'vernacular photography',
  'found footage look',
  'surveillance camera',
  'paparazzi shot',
  'family album photo',
  'yearbook photo',
  'passport photo',
  'ID photo',
  'amateur photography',
];

/**
 * Get random items from a category
 */
export function getRandomModifiers(category, count = 1) {
  let items;
  
  if (Array.isArray(category)) {
    items = category;
  } else if (typeof category === 'object') {
    items = Object.values(category).flat();
  } else {
    return [];
  }
  
  const shuffled = items.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/**
 * Get a balanced set of realism modifiers
 */
export function getBalancedModifiers(options = {}) {
  const {
    includeCamera = true,
    includeLighting = true,
    includeImperfections = true,
    includeComposition = true,
    humanSubject = false,
  } = options;

  const modifiers = [];

  if (includeCamera) {
    modifiers.push(...getRandomModifiers(CAMERAS.film, 1));
    modifiers.push(...getRandomModifiers(LENSES, 1));
  }

  if (includeLighting) {
    modifiers.push(...getRandomModifiers(LIGHTING.natural, 1));
  }

  if (includeImperfections) {
    modifiers.push(...getRandomModifiers(IMPERFECTIONS.film, 1));
    modifiers.push(...getRandomModifiers(IMPERFECTIONS.focus, 1));
  }

  if (includeComposition) {
    modifiers.push(...getRandomModifiers(COMPOSITION.natural, 1));
  }

  if (humanSubject) {
    modifiers.push(...getRandomModifiers(HUMAN_DETAILS, 2));
  }

  return modifiers;
}

export default {
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
};

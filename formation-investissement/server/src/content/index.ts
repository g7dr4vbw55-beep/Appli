import { niveau1 } from './niveau1.js';
import { niveau2 } from './niveau2.js';
import { niveau3 } from './niveau3.js';
import { niveau4 } from './niveau4.js';
import { niveau5 } from './niveau5.js';
import { glossaire } from './glossaire.js';
import { actifs } from './actifs.js';
import type { LevelSeed } from './types.js';

/** Les cinq niveaux, dans l'ordre de deverrouillage. */
export const niveaux: LevelSeed[] = [niveau1, niveau2, niveau3, niveau4, niveau5];

export { glossaire, actifs };
export * from './types.js';

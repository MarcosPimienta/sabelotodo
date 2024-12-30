export const predefinedCoordinates: {
  [key: string]: { x: number; z: number };
} = {
  red: { x: 0, z: 24 },
  blue: { x: 20, z: 12 },
  green: { x: -20, z: 12 },
  gray: { x: 20, z: -12 },
  white: { x: -20, z: -12 },
  black: { x: 0, z: -24 },
};

export const BoardCoordinates: { [key: string]: { x: number; z: number } } = {
  1: { x: 0, z: -44}, // Red start
  2: { x: 0, z: -75 },
  3: { x: 0, z: -108 },
  4: { x: 0, z: -140 },
  5: { x: 0, z: -172 },
  6: { x: -38, z: -22 }, // Blue start
  7: { x: -67, z: -38 },
  8: { x: -94, z: -54 },
  9: { x: -122, z: -70 },
  10: { x: -150, z: -85 },
  11: { x: -38, z: 22 }, // Gray start
  12: { x: -65, z: 37 },
  13: { x: -94, z: 53 },
  14: { x: -122, z: 70 },
  15: { x: -150, z: 85 },
  16: { x: 0, z: 45 }, // Black start
  17: { x: 0, z: 76 },
  18: { x: 0, z: 108 },
  19: { x: 0, z: 141 },
  20: { x: 0, z: 173 },
  21: { x: 38, z: 22 }, // White start
  22: { x: 65, z: 37 },
  23: { x: 94, z: 54 },
  24: { x: 122, z: 70 },
  25: { x: 150, z: 85 },
  26: { x: 38, z: -22 }, // Green start
  27: { x: 65, z: -38 },
  28: { x: 94, z: -53 },
  29: { x: 122, z: -69 },
  30: { x: 150, z: -85 },
  31: { x: 0, z: -214 },
  32: { x: -51, z: -190 },
  33: { x: -80, z: -170 },
  34: { x: -110, z: -155 },
  35: { x: -140, z: -138 },
  36: { x: -185, z: -106 }, // Blue Gate
  37: { x: -188, z: -50 },
  38: { x: -188, z: -15 },
  39: { x: -188, z: 18 },
  40: { x: -188, z: 52 },
  41: { x: -185, z: 107 }, // Gray Gate
  42: { x: -137, z: 138 },
  43: { x: -108, z: 155 },
  44: { x: -80, z: 172 },
  45: { x: -50, z: 190 },
  46: { x: 0, z: 214 }, // Black Gate
  47: { x: 50, z: 190 },
  48: { x: 80, z: 172 },
  49: { x: 108, z: 155 },
  50: { x: 138, z: 140 },
  51: { x: 185, z: 110 }, // White Gate
  52: { x: 190, z: 53 },
  53: { x: 190, z: 18 },
  54: { x: 190, z: -15 },
  55: { x: 190, z: -50 },
  56: { x: 185, z: -105 }, // Green gate
  57: { x: 140, z: -138 },
  58: { x: 110, z: -155 },
  59: { x: 80, z: -170 },
  60: { x: 50, z: -190 },
  61: { x: 0, z: -214 }, // Red Gate
  62: { x: 0, z: -172 },
  63: { x: 0, z: -140 },
  64: { x: 0, z: -108 },
  65: { x: 0, z: -75 },
  66: { x: 0, z: -44 },
  67: { x: 0, z: -24 }, // Red end
  68: { x: -185, z: -106 },
  69: { x: -150, z: -85 },
  70: { x: -122, z: -70 },
  71: { x: -94, z: -54 },
  72: { x: -67, z: -38 },
  73: { x: -38, z: -22 },
  74: { x: -20, z: -12 }, // Blue end
  75: { x: -185, z: 107 },
  76: { x: -150, z: 85 },
  77: { x: -122, z: 70 },
  78: { x: -94, z: 53 },
  79: { x: -65, z: 37 },
  80: { x: -38, z: 22 },
  81: { x: -20, z: 12 }, // Gray End
  82: { x: 0, z: 214 },
  83: { x: 0, z: 173 },
  84: { x: 0, z: 141 },
  85: { x: 0, z: 108 },
  86: { x: 0, z: 76 },
  87: { x: 0, z: 45 },
  88: { x: 0, z: 24 }, // Black end
  89: { x: 185, z: 110 },
  90: { x: 150, z: 85 },
  91: { x: 122, z: 70 },
  92: { x: 94, z: 54 },
  93: { x: 65, z: 37 },
  94: { x: 38, z: 22 },
  95: { x: 20, z: 12 }, // White end
  96: { x: 185, z: -105 },
  97: { x: 190, z: -50 },
  98: { x: 150, z: -85 },
  99: { x: 122, z: -69 },
  100: { x: 94, z: -53 },
  101: { x: 65, z: -38 },
  102: { x: 38, z: -22 },
  103: { x: 20, z: -12 } // Green end
};

export const predefinedCoordinates: {
  [key: string]: { x: number; z: number };
} = {
  red: { x: 0, z: 214 },
  blue: { x: 185, z: 110 },
  gray: { x: -185, z: 107 },
  black: { x: 0, z: -214 },
  white: { x: -185, z: -106 },
  green: { x: -185, z: 107 },
  //This is the test coordinates
  /* red: { x: 0, z: 24 },
  blue: { x: 20, z: 12 },
  gray: { x: 20, z: -12 },
  black: { x: 0, z: -24 },
  white: { x: -20, z: -12 },
  green: { x: -20, z: 12 }, */
};

export const BoardCoordinates: { [key: string]: { x: number; z: number } } = {
  0: { x: 0, z: 24 }, // Red start
  1: { x: 20, z: 12 }, // Blue start
  2: { x: 20, z: -12 }, // Gray start
  3: { x: 0, z: -24 }, // Black start
  4: { x: -20, z: -12 }, // White start
  5: { x: -20, z: 12 }, // Green start
  6: { x: 0, z: -44 },
  7: { x: 0, z: -75 },
  8: { x: 0, z: -108 },
  9: { x: 0, z: -140 },
  10: { x: 0, z: -172 },
  11: { x: -38, z: -22 },
  12: { x: -67, z: -38 },
  13: { x: -94, z: -54 },
  14: { x: -122, z: -70 },
  15: { x: -150, z: -85 },
  16: { x: -38, z: 22 },
  17: { x: -65, z: 37 },
  18: { x: -94, z: 53 },
  19: { x: -122, z: 70 },
  20: { x: -150, z: 85 },
  21: { x: 0, z: 45 }, // Black 1st
  22: { x: 0, z: 76 },
  23: { x: 0, z: 108 },
  24: { x: 0, z: 141 },
  25: { x: 0, z: 173 },
  26: { x: 38, z: 22 }, // Blue 1st
  27: { x: 65, z: 37 },
  28: { x: 94, z: 54 },
  29: { x: 122, z: 70 },
  30: { x: 150, z: 85 },
  31: { x: 38, z: -22 }, // Gray 1st
  32: { x: 65, z: -38 },
  33: { x: 94, z: -53 },
  34: { x: 122, z: -69 },
  35: { x: 150, z: -85 },
  36: { x: 0, z: -214 },
  37: { x: -51, z: -190 },
  38: { x: -80, z: -170 },
  39: { x: -110, z: -155 },
  40: { x: -140, z: -138 },
  41: { x: -185, z: -106 },
  42: { x: -188, z: -50 },
  43: { x: -188, z: -15 },
  44: { x: -188, z: 18 },
  45: { x: -188, z: 52 },
  46: { x: -185, z: 107 },
  47: { x: -137, z: 138 },
  48: { x: -108, z: 155 },
  49: { x: -80, z: 172 },
  50: { x: -50, z: 190 },
  51: { x: 0, z: 214 }, // Red Gate
  52: { x: 50, z: 190 },
  53: { x: 80, z: 172 },
  54: { x: 108, z: 155 },
  55: { x: 138, z: 140 },
  56: { x: 185, z: 110 },
  57: { x: 190, z: 53 },
  58: { x: 190, z: 18 },
  59: { x: 190, z: -15 },
  60: { x: 190, z: -50 },
  61: { x: 185, z: -105 },
  62: { x: 140, z: -138 },
  63: { x: 110, z: -155 },
  64: { x: 80, z: -170 },
  65: { x: 50, z: -190 },
  66: { x: 0, z: -214 },//Black 1-
  67: { x: 0, z: -172 },//Black 2-
  68: { x: 0, z: -140 },//Black 3-
  69: { x: 0, z: -108 },//Black 4-
  70: { x: 0, z: -75 },//Black 5-
  71: { x: 0, z: -44 },//Black 6-
  72: { x: 0, z: -24 },//Black last -- 0 --
  73: { x: -185, z: -106 },//White 1-
  74: { x: -150, z: -85 },//White 2-
  75: { x: -122, z: -70 },//White 3-
  76: { x: -94, z: -54 },//White 4-
  77: { x: -67, z: -38 },//White 5-
  78: { x: -38, z: -22 },//White 6-
  79: { x: -20, z: -12 },//White last -- 0 --
  80: { x: -185, z: 107 },//Gray 1-
  81: { x: -150, z: 85 },//Gray 2-
  82: { x: -122, z: 70 },//Gray 3-
  83: { x: -94, z: 53 },//Gray 4-
  84: { x: -65, z: 37 },//Gray 5-
  85: { x: -38, z: 22 },//Gray 6-
  86: { x: -20, z: 12 },//Gray last -- 0 --
  87: { x: 0, z: 214 },//Red 1-
  88: { x: 0, z: 173 },//Red 2-
  89: { x: 0, z: 141 },//Red 3-
  90: { x: 0, z: 108 },//Red 4-
  91: { x: 0, z: 76 },//Red 5-
  92: { x: 0, z: 45 },//Red 6-
  93: { x: 0, z: 24 },//Red last -- 0 --
  94: { x: 185, z: 110 },//Blue 1-
  95: { x: 150, z: 85 },//Blue 2-
  96: { x: 122, z: 70 },//Blue 3-
  97: { x: 94, z: 54 },//Blue 4-
  98: { x: 65, z: 37 },//Blue 5-
  99: { x: 38, z: 22 },//Blue 6-
  100: { x: 20, z: 12 },//Blue last -- 0 --
  101: { x: -185, z: 107 },//Green 1-
  102: { x: -150, z: 85 },//Green 2-
  103: { x: -122, z: 70 },//Green 3-
  104: { x: -94, z: 53 },//Green 4-
  105: { x: -65, z: 37 },//Green 5-
  106: { x: -38, z: 22 },//Green 6-
  107: { x: -20, z: 12 },//Green last -- 0 --
};

function stringToNumber(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash += str.charCodeAt(i);
  }
  return hash;
}

type Rarity = "SSSR" | "SSR" | "SR" | "R";

const DIVIDER = 1000;

const RARITY: {
  [key in Rarity]: number;
} = {
  SSSR: 5,
  SSR: 50,
  SR: 100,
  R: 1000,
};

export function getRarity(str: string) {
  const num = stringToNumber(str);
  const remainder = num % DIVIDER;

  for (const key of Object.keys(RARITY)) {
    const rarity = RARITY[key as Rarity];

    if (remainder < rarity) {
      return key as Rarity;
    }
  }

  return "R";
}

export const RARITY_STYLES: {
  [key in Rarity]: {
    border: string;
    gradient: string;
    glow: string;
    text: string;
  };
} = {
  R: {
    border: "border-gray-400",
    gradient: "bg-gradient-to-br from-gray-300 to-gray-500",
    glow: "shadow-gray-400/50",
    text: "text-gray-700",
  },
  SR: {
    border: "border-green-500",
    gradient: "bg-gradient-to-br from-green-400 to-green-600",
    glow: "shadow-green-500/50",
    text: "text-green-900",
  },
  SSR: {
    border: "border-purple-500",
    gradient: "bg-gradient-to-br from-purple-400 to-purple-600",
    glow: "shadow-purple-500/50",
    text: "text-purple-50",
  },
  SSSR: {
    border: "border-yellow-500",
    gradient: "bg-gradient-to-br from-yellow-500 to-yellow-600",
    glow: "shadow-yellow-500/50",
    text: "text-yellow-50",
  },
};

export const RARITY_STYLES_OPENGRAPH: {
  [key in Rarity]: {
    bg: string;
    text: string;
  };
} = {
  R: {
    bg: "#d1d5db",
    text: "#374151",
  },
  SR: {
    bg: "#86efac",
    text: "#166534",
  },
  SSR: {
    bg: "#c084fc",
    text: "#4c1d95",
  },
  SSSR: {
    bg: "#fde047",
    text: "#713f12",
  },
};

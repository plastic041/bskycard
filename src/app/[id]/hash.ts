function stringToNumber(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash += str.charCodeAt(i);
  }
  return hash;
}

type Rarity = "SSS" | "SS" | "S" | "A" | "B" | "C";

const DIVIDER = 1000;

const RARITY: {
  [key in Rarity]: number;
} = {
  SSS: 1,
  SS: 5,
  S: 10,
  A: 100,
  B: 300,
  C: 1000,
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

  return "C";
}

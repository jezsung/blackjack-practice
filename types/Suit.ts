const suits = ['club', 'diamond', 'heart', 'spade'] as const;

type Suit = typeof suits[number];

export { suits };
export type { Suit };

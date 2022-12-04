const ranks = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'] as const;

type Rank = typeof ranks[number];

export { ranks };
export type { Rank };

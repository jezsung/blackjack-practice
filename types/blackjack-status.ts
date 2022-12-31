const blackjackStatuses = ['betting', 'dealing', 'insuring', 'acting', 'drawing', 'winning', 'losing'] as const;

type BlackjackStatus = typeof blackjackStatuses[number];

export { blackjackStatuses };
export type { BlackjackStatus };

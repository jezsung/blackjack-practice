const blackjackStatuses = ['betting', 'dealing', 'insurance', 'acting', 'drawing'] as const;

type BlackjackStatus = typeof blackjackStatuses[number];

export { blackjackStatuses };
export type { BlackjackStatus };

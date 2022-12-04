const faces = ['up', 'down'] as const;

type Face = typeof faces[number];

export { faces };
export type { Face };

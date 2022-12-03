type Rank = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'jack' | 'queen' | 'king' | 'ace';

type Suit = 'club' | 'diamond' | 'heart' | 'spade';

type Face = 'up' | 'down';

interface PlayingCard {
  rank: Rank;
  suit: Suit;
  face: Face;
}

export type { PlayingCard, Rank, Suit, Face };

import { Face } from './face';
import { Rank } from './rank';
import { Suit } from './suit';

interface PlayingCard {
  face: Face;
  rank: Rank;
  suit: Suit;
}

export type { PlayingCard };

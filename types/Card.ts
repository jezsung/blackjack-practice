import { CardFace } from './CardFace';
import { Rank } from './Rank';
import { Suit } from './Suit';

class Card {
  rank: Rank;
  suit: Suit;
  face: CardFace;

  constructor(rank: Rank, suit: Suit, face?: CardFace | undefined) {
    this.rank = rank;
    this.suit = suit;
    this.face = face ?? CardFace.Up;
  }

  faceUp() {
    this.face = CardFace.Up;
  }

  faceDown() {
    this.face = CardFace.Down;
  }
}

export { Card };

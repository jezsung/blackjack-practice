import { PlayingCard } from '../types/playing-card';
import { ranks } from '../types/rank';
import { suits } from '../types/suit';

class Shoe {
  private cards: PlayingCard[];

  constructor(deckCount: number) {
    this.cards = [];
    for (let i = 0; i < deckCount; i++) {
      for (const rank of ranks) {
        for (const suit of suits) {
          this.cards.push({
            face: 'down',
            rank: rank,
            suit: suit,
          });
        }
      }
    }
    this.shuffle();
  }

  draw(): PlayingCard {
    const card = this.cards.pop();

    if (!card) {
      throw new Error('Shoe has no more cards');
    }

    return card;
  }

  shuffle(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }
}

export { Shoe };

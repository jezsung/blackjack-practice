import { immerable } from 'immer';
import { PlayingCard } from '../types/playing-card';
import { Hand } from './hand';

class DealerHand extends Hand {
  [immerable] = true;

  constructor(cards: PlayingCard[] = []) {
    super(cards);
  }

  get upcard(): PlayingCard | null {
    if (this.cards.length !== 2) {
      return null;
    }

    return this.cards.find((card) => card.face === 'up')!;
  }

  deal(...card: PlayingCard[]): void {
    this.cards.push(...card);
  }
}

export { DealerHand };

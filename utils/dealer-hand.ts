import { immerable } from 'immer';
import { PlayingCard } from '../types/playing-card';
import { Hand } from './hand';

class DealerHand extends Hand {
  [immerable] = true;

  constructor(cards: PlayingCard[] = []) {
    super(cards);
  }

  deal(...card: PlayingCard[]): void {
    this.cards.push(...card);
  }
}

export { DealerHand };

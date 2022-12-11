import { immerable } from 'immer';
import { PlayingCard } from '../types/playing-card';
import { Rank } from '../types/rank';
import { Hand } from './hand';

class PlayerHand extends Hand {
  [immerable] = true;

  didDoubleDown: boolean = false;

  constructor(cards: PlayingCard[] = []) {
    super(cards);
  }

  get splitable(): boolean {
    if (this.cards.length !== 2) {
      return false;
    }

    const isValue10 = (rank: Rank) => {
      return rank === '10' || rank === 'jack' || rank === 'queen' || rank === 'king';
    };

    if (isValue10(this.cards[0].rank) && isValue10(this.cards[1].rank)) {
      return true;
    }

    return this.cards[0].rank === this.cards[1].rank;
  }

  deal(...card: PlayingCard[]): void {
    if (this.didDoubleDown) {
      throw new Error('Player already did double down. Player cannot be dealt more cards.');
    }

    this.cards.push(...card);
  }

  doubleDown(card: PlayingCard) {
    if (this.didDoubleDown) {
      throw new Error('Player already did double down. Player cannot be dealt more cards.');
    }

    this.didDoubleDown = true;
    this.cards.push(card);
  }
}

export { PlayerHand };

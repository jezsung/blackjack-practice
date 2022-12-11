import { immerable } from 'immer';
import { PlayingCard } from '../types/playing-card';

abstract class Hand {
  [immerable] = true;

  cards: PlayingCard[];

  constructor(cards: PlayingCard[] = []) {
    this.cards = cards;
  }

  get sum(): number {
    const sum = this.cards.reduce((sum, card) => {
      let value: number;

      switch (card.rank) {
        case '2':
          value = 2;
          break;
        case '3':
          value = 3;
          break;
        case '4':
          value = 4;
          break;
        case '5':
          value = 5;
          break;
        case '6':
          value = 6;
          break;
        case '7':
          value = 7;
          break;
        case '8':
          value = 8;
          break;
        case '9':
          value = 9;
        case '10':
        case 'jack':
        case 'queen':
        case 'king':
          value = 10;
          break;
        case 'ace':
          value = sum > 10 ? 1 : 11;
          break;
      }

      return sum + value;
    }, 0);

    return sum;
  }

  get blackjack(): boolean {
    return this.cards.length === 2 && this.sum === 21;
  }

  get bust(): boolean {
    return this.sum > 21;
  }

  abstract deal(...card: PlayingCard[]): void;
}

export { Hand };

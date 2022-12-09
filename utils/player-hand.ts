import { PlayingCard } from '../types/playing-card';
import { Rank } from '../types/rank';

class PlayerHand {
  private cards: PlayingCard[];

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

  get bust(): boolean {
    return this.sum > 21;
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

  add(card: PlayingCard): void {
    this.cards.push(card);
  }
}

export { PlayerHand as Hand };

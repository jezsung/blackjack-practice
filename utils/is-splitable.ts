import { PlayingCard } from '../types/playing-card';

const isValue10 = (card: PlayingCard) => {
  const rank = card.rank;
  return rank === '10' || rank === 'jack' || rank === 'queen' || rank === 'king';
};

export const isSplitable = (cards: PlayingCard[]) => {
  if (cards.length !== 2) {
    return false;
  }

  if (isValue10(cards[0]) && isValue10(cards[1])) {
    return true;
  }

  return cards[0].rank === cards[1].rank;
};

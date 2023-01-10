import { PlayingCard } from '../types/playing-card';
import { getSumOfCardValues } from './get-sum-of-card-values';

export const isBust = (cards: PlayingCard[]) => {
  return getSumOfCardValues(cards) > 21;
};

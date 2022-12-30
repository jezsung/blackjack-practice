import { AnyAction, createSlice, Draft, PayloadAction, ThunkAction } from '@reduxjs/toolkit';
import { RootState } from '..';
import { Face } from '../../types/face';
import { PlayingCard } from '../../types/playing-card';
import { ranks } from '../../types/rank';
import { suits } from '../../types/suit';
import { delay } from '../../utils/delay';
import { getSumOfCards } from '../../utils/get-sum-of-cards';

interface BlackjackState {
  deck: PlayingCard[];
  dealerHand: PlayingCard[];
  playerHand: PlayingCard[][];
  currentHandIndex: number;
  balance: number;
  betAmount: number;
  insured: boolean;
}

const initialState: BlackjackState = {
  deck: [],
  dealerHand: [],
  playerHand: [[]],
  currentHandIndex: 0,
  balance: 1000,
  betAmount: 0,
  insured: false,
};

const slice = createSlice({
  name: 'blackjack',
  initialState: initialState,
  reducers: {
    shuffle: (state: Draft<BlackjackState>, action: PayloadAction<number>) => {
      const deck: PlayingCard[] = [];
      const deckCount = action.payload ?? 2;

      for (let i = 0; i < deckCount; i++) {
        for (const rank of ranks) {
          for (const suit of suits) {
            deck.push({
              face: 'down',
              rank: rank,
              suit: suit,
            });
          }
        }
      }

      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }

      state.deck = deck;
    },
    bet: (state: Draft<BlackjackState>, action: PayloadAction<number>) => {
      const currentBetAmount = state.betAmount;

      if (currentBetAmount > 0) {
        state.balance += currentBetAmount;
      }

      const betAmount = action.payload;

      if (betAmount <= 0 || state.balance < betAmount) {
        return;
      }

      state.balance -= betAmount;
      state.betAmount = betAmount;
    },
    deal: (state: Draft<BlackjackState>, action: PayloadAction<{ to: 'dealer' | 'player'; face: Face }>) => {
      const drawnCard = state.deck.pop();

      if (!drawnCard) {
        return;
      }

      drawnCard.face = action.payload.face;

      switch (action.payload.to) {
        case 'player':
          state.playerHand[state.currentHandIndex].push(drawnCard);
          break;
        case 'dealer':
          state.dealerHand.push(drawnCard);
          break;
      }
    },
    insure: (state: Draft<BlackjackState>) => {
      if (state.balance < state.betAmount / 2) {
        return;
      }

      state.balance -= state.betAmount / 2;
      state.insured = true;
    },
    revealHoleCard: (state: Draft<BlackjackState>) => {
      const holeCardIndex = state.dealerHand.findIndex((card) => card.face === 'down');

      if (holeCardIndex === -1) {
        return;
      }

      state.dealerHand[holeCardIndex].face = 'up';
    },
    win: (state: Draft<BlackjackState>) => {
      if (state.insured) {
        state.balance += state.betAmount + state.betAmount / 2;
      } else {
        state.balance += state.betAmount;
      }
      state.betAmount = 0;
      state.insured = false;
      state.currentHandIndex = 0;
    },
    discard: (state: Draft<BlackjackState>) => {
      state.dealerHand = [];
      state.playerHand = [];
    },
  },
});

const actions = slice.actions;

export const { reducer: blackjackReducer } = slice;
export const { bet } = actions;

export const start = (): ThunkAction<void, RootState, unknown, AnyAction> => (dispatch) => {
  dispatch(actions.shuffle(2));
  dispatch(actions.deal({ to: 'player', face: 'up' }));
  dispatch(actions.deal({ to: 'dealer', face: 'up' }));
  dispatch(actions.deal({ to: 'player', face: 'up' }));
  dispatch(actions.deal({ to: 'dealer', face: 'down' }));
};

export const insure = (): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch, getState) => {
  dispatch(actions.insure());
  await delay(1000);

  const dealerHand = getState().blackjack.dealerHand;
  const sumOfDealerCards = getSumOfCards(dealerHand);

  if (sumOfDealerCards !== 21) {
    return;
  }

  dispatch(actions.revealHoleCard());
  await delay(1000);

  dispatch(actions.win());

  dispatch(actions.discard());
};

export const selectDealerHand = (state: RootState): PlayingCard[] => state.blackjack.dealerHand;

export const selectPlayerHand = (state: RootState): PlayingCard[][] => state.blackjack.playerHand;

export const selectDealerUpcard = (state: RootState): PlayingCard | null => {
  const cards = state.blackjack.dealerHand;

  if (cards.length !== 2) {
    return null;
  }

  return cards.find((card) => card.face === 'up')!;
};

export const selectDealerHoleCard = (state: RootState): PlayingCard | null => {
  const cards = state.blackjack.dealerHand;

  if (cards.length !== 2) {
    return null;
  }

  return cards.find((card) => card.face === 'down')!;
};

export const selectBalance = (state: RootState): number => state.blackjack.balance;

export const selectBet = (state: RootState): number => state.blackjack.betAmount;

export const selectInsured = (state: RootState): boolean => state.blackjack.insured;

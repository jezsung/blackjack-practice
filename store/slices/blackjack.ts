import { AnyAction, createSlice, Draft, PayloadAction, ThunkAction } from '@reduxjs/toolkit';
import { RootState } from '..';
import { BlackjackStatus } from '../../types/blackjack-status';
import { Face } from '../../types/face';
import { PlayingCard } from '../../types/playing-card';
import { ranks } from '../../types/rank';
import { suits } from '../../types/suit';
import { delay } from '../../utils/delay';
import { isSplitable } from '../../utils/is-splitable';

interface DealerHand {
  cards: PlayingCard[];
}

interface PlayerHand {
  cards: PlayingCard[];
  doubledDown: boolean;
}

interface BlackjackState {
  status: BlackjackStatus;
  deck: PlayingCard[];
  dealerHand: DealerHand;
  playerHands: PlayerHand[];
  currentHandIndex: number;
  balance: number;
  betAmount: number;
  insured: boolean;
}

const initialState: BlackjackState = {
  status: 'betting',
  deck: [],
  dealerHand: {
    cards: [],
  },
  playerHands: [
    {
      cards: [],
      doubledDown: false,
    },
  ],
  currentHandIndex: 0,
  balance: 1000,
  betAmount: 0,
  insured: false,
};

const slice = createSlice({
  name: 'blackjack',
  initialState: initialState,
  reducers: {
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
    start: (state: Draft<BlackjackState>) => {
      const shuffle = () => {
        const deck: PlayingCard[] = [];
        const deckCount = 2;

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
      };

      const draw = (face: Face = 'up'): PlayingCard => {
        const drawnCard = state.deck.pop()!;
        drawnCard.face = face;
        return drawnCard;
      };

      shuffle();
      state.dealerHand.cards = [];
      state.playerHands = [
        {
          cards: [],
          doubledDown: false,
        },
      ];

      state.status = 'dealing';
      state.playerHands[0].cards.push(draw());
      state.dealerHand.cards.push(draw());
      state.playerHands[0].cards.push(draw());
      state.dealerHand.cards.push(draw('down'));

      const upcard = state.dealerHand.cards.find((card) => card.face === 'up');
      if (upcard?.rank === 'ace') {
        state.status = 'insuring';
      } else {
        state.status = 'acting';
      }
    },
    deal: (
      state: Draft<BlackjackState>,
      action: PayloadAction<{ to: 'dealer' | 'player'; face: Face; index?: number | undefined }>
    ) => {
      const drawnCard = state.deck.pop();

      if (!drawnCard) {
        return;
      }

      drawnCard.face = action.payload.face;

      const index = action.payload.index ?? state.currentHandIndex;

      switch (action.payload.to) {
        case 'player':
          state.playerHands[index].cards.push(drawnCard);
          break;
        case 'dealer':
          state.dealerHand.cards.push(drawnCard);
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
      const holeCardIndex = state.dealerHand.cards.findIndex((card) => card.face === 'down');

      if (holeCardIndex === -1) {
        return;
      }

      state.dealerHand.cards[holeCardIndex].face = 'up';
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
      state.dealerHand.cards = [];
      state.playerHands = [{ cards: [], doubledDown: false }];
    },
    changeStatus: (state: Draft<BlackjackState>, action: PayloadAction<BlackjackStatus>) => {
      state.status = action.payload;
    },
    incrementCurrentHandIndex: (state: Draft<BlackjackState>) => {
      state.currentHandIndex += 1;
    },
    markDoubleDown: (state: Draft<BlackjackState>) => {
      state.playerHands[state.currentHandIndex].doubledDown = true;
    },
    split: (state: Draft<BlackjackState>) => {
      const hand = state.playerHands[state.currentHandIndex];
      const [card1, card2] = [hand.cards[0], hand.cards[1]];
      state.playerHands[state.currentHandIndex] = {
        ...hand,
        cards: [card1],
      };
      state.playerHands[state.currentHandIndex + 1] = {
        ...hand,
        cards: [card2],
      };
    },
  },
});

const actions = slice.actions;

export const { reducer: blackjackReducer } = slice;
export const { start, bet } = actions;

export const hit = (): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch, getState) => {
  dispatch(actions.deal({ to: 'player', face: 'up' }));
};

export const stand = (): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch, getState) => {
  const currentState = getState();
  const playerHands = currentState.blackjack.playerHands;
  const currentHandIndex = currentState.blackjack.currentHandIndex;

  if (currentHandIndex < playerHands.length - 1) {
    dispatch(actions.incrementCurrentHandIndex());
  } else {
    dispatch(actions.changeStatus('drawing'));
  }
};

export const doubleDown = (): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch, getState) => {
  const currentState = getState();
  const currentHandIndex = currentState.blackjack.currentHandIndex;
  const playerHands = currentState.blackjack.playerHands;
  const currentHand = playerHands[currentHandIndex];

  if (currentHand.cards.length !== 2) {
    return;
  }

  dispatch(actions.deal({ to: 'player', face: 'up' }));
  dispatch(actions.markDoubleDown());

  if (currentHandIndex < playerHands.length - 1) {
    dispatch(actions.incrementCurrentHandIndex());
  } else {
    dispatch(actions.changeStatus('drawing'));
  }
};

export const split = (): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch, getState) => {
  const currentState = getState();
  const currentHand = currentState.blackjack.playerHands[currentState.blackjack.currentHandIndex];

  if (!isSplitable(currentHand.cards)) {
    return;
  }

  dispatch(actions.split());
  await delay(250);

  dispatch(actions.deal({ to: 'player', face: 'up' }));
  await delay(250);

  dispatch(actions.deal({ to: 'player', face: 'up', index: currentState.blackjack.currentHandIndex + 1 }));
  await delay(250);
};

export const insure = (): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch, getState) => {
  dispatch(actions.insure());
  await delay(1000);

  const dealerCardValue = selectDealerCardValue(getState());

  if (dealerCardValue !== 21) {
    return;
  }

  dispatch(actions.revealHoleCard());
  await delay(1000);

  dispatch(actions.win());

  dispatch(actions.discard());
};

export const selectStatus = (state: RootState): BlackjackStatus => state.blackjack.status;

export const selectDealerHand = (state: RootState): DealerHand => state.blackjack.dealerHand;

export const selectPlayerHands = (state: RootState): PlayerHand[] => state.blackjack.playerHands;

export const selectDealerUpcard = (state: RootState): PlayingCard | null => {
  const cards = state.blackjack.dealerHand.cards;

  if (cards.length !== 2) {
    return null;
  }

  return cards.find((card) => card.face === 'up')!;
};

export const selectDealerHoleCard = (state: RootState): PlayingCard | null => {
  const cards = state.blackjack.dealerHand.cards;

  if (cards.length !== 2) {
    return null;
  }

  return cards.find((card) => card.face === 'down')!;
};

export const selectBalance = (state: RootState): number => state.blackjack.balance;

export const selectBet = (state: RootState): number => state.blackjack.betAmount;

export const selectInsured = (state: RootState): boolean => state.blackjack.insured;

export const selectDealerCardValue = (state: RootState) => {
  const sum = state.blackjack.dealerHand.cards.reduce((sum, card) => {
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
};

export const selectPlayerCardValue = (state: RootState, handIndex: number): number => {
  const sum = state.blackjack.playerHands[handIndex].cards.reduce((sum, card) => {
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
};

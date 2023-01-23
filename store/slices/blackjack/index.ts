import { createAction, createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { startAppListening } from '../../../app/listener-middleware';
import { BlackjackStatus } from '../../../types/blackjack-status';
import { Face } from '../../../types/face';
import { PlayingCard } from '../../../types/playing-card';
import { ranks } from '../../../types/rank';
import { suits } from '../../../types/suit';

interface DealerHand {
  cards: PlayingCard[];
}

interface PlayerHand {
  cards: PlayingCard[];
  bet: number;
  doubledDown: boolean;
}

interface BlackjackState {
  status: BlackjackStatus;
  deck: PlayingCard[];
  dealerHand: DealerHand;
  playerHands: PlayerHand[];
  handIndex: number;
  balance: number;
  insurance?: boolean | undefined;
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
      bet: 0,
      doubledDown: false,
    },
  ],
  handIndex: 0,
  balance: 1000,
  insurance: undefined,
};

const slice = createSlice({
  name: 'blackjack',
  initialState: initialState,
  reducers: {
    shuffle: (state: Draft<BlackjackState>) => {
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
    },
    bet: (state: Draft<BlackjackState>, action: PayloadAction<number>) => {
      const amount = action.payload;

      if (amount <= 0 || state.balance < amount) {
        return;
      }

      state.balance -= amount;
      state.playerHands[state.handIndex].bet += amount;
    },
    hit: (state: Draft<BlackjackState>) => {
      const drawnCard = state.deck.pop()!;
      drawnCard.face = 'up';

      state.playerHands[state.handIndex].cards.push(drawnCard);

      if (selectPlayerCardValue(state) > 21) {
        state.playerHands[state.handIndex].bet = 0;

        if (state.handIndex < state.playerHands.length - 1) {
          state.handIndex += 1;
        } else {
          state.status = 'drawing';
        }
      }
    },
    stand: (state: Draft<BlackjackState>) => {
      if (state.handIndex < state.playerHands.length - 1) {
        state.handIndex += 1;
      } else {
        state.status = 'drawing';
      }
    },
    doubleDown: (state: Draft<BlackjackState>) => {
      if (state.balance < state.playerHands[state.handIndex].bet) {
        return;
      }

      const drawnCard = state.deck.pop()!;
      drawnCard.face = 'up';

      state.balance -= state.playerHands[state.handIndex].bet;
      state.playerHands[state.handIndex].bet *= 2;
      state.playerHands[state.handIndex].cards.push(drawnCard);

      if (selectPlayerCardValue(state) > 21) {
        state.playerHands[state.handIndex].bet = 0;
      }

      if (state.handIndex < state.playerHands.length - 1) {
        state.handIndex += 1;
      } else {
        state.status = 'drawing';
      }
    },
    split: (state: Draft<BlackjackState>) => {
      const hand = state.playerHands[state.handIndex];
      const [card1, card2] = hand.cards;

      state.balance -= hand.bet;

      state.playerHands[state.handIndex].cards = [card1];
      state.playerHands[state.handIndex].bet = hand.bet;

      state.playerHands[state.handIndex + 1].cards = [card2];
      state.playerHands[state.handIndex + 1].bet = hand.bet;

      const [drawnCard1, drawnCard2] = [state.deck.pop()!, state.deck.pop()!];

      state.playerHands[state.handIndex].cards.push(drawnCard1);
      state.playerHands[state.handIndex + 1].cards.push(drawnCard2);
    },
    insure: (state: Draft<BlackjackState>, action: PayloadAction<'yes' | 'no'>) => {
      switch (action.payload) {
        case 'yes':
          const bet = state.playerHands[state.handIndex].bet;

          if (state.balance < bet / 2) {
            return;
          }

          state.balance -= bet / 2;
          state.insurance = true;
        case 'no':
          state.insurance = false;
          break;
      }
    },
    deal: (
      state: Draft<BlackjackState>,
      action: PayloadAction<{
        to: 'dealer' | 'player';
        face: Face;
        doubleDown?: boolean | undefined;
        index?: number | undefined;
      }>
    ) => {
      const drawnCard = state.deck.pop()!;
      drawnCard.face = action.payload.face;

      switch (action.payload.to) {
        case 'player':
          const handIndex = action.payload.index ?? state.handIndex;
          state.playerHands[handIndex].cards.push(drawnCard);

          if (action.payload.doubleDown) {
            state.balance -= state.playerHands[handIndex].bet;
            state.playerHands[handIndex].bet *= 2;
            state.playerHands[handIndex].doubledDown = true;
          }
          break;
        case 'dealer':
          state.dealerHand.cards.push(drawnCard);
          break;
      }
    },
    pay: (state: Draft<BlackjackState>) => {
      const initialize = () => {
        for (let i = 0; i < state.playerHands.length; i++) {
          state.playerHands[i].bet = 0;
          state.playerHands[i].doubledDown = false;
        }
        state.insurance = false;
      };

      if (selectIsDealerBlackjack(state)) {
        if (selectIsPlayerBlackjack(state)) {
          state.balance += state.playerHands[state.handIndex].bet;
        }

        if (state.insurance) {
          const insuranceBet = state.playerHands[state.handIndex].bet / 2;
          state.balance += insuranceBet * 2;
        }

        initialize();
        return;
      }

      if (selectIsPlayerBlackjack(state)) {
        state.balance += state.playerHands[state.handIndex].bet + state.playerHands[state.handIndex].bet * 1.5;

        initialize();
        return;
      }

      const dealerCardValue = selectDealerCardValue(state);

      for (let i = 0; i < state.playerHands.length; i++) {
        const playerCardValue = selectPlayerCardValue(state, i);

        if (dealerCardValue > playerCardValue) {
          // Player won't get paid
        }

        if (dealerCardValue < playerCardValue) {
          state.balance += state.playerHands[i].bet * 2;
        }

        if (dealerCardValue === playerCardValue) {
          state.balance += state.playerHands[i].bet;
        }
      }

      initialize();
    },
    reveal: (state: Draft<BlackjackState>) => {
      for (let i = 0; i < state.dealerHand.cards.length; i++) {
        if (state.dealerHand.cards[i].face === 'down') {
          state.dealerHand.cards[i].face = 'up';
        }
      }
    },
    changeStatus: (state: Draft<BlackjackState>, action: PayloadAction<BlackjackStatus>) => {
      state.status = action.payload;
    },
    reset: (state: Draft<BlackjackState>) => {
      state.status = 'betting';
      state.dealerHand.cards = [];
      state.playerHands = [
        {
          cards: [],
          bet: 0,
          doubledDown: false,
        },
      ];
      state.handIndex = 0;
      state.insurance = undefined;
    },
  },
});

const actions = slice.actions;

export const { reducer: blackjackReducer } = slice;

export const { shuffle, bet, deal, hit, stand, doubleDown, split, insure, pay, reveal, changeStatus, reset } = actions;

export const start = createAction('start');

startAppListening({
  actionCreator: start,
  effect: async (action, { dispatch, getState, take, condition, delay }) => {
    dispatch(shuffle());

    dispatch(changeStatus('dealing'));
    dispatch(deal({ to: 'player', face: 'up' }));
    await delay(200);
    dispatch(deal({ to: 'dealer', face: 'up' }));
    await delay(200);
    dispatch(deal({ to: 'player', face: 'up' }));
    await delay(200);
    dispatch(deal({ to: 'dealer', face: 'down' }));

    if (selectDealerUpcard(getState().blackjack)!.rank === 'ace') {
      dispatch(changeStatus('insurance'));

      await condition((action, currentState) => currentState.blackjack.insurance !== undefined);

      dispatch(pay());
      dispatch(reset());

      return;
    }

    if (selectPlayerCardValue(getState().blackjack) === 21) {
      dispatch(pay());
      dispatch(reset());
      return;
    }

    dispatch(changeStatus('acting'));

    await condition((action, currentState) => currentState.blackjack.status === 'drawing');

    dispatch(reveal());

    const allBust = getState().blackjack.playerHands.every(
      (hand, i) => selectPlayerCardValue(getState().blackjack, i) > 21
    );

    if (!allBust) {
      await delay(200);
      while (selectDealerCardValue(getState().blackjack) < 17) {
        dispatch(deal({ to: 'dealer', face: 'up' }));
        await delay(1000);
      }
    }

    await delay(3000);

    dispatch(pay());
    dispatch(reset());
  },
});

export const selectDealerUpcard = (state: BlackjackState): PlayingCard | null => {
  const upcard = state.dealerHand.cards.find((card) => card.face === 'up');

  return upcard ?? null;
};

export const selectDealerCardValue = (state: BlackjackState): number => {
  return state.dealerHand.cards.reduce((sum, card) => {
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
        break;
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
};

export const selectPlayerCardValue = (state: BlackjackState, handIndex?: number | undefined): number => {
  return state.playerHands[handIndex ?? state.handIndex].cards.reduce((sum, card) => {
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
        break;
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
};

export const selectIsDealerBlackjack = (state: BlackjackState): boolean => {
  return (
    state.dealerHand.cards.length === 2 &&
    selectDealerUpcard(state)?.rank === 'ace' &&
    selectDealerCardValue(state) === 21
  );
};

export const selectIsPlayerBlackjack = (state: BlackjackState): boolean => {
  return state.playerHands[0].cards.length === 2 && selectPlayerCardValue(state) === 21;
};

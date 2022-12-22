import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { DealerHand } from '../../utils/dealer-hand';
import { PlayerHand } from '../../utils/player-hand';
import { Shoe } from '../../utils/shoe';

interface BlackjackState {
  shoe: Shoe;
  dealerHand: DealerHand;
  playerHands: PlayerHand[];
  balance: number;
  betAmount: number;
}

const initialState: BlackjackState = {
  shoe: new Shoe(2),
  dealerHand: new DealerHand(),
  playerHands: [new PlayerHand()],
  balance: 1000,
  betAmount: 0,
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
      state.shoe = new Shoe(2);
      state.dealerHand = new DealerHand();
      state.playerHands = [new PlayerHand()];

      const shoe = state.shoe;

      state.dealerHand.deal(shoe.draw(), shoe.draw('down'));
      state.playerHands[0].deal(shoe.draw(), shoe.draw());
    },
  },
});

export const { reducer: blackjackReducer } = slice;
export const { bet, start } = slice.actions;

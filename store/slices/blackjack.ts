import { createSlice, Draft } from '@reduxjs/toolkit';
import { DealerHand } from '../../utils/dealer-hand';
import { PlayerHand } from '../../utils/player-hand';
import { Shoe } from '../../utils/shoe';

interface BlackjackState {
  shoe: Shoe;
  dealerHand: DealerHand;
  playerHands: PlayerHand[];
}

const initialState: BlackjackState = {
  shoe: new Shoe(2),
  dealerHand: new DealerHand(),
  playerHands: [new PlayerHand()],
};

const slice = createSlice({
  name: 'blackjack',
  initialState: initialState,
  reducers: {
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
export const { start } = slice.actions;

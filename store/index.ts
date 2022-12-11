import { configureStore } from '@reduxjs/toolkit';
import { blackjackReducer } from './slices/blackjack';

const store = configureStore({
  reducer: {
    blackjack: blackjackReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export { store };
export type { RootState };
export type { AppDispatch };

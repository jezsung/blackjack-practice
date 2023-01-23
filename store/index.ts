import { configureStore } from '@reduxjs/toolkit';
import { listenerMiddleware } from '../app/listener-middleware';
import { blackjackReducer } from './slices/blackjack';

const store = configureStore({
  reducer: {
    blackjack: blackjackReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export { store };
export type { RootState };
export type { AppDispatch };

import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { vacuumSlice } from './vacuum/vacuumSlice';

const rootReducer = combineReducers({
  vacuum: vacuumSlice.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(),
  // prepend and concat calls can be chained
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;

export default store;
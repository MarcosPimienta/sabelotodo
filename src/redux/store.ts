import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer'; // This file will be created on the next step

const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;

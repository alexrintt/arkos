import { configureStore, applyMiddleware } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";

import rootSaga from "./saga";
import {
  TransactionState,
  preloadedState as transactionPreloadedState,
  TransactionAction,
} from "./reducers/transaction";
import {
  TransactionModalState,
  preloadedState as transactionModalPreloadedState,
} from "./reducers/transaction-modal";
import {
  UIState,
  preloadedState as uiPreloadedState,
  uiReducer,
} from "./reducers/ui";

import type { ReducersMapObject } from "@reduxjs/toolkit";

import { transactionReducer } from "./reducers/transaction";
import { transactionModalReducer } from "./reducers/transaction-modal";

const sagaMiddleware = createSagaMiddleware<ApplicationState>();

export type ApplicationState = {
  transaction: TransactionState;
  transactionModal: TransactionModalState;
  ui: UIState;
};

export const rootReducer: ReducersMapObject = {
  transaction: transactionReducer,
  transactionModal: transactionModalReducer,
  ui: uiReducer,
};

export const preloadedState: ApplicationState = {
  transaction: transactionPreloadedState,
  transactionModal: transactionModalPreloadedState,
  ui: uiPreloadedState,
};

export type ApplicationAction = TransactionAction;

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(),
    sagaMiddleware,
  ],
  devTools: true,
  preloadedState: preloadedState,
});

sagaMiddleware.run(rootSaga);

import { all } from "redux-saga/effects";

import transactionSaga from "./sagas/transaction";
import transactionModalSaga from "./sagas/transaction-modal";

export default function* rootSaga() {
  yield all([transactionSaga(), transactionModalSaga()]);
}

import {
  all,
  call,
  put,
  select,
  takeEvery,
  takeLatest,
} from "redux-saga/effects";
import {
  TransactionAction,
  TransactionActionType,
} from "../reducers/transaction";

import { ApplicationState } from "..";
import { Paginated } from "../../services/model/common";
import { transactionRepository } from "../../services";
import { Transaction } from "../../services/model/transaction";

export function* loadMoreTransactionsSaga() {
  yield takeLatest(TransactionActionType.loadMore, function* () {
    const cursor: string | undefined = yield select(
      (state: ApplicationState) => state.transaction.cursor
    );

    const response: Paginated<Transaction> = yield call(
      transactionRepository.getTransactions.bind(transactionRepository),
      cursor
    );

    yield put<TransactionAction<Paginated<Transaction>>>({
      type: TransactionActionType.loadedMore,
      payload: response,
    });
  });
}

export function* createTransactionSaga() {
  yield takeLatest(
    TransactionActionType.create,
    function* (action: TransactionAction) {
      const response: Transaction = yield call(
        transactionRepository.createTransaction.bind(transactionRepository),
        action.payload as Partial<Transaction>
      );

      yield put<TransactionAction<Transaction>>({
        type: TransactionActionType.created,
        payload: response,
      });
    }
  );
}

export function* deleteTransactionSaga() {
  yield takeEvery(
    TransactionActionType.delete,
    function* (action: TransactionAction) {
      yield call(
        transactionRepository.deleteTransaction.bind(transactionRepository),
        action.payload as Partial<Transaction>
      );
    }
  );
}

export function* editTransactionSaga() {
  yield takeEvery(
    TransactionActionType.edit,
    function* (action: TransactionAction) {
      yield call(
        transactionRepository.editTransaction.bind(transactionRepository),
        action.payload as Partial<Transaction>
      );
    }
  );
}

export default function* rootTransactionSaga() {
  yield all([
    loadMoreTransactionsSaga(),
    createTransactionSaga(),
    deleteTransactionSaga(),
    editTransactionSaga(),
  ]);
}

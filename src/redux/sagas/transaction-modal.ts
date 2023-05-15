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
import { Transaction, TransactionType } from "../../services/model/transaction";
import {
  TransactionModalAction,
  TransactionModalActionType,
  TransactionModalState,
  selectIsTransactionModalEmpty,
  selectTransactionModal,
  selectTransactionModalHasChangesLeft,
} from "../reducers/transaction-modal";
import { isDefined, isUndefined } from "../../utils";
import { PartialReducerFn } from "../../components/transaction-modal";

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

export function* saveTransactionModal() {
  yield takeLatest(
    TransactionModalActionType.updateCurrent,
    function* (action: TransactionModalAction) {
      const transactionModal: TransactionModalState = yield select(
        selectTransactionModal()
      );
      const isTransactionModalEmpty: boolean = yield select(
        selectIsTransactionModalEmpty()
      );
      const transactionModalHasChangesLeft: boolean = yield select(
        selectTransactionModalHasChangesLeft()
      );

      const isEditing = isDefined(transactionModal.current.id);

      console.log({
        "state.transactionModal": transactionModal.current,
      });

      if (isEditing) {
        if (transactionModalHasChangesLeft) {
          yield put<TransactionAction<Partial<Transaction>>>({
            type: TransactionActionType.edit,
            payload: transactionModal.current,
          });
        }
      } else {
        if (!isTransactionModalEmpty) {
          yield put<TransactionModalAction<void>>({
            type: TransactionModalActionType.startWatchingForNewEntry,
          });
          yield put<TransactionAction<Partial<Transaction>>>({
            type: TransactionActionType.create,
            payload: transactionModal.current,
          });
        }
      }
    }
  );
}

export function* saveAndClearOnCloseModal() {
  yield takeEvery(
    TransactionModalActionType.close,
    function* (action: TransactionAction) {
      const transactionModal: TransactionModalState = yield select(
        selectTransactionModal()
      );

      // yield put<TransactionModalAction<Partial<Transaction>>>({
      //   type: TransactionModalActionType.updateCurrent,
      //   payload: transactionModal.current,
      // });

      // yield put<TransactionModalAction<void>>({
      //   type: TransactionModalActionType.clearTemplate,
      // });
    }
  );
}

export function* handleToggleTransactionType() {
  yield takeEvery(
    TransactionModalActionType.toggleTransactionType,
    function* (action: TransactionAction) {
      const transactionModal: TransactionModalState = yield select(
        selectTransactionModal()
      );

      if (isUndefined(transactionModal.current.type)) return;

      const type: TransactionType = {
        [TransactionType.income]: TransactionType.outcome,
        [TransactionType.outcome]: TransactionType.swap,
        [TransactionType.swap]: TransactionType.income,
      }[transactionModal.current.type!];

      yield put<TransactionModalAction<Partial<Transaction>>>({
        type: TransactionModalActionType.updateCurrent,
        payload: {
          type,
        },
      });

      // yield put<TransactionModalAction<void>>({
      //   type: TransactionModalActionType.clearTemplate,
      // });
    }
  );
}

export default function* transactionModalSaga() {
  yield all([
    saveTransactionModal(),
    saveAndClearOnCloseModal(),
    handleToggleTransactionType(),
  ]);
}

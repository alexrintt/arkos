import type { Action } from "@reduxjs/toolkit";
import { Transaction, TransactionType } from "../../services/model/transaction";
import { ApplicationState } from "..";
import { isUndefined, when } from "../../utils";
import {
  StateSelector,
  TransactionAction,
  TransactionActionType,
} from "./transaction";
import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import { PartialReducerFn } from "../../components/transaction-modal";

export enum TransactionModalActionType {
  newTransaction = "TransactionModalActionType.newTransaction",

  openExistingTransaction = "TransactionModalActionType.openExistingTransaction",

  // Updates the current transaction with the provided values by merging with the previous state.
  // Use it when updating single values of the current transaction.
  updateCurrent = "TransactionModalActionType.updateCurrent",
  open = "TransactionModalActionType.open",
  close = "TransactionModalActionType.close",
  toggleTransactionType = "TransactionModalActionType.toggleType",
  clearTemplate = "TransactionModalActionType.clearTemplate",
  // When an auto-save is dispatched and the newly created entry
  // from [transaction] reducer is the same as the current modal
  // So we use this event to attach the new entry as being the
  // same as the current modal entry.
  startWatchingForNewEntry = "TransactionModalActionType.startWatchingForNewEntry",
}

export interface TransactionModalAction<P = any>
  extends Action<TransactionModalActionType> {
  // Added for simplicity, but this is inherited from [Action]
  type: TransactionModalActionType;
  payload?: P;
  id?: string;
}

export enum TransactionModalMode {
  createNewEntry = "createNewEntry",
  editEntry = "editEntry",
}

export type TransactionModalState = {
  isOpen: boolean;
  mode: TransactionModalMode;
  current: Partial<Transaction>;
  lastSavedTransaction?: Transaction;
  watchForNewEntry: boolean;
};

export const preloadedState: TransactionModalState = {
  isOpen: false,
  mode: TransactionModalMode.createNewEntry,
  watchForNewEntry: false,
  current: {
    amount: 0,
    notes: "",
    title: "",
    createdAt: undefined,
    drawable: undefined,
    type: TransactionType.income,
  },
};

export function selectTransactionModal(): StateSelector<TransactionModalState> {
  return (state: ApplicationState) => {
    return state.transactionModal;
  };
}

export function selectTransactionModalIsOpen(): StateSelector<boolean> {
  return (state: ApplicationState) => {
    return selectTransactionModal()(state).isOpen;
  };
}

export function useTransactionModal(): TransactionModalState {
  return useSelector<ApplicationState, TransactionModalState>(
    (state) => state.transactionModal
  );
}

export function useCloseTransactionModal() {
  const dispatch = useDispatch();

  const closeTransactionModal = useCallback(() => {
    dispatch<TransactionModalAction<void>>({
      type: TransactionModalActionType.close,
    });
  }, []);

  return closeTransactionModal;
}

export function useOpenTransactionModal() {
  const dispatch = useDispatch();

  const closeTransactionModal = useCallback(() => {
    dispatch<TransactionModalAction<void>>({
      type: TransactionModalActionType.open,
    });
  }, []);

  return closeTransactionModal;
}

export function selectTransactionModalHasChangesLeft(): StateSelector<boolean> {
  return (state: ApplicationState) => {
    const { current, lastSavedTransaction } = selectTransactionModal()(state);

    return JSON.stringify(current) !== JSON.stringify(lastSavedTransaction);
  };
}

export function useIsTransactionModalEmpty(): boolean {
  const isTransactionModalEmpty = useSelector(selectIsTransactionModalEmpty());
  return isTransactionModalEmpty;
}

export function useTransactionModalHasChangesLeft(): boolean {
  const transactionModalHasChangesLeft = useSelector(
    selectTransactionModalHasChangesLeft()
  );
  return transactionModalHasChangesLeft;
}

export function selectIsTransactionModalEmpty(): StateSelector<boolean> {
  return (state: ApplicationState) => {
    const transaction: Record<string, any> = {
      ...state.transactionModal.current,
    };

    const defaultTemplate: Record<string, any> = { ...preloadedState.current };
    const keysToIgnore = ["createdAt", "type"];

    if (
      Object.keys(defaultTemplate).length !== Object.keys(transaction).length
    ) {
      return false;
    }

    for (const k of Object.keys(defaultTemplate)) {
      if (keysToIgnore.includes(k)) continue;

      if ((defaultTemplate[k] as any) !== (transaction[k] as any)) {
        return false;
      }
    }

    return true;
  };
}

function open(): TransactionModalAction<void> {
  return {
    type: TransactionModalActionType.open,
  };
}

function close(): TransactionModalAction<void> {
  return {
    type: TransactionModalActionType.close,
  };
}

function clearTemplate(): TransactionModalAction<void> {
  return {
    type: TransactionModalActionType.clearTemplate,
  };
}

export const transactionModalAction = {
  open,
  close,
  clearTemplate,
};

export function transactionModalReducer(
  state: TransactionModalState,
  action: TransactionModalAction
): TransactionModalState {
  return when<TransactionModalActionType, TransactionModalState>(
    action.type,
    {
      [TransactionModalActionType.newTransaction]: () => {
        const transaction = action.payload as Partial<Transaction>;

        return {
          ...state,
          current: {
            ...preloadedState.current,
            ...transaction,
          },
        };
      },
      [TransactionModalActionType.openExistingTransaction]: () => {
        const transaction = action.payload as Partial<Transaction>;

        return {
          ...state,
          current: transaction,
        };
      },
      [TransactionModalActionType.updateCurrent]: () => {
        const transaction = action.payload as Partial<Transaction>;

        return {
          ...state,
          current: {
            ...state.current,
            ...transaction,
          },
        };
      },
      [TransactionModalActionType.close]: () => {
        return {
          ...state,
          isOpen: false,
        };
      },
      [TransactionModalActionType.open]: () => {
        return {
          ...state,
          isOpen: true,
        };
      },
      [TransactionModalActionType.clearTemplate]: () => {
        return {
          ...state,
          current: preloadedState.current,
        };
      },
      [TransactionModalActionType.startWatchingForNewEntry]: () => {
        return {
          ...state,
          watchForNewEntry: true,
        };
      },
      [TransactionActionType.created]: () => {
        if (state.watchForNewEntry) {
          const transaction = action.payload as Transaction;
          return {
            ...state,
            watchForNewEntry: false,
            lastSavedTransaction: transaction,
            current: transaction,
            mode: TransactionModalMode.editEntry,
          };
        }

        return state;
      },
      [TransactionActionType.edit]: () => {
        const transaction = action.payload as Transaction;

        if (state.current.id !== transaction.id) {
          /// Some other transaction was edited, not the current one displayed in the modal, so ignore...
          return state;
        }

        return {
          ...state,
          lastSavedTransaction: transaction,
          current: transaction,
          mode: TransactionModalMode.editEntry,
        };
      },
    },
    () => state ?? preloadedState
  );
}

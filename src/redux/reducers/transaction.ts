import type { Action } from "@reduxjs/toolkit";
import {
  Transaction,
  TransactionTemplate,
} from "../../services/model/transaction";
import { Paginated } from "../../services/model/common";
import dayjs from "dayjs";
import { ApplicationState } from "..";
import { isUndefined, when } from "../../utils";
import {
  TransactionModalActionType,
  selectTransactionModalHasChangesLeft,
} from "./transaction-modal";

export enum TransactionActionType {
  loadMore = "loadMore",
  loadedMore = "loadedMore",
  create = "create",
  created = "created",
  delete = "delete",
  edit = "edit",
}

export interface TransactionAction<P = any>
  extends Action<TransactionActionType> {
  // Added for simplicity, but this is inherited from [Action]
  type: TransactionActionType;

  payload?: P;
  id?: string;
}

export type TransactionState = {
  nodes: Transaction[];
  groupedByDate: Record<string, Transaction[]>;
  selected?: Transaction;
  loading: boolean;
  cursor?: string;
  defaultTemplate?: TransactionTemplate;
};

export const preloadedState: TransactionState = {
  nodes: [],
  groupedByDate: {},
  selected: undefined,
  loading: false,
  cursor: undefined,
  defaultTemplate: undefined,
};

export function groupTransactionNodes(
  nodes: Transaction[],
  current: Record<string, Transaction[]>
): Record<string, Transaction[]> {
  const groupedByDate: Record<string, Transaction[]> = { ...current };

  for (const node of nodes) {
    const createdAt = dayjs(node.createdAt);
    const key = getGroupKeyByDate(createdAt);
    groupedByDate[key] = [...(groupedByDate[key] ?? []), node];
  }

  return groupedByDate;
}

export function getGroupKeyByDate(date: dayjs.Dayjs): string {
  return date.format("DD-MM-YYYY");
}

export type StateSelector<T> = (state: ApplicationState) => T;

export function selectTransactionsByPeriod(
  isWithinPeriod: (e: dayjs.Dayjs) => boolean
): StateSelector<Transaction[]> {
  return (state: ApplicationState) => {
    const transactionsWithinPeriod = state.transaction.nodes.filter(
      (e) => e.createdAt && isWithinPeriod(dayjs(e.createdAt))
    );

    return transactionsWithinPeriod;
  };
}

export function selectTransactionsByDate(
  date: dayjs.Dayjs
): StateSelector<Transaction[]> {
  return (state: ApplicationState) => {
    // This is an alternative impl. but this is O(n) since it needs to go through every transaction node.
    // const transactionsWithinDate = selectTransactionsByPeriod((e) =>
    //   e.isSame(date, "date")
    // )(state);

    // This impl. makes use of [groupedByDate] field.
    // This is a pre-computed array sorted by date, which takes constant-time O(1)
    // since it uses a JavaScript plain object key as index.
    const transactionsWithinDate =
      state.transaction.groupedByDate[getGroupKeyByDate(date)] ?? [];

    return transactionsWithinDate;
  };
}

export function selectBalanceByDate(date: dayjs.Dayjs): StateSelector<number> {
  return (state: ApplicationState) => {
    const transactionsWithinDate = selectTransactionsByDate(date)(state);

    const balanceOfDate = transactionsWithinDate
      .map((e) => e.amount ?? 0)
      .reduce((x, y) => x + y, 0);

    return balanceOfDate;
  };
}

export function selectTodaysBalance(): StateSelector<number> {
  return (state: ApplicationState) => {
    return selectBalanceByDate(dayjs())(state);
  };
}

export function transactionReducer(
  state: TransactionState,
  action: TransactionAction
): TransactionState {
  return when<TransactionActionType, TransactionState>(
    action.type,
    {
      [TransactionActionType.loadMore]: () => {
        return {
          ...state,
          loading: true,
        };
      },
      [TransactionActionType.delete]: () => {
        const nodes = state.nodes.filter(
          (transaction) => transaction.id !== action.payload.id
        );

        const groupedByDate = groupTransactionNodes(nodes, {});

        return {
          ...state,
          nodes: nodes,
          groupedByDate: groupedByDate,
        };
      },
      [TransactionActionType.loadedMore]: () => {
        const payload = action.payload as Paginated<Transaction>;

        const groupedByDate = groupTransactionNodes(
          payload.nodes,
          state.groupedByDate
        );

        return {
          ...state,
          loading: false,
          nodes: [...state.nodes, ...payload.nodes],
          groupedByDate: groupedByDate,
          cursor: payload.cursor,
        };
      },
      [TransactionActionType.create]: () => {
        return {
          ...state,
          loading: true,
        };
      },
      [TransactionActionType.created]: () => {
        const createdNode = action.payload as Transaction;

        const groupedByDate = groupTransactionNodes(
          [createdNode],
          state.groupedByDate
        );

        return {
          ...state,
          loading: false,
          nodes: [createdNode, ...state.nodes],
          groupedByDate,
        };
      },
      [TransactionActionType.edit]: () => {
        const editedNode = action.payload as Transaction;

        const id = editedNode.id;

        if (isUndefined(id)) return state;

        const updatedNodes = state.nodes.map((e) =>
          e.id === id ? editedNode : e
        );

        const groupedByDate = groupTransactionNodes(updatedNodes, {});

        return {
          ...state,
          nodes: updatedNodes,
          groupedByDate,
        };
      },
    },
    () => {
      return state ?? preloadedState;
    }
  );
}

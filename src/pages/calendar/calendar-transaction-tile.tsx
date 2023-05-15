import { useDispatch } from "react-redux";
import { ICalendarSlotContext } from "../../components/calendar-view";
import { Transaction, TransactionType } from "../../services/model/transaction";
import { DragItemTarget, DropItemTarget } from "./calendar-slot";
import React, { useCallback } from "react";
import {
  TransactionAction,
  TransactionActionType,
} from "../../redux/reducers/transaction";
import { useKeyPress } from "../../hooks";
import { formatCurrency } from "../../utils";
import {
  ContextMenu,
  ContextMenuItem,
  ContextMenuTrigger,
} from "rctx-contextmenu";
import { Draggable } from "../../components/drag-and-drop/draggable";
import classNames from "classnames";
import { TrashIcon } from "@primer/octicons-react";
import { ListTile } from "../../components/list-tile";
import {
  getColorFromTransactionType,
  getCssVariableValue,
} from "../../components/transaction-modal";

export type ICalendarTransationTile = {
  transaction: Transaction;
  context: ICalendarSlotContext;
  dropContainer: DropItemTarget<number>;
  onClick?: (transaction: Transaction) => void;
};

export function CalendarTransationTile({
  transaction,
  context: { date },
  dropContainer,
  onClick,
}: ICalendarTransationTile) {
  const dispath = useDispatch();

  const deleteTransaction = useCallback(
    (transaction: Transaction) => {
      dispath<TransactionAction<Transaction>>({
        type: TransactionActionType.delete,
        payload: transaction,
      });
    },
    [transaction.id]
  );

  const openModalToEditThisTransaction = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onClick && onClick(transaction);
    },
    [transaction]
  );

  const deleteMode = useKeyPress("Shift");

  const transactionId =
    transaction.id ?? date.valueOf().toString() + JSON.stringify(transaction);

  const contextMenuId = `${transactionId}__menu__item`;

  const displayTitle =
    transaction.title +
    " " +
    (transaction.amount ? formatCurrency(transaction.amount) : "");

  const hasDisplayTitle = displayTitle.trim().length > 0;

  const dragItem = {
    container: dropContainer,
    item: transaction,
    id: `${transactionId}__transaction__item__draggable`,
  };

  return (
    <React.Fragment>
      <ContextMenuTrigger id={contextMenuId}>
        <Draggable<DragItemTarget<Transaction, number>>
          data={dragItem}
          id={dragItem.id}
        >
          {(transform) => {
            return (
              <div
                style={{
                  transform: transform
                    ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
                    : undefined,
                  background: deleteMode
                    ? getCssVariableValue("--danger")
                    : getColorFromTransactionType(
                        transaction.type,
                        transaction.drawable?.hexColor
                      ),
                  paddingLeft: "0.2rem",
                  borderLeft: `6px solid ${getColorFromTransactionType(
                    transaction.type
                  )}`,
                }}
                onClick={(e) => {
                  e.stopPropagation();

                  if (deleteMode) {
                    deleteTransaction(transaction);
                  } else {
                    onClick && onClick(transaction);
                  }
                }}
                className={classNames(
                  "relative mb-0.5 flex justify-start items-center text-s1 rounded text-start w-full text-xs p-0"
                )}
              >
                <span className="p-0.5">
                  {hasDisplayTitle ? displayTitle : "No named entry"}
                </span>
                {deleteMode && (
                  <span className="absolute right-0 top-0 bottom-0 z-[10] flex items-center">
                    <TrashIcon size={14} fill="var(--s1)" />
                  </span>
                )}
              </div>
            );
          }}
        </Draggable>
      </ContextMenuTrigger>
      <ContextMenu id={contextMenuId} appendTo="#context-menu-root">
        <div className={classNames("bg-s2 rounded shadow-lg p-1")}>
          <ContextMenuItem>
            <ListTile
              leading={<TrashIcon fill="var(--danger)" size={14} />}
              text="Delete transaction"
              onClick={(e) => {
                e.stopPropagation();
                deleteTransaction(transaction);
              }}
            />
          </ContextMenuItem>
          <ContextMenuItem>
            <ListTile
              leading={<TrashIcon fill="var(--t1)" size={14} />}
              text="Edit transaction"
              onClick={openModalToEditThisTransaction}
            />
          </ContextMenuItem>
        </div>
      </ContextMenu>
    </React.Fragment>
  );
}

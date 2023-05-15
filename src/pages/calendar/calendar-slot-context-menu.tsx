import { useDispatch } from "react-redux";
import {
  CalendarDroppableTransactionSlot,
  DropItemTarget,
  ICalendarSlot,
} from "./calendar-slot";
import { Transaction, TransactionType } from "../../services/model/transaction";
import {
  TransactionModalAction,
  TransactionModalActionType,
  TransactionModalMode,
  transactionModalAction,
} from "../../redux/reducers/transaction-modal";
import classNames from "classnames";
import {
  ContextMenu,
  ContextMenuItem,
  ContextMenuTrigger,
} from "rctx-contextmenu";
import { uiAction } from "../../redux/reducers/ui";
import { ListTile } from "../../components/list-tile";
import {
  ArrowDownIcon,
  ArrowSwitchIcon,
  ArrowUpIcon,
  CloudIcon,
  CreditCardIcon,
  DownloadIcon,
  ProjectTemplateIcon,
  RocketIcon,
} from "@primer/octicons-react";
import { Divider } from "../../components/divider";
import { isDefined } from "../../utils";
import { PartialReducerFn } from "../../components/transaction-modal";

export type ICalendarSlotContainer = Omit<ICalendarSlot, "dropContainer">;

export function CalendarSlotContextMenu({ context }: ICalendarSlotContainer) {
  const contextMenuId = `context-menu-${context.date.valueOf()}`;
  const { isPast, isFuture, isToday, date } = context;

  const dispatch = useDispatch();

  // const isContextMenuOpen = useSelector(selectIsContextMenuOpen());

  function openTransactionModal(transaction?: Partial<Transaction>) {
    // if (isContextMenuOpen) {
    //   console.log({ isContextMenuOpen });
    // }

    if (isDefined(transaction)) {
      dispatch<TransactionModalAction<Partial<Transaction>>>({
        type: TransactionModalActionType.openExistingTransaction,
        payload: transaction,
      });
    } else {
      const initial: Partial<Transaction> = {
        createdAt: context.date.valueOf(),
      };

      dispatch<TransactionModalAction<Partial<Transaction>>>({
        type: TransactionModalActionType.newTransaction,
        payload: initial,
      });
    }

    dispatch<TransactionModalAction<void>>({
      type: TransactionModalActionType.open,
    });
  }

  const slotKey = date.valueOf();

  const dropContainer: DropItemTarget<number> = {
    id: `droppable__container__${slotKey.toString()}`,
    item: date.valueOf(),
  };

  return (
    <div
      onContextMenu={() => console.log("what")}
      id={dropContainer.id}
      className={classNames(
        {
          "bg-s1": isPast,
          "bg-s2": isFuture,
        },
        "w-full h-full relative"
      )}
      style={{
        userSelect: "none",
      }}
    >
      <ContextMenuTrigger id={contextMenuId}>
        <CalendarDroppableTransactionSlot
          dropContainer={dropContainer}
          context={context}
          onClick={openTransactionModal}
        />
      </ContextMenuTrigger>
      <ContextMenu
        id={contextMenuId}
        onHide={() => dispatch(uiAction.closeContextMenu())}
        onShow={() => dispatch(uiAction.openContextMenu())}
        appendTo="#context-menu-root"
      >
        <div className="bg-s0 rounded shadow-lg">
          <div className="p-1">
            <ContextMenuItem>
              <ListTile
                onClick={() =>
                  openTransactionModal({ type: TransactionType.income })
                }
                leading={<ArrowUpIcon fill="var(--success)" size={14} />}
                text="New income"
              />
            </ContextMenuItem>
            <ContextMenuItem>
              <ListTile
                onClick={() =>
                  openTransactionModal({ type: TransactionType.outcome })
                }
                leading={<ArrowDownIcon fill="var(--danger)" size={14} />}
                text="New outcome"
              />
            </ContextMenuItem>
            <ContextMenuItem>
              <ListTile
                onClick={() =>
                  openTransactionModal({ type: TransactionType.swap })
                }
                leading={<ArrowSwitchIcon fill="var(--w1)" size={14} />}
                text="New swap"
              />
            </ContextMenuItem>
          </div>
          <Divider color="var(--s1)" />
          <div className="p-1">
            <ContextMenuItem>
              <ListTile
                leading={<ProjectTemplateIcon fill="var(--t1)" size={14} />}
                text="Create from template"
              />
            </ContextMenuItem>
            <ContextMenuItem>
              <ListTile
                leading={<DownloadIcon fill="var(--t1)" size={14} />}
                text="Import from file"
              />
            </ContextMenuItem>
            <ContextMenuItem>
              <ListTile
                leading={<CloudIcon fill="var(--t1)" size={14} />}
                text="Import from cloud"
              />
            </ContextMenuItem>
          </div>
          <Divider color="var(--s1)" />
          <div className="p-1">
            <ContextMenuItem>
              <ListTile
                leading={<CreditCardIcon fill="var(--t1)" size={14} />}
                text="Create wallet"
              />
            </ContextMenuItem>
            <ContextMenuItem>
              <ListTile
                leading={<RocketIcon fill="var(--t1)" size={14} />}
                text="Create goal"
              />
            </ContextMenuItem>
          </div>
        </div>
      </ContextMenu>
    </div>
  );
}

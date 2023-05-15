import { useSelector } from "react-redux";
import {
  selectBalanceByDate,
  selectTransactionsByDate,
} from "../../redux/reducers/transaction";
import { Transaction } from "../../services/model/transaction";

import { ICalendarSlotContext } from "../../components/calendar-view";
import classNames from "classnames";
import { ApplicationState } from "../../redux";
import { _1min, _1s } from "../../hooks";
import { Droppable } from "../../components/drag-and-drop/droppable";
import { CalendarTransationTile } from "./calendar-transaction-tile";
import { isDefined, isUndefined } from "../../utils";

export type ICalendarDroppableTransactionSlot = {
  context: ICalendarSlotContext;
  onClick?: (transaction?: Transaction) => void;
  dropContainer: DropItemTarget<number>;
};

export type DragItemTarget<T, D> = {
  container: DropItemTarget<D>;
  item: T;
  id: string;
};

export type DropItemTarget<T> = {
  item: T;
  id: string;
};

export function CalendarDroppableTransactionSlot({
  context,
  dropContainer,
  onClick,
}: ICalendarDroppableTransactionSlot) {
  const { currentDayProgressPercent, isToday } = context;

  return (
    <Droppable<DropItemTarget<number>>
      key={dropContainer.id}
      id={dropContainer.id}
      data={dropContainer}
      getProps={(isOver: boolean) => {
        return {
          className: classNames(
            {
              "border-v1": isToday,
              "border-w3": isOver,
              "border-transparent": !isToday,
            },
            "border-2 w-full h-full p-0 relative"
          ),
          style: {
            backgroundImage: isToday
              ? `linear-gradient(to right, var(--s1) 0%, var(--s1) ${currentDayProgressPercent}%,var(--s2) 100%)`
              : undefined,
          },
          onClick: (e) => {
            onClick && onClick();
          },
        };
      }}
    >
      {(isOver: boolean) => {
        return (
          <CalendarSlotDraggableTransactions
            context={context}
            dropContainer={dropContainer}
            onClick={onClick}
          />
        );
      }}
    </Droppable>
  );
}

export function CalendarSlotDraggableTransactions({
  context,
  dropContainer,
  onClick,
}: ICalendarDroppableTransactionSlot) {
  const { date } = context;

  const transactions = useSelector<ApplicationState, Transaction[]>(
    selectTransactionsByDate(date)
  );

  return (
    <div className={classNames("w-full h-full overflow-hidden")}>
      <CalendarSlotDateLabel context={context} />
      {(() => {
        if (isUndefined(transactions)) return <></>;

        return (
          <div className="flex-flex-col pr-2">
            {transactions.map((transaction) => {
              return (
                <CalendarTransationTile
                  key={transaction.id}
                  context={context}
                  transaction={transaction}
                  dropContainer={dropContainer}
                  onClick={onClick}
                />
              );
            })}
          </div>
        );
      })()}
    </div>
  );
}

export type ICalendarSlot = {
  context: ICalendarSlotContext;
  onClick: () => void;
};

// No state, no items, only the date label, a plain slot
export function CalendarSlotPlain({
  context,
  onClick,
  children,
}: React.PropsWithChildren<ICalendarSlot>) {
  return (
    <div onClick={onClick} className={classNames("w-full h-full")}>
      <CalendarSlotDateLabel context={context} />
      {children}
    </div>
  );
}

export function CalendarSlotDateLabel({
  context: {
    isFirstWeek,
    formattedDay,
    isMainMonth,
    isFirstDayOfTheMonth,
    date,
  },
}: Pick<ICalendarDroppableTransactionSlot, "context">) {
  return (
    <div className={classNames("text-xs flex flex-col items-center")}>
      <span className="uppercase">{isFirstWeek ? formattedDay : ""}</span>
      <span
        className={classNames({
          "opacity-50": !isMainMonth,
        })}
      >
        {isFirstDayOfTheMonth ? date.format("MMM") : ""} {date.date()}
      </span>
    </div>
  );
}

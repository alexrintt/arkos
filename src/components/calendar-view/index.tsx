import dayjs from "dayjs";
import { getDayTimeProgress } from "../../hooks";

import { isDefined } from "../../utils";

export type ICalendarMonthView = {
  children: (slotContext: ICalendarSlotContext) => JSX.Element;
  month: dayjs.Dayjs;
  rows?: number;
};

export type ICalendarSlotContext = {
  date: dayjs.Dayjs;
  isFirstDayOfTheMonth: boolean;
  isFirstWeek: boolean;
  isLastWeek: boolean;
  formattedDay: string;
  formattedMonth: string;
  isMainMonth: boolean;
  isToday: boolean;
  isTomorrow: boolean;
  currentTime: dayjs.Dayjs;
  isPast: boolean;
  isFuture: boolean;
  currentDayProgress: number;
  currentDayProgressPercent: number;
};

export type ICalendarMonthViewContext = {
  columns: number;
  rows: number;
  start: dayjs.Dayjs;
  end: dayjs.Dayjs;
  length: number;
};

export function getCalendarMonthViewContext(
  month: dayjs.Dayjs,
  forcedRows?: number
): ICalendarMonthViewContext {
  const currentMonth = month ?? dayjs();

  const columns = 7; // Week

  const firstDayOfTheCurrentMonth = currentMonth.set("date", 1);
  const lastDayOfTheCurrentMonth = currentMonth.set(
    "date",
    currentMonth.daysInMonth()
  );

  const totalDays = currentMonth.daysInMonth();
  const previousMonthDayPreviewCount = firstDayOfTheCurrentMonth.day();

  const rows =
    forcedRows ?? Math.ceil((previousMonthDayPreviewCount + totalDays) / 7);

  const gridItemCount = rows * columns;

  const emptyCellCount = gridItemCount - totalDays;

  const nextMonthDayPreviewCount =
    emptyCellCount - previousMonthDayPreviewCount;

  const start = firstDayOfTheCurrentMonth.subtract(
    previousMonthDayPreviewCount,
    "days"
  );
  const end = lastDayOfTheCurrentMonth.add(
    nextMonthDayPreviewCount + 1,
    "days"
  );
  const length = end.diff(start, "days");

  return {
    columns,
    rows,
    start,
    end,
    length,
  };
}

export function CalendarMonthView({
  children,
  month,
  rows: forcedRows,
}: ICalendarMonthView) {
  const currentMonth = (month ?? dayjs()).startOf("month");

  const { columns, rows, length, start } = getCalendarMonthViewContext(
    currentMonth,
    forcedRows
  );

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gap: "1px",
        width: "100%",
        height: "100%",
      }}
    >
      {Array.from({ length }).map((_, i) => {
        const slotDate = start.add(i, "days").startOf("day");

        return children(
          generateCalendarDateContext(slotDate, i, currentMonth, columns)
        );
      })}
    </div>
  );
}

export function generateCalendarDateContext(
  date: dayjs.Dayjs,
  gridIndex?: number,
  currentMonth?: dayjs.Dayjs,
  columns?: number
): ICalendarSlotContext {
  const now = dayjs();
  const isFirstDayOfTheMonth = date.date() === 1;
  const isToday = date.isSame(now, "date");
  const isTomorrow = date.isSame(now.add(1, "day"), "date");

  const isFirstWeek =
    isDefined(gridIndex) && isDefined(columns)
      ? gridIndex! <= columns! - 1
      : false;

  const isLastWeek =
    isDefined(gridIndex) && isDefined(columns)
      ? gridIndex! >= length - columns!
      : false;

  const formattedDay = date.format("ddd");
  const formattedMonth = date.format("MMMM").substring(0, 3);

  const isMainMonth = isDefined(currentMonth)
    ? date.month() === currentMonth!.month()
    : false;

  const isPast = date.isBefore(now);
  const isFuture = date.isAfter(now);

  const currentDayProgress = getDayTimeProgress(now);
  const currentDayProgressPercent = currentDayProgress * 100;

  return {
    isTomorrow,
    currentDayProgress,
    currentDayProgressPercent,
    currentTime: now,
    date,
    formattedDay,
    formattedMonth,
    isFirstDayOfTheMonth,
    isFirstWeek,
    isFuture,
    isLastWeek,
    isMainMonth,
    isPast,
    isToday,
  };
}

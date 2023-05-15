import { ArrowLeftIcon, ArrowRightIcon } from "@primer/octicons-react";
import dayjs from "dayjs";

export type ICalendarHeader = {
  currentMonth: dayjs.Dayjs;
  goToNextMonth: () => void;
  goToPreviousMonth: () => void;
};

export function CalendarHeader({
  currentMonth,
  goToPreviousMonth,
  goToNextMonth,
}: ICalendarHeader) {
  return (
    <header className="flex p-2 bg-s2 border-b border-s3">
      <button
        onClick={goToPreviousMonth}
        className="bg-s2 shadow w-7 h-7 border-s3 p-1 flex justify-center items-center"
      >
        <ArrowLeftIcon fill="var(--t1)" size={14} />
      </button>
      <div className="p-1"></div>
      <button
        onClick={goToNextMonth}
        className="bg-s2 shadow w-7 h-7 aspect-square border-s3 p-1 flex justify-center items-center"
      >
        <ArrowRightIcon fill="var(--t1)" size={14} />
      </button>
      <div className="p-2"></div>
      <div className="text-lg flex items-center">
        {currentMonth.format("MMMM YYYY")}
      </div>
    </header>
  );
}

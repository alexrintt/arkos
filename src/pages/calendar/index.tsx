import dayjs from "dayjs";
import {
  Navigate,
  RouteObject,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { CalendarMonthView } from "../../components/calendar-view";

import {
  DependencyList,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useDispatch } from "react-redux";
import {
  TransactionAction,
  TransactionActionType,
} from "../../redux/reducers/transaction";
import React from "react";
import { DragItemTarget, DropItemTarget } from "./calendar-slot";

import Joi from "joi";
import { isDefined } from "../../utils";
import { Transaction } from "../../services/model/transaction";
import { DndContext } from "@dnd-kit/core";
import { CalendarSlotContextMenu } from "./calendar-slot-context-menu";
import { CalendarHeader } from "./calendar-header";
import { Layout } from "../../components/layout";
import { useDndSensors } from "../../hooks";

export type ICalendarParams = {
  month: number;
  year: number;
};

export const JANUARY = 0;
export const DECEMBER = 11;

const calendarParamsSchema = Joi.object<ICalendarParams>({
  month: Joi.number().integer().min(JANUARY).max(DECEMBER).required(),
  year: Joi.number().integer().required(),
}).required();

function generateCalendarPath(params?: ICalendarParams): string {
  if (isDefined(params?.month) && isDefined(params?.year)) {
    const path = CalendarPath.monthAndYear
      .replace(":m", params!.month.toString())
      .replace(":y", params!.year.toString());

    return path;
  }

  if (isDefined(params?.month)) {
    return CalendarPath.month.replace(":m", params!.month.toString());
  }

  // fallback to /t.
  return CalendarPath.today;
}

const b = "/c";

export enum CalendarPath {
  today = b + "/t",
  monthAndYear = b + "/:m/:y",
  month = b + "/:m",
  fallback = b + "/",
}

const routes: RouteObject[] = [
  {
    path: CalendarPath.monthAndYear,
    element: <CalendarPage />,
  },
  {
    path: CalendarPath.month,
    element: <CalendarPage />,
  },
  {
    path: CalendarPath.today,
    element: <CalendarPage />,
  },
  {
    path: CalendarPath.fallback,
    element: <CalendarPage />,
  },
];

export const Calendar = {
  Page: CalendarPage,
  basePath: b,
  routes: routes,
};

export type ICalendarPage = {};

export function useMouseWheelEventCallback(
  fn: (dir: number) => void,
  deps: DependencyList
): React.WheelEventHandler<HTMLElement> {
  const handleMouseWheel = useCallback<React.WheelEventHandler<HTMLElement>>(
    (e) => {
      if (e.deltaY < 0) {
        fn(-1);
      } else {
        fn(1);
      }
    },
    [fn, ...deps]
  );

  return handleMouseWheel;
}

export function useCalendarMonthCallback(
  initialDate: dayjs.Dayjs
): [dayjs.Dayjs, () => void, () => void, (offset: number) => void] {
  const [month, setMonth] = useState(initialDate.startOf("month"));

  const goTo = useCallback(
    (offset: number) => setMonth(month.add(offset, "months")),
    [month]
  );

  const goToPreviousMonth = useCallback(() => goTo(-1), [goTo]);

  const goToNextMonth = useCallback(() => goTo(1), [goTo]);

  return [month, goToPreviousMonth, goToNextMonth, goTo];
}

export function useCalendarMouseWheelEventCallback(
  goToPreviousMonth: () => void,
  goToNextMonth: () => void
) {
  const handleMouseWheel = useMouseWheelEventCallback((dir) => {
    if (dir === 1) {
      goToNextMonth();
    } else if (dir === -1) {
      goToPreviousMonth();
    }
  }, []);

  return handleMouseWheel;
}

function CalendarPage(props: ICalendarPage) {
  const navigate = useNavigate();
  const location = useLocation();
  const { m, y } = useParams<{ m: string; y: string }>();
  const dispatch = useDispatch();

  const dndSensors = useDndSensors();

  const [isRedirect, params] = useMemo<[boolean, ICalendarParams]>(() => {
    const defaultParams: ICalendarParams = {
      month: dayjs().month(),
      year: dayjs().year(),
    };

    const unsafeParams: Partial<ICalendarParams> = {
      month: undefined,
      year: undefined,
    };

    if (m && y) {
      unsafeParams.month = Number(m);
      unsafeParams.year = Number(y);
    } else {
      if (m && !y) {
        unsafeParams.month = Number(m);
        unsafeParams.year = dayjs().year();
      }
    }

    const invalidParams = !!calendarParamsSchema.validate(unsafeParams).error;

    if (invalidParams) {
      return [true, defaultParams];
    } else {
      return [false, unsafeParams as ICalendarParams];
    }
  }, [m, y]);

  useEffect(() => {
    dispatch<TransactionAction<void>>({
      type: TransactionActionType.loadMore,
    });
  }, []);

  const currentMonth = dayjs()
    .set("date", 1)
    .set("month", params.month)
    .set("year", params.year);

  const previousMonth = currentMonth.subtract(1, "month");
  const nextMonth = currentMonth.add(1, "month");

  function goToNextMonth() {
    const path = generateCalendarPath({
      month: nextMonth.month(),
      year: nextMonth.year(),
    });

    navigate(path, {
      state: location.state,
    });
  }

  function goToPreviousMonth() {
    const path = generateCalendarPath({
      month: previousMonth.month(),
      year: previousMonth.year(),
    });

    navigate(path, {
      state: location.state,
    });
  }

  const handleMouseWheel = useCalendarMouseWheelEventCallback(
    goToPreviousMonth,
    goToNextMonth
  );

  if (isRedirect) {
    return (
      <Navigate
        to={generateCalendarPath({
          month: params.month,
          year: params.year,
        })}
      />
    );
  }

  return (
    <Layout>
      <div className="bg-blue-200 w-full h-full flex flex-col">
        <div className="bg-red-200">
          <CalendarHeader
            currentMonth={currentMonth}
            goToPreviousMonth={goToPreviousMonth}
            goToNextMonth={goToNextMonth}
          />
        </div>
        <div
          className="bg-s3 flex-1 overflow-y-scroll"
          onWheel={handleMouseWheel}
        >
          <div className="w-full h-full max-h-full">
            <DndContext
              sensors={dndSensors}
              autoScroll={false}
              onDragStart={(e) => {
                const dragTarget = e.active.data
                  .current as unknown as DragItemTarget<Transaction, number>;

                const el = document.getElementById(dragTarget.id);

                if (!el) return;

                const currentPos = el!.getBoundingClientRect();

                const origin = {
                  top: currentPos.top,
                  left: currentPos.left,
                };

                el.setAttribute("data-origin", JSON.stringify(origin));

                const overlay = el.cloneNode(true) as HTMLDivElement;
                el.appendChild(overlay);
                overlay.setAttribute("id", el.getAttribute("id") + "__overlay");

                overlay.style.position = "fixed";
                overlay.style.opacity = "0.5";
                overlay.style.top = origin.top + "px";
                overlay.style.left = origin.left + "px";
                overlay.style.width = currentPos.width + "px";
                overlay.style.height = currentPos.height + "px";
                overlay.style.zIndex = "10000";
              }}
              onDragMove={(e) => {
                const dragTarget = e.active.data
                  .current as unknown as DragItemTarget<Transaction, number>;

                const el = document.getElementById(dragTarget.id);

                const overlay = document.getElementById(
                  dragTarget.id + "__overlay"
                );

                if (!overlay || !el) return;

                const transform = JSON.parse(
                  el.getAttribute("data-transform")!
                );

                const origin = JSON.parse(el.getAttribute("data-origin")!);

                overlay.style.top =
                  (((origin.top as number) + transform.y) as number) + "px";
                overlay.style.left =
                  (((origin.left as number) + transform.x) as number) + "px";
              }}
              onDragEnd={(e) => {
                function setDragTargetIndexToDefault() {
                  const dragTarget = e.active.data
                    .current as unknown as DragItemTarget<Transaction, number>;

                  const el = document.getElementById(dragTarget.id);
                  const overlay = document.getElementById(
                    dragTarget.id + "__overlay"
                  );

                  if (!el || !overlay) return;

                  el.removeChild(overlay);
                }
                function updateDragTargetStateIfApplicable() {
                  const dragTarget = e.active.data
                    .current as unknown as DragItemTarget<Transaction, number>;

                  const hasDropTarget = isDefined(e.over);

                  if (!hasDropTarget) return;

                  const droppedTo: DropItemTarget<number> = e.over!.data
                    .current as DropItemTarget<number>;

                  const droppedFrom: DropItemTarget<number> =
                    dragTarget.container;

                  if (droppedTo.id !== droppedFrom.id) {
                    dispatch<TransactionAction<Transaction>>({
                      type: TransactionActionType.edit,
                      payload: {
                        ...dragTarget.item,
                        createdAt: droppedTo.item,
                      },
                    });
                  } else {
                    // drop origin and destination is the same, no update.
                  }
                }

                setDragTargetIndexToDefault();
                updateDragTargetStateIfApplicable();
              }}
            >
              <CalendarMonthView month={currentMonth}>
                {(context) => {
                  return (
                    <CalendarSlotContextMenu
                      key={context.date.valueOf()}
                      context={context}
                      onClick={() => {}}
                    />
                  );
                }}
              </CalendarMonthView>
            </DndContext>
          </div>
        </div>
      </div>
    </Layout>
  );
}

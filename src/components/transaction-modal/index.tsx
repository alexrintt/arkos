import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Transaction, TransactionType } from "../../services/model/transaction";
import {
  TextAreaAutoSize,
  useTextAreaAutoSizeRef,
} from "../text-area-autosize";
import { useDispatch, useSelector } from "react-redux";
import {
  TransactionAction,
  TransactionActionType,
  TransactionState,
} from "../../redux/reducers/transaction";
import { ApplicationState } from "../../redux";
import dayjs from "dayjs";
import { Chip } from "../chip";
import { Input } from "../input";
import { InputNumberFormat, useNumberFormat } from "@react-input/number-format";
import {
  formatCurrency,
  isDefined,
  isUndefined,
  isValidHexColor,
  when,
} from "../../utils";
import { useHotkeys } from "react-hotkeys-hook";
// import $ from "jquery";
import {
  ArrowDownIcon,
  ArrowSwitchIcon,
  ArrowUpIcon,
  CalendarIcon,
  CircleIcon,
  SyncIcon,
  TagIcon,
} from "@primer/octicons-react";
import { Is, When } from "../when";
import {
  TransactionModalAction,
  TransactionModalActionType,
  TransactionModalMode,
  TransactionModalState,
  selectIsTransactionModalEmpty,
  selectTransactionModal,
  selectTransactionModalHasChangesLeft,
  transactionModalAction,
  useCloseTransactionModal,
} from "../../redux/reducers/transaction-modal";
import ReactModal from "react-modal";
import { useInterval, useIsFirstRender } from "usehooks-ts";
import { _10s, _15s, _1s, _30min, _30s } from "../../hooks";
import { NumericFormat } from "react-number-format";
import CurrencyFormat from "react-currency-format";
import { CurrencyInput } from "./currency-input";
import classNames from "classnames";
import { Dropdown } from "../dropdown";
import { NoiseFunction2D, createNoise2D } from "simplex-noise";
import { Drawable } from "../../services/model/common";
import {
  CalendarMonthView,
  generateCalendarDateContext,
} from "../calendar-view";
import { CalendarSlotContextMenu } from "../../pages/calendar/calendar-slot-context-menu";
import {
  useCalendarMonthCallback,
  useCalendarMouseWheelEventCallback,
} from "../../pages/calendar";
import { CalendarSlotPlain } from "../../pages/calendar/calendar-slot";

export interface ITransactionModal {}

export type ReducerFn<T> = (current: T) => T;
export type PartialReducerFn<T> = ReducerFn<Partial<T>>;

export function TransactionModal(props: ITransactionModal) {
  const [transactionNotesTextAreaRef, transactionNotes, setTransactionNotes] =
    useTextAreaAutoSizeRef();

  const dispatch = useDispatch();

  const transactionAmountRef = useRef<number>();

  const closeTransactionModal = useCloseTransactionModal();
  // const saveTransactionModal = () => {};

  const transactionModal: TransactionModalState = useSelector(
    selectTransactionModal()
  );

  const setTransactionAmountRef = useCallback((value: number) => {
    transactionAmountRef.current = value;
    dispatch<TransactionModalAction<Partial<Transaction>>>({
      type: TransactionModalActionType.updateCurrent,
      payload: {
        amount: transactionAmountRef.current,
      },
    });
  }, []);

  useEffect(() => {
    handleNotesChange(transactionNotes);
  }, [transactionNotes]);

  useEffect(() => {
    if (transactionModal.isOpen) {
      setTransactionNotes(transactionModal.current.notes ?? "");
    }
  }, [transactionModal.isOpen]);

  useHotkeys(
    "esc",
    (a, b) => {
      closeTransactionModal();
    },
    {
      enableOnFormTags: ["TEXTAREA", "INPUT"],
    }
  );

  // useInterval(saveTransactionModal, _15s);

  function toggleTransactionType() {
    dispatch<TransactionModalAction<void>>({
      type: TransactionModalActionType.toggleTransactionType,
    });
  }

  function handleTitleChange(e: ChangeEvent<HTMLInputElement>) {
    dispatch<TransactionModalAction<Partial<Transaction>>>({
      type: TransactionModalActionType.updateCurrent,
      payload: {
        title: e.target.value,
      },
    });
  }

  function handleNotesChange(value: string) {
    dispatch<TransactionModalAction<Partial<Transaction>>>({
      type: TransactionModalActionType.updateCurrent,
      payload: {
        notes: value,
      },
    });
  }

  const calendarDateContext = generateCalendarDateContext(
    dayjs(transactionModal.current.createdAt ?? dayjs().valueOf())
  );

  const [month, goToPreviousMonth, goToNextMonth] = useCalendarMonthCallback(
    calendarDateContext.date
  );

  const onCalendarViewMouseWheelCallback = useCalendarMouseWheelEventCallback(
    goToPreviousMonth,
    goToNextMonth
  );

  return (
    <div
      style={{
        borderColor: (() => {
          return getColorFromTransactionType(
            transactionModal.current.type,
            transactionModal.current.drawable?.hexColor
          );
        })(),
      }}
      className={classNames("border-t-4 w-full max-w-xl bg-s1 p-0")}
    >
      <div className="p-4">
        <div>
          <div className="flex justify-start">
            <div>
              <Dropdown
                trigger={(setIsOpen, isOpen) => (
                  <Chip
                    onClick={() => setIsOpen(!isOpen)}
                    leading={
                      <div
                        style={{
                          backgroundColor: getColorFromTransactionType(
                            transactionModal.current.type,
                            transactionModal.current.drawable?.hexColor
                          ),
                        }}
                        className="w-full h-full rounded-full"
                      ></div>
                    }
                  />
                )}
              >
                {(setIsOpen, isOpen) => {
                  return (
                    <div className="w-72">
                      <TransactionColorDropdown
                        onChangeColor={(color) => {
                          dispatch<
                            TransactionModalAction<Partial<Transaction>>
                          >({
                            type: TransactionModalActionType.updateCurrent,
                            payload: {
                              drawable: {
                                hexColor: color,
                              },
                            },
                          });
                        }}
                      />
                    </div>
                  );
                }}
              </Dropdown>
            </div>
            <Input
              tabIndex={1}
              type="text"
              maxLength={128}
              value={transactionModal.current.title ?? ""}
              onChange={handleTitleChange}
              placeholder="Untitled"
              className="bg-s1 font-medium text-p1 break-word overflow-hidden text-sm ml-2 w-full outline-none"
            />
          </div>
        </div>
        <div className="flex-1 flex flex-col w-full">
          <div className="my-4 flex items-center">
            <CurrencyInput
              defaultValue={transactionModal.current.amount ?? 0}
              tabIndex={2}
              onChange={(_, value) => {
                setTransactionAmountRef(value);
              }}
            />
          </div>
          <TextAreaAutoSize
            tabIndex={3}
            textAreaRef={transactionNotesTextAreaRef}
            setValue={setTransactionNotes}
            value={transactionNotes}
            // type="text"
            readOnly={false}
            // autoFocus={true}
            className="bg-s1 placeholder-t0 font-medium text-p1 break-word overflow-hidden text-md mb-3 w-full outline-none"
            placeholder="Add description..."
            maxLength={512}
          />
          <div className="flex justify-start flex-wrap">
            <When it={transactionModal.current.type}>
              <Is equalTo={TransactionType.income}>
                <Chip
                  tabIndex={4}
                  onClick={toggleTransactionType}
                  text="Income"
                  leading={<ArrowUpIcon fill="var(--success)" size={14} />}
                />
              </Is>
              <Is equalTo={TransactionType.outcome}>
                <Chip
                  tabIndex={5}
                  onClick={toggleTransactionType}
                  text="Outcome"
                  leading={<ArrowDownIcon fill="var(--danger)" size={14} />}
                />
              </Is>
              <Is equalTo={TransactionType.swap}>
                <Chip
                  tabIndex={6}
                  onClick={toggleTransactionType}
                  text="Swap"
                  leading={<ArrowSwitchIcon fill="var(--w1)" size={14} />}
                />
              </Is>
            </When>
            <Dropdown
              trigger={(setIsOpen, isOpen) => (
                <Chip
                  onClick={() => setIsOpen(!isOpen)}
                  tabIndex={7}
                  text={(() => {
                    if (calendarDateContext.isToday) {
                      return "Today";
                    }

                    if (calendarDateContext.isTomorrow) {
                      return "Tomorrow";
                    }

                    return calendarDateContext.date.format("DD MMMM YYYY");
                  })()}
                  leading={<CalendarIcon fill="var(--t1)" size={14} />}
                />
              )}
            >
              {(setIsOpen, isOpen) => {
                return (
                  <div
                    onWheel={onCalendarViewMouseWheelCallback}
                    className="bg-s3 shadow-lg w-[600px] h-[300px]"
                  >
                    <CalendarMonthView rows={6} month={month}>
                      {(context) => {
                        return (
                          <CalendarSlotPlain
                            context={context}
                            onClick={() => {
                              dispatch<
                                TransactionModalAction<Partial<Transaction>>
                              >({
                                type: TransactionModalActionType.updateCurrent,
                                payload: {
                                  createdAt: context.date.valueOf(),
                                },
                              });
                            }}
                          />
                        );
                      }}
                    </CalendarMonthView>
                  </div>
                );
              }}
            </Dropdown>
            <Chip
              tabIndex={8}
              text="Inter Saldo"
              leading={
                <img
                  className="rounded-full"
                  src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2F1.bp.blogspot.com%2F-QX8GhmiVftA%2FXoKcWDGhYbI%2FAAAAAAAAZFQ%2FqBp1KzQcK0soxwypIFHOu35ENMrjTzmngCLcBGAsYHQ%2Fs1600%2Fbanco-inter-.png&f=1&nofb=1&ipt=126a7735f182ed14c18e235902dac6794dd815d685d70a2f36a04184baf634d1&ipo=images"
                />
              }
            />
            <Chip
              tabIndex={9}
              text="One time"
              leading={<CircleIcon fill="var(--t1)" size={14} />}
            />
            <Chip
              tabIndex={10}
              leading={<TagIcon fill="var(--t1)" size={14} />}
            />
          </div>
        </div>
      </div>
      <div className="border-t border-s2 p-0 sm:flex sm:flex-row-reverse p-4">
        <button
          tabIndex={11}
          type="button"
          className="m-0 inline-flex w-full justify-center rounded-md bg-p1 px-4 py-1 text-xs font-semibold text-s1 shadow-sm ring-1 ring-inset ring-p3 hover:bg-p2 sm:w-auto"
          onClick={closeTransactionModal}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export type ITransactionColorDropdown = {
  onChangeColor: (color: string) => void;
};

export function useRandomSeeds(count: number = 1): [number[], () => void] {
  const generateSeeds = useCallback(() => {
    return Array.from({ length: count }).map((_) => Math.random());
  }, [count]);

  const [seeds, setSeeds] = useState(generateSeeds());

  const randomizeSeeds = useCallback(() => setSeeds(generateSeeds()), []);

  return [seeds, randomizeSeeds];
}

export function useRandomHexColors(count: number = 1): [string[], () => void] {
  const [seeds, randomizeSeeds] = useRandomSeeds(count * 3);

  const hexColors = useMemo(() => {
    return Array.from({ length: count }).map((e, i) => {
      return [0xff, 0xff, 0xff]
        .map((e, j) => Math.floor(seeds[i * j] * e))
        .map((e) => e.toString(16).padStart(2, "0"))
        .join("")
        .padStart(7, "#");
    });
  }, [seeds]);

  return [hexColors, randomizeSeeds];
}

export function TransactionColorDropdown({
  onChangeColor,
}: ITransactionColorDropdown) {
  const COUNT = 5 * 2;

  const [hexColors, randomizeSeeds] = useRandomHexColors(COUNT);

  return (
    <div className="bg-s2 border flex flex-col border-s3 rounded shadow-lg w-full p-2">
      <div className="flex justify-start items-center mb-2">
        <p className="text-xs">Choose a color</p>

        <button
          onClick={() => randomizeSeeds()}
          className="ml-2 bg-s3 border border-s4 rounded-full aspect-square w-10 h-6 flex justify-center items-center"
        >
          <SyncIcon size={14} />
        </button>
      </div>
      <div className="flex flex-wrap">
        {Array.from({ length: 5 * 2 }).map((e, i) => {
          const color = hexColors[i];

          return (
            <div key={color} className="flex items-center justify-center p-1">
              <div
                style={{
                  backgroundColor: color,
                  boxShadow: `0px 0px 100px -5px ${color}`,
                }}
                className="cursor-pointer hover:opacity-75 h-6 w-6 rounded-full"
                onClick={() => onChangeColor(color)}
              ></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function getCssVariableValue(variableName: string): string {
  return getComputedStyle(window.document.body).getPropertyValue(variableName);
}

export const mapTransactionTypeToCssColor = {
  [TransactionType.income]: "--success",
  [TransactionType.outcome]: "--danger",
  [TransactionType.swap]: "--w1",
};

export function getColorFromTransactionType(
  transactionType?: TransactionType,
  customHexColorIfAvailable?: string | undefined
): string {
  if (isDefined(customHexColorIfAvailable)) {
    if (isValidHexColor(customHexColorIfAvailable!)) {
      return customHexColorIfAvailable!;
    }
  }

  if (isUndefined(transactionType)) {
    return TRANSPARENT_COLOR;
  }

  const variable = getCssVariableValue(
    mapTransactionTypeToCssColor[transactionType!]
  );

  return variable.length > 0 ? variable : TRANSPARENT_COLOR;
}

export const TRANSPARENT_COLOR = `#ffffff`;

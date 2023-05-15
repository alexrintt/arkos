import { MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import dayjs from "dayjs";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { useInterval, useIsomorphicLayoutEffect } from "usehooks-ts";

export function useTimeout(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  // Remember the latest callback if it changes.
  useIsomorphicLayoutEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the timeout.
  useEffect(() => {
    // Don't schedule if no delay is specified.
    // Note: 0 is a valid value for delay.
    if (!delay && delay !== 0) {
      return;
    }

    const id = setTimeout(() => savedCallback.current(), delay);

    return () => clearTimeout(id);
  }, [delay]);
}

export function useDndSensors() {
  const mouseSensor = useSensor(MouseSensor, {
    // Require the mouse to move by 10 pixels before activating
    activationConstraint: {
      distance: 50,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    // Press delay of 250ms, with tolerance of 5px of movement
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  return sensors;
}

export const _1s = 1000;
export const _10s = _1s * 10;
export const _15s = _1s * 15;
export const _1min = _1s * 60;
export const _30min = _1min * 30;
export const _30s = _1s * 30;
export const _1h = _30min * 2;
export const _24h = _1h * 24;

export function useIsToday(relative: dayjs.Dayjs) {
  const currentTime = useCurrenTime();

  return currentTime.isSame(relative, "date");
}

export function useCurrenTime(interval: number = _1s): dayjs.Dayjs {
  const [time, setTime] = useState(dayjs());

  useInterval(() => setTime(dayjs()), interval);

  return time;
}

export function useTimeLeftToday() {
  const currentTime = useCurrenTime(_1min);

  return getTimeLeftToday(currentTime);
}

export function useDayTimeProgress() {
  return 1 - useTimeLeftToday();
}

export function getTimeLeftToday(time: dayjs.Dayjs): number {
  return time.endOf("date").diff(dayjs(), "milliseconds") / _24h;
}

export function getDayTimeProgress(time: dayjs.Dayjs): number {
  return 1 - getTimeLeftToday(time);
}

export function useKeyPress(targetKey: string) {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState<boolean>(false);

  const setAsNotBeingPressed = useCallback(() => {
    setKeyPressed(false);
  }, []);

  const setAsBeingPressed = useCallback(() => {
    setKeyPressed(true);
  }, []);

  // If pressed key is our target key then set to true
  const downHandler = useCallback(({ key }: KeyboardEvent) => {
    if (key === targetKey) {
      setAsBeingPressed();
    }
  }, []);

  // If released key is our target key then set to false
  const upHandler = useCallback(({ key }: KeyboardEvent) => {
    if (key === targetKey) {
      setAsNotBeingPressed();
    }
  }, []);

  // Add event listeners
  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("blur", setAsNotBeingPressed);
    window.addEventListener("keyup", upHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("blur", setAsNotBeingPressed);
      window.removeEventListener("keyup", upHandler);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return keyPressed;
}

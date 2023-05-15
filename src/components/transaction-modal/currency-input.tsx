import classNames from "classnames";
import { useEffect, useRef } from "react";
import IntlCurrencyInput from "react-intl-currency-input";
import { LocaleTag } from "./mask-input";
import { useIsFirstRender } from "usehooks-ts";

export type IntlFormatterConfig = {
  locale: LocaleTag;
  formats: {
    number: {
      [key: string]: Intl.NumberFormatOptions;
    };
  };
};

export type ICurrencyInput = {
  onChange: (event: InputEvent, value: number, maskedValue: string) => void;
  tabIndex: number;
  defaultValue: number;
};

export const CurrencyInput = ({
  onChange,
  tabIndex,
  defaultValue,
}: ICurrencyInput) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const currencyConfig: IntlFormatterConfig = {
    locale: "pt-BR",
    formats: {
      number: {
        BRL: {
          style: "currency",
          currency: "BRL",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        },
      },
    },
  };

  const handleChange = (
    event: InputEvent,
    value: number,
    maskedValue: string
  ) => {
    event.preventDefault();

    onChange(event, value, maskedValue);
  };

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current!.className = classNames(
      "bg-s1 placeholder-t0 font-medium text-p1 break-word overflow-hidden text-lg w-full outline-none"
    );
    inputRef.current.tabIndex = tabIndex;
    inputRef.current.focus();
  }, []);

  return (
    <IntlCurrencyInput
      defaultValue={defaultValue}
      max={Infinity}
      autoFocus
      currency="BRL"
      config={currencyConfig}
      onChange={handleChange}
      inputRef={inputRef}
    />
  );
};

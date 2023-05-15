import { useLayoutEffect, useRef, useState } from "react";

const MIN_TEXTAREA_HEIGHT = 32;

export interface ITextAreaAutoSize
  extends React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {
  textAreaRef: React.RefObject<HTMLTextAreaElement>;
  value: string;
  setValue: (value: string) => void;
}

export function TextAreaAutoSize({
  textAreaRef,
  value,
  setValue,
  ...props
}: ITextAreaAutoSize) {
  return (
    <textarea
      autoCorrect="false"
      spellCheck="false"
      {...props}
      onChange={(e) => setValue(e.target.value)}
      ref={textAreaRef}
      style={{
        minHeight: MIN_TEXTAREA_HEIGHT,
        resize: "none",
      }}
      value={value}
    />
  );
}

export function useTextAreaAutoSizeRef(): [
  React.RefObject<HTMLTextAreaElement>,
  string,
  React.Dispatch<React.SetStateAction<string>>
] {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState("");

  useLayoutEffect(() => {
    if (!textAreaRef.current) return;

    // Reset height - important to shrink on delete
    textAreaRef.current.style.height = "inherit";
    // Set height
    textAreaRef.current.style.height = `${Math.max(
      textAreaRef.current.scrollHeight,
      MIN_TEXTAREA_HEIGHT
    )}px`;
  }, [value]);

  return [textAreaRef, value, setValue];
}

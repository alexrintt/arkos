import React from "react";
import { useDroppable } from "@dnd-kit/core";

export type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;

export type IDroppable<D> = {
  children: (isOver: boolean) => React.ReactNode;
  id: string;
  data?: D;
  getProps: (
    isOver: boolean
  ) => React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >;
};

export function Droppable<D extends Record<string, any> = any>({
  children,
  id,
  data,
  getProps,
}: IDroppable<D>) {
  const { isOver, setNodeRef } = useDroppable({
    id: `${id}__droppable`,
    data: data,
  });

  return (
    <div {...getProps(isOver)} ref={setNodeRef}>
      {children(isOver)}
    </div>
  );
}

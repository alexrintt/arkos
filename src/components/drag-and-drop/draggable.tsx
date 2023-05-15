import React, { CSSProperties } from "react";
import { Data, useDraggable } from "@dnd-kit/core";
import type { Transform } from "@dnd-kit/utilities";
import { Overwrite } from "./droppable";

export type IDraggable<D> = Overwrite<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  {
    id: string;
    data?: D;
    children: (transform: Transform | null) => React.ReactNode;
  }
>;

export function Draggable<D extends Data>({
  id,
  data,
  ...props
}: IDraggable<D>) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `${id}__draggable`,
    data: data,
  });

  return (
    <div ref={setNodeRef} {...listeners} {...attributes}>
      {props.children(transform)}
    </div>
  );
}

type A<T> = T & Record<string, any>;

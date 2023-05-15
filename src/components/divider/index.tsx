import { CSSProperties } from "react";

export type IDivider = Pick<CSSProperties, "color">;

export function Divider({ color }: IDivider) {
  return (
    <div
      style={{
        backgroundColor: color,
        width: "100%",
        height: 1,
      }}
    />
  );
}

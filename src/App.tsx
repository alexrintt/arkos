import React from "react";

export default function App(props?: React.PropsWithChildren): JSX.Element {
  return <>{props?.children}</>;
}

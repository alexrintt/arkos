import React, { ReactElement } from "react";

export interface IIs extends React.PropsWithChildren {
  equalTo?: any;
}

export function Is(props: IIs): JSX.Element {
  return <>{props.children}</>;
}

export interface IWhen extends React.PropsWithChildren {
  it: any;
}

export function When({ children, it }: IWhen): JSX.Element {
  const child = React.Children.toArray(children)
    .filter((child) => {
      if (typeof child !== "object" || !child) {
        throw Error(`
        Invalid use of [When] and [Is]. Usage:
        <When it={1}>
          <Is equalTo={0}>Zero</Is>
          <Is equalTo={1}>One</Is>
          <Is equalTo={2}>Two</Is>
          <Is equalTo={NaN}>Not a number!</Is>
        </When>
      `);
      }
      return true;
    })
    .find((child) => {
      const target = child as ReactElement<IIs>;

      if (target.props.equalTo === it) {
        return true;
      }

      return false;
    }) as ReactElement<IIs> | undefined;

  return <>{child?.props.children}</>;
}

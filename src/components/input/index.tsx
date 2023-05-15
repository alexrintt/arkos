interface IInput
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  component?: React.ReactNode;
}

export function Input({ component, leading, trailing, ...props }: IInput) {
  return (
    <div className="relative flex items-center w-full">
      {leading}
      {component ?? (
        <input
          className="bg-s1 rounded-md placeholder-t0 text-sm appearance-none border border-s2 w-full py-3 px-4 text-t1 leading-tight focus:outline-none focus:border-t1 mb-3"
          type="text"
          {...props}
        />
      )}
      {trailing}
    </div>
  );
}

export interface IInputTrailing {
  attrs: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >;
  text?: string;
  icon?: React.ReactNode;
  bgColor?: string;
  color?: string;
}

export function InputTrailing(props: IInputTrailing) {
  const defaultProps: Partial<IInputTrailing> = {
    bgColor: "p1",
    color: "s1",
  };

  const config = Object.assign(defaultProps, props);

  return (
    <button
      className={`!absolute right-1 top-1 z-10 select-none rounded bg-${config.bgColor} py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-${config.color} transition-all`}
      type="button"
      {...props.attrs}
    >
      {props.text}
      {props.icon}
    </button>
  );
}

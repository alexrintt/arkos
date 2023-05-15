export interface IChip
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  leading?: JSX.Element;
  trailing?: JSX.Element;
  text?: string;
}

export function Chip({ text, leading, trailing, ...props }: IChip) {
  return (
    <div
      className="flex justify-center items-center m-0.5 font-medium py-1 px-2 bg-s2 hover:bg-s3 hover:border-s4 cursor-pointer border shadow-sm border-s3 rounded-md text-p1"
      {...props}
    >
      {leading && (
        <div slot="avatar">
          <div className="flex relative w-4 h-4 justify-center items-center text-xs rounded-full">
            {leading}
          </div>
        </div>
      )}
      {text && (
        <div className="ml-1 text-xs font-normal leading-none max-w-full flex-initial">
          {text}
        </div>
      )}
      {trailing && (
        <div slot="avatar">
          <div className="flex relative w-4 h-4 justify-center items-center text-xs rounded-full">
            {trailing}
          </div>
        </div>
      )}
    </div>
  );
}

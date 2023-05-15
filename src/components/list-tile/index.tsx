import classNames from "classnames";

export type IListTile = {
  text: string;
  leading: JSX.Element;
  trailing?: JSX.Element;
  onClick?: (e: React.MouseEvent) => void;
  active?: boolean;
};

export function ListTile({
  onClick,
  leading,
  text,
  trailing,
  active = false,
}: IListTile) {
  return (
    <div
      onClick={onClick}
      className={classNames(
        {
          "bg-s3": active,
          "bg-transparent": !active,
          "hover:bg-s4": !active,
        },
        "cursor-pointer group w-full text-start text-t1 flex items-center p-[0.38rem] text-t2 text-xs rounded-md"
      )}
    >
      {leading}
      <span
        className={classNames(
          {
            "group-hover:text-p1": !active,
          },
          "flex-1 ml-2 whitespace-nowrap"
        )}
      >
        {text}
      </span>
      {trailing}
    </div>
  );
}

import { Menu, MenuItemProps, MenuItemsProps } from "@headlessui/react";
import React, { ElementType, forwardRef, useRef, useState } from "react";

export type IDropdown = {
  children: (
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    open: boolean
  ) => React.ReactNode;
  trigger: (
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    open: boolean
  ) => JSX.Element;
};

export function Dropdown({ children, trigger }: IDropdown) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <div>{trigger(setIsOpen, isOpen)}</div>
      {/*
    Dropdown menu, show/hide based on menu state.

    Entering: "transition ease-out duration-100"
From: "transform opacity-0 scale-95"
To: "transform opacity-100 scale-100"
    Leaving: "transition ease-in duration-75"
From: "transform opacity-100 scale-100"
To: "transform opacity-0 scale-95"
  */}
      {isOpen && (
        <>
          <div
            onClick={() => setIsOpen(false)}
            className="fixed top-0 right-0 left-0 bottom-0"
          ></div>
          <div
            className="absolute left-0 z-10 mt-2 origin-top-right divide-gray-100"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
            tabIndex={-1}
          >
            {children(setIsOpen, isOpen)}
          </div>
        </>
      )}
    </div>
  );
}

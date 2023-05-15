import type { Action } from "@reduxjs/toolkit";
import { ApplicationState } from "..";
import { when } from "../../utils";
import { StateSelector } from "./transaction";

export enum UIActionType {
  openContextMenu = "openContextMenu",
  closeContextMenu = "closeContextMenu",
}

export interface UIAction<P = any> extends Action<UIActionType> {
  // Added for simplicity, but this is inherited from [Action]
  type: UIActionType;
  payload?: P;
  id?: string;
}

export type UIState = {
  isContextMenuOpen: boolean;
};

export const preloadedState: UIState = {
  isContextMenuOpen: false,
};

export function selectIsContextMenuOpen(): StateSelector<boolean> {
  return (state: ApplicationState) => {
    return state.ui.isContextMenuOpen;
  };
}

function openContextMenu(): UIAction<void> {
  return {
    type: UIActionType.openContextMenu,
  };
}

function closeContextMenu(): UIAction<void> {
  return {
    type: UIActionType.closeContextMenu,
  };
}

export const uiAction = {
  openContextMenu,
  closeContextMenu,
};

export function uiReducer(state: UIState, action: UIAction): UIState {
  return when<UIActionType, UIState>(
    action.type,
    {
      [UIActionType.openContextMenu]: () => {
        return {
          ...state,
          isContextMenuOpen: true,
        };
      },
      [UIActionType.closeContextMenu]: () => {
        return {
          ...state,
          isContextMenuOpen: false,
        };
      },
    },
    () => state ?? preloadedState
  );
}

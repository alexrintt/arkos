import { Drawable, WithId } from "./common";

export interface User extends WithId {
  name: string;
  drawable: Drawable;
}

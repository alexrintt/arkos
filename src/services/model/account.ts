import { Timestamp } from "firebase/firestore";
import { Drawable, WithId } from "./common";

export interface Account extends WithId, Timestamp {
  name: string;
  drawable: Drawable;
  balance: string;
}

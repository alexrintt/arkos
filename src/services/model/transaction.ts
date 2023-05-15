import { User } from "../user";
import { Account } from "./account";
import { Drawable, Paginated, Template, WithId, WithTimestamp } from "./common";

export enum TransactionType {
  income = "income",
  outcome = "outcome",
  swap = "swap",
}

export type TransactionTemplate = Template<Transaction>;

export interface RecurringTransaction extends Transaction {
  startDate: number;
  endDate?: number;

  // Cron format of this transaction (when it occurs)
  // https://en.wikipedia.org/wiki/Cron
  cron: string;
}

// Although this is one of the main models.
// The UI will rely heavily on [TransactionTemplate] because it is more convenient.
export interface Transaction extends WithId, WithTimestamp {
  amount?: number;

  // If this is a outcome, it will discount from [account].
  // If this is a income, it will add to [account].
  // If this is a swap, it will discount from [account] and add to [destination].
  type?: TransactionType;

  // Custom title that was given to this transaction. Otherwise must fallback to [drawable.name]
  title?: string;

  // Icon of this transaction
  drawable?: Drawable;

  // Optional notes
  notes?: string;

  createdAt?: number;

  // Who created this transaction
  commiters?: User;

  // The account in which this transaction is being made
  targetAccount?: Account;

  // In case this transaction is a swap between accounts
  destinationAccount?: Account;
}

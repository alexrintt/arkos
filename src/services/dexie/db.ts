import Dexie, { Table } from "dexie";
import { Transaction } from "../model/transaction";

export class IndexedDatabase extends Dexie {
  transactionTable!: Table<Transaction>;

  constructor() {
    super("db");
    this.version(1).stores({
      transactionTable: `
        id, 
        createdAt,
        insertedAt,
        updatedAt,
        notes,
        amount,
        type
      `, // Primary key and indexed props
    });
  }
}

export const db = new IndexedDatabase();

import localforage from "localforage";
import { TransactionRepository } from "../interface/transaction";
import { Paginated } from "../model/common";
import { Transaction, TransactionTemplate } from "../model/transaction";
import { isDefined, isUndefined } from "../../utils";
import { db } from "./db";

// Implementation of [TransactionRepository] using dexie as backend (wrapper for browser IndexedDB local storage).
export class DexieTransactionRepository implements TransactionRepository {
  async editTransaction(transaction: Partial<Transaction>): Promise<void> {
    if (transaction.id) {
      const node = await db.transactionTable.get(transaction.id);

      if (isDefined(node)) {
        await db.transactionTable.put(
          {
            ...node!,
            ...transaction,
          },
          transaction.id
        );
      }
    }
  }

  async deleteTransaction(transaction: Partial<Transaction>): Promise<void> {
    if (isDefined(transaction.id)) {
      await db.transactionTable.delete(transaction.id!);
    }
  }

  async createTransaction(
    transaction: Partial<Transaction>
  ): Promise<Transaction> {
    const id = window.crypto.randomUUID();
    const now = Date.now();

    const node = {
      ...transaction,
      id,
      insertedAt: now,
      updatedAt: now,
      createdAt: transaction.createdAt ?? now,
    };

    await db.transactionTable.add(node);

    return node;
  }
  async createTransactionTemplate(
    transaction: Partial<Transaction>
  ): Promise<TransactionTemplate> {
    const id = window.crypto.randomUUID();
    const now = Date.now();

    throw Error("Not implemented");

    // return await this.transactionStorage.setItem(id, {
    //   id,
    //   insertedAt: now,
    //   updatedAt: now,
    //   prefilled: transaction,
    // });
  }
  async getTransactions(cursor?: string): Promise<Paginated<Transaction>> {
    const PER_PAGE = 30;
    const offset = Number(cursor ?? "0");
    // const results: Transaction[] = [];

    const results: Transaction[] = await db.transactionTable
      .orderBy("createdAt")
      .offset(offset)
      .limit(PER_PAGE)
      .toArray();

    return {
      cursor: `${offset + results.length}`,
      nodes: results.slice(0, PER_PAGE),
    };
  }
}

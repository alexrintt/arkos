import localforage from "localforage";
import { TransactionRepository } from "../interface/transaction";
import { Paginated } from "../model/common";
import { Transaction, TransactionTemplate } from "../model/transaction";
import { isUndefined } from "../../utils";

// Implementation of [TransactionRepository] using localforage as backend (Browser local storage).

export class LocalForageTransactionRepository implements TransactionRepository {
  transactionStorage = localforage.createInstance({
    name: "transaction",
  });

  async editTransaction(transaction: Partial<Transaction>): Promise<void> {
    if (transaction.id) {
      const node = await this.transactionStorage.getItem<Transaction>(
        transaction.id
      );

      if (isUndefined(node)) {
        this.createTransaction(transaction);
      } else {
        await this.transactionStorage.setItem(transaction.id, {
          ...node,
          ...transaction,
        });
      }
    }
  }

  async deleteTransaction(transaction: Partial<Transaction>): Promise<void> {
    if (transaction.id) {
      await this.transactionStorage.removeItem(transaction.id);
    }
  }

  async createTransaction(
    transaction: Partial<Transaction>
  ): Promise<Transaction> {
    const id = window.crypto.randomUUID();
    const now = Date.now();

    return await this.transactionStorage.setItem(id, {
      ...transaction,
      id,
      insertedAt: now,
      updatedAt: now,
      createdAt: transaction.createdAt ?? now,
    });
  }
  async createTransactionTemplate(
    transaction: Partial<Transaction>
  ): Promise<TransactionTemplate> {
    const id = window.crypto.randomUUID();
    const now = Date.now();

    return await this.transactionStorage.setItem(id, {
      id,
      insertedAt: now,
      updatedAt: now,
      prefilled: transaction,
    });
  }
  async getTransactions(cursor?: string): Promise<Paginated<Transaction>> {
    const PER_PAGE = 30;
    const offset = Number(cursor ?? "0");
    const results: Transaction[] = [];

    await this.transactionStorage.iterate<Transaction, void>((value, key) => {
      results.push(value);
    });

    results.sort(
      (a: Transaction, z: Transaction) =>
        (z.createdAt ?? 0) - (a.createdAt ?? 0)
    );

    const nodes = results.slice(offset, PER_PAGE);

    return {
      cursor: (offset + nodes.length).toString(),
      nodes,
    };
  }
}

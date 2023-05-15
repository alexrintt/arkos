import { Paginated } from "../model/common";
import { Transaction, TransactionTemplate } from "../model/transaction";

// Repositories - responsible for fetching/creating/updating data only.
export abstract class TransactionRepository {
  abstract createTransactionTemplate(
    template: Partial<Transaction>
  ): Promise<TransactionTemplate>;
  abstract createTransaction(
    transaction: Partial<Transaction>
  ): Promise<Transaction>;
  abstract getTransactions(cursor?: string): Promise<Paginated<Transaction>>;
  abstract deleteTransaction(transaction: Partial<Transaction>): Promise<void>;
  abstract editTransaction(transaction: Partial<Transaction>): Promise<void>;
}

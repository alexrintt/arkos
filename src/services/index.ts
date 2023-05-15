import { DexieTransactionRepository } from "./dexie/transaction";
import { TransactionRepository } from "./interface/transaction";
import { LocalForageTransactionRepository } from "./localforage/transaction";

export const transactionRepository: TransactionRepository =
  new DexieTransactionRepository();

import { PageOf } from "../workspace";

export type Timestamp = {
  createdAt: number;
  updatedAt: number;
};

export type Wallet = {
  name: string;
  id: string;
};

export type WalletEntry = {
  amount: number;
  title: string;
  description: string;
  id: string;
};

export abstract class WalletService {
  abstract getWorkspaceWallets(workspaceId: string): Promise<PageOf<Wallet>>;
  abstract getBalance(walletId: string): number;
  abstract getWalletEntries(walletId: string): PageOf<WalletEntry>;
}

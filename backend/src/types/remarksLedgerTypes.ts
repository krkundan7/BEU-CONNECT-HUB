export interface IRemarksLedgerEntry {
  id: string;
  userId: string;
  points: number;
  reason: string;
  balanceAfter: number;
  transactionType: 'CREDIT' | 'DEBIT';
  createdAt: Date;
}

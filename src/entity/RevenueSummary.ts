
export interface RevenueSummary {
  totalCollected: number;
  totalPending: number;
  monthlyRevenue: { [key: string]: number };
  totalPaidOwners: number;
  totalPendingOwners: number;
}
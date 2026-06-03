export interface DashboardStats {
  totalPGs: number;
  totalUsers: number;
  totalOwners: number;
  totalTenants: number;
  monthlyInquiries: number;
  weeklySignups: number;
  totalFinderFeesCollected: number;
  pendingFinderFees: number;
  platformHealthy: boolean;
  lastUpdated: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  active: boolean;
  createdAt: string;
  listedPGCount?: number;
  inquiryCount?: number;
}

export interface PgListing {
  id: number;
  pgName: string;
  city: string;
  locality: string;
  ownerName: string;
  ownerId: number;
  verified: boolean;
  active: boolean;
  lowestPrice: number;
  createdAt: string;
  inquiryCount: number;
  occupancyType: string;
}

export interface Inquiry {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  message: string;
  inquiryType: string;
  location: string;
  createdAt: string;
}

export interface RevenueSummary {
  totalCollected: number;
  totalPending: number;
  monthlyRevenue: { [key: string]: number };
  totalPaidOwners: number;
  totalPendingOwners: number;
}

export interface ChartData {
  label: string;
  value: number;
}

export class PlatformSettings {
  featuredListings: number[] = [];
  cities: string[] = [];
  localities: string[] = [];
  announcementTitle = '';
  announcementMessage = '';

  get featuredListingsStr(): string { return this.featuredListings.join(','); }
  set featuredListingsStr(val: string) { this.featuredListings = val.split(',').filter(v => v.trim()).map(Number); }
  get citiesStr(): string { return this.cities.join(','); }
  set citiesStr(val: string) { this.cities = val.split(',').map(c => c.trim()).filter(c => c); }
  get localitiesStr(): string { return this.localities.join(','); }
  set localitiesStr(val: string) { this.localities = val.split(',').map(l => l.trim()).filter(l => l); }
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
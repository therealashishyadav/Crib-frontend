import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

interface DashboardStats {
  totalPGs: number;
  totalUsers: number;
  totalOwners: number;
  monthlyInquiries: number;
  weeklySignups: number;
  totalFinderFeesCollected: number;
  pendingFinderFees: number;
  totalTenants: number;
}

interface StatTrend {
  direction: 'up' | 'down';
  percent: number;
  caption: string;
}

interface ServiceHealthItem {
  name: string;
  status: 'UP' | 'DOWN';
}

interface InquiryPreview {
  fullName: string;
  email: string;
  location: string;
  inquiryType?: string;
}

interface UserRow {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'USER' | 'OWNER' | 'ADMIN' | 'MANAGEMENT';
  active?: boolean;
}

interface PgRow {
  id: number;
  pgName: string;
  city: string;
  locality: string;
  ownerName: string;
  lowestPrice: number;
  verified: boolean;
  active: boolean;
}

interface InquiryRow {
  id?: number;
  inquiryId?: number;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  inquiryType?: string;
  message?: string;
}

interface RevenueSummary {
  totalCollected: number;
  totalPending: number;
  totalPaidOwners: number;
  totalPendingOwners: number;
}

interface PortalSettings {
  featuredListingsStr: string;
  citiesStr: string;
  localitiesStr: string;
}

interface NotificationItem {
  id: number;
  title: string;
  detail: string;
  time: string;
  read: boolean;
}

@Component({
  selector: 'app-management-portal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatMenuModule,
    MatBadgeModule,
    MatSnackBarModule
  ],
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.css'],
})
export class ManagementComponent implements OnInit, OnDestroy {

  sidebarCollapsed = false;
  activeTab = 0;

  tabTitles = ['Dashboard', 'Users', 'PG Listings', 'Inquiries', 'Revenue', 'Settings'];

  currentUserInitial = 'C';
  currentUserName = 'Chirag Deshmukh';
  currentUserRole = 'Management';

  today = new Date();
  clockLabel = '';
  isDashboardRefreshing = false;
  activeFilterCount = 0;

  isDarkTheme = true;

  notifications: NotificationItem[] = [
    { id: 1, title: 'New owner signup', detail: 'Ananya Rao registered as an owner', time: '5m ago', read: false },
    { id: 2, title: 'PG flagged for review', detail: 'Sunrise PG reported by a tenant', time: '38m ago', read: false },
    { id: 3, title: 'Payout completed', detail: 'Weekly finder fee payout processed', time: '2h ago', read: true }
  ];

  dashboardStats: DashboardStats | null = null;

  statTrends: Record<string, StatTrend> = {
    totalPGs: { direction: 'up', percent: 8.2, caption: 'since last month' },
    totalUsers: { direction: 'up', percent: 12.5, caption: 'since last week' },
    totalOwners: { direction: 'up', percent: 4.1, caption: 'since last month' },
    monthlyInquiries: { direction: 'down', percent: 3.4, caption: 'since last month' },
    weeklySignups: { direction: 'up', percent: 21.6, caption: 'since last week' },
    totalFinderFeesCollected: { direction: 'up', percent: 9.8, caption: 'since last month' },
    pendingFinderFees: { direction: 'down', percent: 2.2, caption: 'since last month' },
    totalTenants: { direction: 'up', percent: 6.7, caption: 'since last month' }
  };

  serviceHealth: ServiceHealthItem[] = [
    { name: 'Account Service', status: 'UP' },
    { name: 'PG Listing Service', status: 'UP' },
    { name: 'Inquiry Service', status: 'UP' },
    { name: 'Payment Service', status: 'DOWN' },
    { name: 'Notification Service', status: 'UP' }
  ];

  recentInquiries: InquiryPreview[] = [
    { fullName: 'Aarav Mehta', email: 'aarav.mehta@example.com', location: 'Pune', inquiryType: 'GENERAL' },
    { fullName: 'Diya Kapoor', email: 'diya.kapoor@example.com', location: 'Bengaluru', inquiryType: 'OWNER_SIGNUP' },
    { fullName: 'Rohan Iyer', email: 'rohan.iyer@example.com', location: 'Mumbai', inquiryType: 'ISSUE' }
  ];

  users: UserRow[] = [
    { id: 1, firstName: 'Aarav', lastName: 'Mehta', email: 'aarav.mehta@example.com', phone: '9876543210', role: 'USER', active: true },
    { id: 2, firstName: 'Diya', lastName: 'Kapoor', email: 'diya.kapoor@example.com', phone: '9876501234', role: 'OWNER', active: true },
    { id: 3, firstName: 'Rohan', lastName: 'Iyer', email: 'rohan.iyer@example.com', phone: '9876512345', role: 'ADMIN', active: false }
  ];
  displayedUserColumns = ['id', 'name', 'email', 'phone', 'role', 'active', 'actions'];
  userSearch = '';
  userRoleFilter = '';
  usersTotal = 3;
  usersPageSize = 10;
  usersPageIndex = 0;
  private userSearch$ = new Subject<string>();

  pgs: PgRow[] = [
    { id: 1, pgName: 'Sunrise PG', city: 'Pune', locality: 'Kothrud', ownerName: 'Diya Kapoor', lowestPrice: 8000, verified: true, active: true },
    { id: 2, pgName: 'Nook Residency', city: 'Bengaluru', locality: 'Koramangala', ownerName: 'Vikram Nair', lowestPrice: 11000, verified: false, active: true }
  ];
  displayedPgColumns = ['id', 'pgName', 'city', 'locality', 'ownerName', 'lowestPrice', 'verified', 'active', 'actions'];
  pgCityFilter = '';
  pgOccupancyFilter = '';
  pgActiveFilter = '';
  pgsTotal = 2;
  pgsPageSize = 10;
  pgsPageIndex = 0;

  inquiries: InquiryRow[] = [
    { inquiryId: 101, fullName: 'Aarav Mehta', email: 'aarav.mehta@example.com', phone: '9876543210', location: 'Pune', inquiryType: 'GENERAL', message: 'Looking for a PG near Kothrud with food included.' },
    { inquiryId: 102, fullName: 'Diya Kapoor', email: 'diya.kapoor@example.com', phone: '9876501234', location: 'Bengaluru', inquiryType: 'OWNER_SIGNUP', message: 'Want to list two properties in Koramangala.' }
  ];
  displayedInquiryColumns = ['id', 'fullName', 'email', 'phone', 'location', 'inquiryType', 'message'];
  inquirySearch = '';
  inquiryLocationFilter = '';
  inquiryTypeFilter = '';
  inquiriesTotal = 2;
  inquiriesPageSize = 10;
  inquiriesPageIndex = 0;

  revenueSummary: RevenueSummary | null = null;

  settings: PortalSettings = {
    featuredListingsStr: '',
    citiesStr: '',
    localitiesStr: ''
  };
  announcementTitle = '';
  announcementMessage = '';
  announcementTarget: 'ALL_OWNERS' | 'ALL_USERS' | 'ALL' = 'ALL';

  private clockTimer: any;

  constructor(private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loadDashboard();
    this.updateClock();
    this.clockTimer = setInterval(() => this.updateClock(), 1000 * 30);
    this.userSearch$.pipe(debounceTime(350), distinctUntilChanged()).subscribe(() => this.onUserSearch());
    this.recalculateActiveFilters();
  }

  ngOnDestroy(): void {
    if (this.clockTimer) {
      clearInterval(this.clockTimer);
    }
  }

  private updateClock(): void {
    this.today = new Date();
    this.clockLabel = this.today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  private loadDashboard(): void {
    this.dashboardStats = {
      totalPGs: 486,
      totalUsers: 12480,
      totalOwners: 612,
      monthlyInquiries: 934,
      weeklySignups: 187,
      totalFinderFeesCollected: 1865400,
      pendingFinderFees: 142560,
      totalTenants: 5320
    };
    this.revenueSummary = {
      totalCollected: 1865400,
      totalPending: 142560,
      totalPaidOwners: 341,
      totalPendingOwners: 68
    };
  }

  refreshDashboard(): void {
    this.isDashboardRefreshing = true;
    this.dashboardStats = null;
    setTimeout(() => {
      this.loadDashboard();
      this.isDashboardRefreshing = false;
      this.snackBar.open('Dashboard refreshed', 'Close', { duration: 2000 });
    }, 900);
  }

  trendFor(key: keyof DashboardStats): StatTrend {
    return this.statTrends[key];
  }

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
  }

  setTab(index: number): void {
    this.activeTab = index;
    this.recalculateActiveFilters();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardShortcut(event: KeyboardEvent): void {
    if (!event.altKey) {
      return;
    }
    const num = Number(event.key);
    if (num >= 1 && num <= this.tabTitles.length) {
      event.preventDefault();
      this.setTab(num - 1);
    }
  }

  logout(): void {
    this.snackBar.open('Logged out', 'Close', { duration: 2000 });
  }

  unreadNotificationCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  markAllNotificationsRead(): void {
    this.notifications = this.notifications.map(n => ({ ...n, read: true }));
  }

  onUserSearchInput(value: string): void {
    this.userSearch = value;
    this.userSearch$.next(value);
  }

  onUserSearch(): void {
    this.usersPageIndex = 0;
    this.recalculateActiveFilters();
  }

  onUserPage(event: PageEvent): void {
    this.usersPageIndex = event.pageIndex;
    this.usersPageSize = event.pageSize;
  }

  toggleUserStatus(user: UserRow): void {
    user.active = user.active === false ? true : false;
    this.snackBar.open(
      `${user.firstName} ${user.lastName} is now ${user.active ? 'active' : 'inactive'}`,
      'Close',
      { duration: 2500 }
    );
  }

  viewUserPGs(user: UserRow): void {
    this.snackBar.open(`Showing PGs owned by ${user.firstName} ${user.lastName}`, 'Close', { duration: 2500 });
  }

  onPgFilter(): void {
    this.pgsPageIndex = 0;
    this.recalculateActiveFilters();
  }

  onPgPage(event: PageEvent): void {
    this.pgsPageIndex = event.pageIndex;
    this.pgsPageSize = event.pageSize;
  }

  verifyPg(pg: PgRow): void {
    pg.verified = true;
    this.snackBar.open(`${pg.pgName} marked as verified`, 'Close', { duration: 2500 });
  }

  deletePg(pg: PgRow): void {
    this.pgs = this.pgs.filter(p => p.id !== pg.id);
    this.pgsTotal = this.pgs.length;
    this.snackBar.open(`${pg.pgName} removed`, 'Close', { duration: 2500 });
  }

  onInquiryFilter(): void {
    this.inquiriesPageIndex = 0;
    this.recalculateActiveFilters();
  }

  onInquiryPage(event: PageEvent): void {
    this.inquiriesPageIndex = event.pageIndex;
    this.inquiriesPageSize = event.pageSize;
  }

  exportInquiries(): void {
    const header = ['ID', 'Name', 'Email', 'Phone', 'Location', 'Type', 'Message'];
    const rows = this.inquiries.map(i => [
      String(i.inquiryId ?? i.id ?? ''),
      i.fullName,
      i.email,
      i.phone,
      i.location,
      i.inquiryType || 'GENERAL',
      (i.message || '').replace(/,/g, ';')
    ]);
    const csvContent = [header, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `crib-inquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    this.snackBar.open('Inquiries exported as CSV', 'Close', { duration: 2500 });
  }

  saveSettings(): void {
    this.snackBar.open('Settings saved', 'Close', { duration: 2500 });
  }

  broadcastAnnouncement(): void {
    if (!this.announcementTitle.trim() || !this.announcementMessage.trim()) {
      this.snackBar.open('Please fill in the announcement title and message', 'Close', { duration: 3000 });
      return;
    }
    this.snackBar.open(`Announcement sent to ${this.announcementTarget.replace('_', ' ').toLowerCase()}`, 'Close', { duration: 3000 });
    this.announcementTitle = '';
    this.announcementMessage = '';
  }

  private recalculateActiveFilters(): void {
    let count = 0;
    if (this.activeTab === 1) {
      if (this.userSearch) count++;
      if (this.userRoleFilter) count++;
    } else if (this.activeTab === 2) {
      if (this.pgCityFilter) count++;
      if (this.pgOccupancyFilter) count++;
      if (this.pgActiveFilter) count++;
    } else if (this.activeTab === 3) {
      if (this.inquirySearch) count++;
      if (this.inquiryLocationFilter) count++;
      if (this.inquiryTypeFilter) count++;
    }
    this.activeFilterCount = count;
  }

  clearFilters(): void {
    if (this.activeTab === 1) {
      this.userSearch = '';
      this.userRoleFilter = '';
      this.onUserSearch();
    } else if (this.activeTab === 2) {
      this.pgCityFilter = '';
      this.pgOccupancyFilter = '';
      this.pgActiveFilter = '';
      this.onPgFilter();
    } else if (this.activeTab === 3) {
      this.inquirySearch = '';
      this.inquiryLocationFilter = '';
      this.inquiryTypeFilter = '';
      this.onInquiryFilter();
    }
  }
}
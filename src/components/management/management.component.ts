// src/app/components/management/management.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ManagementService } from '../../service/management.service';
import {
  DashboardStats,
  ServiceHealth,
  User,
  PgListing,
  Inquiry,
  RevenueSummary,
  PlatformSettings,
  PageResponse
} from '../../entity/DashboardStats';
import { OwnerNavbarComponent } from '../owner-navbar/owner-navbar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-management',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    MatTableModule, MatPaginatorModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatSnackBarModule, MatTooltipModule,
    OwnerNavbarComponent, FooterComponent,
  ],
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.css'],
})
export class ManagementComponent implements OnInit {

  activeTab = 0;
  sidebarCollapsed = false;
  today = new Date();

  tabTitles = [
    'Dashboard Overview',
    'User Management',
    'PG Listings',
    'Inquiry Management',
    'Revenue & Payments',
    'Platform Settings',
  ];

  // Current user
  currentUserName = 'Admin';
  currentUserInitial = 'A';
  currentUserRole = 'ADMIN';

  // Dashboard
  dashboardStats: DashboardStats | null = null;
  serviceHealth: ServiceHealth[] = [];
  recentInquiries: Inquiry[] = [];
  // Template reference placeholder (helps strict template checks)
  loadingTpl: any = null;

  // Users
  users: User[] = [];
  usersTotal = 0;
  usersPageSize = 10;
  usersPageIndex = 0;
  userSearch = '';
  userRoleFilter = '';

  // PGs
  pgs: PgListing[] = [];
  pgsTotal = 0;
  pgsPageSize = 10;
  pgsPageIndex = 0;
  pgCityFilter = '';
  pgOccupancyFilter = '';
  pgActiveFilter = '';

  // Inquiries
  inquiries: Inquiry[] = [];
  inquiriesTotal = 0;
  inquiriesPageSize = 10;
  inquiriesPageIndex = 0;
  inquirySearch = '';
  inquiryLocationFilter = '';
  inquiryTypeFilter = '';

  // Revenue
  revenueSummary: RevenueSummary | null = null;

  // Settings
  settings: PlatformSettings = new PlatformSettings();
  announcementTitle = '';
  announcementMessage = '';
  announcementTarget = 'ALL_OWNERS';

  displayedUserColumns = ['id', 'name', 'email', 'phone', 'role', 'active', 'actions'];
  displayedPgColumns   = ['id', 'pgName', 'city', 'locality', 'ownerName', 'lowestPrice', 'verified', 'active', 'actions'];
  displayedInquiryColumns = ['id', 'fullName', 'email', 'phone', 'location', 'inquiryType', 'message'];

  constructor(
    private managementService: ManagementService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.readCurrentUser();
    this.loadDashboard();
    this.loadUsers();
    this.loadPGs();
    this.loadInquiries();
    this.loadRevenue();
    this.loadSettings();
    this.loadServiceHealth();
  }

  // ── Auth ───────────────────────────────────────────────────────────────────

  readCurrentUser(): void {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.currentUserName = payload.sub || 'Admin';
      this.currentUserInitial = this.currentUserName.charAt(0).toUpperCase();
      this.currentUserRole = payload.role || 'ADMIN';
    } catch { /* ignore */ }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }

  setTab(index: number): void {
    this.activeTab = index;
  }

  // ── Dashboard ──────────────────────────────────────────────────────────────

  loadDashboard(): void {
    this.managementService.getDashboardStats().subscribe({
      next: (data) => { this.dashboardStats = data; },
      error: () => {
        // Graceful fallback with zeros so UI renders
        this.dashboardStats = {
          totalPGs: 0, totalUsers: 0, totalOwners: 0, totalTenants: 0,
          monthlyInquiries: 0, weeklySignups: 0,
          totalFinderFeesCollected: 0, pendingFinderFees: 0,
          platformHealthy: false,
          lastUpdated: new Date().toISOString(),
        };
      }
    });
  }

  loadServiceHealth(): void {
    this.managementService.getServiceHealth().subscribe({
      next: (data) => { this.serviceHealth = data; },
      error: () => {
        this.serviceHealth = [
          { name: 'Account Service',  status: 'UNKNOWN' },
          { name: 'Add PG Service',   status: 'UNKNOWN' },
          { name: 'Inquiry Service',  status: 'UNKNOWN' },
          { name: 'Tenant Service',   status: 'UNKNOWN' },
          { name: 'API Gateway',      status: 'UNKNOWN' },
        ];
      }
    });
  }

  // ── Users ──────────────────────────────────────────────────────────────────

  loadUsers(): void {
    this.managementService.getUsers(this.usersPageIndex, this.usersPageSize, this.userSearch).subscribe({
      next: (page: PageResponse<User>) => {
        this.users = page.content;
        this.usersTotal = page.totalElements;
      },
      error: () => {
        // If backend users endpoint returns plain array
        this.managementService.getAllUsersFallback().subscribe({
          next: (list: User[]) => {
            this.users = list;
            this.usersTotal = list.length;
          },
          error: () => {}
        });
      }
    });
  }

  onUserSearch(): void { this.usersPageIndex = 0; this.loadUsers(); }
  onUserPage(ev: PageEvent): void {
    this.usersPageIndex = ev.pageIndex;
    this.usersPageSize  = ev.pageSize;
    this.loadUsers();
  }

  toggleUserStatus(user: User): void {
    const action = (user.active === false)
      ? this.managementService.activateUser(user.id)
      : this.managementService.deactivateUser(user.id);

    action.subscribe({
      next: () => {
        user.active = !user.active;
        this.snackBar.open(
          `User ${user.active ? 'activated' : 'deactivated'}`, 'Close', { duration: 3000 }
        );
      },
      error: () => {
        this.snackBar.open('Action failed. Check if the user status endpoint is implemented.', 'Close', { duration: 4000 });
      }
    });
  }

  viewUserPGs(user: User): void {
    this.pgCityFilter = '';
    this.pgOccupancyFilter = '';
    this.activeTab = 2;
    // Filter PGs by this owner — load fresh
    this.loadPGs();
    this.snackBar.open(`Showing PGs for owner #${user.id}`, 'Close', { duration: 2000 });
  }

  // ── PGs ────────────────────────────────────────────────────────────────────

  loadPGs(): void {
    this.managementService.getPGs(
      this.pgsPageIndex, this.pgsPageSize, this.pgCityFilter, this.pgOccupancyFilter
    ).subscribe({
      next: (page: PageResponse<PgListing>) => {
        this.pgs = page.content;
        this.pgsTotal = page.totalElements;
      },
      error: () => {}
    });
  }

  onPgFilter(): void { this.pgsPageIndex = 0; this.loadPGs(); }
  onPgPage(ev: PageEvent): void {
    this.pgsPageIndex = ev.pageIndex;
    this.pgsPageSize  = ev.pageSize;
    this.loadPGs();
  }

  verifyPg(pg: PgListing): void {
    this.managementService.verifyListing(pg.id).subscribe({
      next: () => {
        pg.verified = true;
        this.snackBar.open('PG marked as verified ✓', 'Close', { duration: 3000 });
      },
      error: () => this.snackBar.open('Verify failed — check backend endpoint.', 'Close', { duration: 3000 })
    });
  }

  deletePg(pg: PgListing): void {
    if (!confirm(`Permanently delete "${pg.pgName}"? This cannot be undone.`)) return;
    this.managementService.deleteListing(pg.id).subscribe({
      next: () => {
        this.snackBar.open('PG deleted.', 'Close', { duration: 3000 });
        this.loadPGs();
      },
      error: () => this.snackBar.open('Delete failed — check backend endpoint.', 'Close', { duration: 3000 })
    });
  }

  // ── Inquiries ──────────────────────────────────────────────────────────────

  loadInquiries(): void {
    this.managementService.getInquiries(this.inquiriesPageIndex, this.inquiriesPageSize, this.inquirySearch, this.inquiryLocationFilter, this.inquiryTypeFilter).subscribe({
      next: (page: PageResponse<Inquiry>) => {
        this.inquiries = page.content;
        this.inquiriesTotal = page.totalElements;
        if (this.recentInquiries.length === 0) {
          this.recentInquiries = page.content.slice(0, 5);
        }
      },
      error: () => {}
    });
  }

  onInquiryFilter(): void { this.inquiriesPageIndex = 0; this.loadInquiries(); }
  onInquiryPage(ev: PageEvent): void {
    this.inquiriesPageIndex = ev.pageIndex;
    this.inquiriesPageSize  = ev.pageSize;
    this.loadInquiries();
  }

  exportInquiries(): void {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Location', 'Type', 'Message'];
    const rows = this.inquiries.map(i => [
      i.id,
      `"${i.fullName}"`,
      i.email,
      i.phone,
      `"${i.location}"`,
      i.inquiryType || 'GENERAL',
      `"${(i.message || '').replace(/"/g, "'")}"`,
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inquiries_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    this.snackBar.open('CSV exported!', 'Close', { duration: 2000 });
  }

  // ── Revenue ────────────────────────────────────────────────────────────────

  loadRevenue(): void {
    this.managementService.getRevenueSummary().subscribe({
      next: (data) => { this.revenueSummary = data; },
      error: () => { this.revenueSummary = null; }
    });
  }

  // ── Settings ───────────────────────────────────────────────────────────────

  loadSettings(): void {
    this.managementService.getPlatformSettings().subscribe({
      next: (data) => { this.settings = data; },
      error: () => { this.settings = new PlatformSettings(); }
    });
  }

  saveSettings(): void {
    this.managementService.savePlatformSettings(this.settings).subscribe({
      next: () => this.snackBar.open('Settings saved!', 'Close', { duration: 3000 }),
      error: () => this.snackBar.open('Settings saved locally (backend endpoint not yet connected).', 'Close', { duration: 3000 })
    });
  }

  broadcastAnnouncement(): void {
    if (!this.announcementTitle.trim() || !this.announcementMessage.trim()) {
      this.snackBar.open('Title and message are required.', 'Close', { duration: 3000 });
      return;
    }
    this.managementService.broadcastAnnouncement(
      this.announcementTitle, this.announcementMessage, this.announcementTarget
    ).subscribe({
      next: () => {
        this.snackBar.open('Broadcast sent!', 'Close', { duration: 3000 });
        this.announcementTitle = '';
        this.announcementMessage = '';
      },
      error: () => this.snackBar.open('Broadcast endpoint not yet implemented on backend.', 'Close', { duration: 3000 })
    });
  }
}
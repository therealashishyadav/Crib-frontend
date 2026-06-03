// src/app/management/management.component.ts
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Chart, registerables } from 'chart.js';
import { ManagementService } from '../../service/management.service';
import {
  DashboardStats,
  User,
  PgListing,
  Inquiry,
  RevenueSummary,
  ChartData,
  PlatformSettings,
  PageResponse
} from '../../entity/DashboardStats';
import { OwnerNavbarComponent } from '../owner-navbar/owner-navbar.component';
import { FooterComponent } from '../footer/footer.component';

Chart.register(...registerables);

@Component({
  selector: 'app-management',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    MatTabsModule, MatTableModule, MatPaginatorModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule,
    MatIconModule, MatCardModule, MatChipsModule, MatProgressSpinnerModule,
    MatSnackBarModule, MatTooltipModule,
    OwnerNavbarComponent, FooterComponent
  ],
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.css']
})
export class ManagementComponent implements OnInit, AfterViewInit {
  @ViewChild('cityChart') cityChartCanvas!: ElementRef;
  @ViewChild('growthChart') growthChartCanvas!: ElementRef;

  activeTab = 0;
  isLoading = true;

  dashboardStats: DashboardStats | null = null;

  users: User[] = [];
  usersTotal = 0;
  usersPageSize = 10;
  usersPageIndex = 0;
  userSearch = '';

  pgs: PgListing[] = [];
  pgsTotal = 0;
  pgsPageSize = 10;
  pgsPageIndex = 0;
  pgCityFilter = '';
  pgOccupancyFilter = '';

  inquiries: Inquiry[] = [];
  inquiriesTotal = 0;
  inquiriesPageSize = 10;
  inquiriesPageIndex = 0;
  inquirySearch = '';
  inquiryLocationFilter = '';
  inquiryTypeFilter = '';

  revenueSummary: RevenueSummary | null = null;
  settings: PlatformSettings = new PlatformSettings();
  announcementTitle = '';
  announcementMessage = '';

  displayedUserColumns = ['id', 'name', 'email', 'phone', 'role', 'active', 'createdAt', 'actions'];
  displayedPgColumns = ['id', 'pgName', 'city', 'locality', 'ownerName', 'verified', 'active', 'lowestPrice', 'inquiries', 'actions'];
  displayedInquiryColumns = ['id', 'fullName', 'email', 'phone', 'location', 'inquiryType', 'message', 'createdAt'];

  constructor(
    private managementService: ManagementService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
    this.loadUsers();
    this.loadPGs();
    this.loadInquiries();
    this.loadRevenue();
    this.loadSettings();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.drawCityChart();
      this.drawGrowthChart();
    }, 500);
  }

  loadDashboard(): void {
    this.managementService.getDashboardStats().subscribe({
      next: (data: DashboardStats) => { this.dashboardStats = data; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  loadUsers(): void {
    this.managementService.getUsers(this.usersPageIndex, this.usersPageSize, this.userSearch).subscribe({
      next: (page: PageResponse<User>) => { this.users = page.content; this.usersTotal = page.totalElements; }
    });
  }

  onUserSearch(): void { this.usersPageIndex = 0; this.loadUsers(); }
  onUserPage(event: PageEvent): void { this.usersPageIndex = event.pageIndex; this.usersPageSize = event.pageSize; this.loadUsers(); }

  toggleUserStatus(user: User): void {
    const action = user.active ? this.managementService.deactivateUser(user.id) : this.managementService.activateUser(user.id);
    action.subscribe({
      next: () => { user.active = !user.active; this.snackBar.open(`User ${user.active ? 'activated' : 'deactivated'}`, 'Close', { duration: 3000 }); }
    });
  }

  loadPGs(): void {
    this.managementService.getPGs(this.pgsPageIndex, this.pgsPageSize, this.pgCityFilter, this.pgOccupancyFilter).subscribe({
      next: (page: PageResponse<PgListing>) => { this.pgs = page.content; this.pgsTotal = page.totalElements; this.drawCityChart(); }
    });
  }

  onPgFilter(): void { this.pgsPageIndex = 0; this.loadPGs(); }
  onPgPage(event: PageEvent): void { this.pgsPageIndex = event.pageIndex; this.pgsPageSize = event.pageSize; this.loadPGs(); }

  verifyPg(pg: PgListing): void {
    this.managementService.verifyListing(pg.id).subscribe({
      next: () => { pg.verified = true; this.snackBar.open('PG verified', 'Close', { duration: 3000 }); }
    });
  }

  deletePg(pg: PgListing): void {
    if (confirm(`Delete "${pg.pgName}"? This cannot be undone.`)) {
      this.managementService.deleteListing(pg.id).subscribe({
        next: () => { this.loadPGs(); this.snackBar.open('PG deleted', 'Close', { duration: 3000 }); }
      });
    }
  }

  loadInquiries(): void {
    this.managementService.getInquiries(this.inquiriesPageIndex, this.inquiriesPageSize, this.inquirySearch, this.inquiryLocationFilter, this.inquiryTypeFilter).subscribe({
      next: (page: PageResponse<Inquiry>) => { this.inquiries = page.content; this.inquiriesTotal = page.totalElements; }
    });
  }

  onInquiryFilter(): void { this.inquiriesPageIndex = 0; this.loadInquiries(); }
  onInquiryPage(event: PageEvent): void { this.inquiriesPageIndex = event.pageIndex; this.inquiriesPageSize = event.pageSize; this.loadInquiries(); }

  exportInquiries(): void {
    this.managementService.exportInquiriesCsv().subscribe({
      next: (csv: string) => {
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'inquiries.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      }
    });
  }

  loadRevenue(): void {
    this.managementService.getRevenueSummary().subscribe({
      next: (data: RevenueSummary) => this.revenueSummary = data
    });
  }

  loadSettings(): void {
    this.managementService.getPlatformSettings().subscribe({
      next: (data: PlatformSettings) => this.settings = data
    });
  }

  saveSettings(): void {
    this.managementService.updatePlatformSettings(this.settings).subscribe({
      next: () => this.snackBar.open('Settings saved', 'Close', { duration: 3000 })
    });
  }

  broadcastAnnouncement(): void {
    this.managementService.broadcastAnnouncement({ announcementTitle: this.announcementTitle, announcementMessage: this.announcementMessage }).subscribe({
      next: () => {
        this.snackBar.open('Announcement sent to all owners', 'Close', { duration: 3000 });
        this.announcementTitle = '';
        this.announcementMessage = '';
      }
    });
  }

  drawCityChart(): void {
    if (this.cityChartCanvas && this.pgs.length) {
      const cityCount = new Map<string, number>();
      this.pgs.forEach(pg => cityCount.set(pg.city, (cityCount.get(pg.city) || 0) + 1));
      const labels = Array.from(cityCount.keys());
      const data = Array.from(cityCount.values());
      new Chart(this.cityChartCanvas.nativeElement, {
        type: 'bar',
        data: { labels, datasets: [{ label: 'PGs per City', data, backgroundColor: '#4A90E2' }] },
        options: { responsive: true, maintainAspectRatio: false }
      });
    }
  }

  drawGrowthChart(): void {
    if (this.growthChartCanvas) {
      this.managementService.getMonthlyGrowth().subscribe({
        next: (growthData: ChartData[]) => {
          new Chart(this.growthChartCanvas.nativeElement, {
            type: 'line',
            data: {
              labels: growthData.map(d => d.label),
              datasets: [{ label: 'New Signups', data: growthData.map(d => d.value), borderColor: '#C9A96E', fill: false, tension: 0.3 }]
            },
            options: { responsive: true, maintainAspectRatio: false }
          });
        }
      });
    }
  }
}
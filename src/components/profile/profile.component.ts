import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { first } from 'rxjs/operators';

import { AccountService } from '../../service/account.service';
import { LoginService } from '../../service/login.service';
import { InquiryService } from '../../service/inquiry.service';
import { PgService } from '../../service/pg.service';
import { Account } from '../../entity/Account';
import { Inquiry } from '../../entity/Inquiry';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatChipsModule,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  // ── User Data ────────────────────────────────────────────────────────
  user: Account | null = null;
  editUser: Account = new Account();
  editMode = false;
  loading = true;
  error = '';
  isOwner = false;

  // ── Inquiries (sent by user) ──────────────────────────────────────
  inquiries: any[] = [];
  filteredInquiries: any[] = [];
  inquiryStatusFilter = 'all';
  inquirySearch = '';

  // ── Owner Dashboard ──────────────────────────────────────────────
  ownerPGs: any[] = [];
  ownerStats = {
    totalPGs: 0,
    totalTenants: 0,
    totalInquiries: 0,
    monthlyRevenue: 0,
  };
  receivedInquiries: any[] = [];
  filteredReceivedInquiries: any[] = [];
  receivedInquiryFilter = 'all';
  receivedInquirySearch = '';

  // ── Password Change ──────────────────────────────────────────────
  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };
  showPassword = false;

  constructor(
    private accountService: AccountService,
    private loginService: LoginService,
    private inquiryService: InquiryService,
    private pgService: PgService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProfile();
    this.loadInquiries();
  }

  // ── Load Profile ──────────────────────────────────────────────────
  loadProfile(): void {
    this.loading = true;
    this.loginService.currentUser().pipe(first()).subscribe({
      next: (data) => {
        this.user = data;
        // ✅ Fix: Properly initialize editUser as a full Account instance
        this.editUser = new Account();
        Object.assign(this.editUser, this.user);
        this.isOwner = data.role === 'OWNER';
        this.loading = false;
        if (this.isOwner) {
          this.loadOwnerData();
          this.loadReceivedInquiries();
        }
      },
      error: () => {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            this.user = {
              id: payload.id || 0,
              firstName: payload.firstName || 'User',
              lastName: payload.lastName || '',
              email: payload.sub || '',
              phone: payload.phone || '',
              role: payload.role || 'USER',
              active: true,
            } as Account;
            // ✅ Fix: Properly initialize editUser
            this.editUser = new Account();
            Object.assign(this.editUser, this.user);
            this.isOwner = this.user.role === 'OWNER';
            this.loading = false;
            if (this.isOwner) {
              this.loadOwnerData();
              this.loadReceivedInquiries();
            }
          } catch (e) {
            this.error = 'Unable to load profile. Please try again.';
            this.loading = false;
          }
        } else {
          this.error = 'You are not logged in.';
          this.loading = false;
        }
      },
    });
  }

  // ── Owner Methods ──────────────────────────────────────────────────
  loadOwnerData(): void {
    if (!this.user) return;
    this.pgService.getMyPGs().pipe(first()).subscribe({
      next: (pgs) => {
        this.ownerPGs = pgs;
        this.ownerStats.totalPGs = pgs.length;
        this.ownerStats.totalTenants = pgs.reduce((acc, pg) => acc + (pg.tenantCount || 0), 0);
        this.ownerStats.totalInquiries = pgs.reduce((acc, pg) => acc + (pg.inquiryCount || 0), 0);
        this.ownerStats.monthlyRevenue = pgs.reduce((acc, pg) => acc + (pg.monthlyRevenue || 0), 0);
      },
      error: () => {
        // Mock data for UI preview
        this.ownerPGs = [
          {
            id: 1,
            pgName: 'Zolo PG Viman Nagar',
            locality: 'Viman Nagar',
            city: 'Pune',
            coverImageUrl: '',
            active: true,
            lowestPrice: 8500,
            tenantCount: 8,
            inquiryCount: 5,
            monthlyRevenue: 68000,
          },
          {
            id: 2,
            pgName: 'Cosy PG Hinjawadi',
            locality: 'Hinjawadi',
            city: 'Pune',
            coverImageUrl: '',
            active: true,
            lowestPrice: 7000,
            tenantCount: 6,
            inquiryCount: 3,
            monthlyRevenue: 42000,
          },
        ];
        this.ownerStats.totalPGs = this.ownerPGs.length;
        this.ownerStats.totalTenants = 14;
        this.ownerStats.totalInquiries = 8;
        this.ownerStats.monthlyRevenue = 110000;
      },
    });
  }

  loadReceivedInquiries(): void {
    // Mock data for received inquiries
    this.receivedInquiries = [
      {
        id: 1,
        fullName: 'Rahul Sharma',
        email: 'rahul@example.com',
        phone: '9876543210',
        message: 'Is this PG available for immediate move-in?',
        pgName: 'Zolo PG Viman Nagar',
        status: 'pending',
        createdAt: new Date('2026-07-15T10:30:00Z'),
      },
      {
        id: 2,
        fullName: 'Priya Patel',
        email: 'priya@example.com',
        phone: '9876543211',
        message: 'Do you offer vegetarian meals?',
        pgName: 'Cosy PG Hinjawadi',
        status: 'responded',
        createdAt: new Date('2026-07-14T16:45:00Z'),
      },
    ];
    this.filteredReceivedInquiries = [...this.receivedInquiries];
  }

  editPG(pg: any): void {
    this.router.navigate(['/edit-pg', pg.id]);
  }

  deletePG(pg: any): void {
    if (confirm(`Delete "${pg.pgName}"? This cannot be undone.`)) {
      this.pgService.deletePG(pg.id).pipe(first()).subscribe({
        next: () => {
          this.ownerPGs = this.ownerPGs.filter((p) => p.id !== pg.id);
          this.ownerStats.totalPGs = this.ownerPGs.length;
          this.snackBar.open('PG deleted successfully.', 'Close', { duration: 3000 });
        },
        error: () => {
          this.snackBar.open('Failed to delete PG.', 'Close', { duration: 3000 });
        },
      });
    }
  }

  filterReceivedInquiries(): void {
    this.filteredReceivedInquiries = this.receivedInquiries.filter((inq) => {
      const matchStatus =
        this.receivedInquiryFilter === 'all' || inq.status === this.receivedInquiryFilter;
      const matchSearch =
        !this.receivedInquirySearch ||
        (inq.fullName || '').toLowerCase().includes(
          this.receivedInquirySearch.toLowerCase()
        ) ||
        (inq.pgName || '').toLowerCase().includes(
          this.receivedInquirySearch.toLowerCase()
        );
      return matchStatus && matchSearch;
    });
  }

  respondToInquiry(inq: any): void {
    this.snackBar.open('Respond feature coming soon.', 'Close', { duration: 2000 });
  }

  deleteReceivedInquiry(inq: any): void {
    if (confirm(`Delete this inquiry?`)) {
      this.receivedInquiries = this.receivedInquiries.filter((i) => i.id !== inq.id);
      this.filteredReceivedInquiries = [...this.receivedInquiries];
      this.snackBar.open('Inquiry deleted.', 'Close', { duration: 2000 });
    }
  }

  // ── Edit Profile ──────────────────────────────────────────────────
  toggleEdit(): void {
    if (this.editMode) {
      // Cancel editing: reset to original user data
      this.editUser = new Account();
      Object.assign(this.editUser, this.user);
    }
    this.editMode = !this.editMode;
  }

  updateProfile(): void {
    this.accountService.updateUser(this.editUser).pipe(first()).subscribe({
      next: (updated) => {
        this.user = updated;
        // ✅ Fix: Properly initialize editUser with updated data
        this.editUser = new Account();
        Object.assign(this.editUser, updated);
        this.editMode = false;
        this.snackBar.open('Profile updated successfully!', 'Close', { duration: 3000 });
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Failed to update profile. Please try again.', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  // ── Inquiries ──────────────────────────────────────────────────────
  loadInquiries(): void {
    this.inquiries = [
      {
        id: 1,
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '9876543212',
        message: 'Is this PG pet-friendly?',
        pgName: 'Sunshine PG',
        status: 'pending',
        createdAt: new Date('2026-07-16T08:00:00Z'),
      },
    ];
    this.filteredInquiries = [...this.inquiries];
  }

  filterInquiries(): void {
    this.filteredInquiries = this.inquiries.filter((inq) => {
      const matchStatus =
        this.inquiryStatusFilter === 'all' || inq.status === this.inquiryStatusFilter;
      const matchSearch =
        !this.inquirySearch ||
        (inq.pgName || '').toLowerCase().includes(
          this.inquirySearch.toLowerCase()
        );
      return matchStatus && matchSearch;
    });
  }

  deleteInquiry(inq: any): void {
    if (confirm(`Delete this inquiry?`)) {
      this.inquiries = this.inquiries.filter((i) => i.id !== inq.id);
      this.filteredInquiries = [...this.inquiries];
      this.snackBar.open('Inquiry deleted.', 'Close', { duration: 2000 });
    }
  }

  onTabChange(event: any): void {
    if (event.index === 1) this.loadInquiries();
    if (event.index === 2 && this.isOwner) {
      this.loadOwnerData();
      this.loadReceivedInquiries();
    }
    if (event.index === 3 && this.isOwner) {
      this.loadReceivedInquiries();
    }
  }

  // ── Account Settings ──────────────────────────────────────────────
  changePassword(): void {
    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.snackBar.open('Passwords do not match.', 'Close', { duration: 3000 });
      return;
    }
    this.accountService.changePassword(this.passwordData).pipe(first()).subscribe({
      next: () => {
        this.snackBar.open('Password changed successfully!', 'Close', { duration: 3000 });
        this.passwordData = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        };
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open(
          'Failed to change password. Check your current password.',
          'Close',
          { duration: 3000 }
        );
      },
    });
  }

  deactivateAccount(): void {
    if (
      confirm(
        'Are you sure you want to deactivate your account? You can reactivate later.'
      )
    ) {
      this.accountService.deactivateAccount().pipe(first()).subscribe({
        next: () => {
          this.snackBar.open('Account deactivated.', 'Close', { duration: 3000 });
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open('Failed to deactivate account.', 'Close', {
            duration: 3000,
          });
        },
      });
    }
  }

  uploadPhoto(): void {
    this.snackBar.open('Photo upload coming soon.', 'Close', { duration: 2000 });
  }

  // ── Reset form helper (optional) ──────────────────────────────────
  resetEditForm(): void {
    this.editUser = new Account();
    if (this.user) {
      Object.assign(this.editUser, this.user);
    }
    this.editMode = false;
  }
}
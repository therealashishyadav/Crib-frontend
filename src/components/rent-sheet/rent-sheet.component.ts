import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NavbarComponent } from '../navbar/navbar.component';
import { TenantService } from '../../service/tenant.service';
import { RentRecord } from '../../entity/Tenant';

@Component({
  selector: 'app-rent-sheet',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    MatButtonModule, MatIconModule, MatSelectModule,
    MatFormFieldModule, MatSnackBarModule, MatTooltipModule,
    NavbarComponent
  ],
  templateUrl: './rent-sheet.component.html',
  styleUrls: ['./rent-sheet.component.css']
})
export class RentSheetComponent implements OnInit {

  records: RentRecord[] = [];
  isLoading = false;

  // Current selected month/year
  selectedYear: number = new Date().getFullYear();
  selectedMonth: number = new Date().getMonth() + 1; // 1-12

  // Past months that have records
  pastMonths: { year: number; month: number }[] = [];

  // Summary stats
  get totalTenants(): number { return this.records.length; }
  get paidCount(): number { return this.records.filter(r => r.paid).length; }
  get pendingCount(): number { return this.records.filter(r => !r.paid).length; }
  get totalCollected(): number {
    return this.records.filter(r => r.paid).reduce((s, r) => s + (r.amountDue ?? 0), 0);
  }
  get totalPending(): number {
    return this.records.filter(r => !r.paid).reduce((s, r) => s + (r.amountDue ?? 0), 0);
  }

  readonly months = [
    { value: 1, label: 'January' }, { value: 2, label: 'February' },
    { value: 3, label: 'March' },   { value: 4, label: 'April' },
    { value: 5, label: 'May' },     { value: 6, label: 'June' },
    { value: 7, label: 'July' },    { value: 8, label: 'August' },
    { value: 9, label: 'September' },{ value: 10, label: 'October' },
    { value: 11, label: 'November' },{ value: 12, label: 'December' },
  ];

  readonly years = [
    new Date().getFullYear(),
    new Date().getFullYear() - 1,
    new Date().getFullYear() - 2
  ];

  constructor(
    private tenantService: TenantService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadSheet();
    this.tenantService.getPastMonths().subscribe({
      next: (data) => this.pastMonths = data
    });
  }

  loadSheet(): void {
    this.isLoading = true;
    this.tenantService.getRentSheet(this.selectedYear, this.selectedMonth).subscribe({
      next: (data) => { this.records = data; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  onMonthChange(): void {
    this.loadSheet();
  }

  // Toggle paid/unpaid with a single click
  togglePayment(record: RentRecord): void {
    this.tenantService.togglePayment(record.id!, undefined).subscribe({
      next: (updated) => {
        const idx = this.records.findIndex(r => r.id === updated.id);
        if (idx > -1) this.records[idx] = updated;
        const msg = updated.paid
          ? `✓ ${record.tenant?.fullName} marked as PAID`
          : `${record.tenant?.fullName} marked as PENDING`;
        this.snackBar.open(msg, 'Close', { duration: 2500 });
      }
    });
  }

  // Send WhatsApp reminder to unpaid tenants
  sendReminder(record: RentRecord): void {
    const phone = record.tenant?.phone?.replace(/\D/g, '') ?? '';
    const countryCode = phone.startsWith('91') ? phone : `91${phone}`;
    const monthName = this.months.find(m => m.value === this.selectedMonth)?.label;
    const message = encodeURIComponent(
      `Hi ${record.tenant?.fullName}, this is a gentle reminder from your PG owner. ` +
      `Your rent of ₹${record.amountDue} for ${monthName} ${this.selectedYear} ` +
      `(Room ${record.tenant?.roomNumber}) is still pending. ` +
      `Please arrange payment at the earliest. Thank you! 🙏`
    );
    window.open(`https://wa.me/${countryCode}?text=${message}`, '_blank');
  }

  // Send reminders to ALL pending tenants at once
  sendAllReminders(): void {
    const pending = this.records.filter(r => !r.paid);
    if (pending.length === 0) {
      this.snackBar.open('All tenants have paid! 🎉', 'Close', { duration: 3000 });
      return;
    }
    // Open WhatsApp for each pending tenant with a small delay
    pending.forEach((record, index) => {
      setTimeout(() => this.sendReminder(record), index * 800);
    });
    this.snackBar.open(
      `Opening WhatsApp for ${pending.length} pending tenant(s)...`,
      'Close', { duration: 3000 }
    );
  }

  getMonthLabel(month: number): string {
    return this.months.find(m => m.value === month)?.label ?? '';
  }
}
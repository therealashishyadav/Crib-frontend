import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { OwnerNavbarComponent } from '../owner-navbar/owner-navbar.component';
import { TenantService } from '../../service/tenant.service';
import { PgService } from '../../service/pg.service';          // <-- IMPORT PgService
import { Tenant } from '../../entity/Tenant';
import { MetaService } from '../../service/meta.service';

@Component({
  selector: 'app-tenant-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    MatButtonModule, MatIconModule,
    MatSnackBarModule, MatChipsModule,
    OwnerNavbarComponent, MatSelectModule, FormsModule
  ],
  templateUrl: './tenant-list.component.html',
  styleUrls: ['./tenant-list.component.css']
})
export class TenantListComponent implements OnInit {

  ownerPgs: any[] = [];
  selectedPgId: number | null = null;
  tenants: Tenant[] = [];
  isLoading = true;
  showInactive = false;

  constructor(
    private tenantService: TenantService,
    private pgService: PgService,           // <-- INJECT PgService
    private router: Router,
    private snackBar: MatSnackBar,
    private metaService: MetaService
  ) { }

  ngOnInit(): void {
    this.metaService.setPage(
      'Tenant Management - Manage Your Tenants',
      'View and manage all your tenants in one place. Track tenant information and PG assignments.',
      '',
      'https://cribup.vercel.app/tenant-list'
    );
    this.loadOwnerPgs();
    this.loadTenants();
  }

  loadTenants(): void {
    this.isLoading = true;
    let obs;
    if (this.selectedPgId) {
      obs = this.tenantService.getTenantsByPg(this.selectedPgId);
    } else {
      obs = this.showInactive
        ? this.tenantService.getAllTenants()
        : this.tenantService.getActiveTenants();
    }
    obs.subscribe({
      next: (data) => {
        this.tenants = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading tenants:', err);
        this.snackBar.open('Failed to load tenants', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  onPgFilter(): void {
    this.loadTenants();
  }

  // ---- FIXED: loadOwnerPgs with explicit 'any' type ----
  loadOwnerPgs(): void {
    this.pgService.getMyPGs().subscribe({
      next: (res: any) => {   // <-- FIX: explicit any type
        console.log('PGs response:', res);
        if (Array.isArray(res)) {
          this.ownerPgs = res;
        } else if (res && res.content) {
          this.ownerPgs = res.content;
        } else if (res && res.data) {
          this.ownerPgs = res.data;
        } else {
          this.ownerPgs = [];
        }
      },
      error: (err) => {
        console.error('Failed to load PGs:', err);
        this.snackBar.open('Could not load PG list', 'Close', { duration: 3000 });
      }
    });
  }

  toggleInactive(): void {
    this.showInactive = !this.showInactive;
    this.loadTenants();
  }

  editTenant(tenant: Tenant): void {
    this.router.navigate(['/owner/add-tenant'], { queryParams: { id: tenant.id } });
  }

  markMovedOut(tenant: Tenant): void {
    if (!confirm(`Mark ${tenant.fullName} as moved out?`)) return;
    this.tenantService.deactivateTenant(tenant.id!).subscribe({
      next: () => {
        this.snackBar.open('Tenant marked as moved out.', 'Close', { duration: 3000 });
        this.loadTenants();
      },
      error: () => {
        this.snackBar.open('Error updating tenant', 'Close', { duration: 3000 });
      }
    });
  }

  deleteTenant(tenant: Tenant): void {
    if (!confirm(`Are you sure you want to permanently delete ${tenant.fullName}? This action cannot be undone.`)) return;
    this.tenantService.hardDeleteTenant(tenant.id!).subscribe({
      next: () => {
        this.snackBar.open('Tenant permanently deleted.', 'Close', { duration: 3000 });
        this.loadTenants();
      },
      error: () => {
        this.snackBar.open('Error deleting tenant.', 'Close', { duration: 3000 });
      }
    });
  }

  sendWhatsApp(tenant: Tenant): void {
    const phone = tenant.phone.replace(/\D/g, '');
    const countryCode = phone.startsWith('91') ? phone : `91${phone}`;
    const message = encodeURIComponent(
      `Hi ${tenant.fullName}, this is a reminder from your PG owner. ` +
      `Your rent of ₹${tenant.monthlyRent} for Room ${tenant.roomNumber} is due. ` +
      `Please pay at your earliest convenience. Thank you!`
    );
    window.open(`https://wa.me/${countryCode}?text=${message}`, '_blank');
  }

  goToRentSheet(): void {
    this.router.navigate(['/owner/rent-sheet']);
  }
}
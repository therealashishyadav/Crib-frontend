import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { NavbarComponent } from '../navbar/navbar.component';
import { TenantService } from '../../service/tenant.service';
import { Tenant } from '../../entity/Tenant';
import { OwnerNavbarComponent } from '../owner-navbar/owner-navbar.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MetaService } from '../../service/meta.service';

@Component({
  selector: 'app-tenant-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    MatButtonModule, MatIconModule,
    MatSnackBarModule, MatChipsModule,
    OwnerNavbarComponent,MatSelectModule, FormsModule
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
    private router: Router,
    private snackBar: MatSnackBar,
    private http: HttpClient,
    private metaService: MetaService
  ) { }

  ngOnInit(): void {
    this.metaService.setPage(
      'Tenant Management - Manage Your Tenants',
      'View and manage all your tenants in one place. Track tenant information and PG assignments.',
      '',
      'https://cribup.vercel.app/tenant-list'
    );
    this.loadTenants();
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
    next: (data) => { this.tenants = data; this.isLoading = false; },
    error: () => { this.isLoading = false; }
  });
}

onPgFilter(): void {
  this.loadTenants();
}


  loadOwnerPgs(): void {
    const token = localStorage.getItem('token') ?? '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.http.get<any>(`${environment.apiUrl}/api/pg-listings/my`, { headers }).subscribe({
      next: (res) => {
        this.ownerPgs = Array.isArray(res) ? res : (res.content ?? []);
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
      }
    });
  }

  // NEW: Permanently delete tenant
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

  // Open WhatsApp with pre-filled message
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
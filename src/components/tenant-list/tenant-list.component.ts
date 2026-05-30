// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Router, RouterLink } from '@angular/router';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
// import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
// import { MatChipsModule } from '@angular/material/chips';
// import { NavbarComponent } from '../navbar/navbar.component';
// import { TenantService } from '../../service/tenant.service';
// import { Tenant } from '../../entity/Tenant';
// import { OwnerNavbarComponent } from '../owner-navbar/owner-navbar.component';

// @Component({
//   selector: 'app-tenant-list',
//   standalone: true,
//   imports: [
//     CommonModule, RouterLink,
//     MatButtonModule, MatIconModule,
//     MatSnackBarModule, MatChipsModule,
//     OwnerNavbarComponent,
//   ],
//   templateUrl: './tenant-list.component.html',
//   styleUrls: ['./tenant-list.component.css']
// })
// export class TenantListComponent implements OnInit {

//   tenants: Tenant[] = [];
//   isLoading = true;
//   showInactive = false;

//   constructor(
//     private tenantService: TenantService,
//     private router: Router,
//     private snackBar: MatSnackBar
//   ) {}

//   ngOnInit(): void {
//     this.loadTenants();
//   }

//   loadTenants(): void {
//     this.isLoading = true;
//     const obs = this.showInactive
//       ? this.tenantService.getAllTenants()
//       : this.tenantService.getActiveTenants();

//     obs.subscribe({
//       next: (data) => { this.tenants = data; this.isLoading = false; },
//       error: () => { this.isLoading = false; }
//     });
//   }

//   toggleInactive(): void {
//     this.showInactive = !this.showInactive;
//     this.loadTenants();
//   }

//   editTenant(tenant: Tenant): void {
//     this.router.navigate(['/owner/add-tenant'], { queryParams: { id: tenant.id } });
//   }

//   markMovedOut(tenant: Tenant): void {
//     if (!confirm(`Mark ${tenant.fullName} as moved out?`)) return;
//     this.tenantService.deactivateTenant(tenant.id!).subscribe({
//       next: () => {
//         this.snackBar.open('Tenant marked as moved out.', 'Close', { duration: 3000 });
//         this.loadTenants();
//       }
//     });
//   }

//   // Open WhatsApp with pre-filled message — completely free
//   sendWhatsApp(tenant: Tenant): void {
//     const phone = tenant.phone.replace(/\D/g, ''); // remove non-digits
//     const countryCode = phone.startsWith('91') ? phone : `91${phone}`;
//     const message = encodeURIComponent(
//       `Hi ${tenant.fullName}, this is a reminder from your PG owner. ` +
//       `Your rent of ₹${tenant.monthlyRent} for Room ${tenant.roomNumber} is due. ` +
//       `Please pay at your earliest convenience. Thank you!`
//     );
//     window.open(`https://wa.me/${countryCode}?text=${message}`, '_blank');
//   }

//   goToRentSheet(): void {
//     this.router.navigate(['/owner/rent-sheet']);
//   }
// }

// tenant.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Tenant } from '../entity/Tenant';
import { RentRecord } from '../entity/Tenant';

const BASE = environment.apiUrl + '/api/tenants';

@Injectable({ providedIn: 'root' })
export class TenantService {

  constructor(private http: HttpClient) {}

  private headers(): HttpHeaders {
    const token = localStorage.getItem('token') ?? '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  addTenant(tenant: Tenant): Observable<Tenant> {
    return this.http.post<Tenant>(BASE, tenant, { headers: this.headers() });
  }

  getActiveTenants(): Observable<Tenant[]> {
    return this.http.get<Tenant[]>(BASE, { headers: this.headers() });
  }

  getAllTenants(): Observable<Tenant[]> {
    return this.http.get<Tenant[]>(`${BASE}/all`, { headers: this.headers() });
  }

  updateTenant(id: number, tenant: Tenant): Observable<Tenant> {
    return this.http.put<Tenant>(`${BASE}/${id}`, tenant, { headers: this.headers() });
  }

  // Soft delete (set active = false)
  deactivateTenant(id: number): Observable<any> {
    return this.http.delete(`${BASE}/${id}`, { headers: this.headers() });
  }

  // NEW: Hard delete (permanently remove from database)
  hardDeleteTenant(id: number): Observable<any> {
    // Adjust the endpoint to match your Spring Boot hard delete URL
    // Example: @DeleteMapping("/{id}/hard")
    return this.http.delete(`${BASE}/${id}/hard`, { headers: this.headers() });
  }

  getRentSheet(year: number, month: number): Observable<RentRecord[]> {
    return this.http.get<RentRecord[]>(
      `${BASE}/rent-sheet?year=${year}&month=${month}`,
      { headers: this.headers() }
    );
  }

  togglePayment(recordId: number, note?: string): Observable<RentRecord> {
    return this.http.post<RentRecord>(
      `${BASE}/rent-sheet/${recordId}/toggle`,
      { note: note ?? '' },
      { headers: this.headers() }
    );
  }

  getPastMonths(): Observable<{ year: number; month: number }[]> {
    return this.http.get<any[]>(`${BASE}/past-months`, { headers: this.headers() });
  }

  getTenantHistory(tenantId: number): Observable<RentRecord[]> {
    return this.http.get<RentRecord[]>(`${BASE}/${tenantId}/history`, { headers: this.headers() });
  }
}
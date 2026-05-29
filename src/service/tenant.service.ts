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

  deactivateTenant(id: number): Observable<any> {
    return this.http.delete(`${BASE}/${id}`, { headers: this.headers() });
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
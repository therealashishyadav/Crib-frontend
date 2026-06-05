import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import {
  DashboardStats,
  User,
  PgListing,
  Inquiry,
  RevenueSummary,
  ChartData,
  PlatformSettings,
  PageResponse
} from '../entity/DashboardStats';
import { ServiceHealth } from '../entity/DashboardStats';

@Injectable({ providedIn: 'root' })
export class ManagementService {
  private apiUrl = `${environment.apiUrl}/api/management`;

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard`);
  }

  getUsers(page: number, size: number, search: string): Observable<PageResponse<User>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (search) params = params.set('search', search);
    return this.http.get<PageResponse<User>>(`${this.apiUrl}/users`, { params });
  }

  activateUser(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/users/${id}/activate`, {});
  }

  deactivateUser(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/users/${id}/deactivate`, {});
  }

  getPGs(page: number, size: number, city: string, occupancyType: string): Observable<PageResponse<PgListing>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (city) params = params.set('city', city);
    if (occupancyType) params = params.set('occupancyType', occupancyType);
    return this.http.get<PageResponse<PgListing>>(`${this.apiUrl}/pgs`, { params });
  }

  verifyListing(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/pgs/${id}/verify`, {});
  }

  deleteListing(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/pgs/${id}`);
  }

  getInquiries(page: number, size: number, search: string, location: string, inquiryType: string): Observable<PageResponse<Inquiry>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (search) params = params.set('search', search);
    if (location) params = params.set('location', location);
    if (inquiryType) params = params.set('inquiryType', inquiryType);
    return this.http.get<PageResponse<Inquiry>>(`${this.apiUrl}/inquiries`, { params });
  }

  exportInquiriesCsv(): Observable<string> {
    return this.http.get(`${this.apiUrl}/inquiries/export`, { responseType: 'text' });
  }

  getRevenueSummary(): Observable<RevenueSummary> {
    return this.http.get<RevenueSummary>(`${this.apiUrl}/revenue`);
  }

  getCityDistribution(): Observable<ChartData[]> {
    return this.http.get<ChartData[]>(`${this.apiUrl}/reports/city-distribution`);
  }

  getMonthlyGrowth(): Observable<ChartData[]> {
    return this.http.get<ChartData[]>(`${this.apiUrl}/reports/monthly-growth`);
  }

  /**
   * Returns health status of dependent services. Back-end endpoint may be optional.
   */
  getServiceHealth(): Observable<ServiceHealth[]> {
    return this.http.get<ServiceHealth[]>(`${this.apiUrl}/health`);
  }

  getPlatformSettings(): Observable<PlatformSettings> {
    return this.http.get<PlatformSettings>(`${this.apiUrl}/settings`);
  }

  updatePlatformSettings(settings: PlatformSettings): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/settings`, settings);
  }

  // Backwards-compatible alias used by some components
  savePlatformSettings(settings: PlatformSettings): Observable<void> {
    return this.updatePlatformSettings(settings);
  }

  /**
   * Broadcast announcement. Accepts either a payload object or simple (title, message, target) args.
   */
  broadcastAnnouncement(titleOrPayload: any, message?: string, target?: string): Observable<void> {
    const payload = typeof titleOrPayload === 'string'
      ? { announcementTitle: titleOrPayload, announcementMessage: message || '', target }
      : titleOrPayload;
    return this.http.post<void>(`${this.apiUrl}/settings/announce`, payload);
  }

  /**
   * Some deployments return a plain list of users; helper for that case.
   */
  getAllUsersFallback(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users/all`);
  }
}
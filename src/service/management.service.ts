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

  getPlatformSettings(): Observable<PlatformSettings> {
    return this.http.get<PlatformSettings>(`${this.apiUrl}/settings`);
  }

  updatePlatformSettings(settings: PlatformSettings): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/settings`, settings);
  }

  broadcastAnnouncement(announcement: { announcementTitle: string; announcementMessage: string }): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/settings/announce`, announcement);
  }
}
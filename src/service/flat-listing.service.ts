import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { FlatModel, FlatResponse } from '../entity/FlatModel';

@Injectable({
  providedIn: 'root'
})
export class FlatListingService {
  private apiUrl = environment.apiUrl;
  private baseUrl = `${this.apiUrl}/api/flat-listings`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });
  }

  createListing(flatModel: FlatModel): Observable<FlatResponse> {
    return this.http.post<FlatResponse>(this.baseUrl, flatModel, {
      headers: this.getAuthHeaders()
    });
  }

  getListingById(id: number): Observable<FlatResponse> {
    return this.http.get<FlatResponse>(`${this.baseUrl}/${id}`);
  }

  getMyListings(): Observable<FlatResponse[]> {
    return this.http.get<FlatResponse[]>(`${this.baseUrl}/owner`, {
      headers: this.getAuthHeaders()
    });
  }

  getAllListings(page: number = 0, size: number = 20): Observable<any> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<any>(this.baseUrl, { params });
  }

  getListingsByCity(city: string, page: number = 0, size: number = 20): Observable<any> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<any>(`${this.baseUrl}/city/${city}`, { params });
  }

  searchListings(filters: {
    city: string;
    minRent?: number;
    maxRent?: number;
    bedrooms?: number;
    furnishingStatus?: string;
    page?: number;
    size?: number;
  }): Observable<any> {
    let params = new HttpParams().set('city', filters.city);
    if (filters.minRent) params = params.set('minRent', filters.minRent.toString());
    if (filters.maxRent) params = params.set('maxRent', filters.maxRent.toString());
    if (filters.bedrooms) params = params.set('bedrooms', filters.bedrooms.toString());
    if (filters.furnishingStatus) params = params.set('furnishingStatus', filters.furnishingStatus);
    params = params.set('page', (filters.page ?? 0).toString()).set('size', (filters.size ?? 20).toString());
    return this.http.get<any>(`${this.baseUrl}/search`, { params });
  }

  updateListing(id: number, flatModel: FlatModel): Observable<FlatResponse> {
    return this.http.put<FlatResponse>(`${this.baseUrl}/${id}`, flatModel, {
      headers: this.getAuthHeaders()
    });
  }

  deactivateListing(id: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/deactivate`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  deleteListing(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
// // src/app/services/pg-listing.service.ts

// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { PgListingResponse, PgModel } from '../entity/PgModel';


// @Injectable({
//   providedIn: 'root'
// })
// export class PgListingService {

//   private baseUrl = 'http://localhost:8084/api/pg-listings';

//   constructor(private http: HttpClient) {}
//   uploadImage(file: File): Observable<{ url: string }> {
//     const formData = new FormData();
//     formData.append('file', file);
//     return this.http.post<{ url: string }>(`${this.baseUrl}/upload-image`, formData);
//   }

//   createListing(pgModel: PgModel, ownerId: number): Observable<PgListingResponse> {
//     const headers = new HttpHeaders({
//       'Content-Type': 'application/json',
//       'X-Owner-Id': ownerId.toString()
//     });
//     return this.http.post<PgListingResponse>(this.baseUrl, pgModel, { headers });
//   }
//   getListingById(id: number): Observable<PgListingResponse> {
//     return this.http.get<PgListingResponse>(`${this.baseUrl}/${id}`);
//   }

//   getMyListings(ownerId: number): Observable<PgListingResponse[]> {
//     const headers = new HttpHeaders({ 'X-Owner-Id': ownerId.toString() });
//     return this.http.get<PgListingResponse[]>(`${this.baseUrl}/owner`, { headers });
//   }

//   getAllListings(page: number = 0, size: number = 20): Observable<any> {
//     const params = new HttpParams()
//       .set('page', page.toString())
//       .set('size', size.toString());
//     return this.http.get<any>(this.baseUrl, { params });
//   }

//   getListingsByCity(city: string, page: number = 0, size: number = 20): Observable<any> {
//     const params = new HttpParams()
//       .set('page', page.toString())
//       .set('size', size.toString());
//     return this.http.get<any>(`${this.baseUrl}/city/${city}`, { params });
//   }

//   searchListings(filters: {
//     city: string;
//     occupancyType?: string;
//     sharingType?: string;
//     minPrice?: number;
//     maxPrice?: number;
//     foodProvided?: boolean;
//     wifiAvailable?: boolean;
//     page?: number;
//     size?: number;
//   }): Observable<any> {
//     let params = new HttpParams().set('city', filters.city);

//     if (filters.occupancyType) params = params.set('occupancyType', filters.occupancyType);
//     if (filters.sharingType)   params = params.set('sharingType',   filters.sharingType);
//     if (filters.minPrice)      params = params.set('minPrice',      filters.minPrice.toString());
//     if (filters.maxPrice)      params = params.set('maxPrice',      filters.maxPrice.toString());
//     if (filters.foodProvided  !== undefined) params = params.set('foodProvided',  filters.foodProvided.toString());
//     if (filters.wifiAvailable !== undefined) params = params.set('wifiAvailable', filters.wifiAvailable.toString());

//     params = params
//       .set('page', (filters.page ?? 0).toString())
//       .set('size', (filters.size ?? 20).toString());

//     return this.http.get<any>(`${this.baseUrl}/search`, { params });
//   }

//   getTopRatedByCity(city: string): Observable<PgListingResponse[]> {
//     return this.http.get<PgListingResponse[]>(`${this.baseUrl}/top-rated/${city}`);
//   }

//   updateListing(id: number, pgModel: PgModel, ownerId: number): Observable<PgListingResponse> {
//     const headers = new HttpHeaders({
//       'Content-Type': 'application/json',
//       'X-Owner-Id': ownerId.toString()
//     });
//     return this.http.put<PgListingResponse>(`${this.baseUrl}/${id}`, pgModel, { headers });
//   }

//   deactivateListing(id: number, ownerId: number): Observable<any> {
//     const headers = new HttpHeaders({ 'X-Owner-Id': ownerId.toString() });
//     return this.http.patch(`${this.baseUrl}/${id}/deactivate`, {}, { headers });
//   }

//   deleteListing(id: number, ownerId: number): Observable<any> {
//     const headers = new HttpHeaders({ 'X-Owner-Id': ownerId.toString() });
//     return this.http.delete(`${this.baseUrl}/${id}`, { headers });
//   }

// }

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PgListingResponse, PgModel } from '../entity/PgModel';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PgListingService {

  // private baseUrl = 'http://localhost:8080/api/pg-listings';

  private apiUrl = environment.apiUrl;
  private baseUrl = `${this.apiUrl}/api/pg-listings`;

  constructor(private http: HttpClient) {}

  // Always read token from localStorage
  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });
  }

  uploadImage(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string }>(
      `${this.baseUrl}/upload-image`,
      formData,
      { headers: new HttpHeaders({ Authorization: `Bearer ${localStorage.getItem('token')}` }) }
    );
  }

  // ownerId extracted from token on backend — no need to pass it
  createListing(pgModel: PgModel): Observable<PgListingResponse> {
    return this.http.post<PgListingResponse>(this.baseUrl, pgModel, {
      headers: this.getAuthHeaders()
    });
  }

  getListingById(id: number): Observable<PgListingResponse> {
    return this.http.get<PgListingResponse>(`${this.baseUrl}/${id}`);
  }

  // ownerId extracted from token on backend
  getMyListings(): Observable<PgListingResponse[]> {
    return this.http.get<PgListingResponse[]>(`${this.baseUrl}/owner`, {
      headers: this.getAuthHeaders()
    });
  }

  getAllListings(page: number = 0, size: number = 20): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<any>(this.baseUrl, { params });
  }

  getListingsByCity(city: string, page: number = 0, size: number = 20): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<any>(`${this.baseUrl}/city/${city}`, { params });
  }

  searchListings(filters: {
    city: string;
    occupancyType?: string;
    sharingType?: string;
    minPrice?: number;
    maxPrice?: number;
    foodProvided?: boolean;
    wifiAvailable?: boolean;
    page?: number;
    size?: number;
  }): Observable<any> {
    let params = new HttpParams().set('city', filters.city);
    if (filters.occupancyType) params = params.set('occupancyType', filters.occupancyType);
    if (filters.sharingType)   params = params.set('sharingType', filters.sharingType);
    if (filters.minPrice)      params = params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice)      params = params.set('maxPrice', filters.maxPrice.toString());
    if (filters.foodProvided  !== undefined) params = params.set('foodProvided', filters.foodProvided.toString());
    if (filters.wifiAvailable !== undefined) params = params.set('wifiAvailable', filters.wifiAvailable.toString());
    params = params
      .set('page', (filters.page ?? 0).toString())
      .set('size', (filters.size ?? 20).toString());
    return this.http.get<any>(`${this.baseUrl}/search`, { params });
  }

  getTopRatedByCity(city: string): Observable<PgListingResponse[]> {
    return this.http.get<PgListingResponse[]>(`${this.baseUrl}/top-rated/${city}`);
  }

  // ownerId from token on backend
  updateListing(id: number, pgModel: PgModel): Observable<PgListingResponse> {
    return this.http.put<PgListingResponse>(`${this.baseUrl}/${id}`, pgModel, {
      headers: this.getAuthHeaders()
    });
  }

  // ownerId from token on backend
  deactivateListing(id: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/deactivate`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  // ownerId from token on backend
  deleteListing(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
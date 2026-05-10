// services/owner-dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError, forkJoin } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { environment } from '../environments/environment';

// Models
export interface Owner {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
}

export interface PgListing {
  id: number;
  pgName: string;
  fullAddress: string;
  city: string;
  locality: string;
  coverImageUrl: string;
  lowestPrice: number;
  isActive: boolean;
  isVerified: boolean;
  availableRooms: number;
  totalRooms: number;
  email: string;
  contactNumber: string;
  ownerName: string;
  sharingOptions: SharingOption[];
  createdAt: string;
  views?: number;
  inquiriesCount?: number;
}

export interface SharingOption {
  id: number;
  sharingType: string;
  label: string;
  pricePerMonth: number;
  totalBeds: number;
  availableBeds: number;
}

export interface DashboardStats {
  totalListings: number;
  totalAvailableBeds: number;
  totalRooms: number;
  activeListings: number;
}

@Injectable({
  providedIn: 'root'
})
export class OwnerDashboardService {
  // private authApiUrl = 'http://localhost:8080/api/v1';
  // private pgApiUrl = 'http://localhost:8080/api';

// const apiUrl = environment.apiUrl;

private apiUrl = environment.apiUrl;
private authApiUrl = `${this.apiUrl}/api/v1`;
private pgApiUrl = `${this.apiUrl}/api`;

  constructor(private http: HttpClient, ) {}

  // Get JWT token from localStorage
  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Step 1: Fetch owner by phone number from Auth Service
  getOwnerByPhone(phone: string): Observable<Owner> {
    return this.http.get<Owner>(`${this.authApiUrl}/owner/phone/${phone}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Step 2: Fetch PG listings by owner's email OR phone
  getPgListingsByOwnerContact(email: string, phone: string): Observable<PgListing[]> {
    const params = new HttpParams()
      .set('email', email)
      .set('phone', phone);
    
    return this.http.get<PgListing[]>(`${this.pgApiUrl}/pg-listings/by-owner-contact`, {
      headers: this.getHeaders(),
      params: params
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Combined: fetch owner then their PGs
  getOwnerAndListings(phone: string): Observable<{ owner: Owner; listings: PgListing[] }> {
    return this.getOwnerByPhone(phone).pipe(
      switchMap(owner => {
        return this.getPgListingsByOwnerContact(owner.email, owner.phone).pipe(
          map(listings => ({ owner, listings }))
        );
      })
    );
  }

  // Get dashboard stats from listings
  getDashboardStats(listings: PgListing[]): DashboardStats {
    const totalListings = listings.length;
    const totalAvailableBeds = listings.reduce((sum, pg) => sum + (pg.availableRooms || 0), 0);
    const totalRooms = listings.reduce((sum, pg) => sum + (pg.totalRooms || 0), 0);
    const activeListings = listings.filter(pg => pg.isActive).length;
    
    return { totalListings, totalAvailableBeds, totalRooms, activeListings };
  }

  // Update PG status
  updatePgStatus(pgId: number, isActive: boolean, ownerEmail: string): Observable<any> {
    return this.http.patch(`${this.pgApiUrl}/pg-listings/${pgId}/status`, 
      { isActive, ownerEmail }, 
      { headers: this.getHeaders() }
    ).pipe(catchError(this.handleError));
  }

  // Delete PG
  deletePgListing(pgId: number, ownerEmail: string): Observable<any> {
    const params = new HttpParams().set('ownerEmail', ownerEmail);
    return this.http.delete(`${this.pgApiUrl}/pg-listings/${pgId}`, {
      headers: this.getHeaders(),
      params
    }).pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else if (error.status === 404) {
      errorMessage = 'Owner not found with this phone number';
    } else if (error.status === 401) {
      errorMessage = 'Unauthorized. Please login again.';
    }
    return throwError(() => new Error(errorMessage));
  }
}
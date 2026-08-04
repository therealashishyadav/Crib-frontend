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

  constructor(private http: HttpClient) { }

  // Always read token from localStorage
  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });
  }

  createListing(pgModel: PgModel): Observable<PgListingResponse> {
    return this.http.post<PgListingResponse>(this.baseUrl, pgModel, {
      headers: this.getAuthHeaders()
    });
  }

  getListingById(id: number): Observable<any> {
    const token = localStorage.getItem('token') ?? '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<any>(
      `${environment.apiUrl}/api/pg-listings/${id}`,
      { headers }
    );
  }

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
    if (filters.sharingType) params = params.set('sharingType', filters.sharingType);
    if (filters.minPrice) params = params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params = params.set('maxPrice', filters.maxPrice.toString());
    if (filters.foodProvided !== undefined) params = params.set('foodProvided', filters.foodProvided.toString());
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
  updateListing(id: number, payload: any): Observable<any> {
    const token = localStorage.getItem('token') ?? '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.put<any>(
      `${environment.apiUrl}/api/pg-listings/${id}`,
      payload,
      { headers }
    );
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

  importPgsFromCsv(file: File): Observable<any> {
  const token = localStorage.getItem('token') ?? '';
  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
  const formData = new FormData();
  formData.append('file', file);
  return this.http.post<any>(`${this.baseUrl}/import-csv`, formData, { headers });
}

downloadPgCsvTemplate(): void {
  const fields = [
    'pgName','fullAddress','city','locality','pinCode','googleMapLink','nearbyLandmarks',
    'coverImageUrl','galleryImages','virtualTourLink','videoLink',
    'occupancyType','roomSizeSqFt','furnished','attachedWashroom','balconyAvailable',
    'airConditioned','bedType','mattressProvided','studyTableAvailable',
    'foodProvided','mealTypes','foodOptions','cookingAllowed','commonKitchenAccess',
    'fridgeAvailable','microwaveAvailable',
    'wifiAvailable','powerBackupAvailable','geyserAvailable','washingMachineAvailable',
    'housekeepingFrequency','cctvSurveillance','securityGuardAvailable','liftAvailable',
    'twoWheelerParking','fourWheelerParking','loungeAvailable','recreationAreaAvailable',
    'gymAvailable','rooftopAccess',
    'dailyCleaning','laundryService','maintenanceOnCall','waterPurifierAvailable','dispenserAvailable',
    'entryExitTimings','visitorsAllowed','guestsOvernightAllowed','securityDepositAmount',
    'idVerificationRequired','fireSafetyAvailable','smokingAllowed','petsAllowed','alcoholAllowed',
    'depositAmount','noticePeriodDays','lockInPeriodMonths','additionalChargesInfo','maintenanceChargesInfo',
    'ownerName','contactNumber','whatsappNumber','email','visitingHours','availabilityFor',
    'agreementType','minimumStayMonths','noticePeriodToLeaveDays','refundPolicy','houseRulesDocumentUrl',
    'specialOffers','earlyBirdDiscounts','referralBonuses',
    'immediatePossession','availableFromDate','waitingList','totalRooms','availableRooms',
    'sharingOptionsJson'
  ];

  const sampleSharing = [
    { sharingType: 'ONE_SHARING', pricePerMonth: 8500, totalBeds: 2, amenities: ['AC','WiFi'] }
  ];
  const sharingJson = JSON.stringify(sampleSharing);

  const sampleRow = [
    'Sunrise PG','123 Main Road','Pune','Viman Nagar','411014','https://...','Near Wipro',
    '','','','',
    'COED','150','true','true','false','false','SINGLE','true','true',
    'true','Breakfast, Lunch','Veg','false','false','true','false',
    'true','false','true','false','DAILY','true','false','true',
    'true','false','false','false','false','false',
    'true','false','true','true','false',
    '10:00 PM','true','false','5000','true','true','false','false','false',
    '10000','30','6','Electricity extra','Maintenance included',
    'Rajesh Kumar','9876543210','9876543210','owner@email.com','10 AM - 7 PM','BOTH',
    'RENTAL_AGREEMENT','3','15','Refundable','https://...',
    'First month 10% off','','',
    'true','2025-06-01','false','10','8',
    sharingJson
  ];

const headerLine = this.toCsvLine(fields);
const sampleLine = this.toCsvLine(sampleRow);

const csvContent = headerLine + '\n' + sampleLine;
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'pg-import-template-full.csv';
  a.click();
  URL.revokeObjectURL(url);
}
private escapeCsvField(value: any): string {
  const str = value === null || value === undefined ? '' : String(value);
  if (/[",\n\r]/.test(str)) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

private toCsvLine(values: any[]): string {
  return values.map(v => this.escapeCsvField(v)).join(',');
}
}
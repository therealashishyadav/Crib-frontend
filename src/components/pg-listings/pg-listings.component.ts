import { Component, OnInit } from '@angular/core';
import { PgListingResponse } from '../../entity/PgModel';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PgListingService } from '../../service/pg-listing.service';
import { MetaService } from '../../service/meta.service';

@Component({
  selector: 'app-pg-listings',
  standalone: true,
  imports: [    CommonModule,
    RouterModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    NavbarComponent,
    FooterComponent,
  ]
    ,
  templateUrl: './pg-listings.component.html',
  styleUrl: './pg-listings.component.css'
})
export class PgListingsComponent implements OnInit {

  listings: PgListingResponse[]         = [];
  filteredListings: PgListingResponse[] = [];
 

  isLoading     = true;
  hasError      = false;
  errorMessage  = '';
  isSidebarOpen = false;
 

  searchCity = '';
 

  selectedGender   = '';
  selectedRoomType = '';
  minRent          = 0;
  maxRent          = 100000;
  foodIncluded     = false;
  foodExcluded     = false;
  withPhotos       = false;
  preferredFor     = '';
  attachedBathroom = false;
 

  sortBy = 'newest';
 
  sortOptions = [
    { value: 'newest',     label: 'Newest First'       },
    { value: 'price_low',  label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
  ];
 
  constructor(
    private pgListingService: PgListingService,
    private snackBar: MatSnackBar,
    private metaService: MetaService
  ) {}
 
  ngOnInit(): void {
    this.metaService.setPage(
      'PG Listings - Find Verified Accommodation',
      'Browse verified PG listings with direct owner contact. No broker fees, real photos, and transparent pricing.',
      '',
      'https://cribup.vercel.app/pg-listings'
    );
    this.loadAllListings();
  }
 

  loadAllListings(): void {
    this.isLoading = true;
    this.hasError  = false;
 
    this.pgListingService.getAllListings().subscribe({
      next: (response: any) => {
        this.listings         = response?.content ?? response ?? [];
        this.filteredListings = [...this.listings];
        this.isLoading        = false;
        this.applyFiltersAndSort();
      },
      error: (err) => {
        this.isLoading    = false;
        this.hasError     = true;
        this.errorMessage = 'Could not load PG listings. Please try again.';
        console.error('Error loading PGs:', err);
      }
    });
  }
 

  onSearch(): void {
    if (!this.searchCity.trim()) {
      this.loadAllListings();
      return;
    }
    this.isLoading = true;
    this.hasError  = false;
 
    this.pgListingService.getListingsByCity(this.searchCity).subscribe({
      next: (response: any) => {
        this.listings         = response?.content ?? response ?? [];
        this.filteredListings = [...this.listings];
        this.isLoading        = false;
        this.applyFiltersAndSort();
        if (this.listings.length === 0) {
          this.snackBar.open(`No PGs found in ${this.searchCity}`, 'Close', { duration: 3000 });
        }
      },
      error: (err) => {
        this.isLoading    = false;
        this.hasError     = true;
        this.errorMessage = `Could not load listings for ${this.searchCity}`;
        console.error('Error:', err);
      }
    });
  }
 

  applyFiltersAndSort(): void {
    let result = [...this.listings];
 
    if (this.selectedGender) {
      result = result.filter(pg => pg.occupancyType === this.selectedGender);
    }
 
    if (this.selectedRoomType) {
      result = result.filter(pg =>
        pg.sharingOptions.some(opt => opt.sharingType === this.selectedRoomType)
      );
    }
 
    result = result.filter(pg => {
      const price = this.getLowestPrice(pg);
      return price >= this.minRent && price <= this.maxRent;
    });
 
    if (this.foodIncluded)     result = result.filter(pg => pg.foodProvided);
    if (this.foodExcluded)     result = result.filter(pg => !pg.foodProvided);
    if (this.withPhotos)       result = result.filter(pg => !!pg.coverImageUrl);
    if (this.attachedBathroom) result = result.filter(pg => pg.attachedWashroom);
    if (this.preferredFor)     result = result.filter(pg => pg.availabilityFor === this.preferredFor);
 
    this.filteredListings = this.sortListings(result);
  }
 

  sortListings(list: PgListingResponse[]): PgListingResponse[] {
    return [...list].sort((a, b) => {
      switch (this.sortBy) {
        case 'price_low':  return this.getLowestPrice(a) - this.getLowestPrice(b);
        case 'price_high': return this.getLowestPrice(b) - this.getLowestPrice(a);
        default:           return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }
 

  resetFilters(): void {
    this.selectedGender   = '';
    this.selectedRoomType = '';
    this.minRent          = 0;
    this.maxRent          = 100000;
    this.foodIncluded     = false;
    this.foodExcluded     = false;
    this.withPhotos       = false;
    this.preferredFor     = '';
    this.attachedBathroom = false;
    this.sortBy           = 'newest';
    this.searchCity       = '';
    this.loadAllListings();
  }
 
  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
 

  getLowestPrice(pg: PgListingResponse): number {
    if (pg.lowestPrice) return pg.lowestPrice;
    if (!pg.sharingOptions.length) return 0;
    return Math.min(...pg.sharingOptions.map(o => o.pricePerMonth));
  }
 
  getGenderLabel(type: string): string {
    switch (type) {
      case 'GIRLS': return 'Girls';
      case 'BOYS':  return 'Boys';
      case 'COED':  return 'Coed';
      default:      return type ?? '';
    }
  }
 
  getGenderClass(type: string): string {
    switch (type) {
      case 'GIRLS': return 'badge-girls';
      case 'BOYS':  return 'badge-boys';
      case 'COED':  return 'badge-coed';
      default:      return '';
    }
  }
 
  getDaysAgo(dateStr: string): string {
    if (!dateStr) return '';
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return '1 Day Ago';
    return `${diff} Days Ago`;
  }
}
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PgService } from '../../service/pg.service';
import { RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { OwnerNavbarComponent } from '../owner-navbar/owner-navbar.component';

@Component({
  selector: 'app-ownerpage',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, OwnerNavbarComponent, MatSnackBarModule],
  templateUrl: './ownerpage.component.html',
  styleUrl: './ownerpage.component.css'
})
export class OwnerpageComponent implements OnInit {

  pgs: any[] = [];
  totalPGs: number = 0;
  totalRent: number = 0;
  averageRent: number = 0;
  editingPG: any | null = null;
  isLoading: boolean = true;
  greeting: string = 'Hello';
  ownerName: string = 'Owner';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private pgService: PgService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadMyPGs();
  }

  loadMyPGs(): void {
    this.isLoading = true;

    // ✅ Only access localStorage in browser
    if (isPlatformBrowser(this.platformId)) {
      console.log('Token:', localStorage.getItem('token'));
    } else {
      console.log('Running on server - skipping localStorage');
    }

    this.pgService.getMyPGs().subscribe({
      next: (data) => {
        console.log('PGs received:', data);
        this.pgs = data;
        this.calculateStats();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching PGs', err);
        this.isLoading = false;
      }
    });
  }

  calculateStats(): void {
    this.totalPGs = this.pgs.length;
    // lowestPrice comes from Add PG API response
    // monthlyRent comes from PG Details API response
    // handle both
    this.totalRent = this.pgs.reduce((sum, pg) => {
      const price = pg.lowestPrice || pg.monthlyRent || 0;
      return sum + Number(price);
    }, 0);
    this.averageRent = this.totalPGs > 0 ? this.totalRent / this.totalPGs : 0;
  }

  deletePG(id: number): void {
    if (confirm('Are you sure you want to delete this PG?')) {
      this.pgService.deletePG(id).subscribe({
        next: () => {
          this.pgs = this.pgs.filter(pg => pg.id !== id);
          this.calculateStats();
        },
        error: (err) => console.error('Error deleting PG', err)
      });
    }
  }

  editPG(pg: any): void {
    this.editingPG = { ...pg };
  }

  saveEdit(): void {
    if (this.editingPG && this.editingPG.id) {
      this.pgService.updatePG(this.editingPG.id, this.editingPG).subscribe({
        next: (updated) => {
          const index = this.pgs.findIndex(pg => pg.id === updated.id);
          if (index !== -1) this.pgs[index] = updated;
          this.calculateStats();
          this.editingPG = null;
        },
        error: (err) => console.error('Error updating PG', err)
      });
    }
  }

  cancelEdit(): void {
    this.editingPG = null;
  }

   sharePg(pg: any): void {
    const baseUrl = window.location.origin;
    const detailUrl = `${baseUrl}/pg-detail/${pg.id}`;

    if (navigator.share) {
      navigator.share({
        title: pg.pgName,
        url: detailUrl
      }).catch(err => {
        if (err.name !== 'AbortError') {
          this.copyToClipboard(detailUrl);
        }
      });
    } else {
      this.copyToClipboard(detailUrl);
    }
  }

  private copyToClipboard(url: string): void {
    navigator.clipboard.writeText(url).then(() => {
      this.snackBar.open('✅ PG link copied to clipboard!', 'Dismiss', {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
    }).catch(() => {
      this.snackBar.open('❌ Failed to copy link. Please copy manually.', 'Dismiss', {
        duration: 3000
      });
    });
  }
}
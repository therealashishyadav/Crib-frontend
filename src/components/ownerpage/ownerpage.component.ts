// import { CommonModule } from '@angular/common';
// import { Component } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { PGListing } from '../../entity/PGListing';
// import { PgService } from '../../service/pg.service';

// @Component({
//   selector: 'app-ownerpage',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './ownerpage.component.html',
//   styleUrl: './ownerpage.component.css'
// })
// export class OwnerpageComponent {

//   pgs: PGListing[] = [];
//   totalPGs: number = 0;
//   totalRent: number = 0;
//   averageRent: number = 0;
//   editingPG: PGListing | null = null;
//   isLoading: boolean = true;

//   constructor(private pgService: PgService) {}

//   ngOnInit(): void {
//     this.loadMyPGs();
//   }

//   loadMyPGs(): void {
//     this.isLoading = true;
//     this.pgService.getMyPGs().subscribe({
//       next: (data) => {
//         this.pgs = data;
//         this.calculateStats();
//         this.isLoading = false;
//       },
//       error: (err) => {
//         console.error('Error fetching PGs', err);
//         this.isLoading = false;
//       }
//     });
//   }

//   calculateStats(): void {
//     this.totalPGs = this.pgs.length;
//     this.totalRent = this.pgs.reduce((sum, pg) => sum + (pg.monthlyRent || 0), 0);
//     this.averageRent = this.totalPGs > 0 ? this.totalRent / this.totalPGs : 0;
//   }

//   deletePG(id: number): void {
//     if (confirm('Are you sure you want to delete this PG?')) {
//       this.pgService.deletePG(id).subscribe({
//         next: () => {
//           this.pgs = this.pgs.filter(pg => pg.id !== id);
//           this.calculateStats();
//         },
//         error: (err) => console.error('Error deleting PG', err)
//       });
//     }
//   }

//   editPG(pg: PGListing): void {
//     this.editingPG = { ...pg };
//   }

//   saveEdit(): void {
//     if (this.editingPG && this.editingPG.id) {
//       this.pgService.updatePG(this.editingPG.id, this.editingPG).subscribe({
//         next: (updated) => {
//           const index = this.pgs.findIndex(pg => pg.id === updated.id);
//           if (index !== -1) this.pgs[index] = updated;
//           this.calculateStats();
//           this.editingPG = null;
//         },
//         error: (err) => console.error('Error updating PG', err)
//       });
//     }
//   }

//   cancelEdit(): void {
//     this.editingPG = null;
//   }
// }


// import { CommonModule } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { PgService } from '../../service/pg.service';
// import { RouterLink } from '@angular/router';

// @Component({
//   selector: 'app-ownerpage',
//   standalone: true,
//   imports: [CommonModule, FormsModule, RouterLink],
//   templateUrl: './ownerpage.component.html',
//   styleUrl: './ownerpage.component.css'
// })
// export class OwnerpageComponent implements OnInit {

//   pgs: any[] = [];
//   totalPGs: number = 0;
//   totalRent: number = 0;
//   averageRent: number = 0;
//   editingPG: any | null = null;
//   isLoading: boolean = true;

//   constructor(private pgService: PgService) {}

//   ngOnInit(): void {
//     this.loadMyPGs();
//   }

// loadMyPGs(): void {
//   this.isLoading = true;
//   console.log('Token:', localStorage.getItem('token')); // ← add this
//   this.pgService.getMyPGs().subscribe({
//     next: (data) => {
//       console.log('PGs received:', data); // ← add this
//       this.pgs = data;
//       this.calculateStats();
//       this.isLoading = false;
//     },
//     error: (err) => {
//       console.error('Error fetching PGs', err); // already there
//       this.isLoading = false;
//     }
//   });
// }

//   calculateStats(): void {
//     this.totalPGs = this.pgs.length;
//     // lowestPrice comes from Add PG API response
//     // monthlyRent comes from PG Details API response
//     // handle both
//     this.totalRent = this.pgs.reduce((sum, pg) => {
//       const price = pg.lowestPrice || pg.monthlyRent || 0;
//       return sum + Number(price);
//     }, 0);
//     this.averageRent = this.totalPGs > 0 ? this.totalRent / this.totalPGs : 0;
//   }

//   deletePG(id: number): void {
//     if (confirm('Are you sure you want to delete this PG?')) {
//       this.pgService.deletePG(id).subscribe({
//         next: () => {
//           this.pgs = this.pgs.filter(pg => pg.id !== id);
//           this.calculateStats();
//         },
//         error: (err) => console.error('Error deleting PG', err)
//       });
//     }
//   }

//   editPG(pg: any): void {
//     this.editingPG = { ...pg };
//   }

//   saveEdit(): void {
//     if (this.editingPG && this.editingPG.id) {
//       this.pgService.updatePG(this.editingPG.id, this.editingPG).subscribe({
//         next: (updated) => {
//           const index = this.pgs.findIndex(pg => pg.id === updated.id);
//           if (index !== -1) this.pgs[index] = updated;
//           this.calculateStats();
//           this.editingPG = null;
//         },
//         error: (err) => console.error('Error updating PG', err)
//       });
//     }
//   }

//   cancelEdit(): void {
//     this.editingPG = null;
//   }
// }


import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PgService } from '../../service/pg.service';
import { RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-ownerpage',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
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

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private pgService: PgService
  ) {}

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
}
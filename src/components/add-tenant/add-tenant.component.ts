import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';          //  import MatSelectModule
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NavbarComponent } from '../navbar/navbar.component';
import { TenantService } from '../../service/tenant.service';
import { PgListingService } from '../../service/pg-listing.service';   //  import PG service
import { Tenant } from '../../entity/Tenant';
import { OwnerNavbarComponent } from "../owner-navbar/owner-navbar.component";
import { PgListingResponse } from '../../entity/PgModel';              //  import PG response type
import { PgService } from '../../service/pg.service';
import { MetaService } from '../../service/meta.service';

@Component({
  selector: 'app-add-tenant',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatSnackBarModule, MatIconModule, MatSelectModule,   //  add MatSelectModule
    MatCheckboxModule,
    OwnerNavbarComponent,
  ],
  templateUrl: './add-tenant.component.html',
  styleUrls: ['./add-tenant.component.css']
})
export class AddTenantComponent implements OnInit {

  tenant: Tenant = new Tenant();
  isEditing = false;
  tenantId?: number;
  isLoading = false;

  pgList: PgListingResponse[] = [];
  loadingPGs = false;

  constructor(
private tenantService: TenantService,
  private pgService: PgService,          // ← change to PgService
  private router: Router,
  private route: ActivatedRoute,
  private snackBar: MatSnackBar,
  private metaService: MetaService
  ) {}

  ngOnInit(): void {
    this.metaService.setPrivatePage('Add Tenant — CribUp');
    this.loadOwnerPGs();   //  fetch PGs first

    // If ?id=X in URL, load tenant for editing
    const id = this.route.snapshot.queryParamMap.get('id');
    if (id) {
      this.isEditing = true;
      this.tenantId = +id;
      this.tenantService.getAllTenants().subscribe({
        next: (tenants) => {
          const found = tenants.find(t => t.id === this.tenantId);
          if (found) this.tenant = { ...found };
        }
      });
    }
  }
  
loadOwnerPGs(): void {
  this.loadingPGs = true;
  this.pgService.getMyPGs().subscribe({   // ← now using pgService
    next: (pgs) => {
      this.pgList = pgs;
      this.loadingPGs = false;
    },
    error: (err) => {
      this.loadingPGs = false;
      console.error('Error loading PGs:', err);
      this.snackBar.open('Could not load your PG list.', 'Close', { duration: 3000 });
    }
  });
}

  save(): void {
    if (!this.tenant.fullName || !this.tenant.phone ||
        !this.tenant.roomNumber || !this.tenant.monthlyRent) {
      this.snackBar.open('Please fill all required fields.', 'Close', { duration: 3000 });
      return;
    }

    // 👇 optional: validate that a PG is selected (if you want to make it required)
    if (!this.tenant.pgId) {
      this.snackBar.open('Please select a PG.', 'Close', { duration: 3000 });
      return;
    }

    this.isLoading = true;

    if (this.isEditing && this.tenantId) {
      this.tenantService.updateTenant(this.tenantId, this.tenant).subscribe({
        next: () => {
          this.isLoading = false;
          this.snackBar.open('Tenant updated successfully.', 'Close', { duration: 3000 });
          this.router.navigate(['/owner/tenants']);
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open('Error updating tenant.', 'Close', { duration: 3000 });
        }
      });
    } else {
      this.tenantService.addTenant(this.tenant).subscribe({
        next: () => {
          this.isLoading = false;
          this.snackBar.open('Tenant added successfully.', 'Close', { duration: 3000 });
          this.router.navigate(['/owner/tenants']);
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open('Error adding tenant.', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
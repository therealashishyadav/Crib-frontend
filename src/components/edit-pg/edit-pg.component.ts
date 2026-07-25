import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PgListingService } from '../../service/pg-listing.service';
import { PgModel, SharingOptionModel } from '../../entity/PgModel';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; 

const CLOUDINARY_CLOUD_NAME = 'dmb3nvt45';
const CLOUDINARY_UPLOAD_PRESET = 'nookly_unsigned';

@Component({
  selector: 'app-edit-pg',
  standalone: true,
  imports: [
 CommonModule,
    FormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatCardModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './edit-pg.component.html',
  styleUrls: ['./edit-pg.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EditPgComponent implements OnInit {

  @ViewChild('editPgForm') pgForm!: NgForm;

  readonly URL = typeof window !== 'undefined' ? window.URL : ({} as typeof URL);

  pgId!: number;
  pgModel: PgModel = new PgModel();
  isLoading     = false;
  isSubmitting  = false;

  // Image state
  coverImageFile: File | null = null;
  coverImagePreview: string | null = null;
  galleryImageFiles: File[] = [];
  videoFile: File | null = null;
  existingGalleryImages: string[] = [];

  // Dropdown options — same as ListPropertyComponent
  occupancyTypes = [
    { value: 'GIRLS', label: 'Girls' },
    { value: 'BOYS',  label: 'Boys'  },
    { value: 'COED',  label: 'Coed'  },
  ];
  bedTypes = [
    { value: 'SINGLE',   label: 'Single Bed' },
    { value: 'DOUBLE',   label: 'Double Bed' },
    { value: 'BUNK',     label: 'Bunk Bed'   },
    { value: 'SOFA_BED', label: 'Sofa Bed'   },
  ];
  housekeepingOptions = [
    { value: 'DAILY',          label: 'Daily'          },
    { value: 'ALTERNATE_DAYS', label: 'Alternate Days' },
    { value: 'WEEKLY',         label: 'Weekly'         },
    { value: 'MONTHLY',        label: 'Monthly'        },
    { value: 'NONE',           label: 'Not Available'  },
  ];
  availabilityOptions = [
    { value: 'STUDENTS',              label: 'Students'              },
    { value: 'WORKING_PROFESSIONALS', label: 'Working Professionals' },
    { value: 'BOTH',                  label: 'Both'                  },
  ];
  agreementOptions = [
    { value: 'RENTAL_AGREEMENT',  label: 'Rental Agreement' },
    { value: 'LEAVE_AND_LICENSE', label: 'Leave & License'  },
    { value: 'NONE',              label: 'No Agreement'     },
  ];
  sharingTypes = [
    { value: 'ONE_SHARING',   label: 'Single Room'    },
    { value: 'TWO_SHARING',   label: 'Twin Sharing'   },
    { value: 'THREE_SHARING', label: 'Triple Sharing' },
    { value: 'FOUR_SHARING',  label: 'Four Sharing'   },
    { value: 'FIVE_SHARING',  label: 'Five Sharing'   },
  ];
  commonAmenities: string[] = [
    'AC', 'WiFi', 'Geyser', 'Attached Bathroom',
    'Study Table', 'Wardrobe', 'TV', 'Fridge',
    'Washing Machine', 'Power Backup',
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pgListingService: PgListingService,
    private snackBar: MatSnackBar
  ) {}

  goBack(): void {
    this.router.navigate(['/owner/dashboard']);
  }

  ngOnInit(): void {
    this.pgId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadPg();
  }

  loadPg(): void {
    this.isLoading = true;
    this.pgListingService.getListingById(this.pgId).subscribe({
      next: (pg) => {
        // Map response back to PgModel
        this.pgModel = {
          ...pg,
          sharingOptions: pg.sharingOptions ?? [new SharingOptionModel()]
        };
        this.coverImagePreview      = pg.coverImageUrl ?? null;
        this.existingGalleryImages  = pg.galleryImages ?? [];
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        const msg = err?.status === 403
          ? 'You do not have permission to edit this PG.'
          : 'Failed to load PG details.';
        this.snackBar.open(msg, 'Close', { duration: 4000 });
        if (err?.status === 403) this.router.navigate(['/owner/dashboard']);
      }
    });
  }

  // ── Image handlers ────────────────────────────────────────────────────────
  onCoverImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      this.coverImageFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => { this.coverImagePreview = e.target?.result as string; };
      reader.readAsDataURL(input.files[0]);
    }
  }

  removeCoverImage(): void {
    this.coverImageFile        = null;
    this.coverImagePreview     = null;
    this.pgModel.coverImageUrl = '';
  }

  onGalleryFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      Array.from(input.files).forEach(f => this.galleryImageFiles.push(f));
    }
  }

  removeNewGalleryImage(index: number): void {
    this.galleryImageFiles.splice(index, 1);
  }

  removeExistingGalleryImage(index: number): void {
    this.existingGalleryImages.splice(index, 1);
    this.pgModel.galleryImages = [...this.existingGalleryImages];
  }

  onVideoFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) this.videoFile = input.files[0];
  }

  removeVideo(): void {
    this.videoFile = null;
    this.pgModel.videoLink = '';
  }

  // ── Sharing options ───────────────────────────────────────────────────────
  addSharingOption(): void {
    this.pgModel.sharingOptions.push(new SharingOptionModel());
  }

  removeSharingOption(index: number): void {
    if (this.pgModel.sharingOptions.length > 1) {
      this.pgModel.sharingOptions.splice(index, 1);
    }
  }

  toggleAmenity(optionIndex: number, amenity: string): void {
    const opt = this.pgModel.sharingOptions[optionIndex];
    const idx = opt.amenities.indexOf(amenity);
    idx > -1 ? opt.amenities.splice(idx, 1) : opt.amenities.push(amenity);
  }

  isAmenitySelected(optionIndex: number, amenity: string): boolean {
    return this.pgModel.sharingOptions[optionIndex].amenities.includes(amenity);
  }

  // ── Cloudinary upload ─────────────────────────────────────────────────────
  private async uploadToCloudinary(file: File, resourceType: 'image' | 'video' = 'image'): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', resourceType === 'video' ? 'nookly-pg/videos' : 'nookly-pg/images');
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
      { method: 'POST', body: formData }
    );
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return data.secure_url as string;
  }

  private cleanModel(model: any): any {
    const cleaned = { ...model };
    Object.keys(cleaned).forEach(k => { if (cleaned[k] === '') cleaned[k] = null; });
    cleaned.sharingOptions = model.sharingOptions.map((opt: any) => {
      const c = { ...opt };
      Object.keys(c).forEach(k => { if (c[k] === '') c[k] = null; });
      return c;
    });
    return cleaned;
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  async SaveChanges(): Promise<void> {
    this.isSubmitting = true;
    try {
      // Upload new cover image if selected
      if (this.coverImageFile) {
        this.snackBar.open('Uploading cover image...', '', { duration: 2500 });
        this.pgModel.coverImageUrl = await this.uploadToCloudinary(this.coverImageFile, 'image');
      }

      // Upload new gallery images and merge with existing
      if (this.galleryImageFiles.length > 0) {
        this.snackBar.open('Uploading gallery images...', '', { duration: 3000 });
        const newUrls: string[] = [];
        for (const file of this.galleryImageFiles) {
          newUrls.push(await this.uploadToCloudinary(file, 'image'));
        }
        this.pgModel.galleryImages = [...this.existingGalleryImages, ...newUrls];
      } else {
        this.pgModel.galleryImages = [...this.existingGalleryImages];
      }

      // Upload new video if selected
      if (this.videoFile) {
        this.snackBar.open('Uploading video...', '', { duration: 6000 });
        this.pgModel.videoLink = await this.uploadToCloudinary(this.videoFile, 'video');
      }

      const payload = this.cleanModel(this.pgModel);

      this.pgListingService.updateListing(this.pgId, payload).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.snackBar.open('PG updated successfully!', 'Close', { duration: 3000 });
          setTimeout(() => this.router.navigate(['/owner/dashboard']), 1500);
        },
        error: (err) => {
          this.isSubmitting = false;
          const msg = err?.status === 403
            ? 'You can only edit your own PG listings.'
            : err?.error?.message ?? 'Failed to save changes.';
          this.snackBar.open(msg, 'Close', { duration: 5000 });
        }
      });
    } catch (err: any) {
      this.isSubmitting = false;
      this.snackBar.open(err?.message ?? 'Upload failed.', 'Close', { duration: 4000 });
    }
  }
}
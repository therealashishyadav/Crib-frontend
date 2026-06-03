import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { OwnerNavbarComponent } from '../owner-navbar/owner-navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { FlatListingService } from '../../service/flat-listing.service';
import { FlatModel } from '../../entity/FlatModel';

const CLOUDINARY_CLOUD_NAME = 'dmb3nvt45';
const CLOUDINARY_UPLOAD_PRESET = 'nookly_unsigned';

@Component({
  selector: 'app-add-flat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
    MatExpansionModule,
    MatSnackBarModule,
    OwnerNavbarComponent,
    FooterComponent,
  ],
  templateUrl: './add-flat.component.html',
  styleUrls: ['./add-flat.component.css']
})
export class AddFlatComponent {
  @ViewChild('flatForm') flatForm!: NgForm;

  flatModel: FlatModel = new FlatModel();
  isSubmitting = false;
  submitSuccess = false;

  coverImageFile: File | null = null;
  coverImagePreview: string | null = null;
  galleryImageFiles: File[] = [];
  videoFile: File | null = null;

  constructor(
    private flatService: FlatListingService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  onCoverImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.coverImageFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.coverImagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  removeCoverImage(): void {
    this.coverImageFile = null;
    this.coverImagePreview = null;
    this.flatModel.coverImageUrl = '';
  }

  onGalleryFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      Array.from(input.files).forEach(file => this.galleryImageFiles.push(file));
    }
  }

  removeGalleryImage(index: number): void {
    this.galleryImageFiles.splice(index, 1);
  }

  onVideoFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) this.videoFile = input.files[0];
  }

  removeVideo(): void {
    this.videoFile = null;
    this.flatModel.videoLink = '';
  }

  private async uploadToCloudinary(file: File, resourceType: 'image' | 'video' = 'image'): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', resourceType === 'video' ? 'nookly-flats/videos' : 'nookly-flats/images');

    const apiUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;
    const response = await fetch(apiUrl, { method: 'POST', body: formData });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err?.error?.message ?? 'Cloudinary upload failed');
    }

    const data = await response.json();
    return data.secure_url as string;
  }

  private cleanModel(model: any): any {
    const cleaned = { ...model };
    Object.keys(cleaned).forEach(key => {
      if (cleaned[key] === '') cleaned[key] = null;
    });
    return cleaned;
  }

  async submitListing(): Promise<void> {
    if (this.flatForm.invalid) {
      this.snackBar.open('Please fill all required fields.', 'Close', { duration: 3000 });
      return;
    }

    this.isSubmitting = true;

    try {
      if (this.coverImageFile) {
        this.snackBar.open('Uploading cover image...', '', { duration: 2500 });
        this.flatModel.coverImageUrl = await this.uploadToCloudinary(this.coverImageFile, 'image');
      }

      if (this.galleryImageFiles.length > 0) {
        this.snackBar.open(`Uploading ${this.galleryImageFiles.length} gallery image(s)...`, '', { duration: 4000 });
        const galleryUrls: string[] = [];
        for (const file of this.galleryImageFiles) {
          const url = await this.uploadToCloudinary(file, 'image');
          galleryUrls.push(url);
        }
        this.flatModel.galleryImages = galleryUrls;
      }

      if (this.videoFile) {
        this.snackBar.open('Uploading video...', '', { duration: 8000 });
        this.flatModel.videoLink = await this.uploadToCloudinary(this.videoFile, 'video');
      }

      const payload = this.cleanModel(this.flatModel);

      this.flatService.createListing(payload).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.submitSuccess = true;
          this.snackBar.open('Flat listed successfully!', 'Close', { duration: 3000 });
          setTimeout(() => this.router.navigate(['/flat', response.id]), 2000);
        },
        error: (error) => {
          this.isSubmitting = false;
          const message = error?.error?.message ?? error?.error?.error ?? 'Error submitting listing. Please try again.';
          this.snackBar.open(message, 'Close', { duration: 5000 });
          console.error('Error submitting flat listing:', error);
        }
      });
    } catch (error: any) {
      this.isSubmitting = false;
      const message = error?.message ?? 'Upload failed. Please check your connection and try again.';
      this.snackBar.open(message, 'Close', { duration: 5000 });
      console.error('Upload error:', error);
    }
  }

  resetForm(): void {
    this.flatModel = new FlatModel();
    this.coverImageFile = null;
    this.coverImagePreview = null;
    this.galleryImageFiles = [];
    this.videoFile = null;
    this.flatForm.resetForm();
  }
}
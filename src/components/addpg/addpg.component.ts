import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { NgModule, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { PgdetailsService } from '../../service/pgdetails.service';
import { response } from 'express';
import { error } from 'console';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { PgModel } from '../../entity/PgModel';
import { MetaService } from '../../service/meta.service';


@Component({
  selector: 'app-addpg',
  standalone: true,
  imports: [MatFormFieldModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    CommonModule,
    MatFormFieldModule,
    MatCardModule,



  ],
  templateUrl: './addpg.component.html',
  styleUrl: './addpg.component.css'
})
export class AddpgComponent {

  pgModel: PgModel = new PgModel();

onSubmit(): void {
  const formData = new FormData();

  // Append PG model as JSON string
  formData.append('pg', new Blob([JSON.stringify(this.pgModel)], { type: 'application/json' }));

  // Append gallery images
  this.galleryImageFiles.forEach((file, index) => {
    formData.append('galleryImages', file, file.name);
  });

  // Append video if available
  if (this.videoFile) {
    formData.append('video', this.videoFile, this.videoFile.name);
  }

  this.pgDetailService.postPg(formData).subscribe({
    next: (response) => {
      alert('PG Added Successfully!');
      this.resetForm();
    },
    error: (err) => {
      console.error(err);
      alert('Error uploading PG');
    }
  });
}


  addGalleryImage(): void {
    this.pgModel.galleryImages.push('');
  }

  resetForm(): void {
    this.route.navigate(['/addpg']);
  }

  galleryImageFiles: File[] = [];
  videoFile: File | null = null;

  onGalleryFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.galleryImageFiles = [...this.galleryImageFiles, ...Array.from(input.files)];
      // Clear the input to allow selecting the same files again if needed
      input.value = '';
    }
  }

  onVideoFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.videoFile = input.files[0];
      input.value = '';
    }
  }

  removeGalleryImage(index: number) {
    this.galleryImageFiles.splice(index, 1);
  }

  removeVideo() {
    this.videoFile = null;
  }

  constructor(private pgDetailService: PgdetailsService, private http: HttpClient, private route: Router, private metaService: MetaService) {

  }

  ngOnInit(): void {
    this.metaService.setPrivatePage('Add PG \u2014 CribUp');
    this.pgModel.galleryImages = [''];
  }

}
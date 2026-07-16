import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { HttpClient } from '@angular/common/http';
import { Inquiry } from '../../entity/Inquiry';
import { response } from 'express';
import { error } from 'console';
import { InquiryService } from '../../service/inquiry.service';
import { MetaService } from '../../service/meta.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [MatFormField,
    MatLabel, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule, CommonModule, NavbarComponent, 
    FooterComponent
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit {

  constructor(private http: HttpClient, private inquiryService: InquiryService, private snackBar: MatSnackBar, private metaService: MetaService) { }

  ngOnInit(): void {
    this.metaService.setPage(
      'Contact Crib - Get in Touch',
      'Have questions about finding a PG? Contact Crib support. Reach out via email or phone. We are here to help.',
      '',
      'https://cribup.vercel.app/contact'
    );
  }

  inquiry: Inquiry = new Inquiry();

  Submit() {
    this.inquiryService.postInquiry(this.inquiry).subscribe(
      response => {
        console.log('Inquiry sent successfully', response);
        this.snackBar.open('Your message has been sent successfully!', 'Close', { duration: 5000 });
        this.inquiry = new Inquiry();
      },
      error => {
        console.error('Error sending inquiry', error);
        this.snackBar.open('There was an error sending your message. Please try again later.', 'Close',
          { duration: 5000 });
      }
    );
  }
}

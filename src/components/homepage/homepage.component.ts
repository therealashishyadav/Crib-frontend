import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MetaService } from '../../service/meta.service';


interface PropertyType {
  name: string;
  icon: string;
}

interface RentalStep {
  number: string;
  title: string;
  description: string;
}

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface Testimonial {
  text: string;
  name: string;
  role: string;
  // image: string;
}

interface FAQ {
  question: string;
  answer: string;
}


@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent,
    CommonModule,
    RouterLink,
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {


  toggleFaq(event: Event): void {
    const header = event.currentTarget as HTMLButtonElement;
    const item = header.closest('.accordion-item') as HTMLElement;
    const body = item?.querySelector('.accordion-body') as HTMLElement;

    if (!item || !body) return;

    const isOpen = header.getAttribute('aria-expanded') === 'true';

    // Close all other open items first (accordion behaviour)
    const allHeaders = document.querySelectorAll<HTMLButtonElement>('.accordion-header');
    allHeaders.forEach(h => {
      if (h !== header) {
        h.setAttribute('aria-expanded', 'false');
        const b = h.closest('.accordion-item')
          ?.querySelector('.accordion-body') as HTMLElement | null;
        if (b) b.classList.remove('is-open');
      }
    });

    // Toggle current
    header.setAttribute('aria-expanded', String(!isOpen));
    body.classList.toggle('is-open', !isOpen);
  }
  constructor(private metaService: MetaService) {
  }
  ngOnInit() {
    this.metaService.setPage(
      'CribUp - Find Verified PG in Pune | No Brokerage',
      'Find verified PG accommodation in Pune. No broker fees, real photos, transparent pricing. Browse 100+ verified PG listings now. ',
      'Hassle-free PG search with direct owner contact. Your trusted platform for verified PGs in Pune.',
      'https://cribup.vercel.app'
    );
  }
}

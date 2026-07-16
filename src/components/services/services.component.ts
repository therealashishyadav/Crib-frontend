import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterLink } from '@angular/router';
import { MetaService } from '../../service/meta.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [ NavbarComponent, FooterComponent, RouterLink ],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent implements OnInit {
  constructor(private metaService: MetaService) {}

  ngOnInit(): void {
    this.metaService.setPage(
      'Services — CribUp | PG Management Solutions',
      'Discover CribUp services: PG listings, tenant management, rent tracking, and property verification.',
      '',
      'https://cribup.vercel.app/services'
    );
  }
togglePanel(event: Event): void {
    const header = event.currentTarget as HTMLButtonElement;
    const item   = header.closest('.acc-item') as HTMLElement;
    const bodyId = header.getAttribute('aria-controls');
    const body   = bodyId
      ? (document.getElementById(bodyId) as HTMLElement)
      : (item?.querySelector('.acc-body') as HTMLElement);
 
    if (!body) return;
 
    const isOpen = header.getAttribute('aria-expanded') === 'true';
 
    // Close all other open panels
    const allHeaders = document.querySelectorAll<HTMLButtonElement>('.acc-header');
    allHeaders.forEach(h => {
      if (h === header) return;
      h.setAttribute('aria-expanded', 'false');
      const bid = h.getAttribute('aria-controls');
      const b   = bid
        ? document.getElementById(bid)
        : h.closest('.acc-item')?.querySelector('.acc-body');
      (b as HTMLElement | null)?.classList.remove('is-open');
    });
 
    // Toggle current
    header.setAttribute('aria-expanded', String(!isOpen));
    body.classList.toggle('is-open', !isOpen);
  }
}

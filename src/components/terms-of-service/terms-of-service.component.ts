import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { MetaService } from '../../service/meta.service';

@Component({
  selector: 'app-terms-of-service',
  templateUrl: './terms-of-service.component.html',
  styleUrls: ['./terms-of-service.component.scss'],
  animations: [
    trigger('fadeInStagger', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(32px)' }),
          stagger(70, [
            animate('0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)', 
              style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('slideToc', [
      transition(':enter', [
        style({ height: '0', opacity: 0, overflow: 'hidden' }),
        animate('300ms ease-out', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ height: '0', opacity: 0 }))
      ])
    ])
  ]
})
export class TermsOfServiceComponent implements OnInit {
  isTocOpen = false;
  sidebarCollapsed = false;
  currentDate: string = '';

  sections = [
    { id: 'section-1', number: '1', title: 'Scope and Acceptance' },
    { id: 'section-2', number: '2', title: 'Eligibility and Definitions' },
    { id: 'section-3', number: '3', title: 'Nature of the Platform — Marketplace, Not a Party to Any Tenancy' },
    { id: 'section-4', number: '4', title: 'User Accounts, Login & Registration' },
    { id: 'section-5', number: '5', title: '"Verified Properties" — Scope and Limitation of Verification' },
    { id: 'section-6', number: '6', title: 'User Responsibilities' },
    { id: 'section-7', number: '7', title: 'Intellectual Property Rights' },
    { id: 'section-8', number: '8', title: 'Upcoming Features — Digital Agreements & Payments' },
    { id: 'section-9', number: '9', title: 'Limitation of Liability' },
    { id: 'section-10', number: '10', title: 'Indemnification' },
    { id: 'section-11', number: '11', title: 'Suspension and Termination' },
    { id: 'section-12', number: '12', title: 'Dispute Resolution and Mandatory Arbitration' },
    { id: 'section-13', number: '13', title: 'Governing Law and Jurisdiction' },
    { id: 'section-14', number: '14', title: 'Privacy and Data Protection' },
    { id: 'section-15', number: '15', title: 'General Provisions' },
    { id: 'section-16', number: '16', title: 'Contact Information' }
  ];

  toggleToc(): void {
    this.isTocOpen = !this.isTocOpen;
  }

  printDocument(): void {
    window.print();
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  constructor(private metaService: MetaService) {}

  ngOnInit(): void {
    this.metaService.setPage(
      'Terms of Service - Crib Platform Agreement',
      'Read the Terms of Service for Crib platform. Understand user rights, responsibilities, and platform policies.',
      '',
      'https://cribup.vercel.app/terms-of-service'
    );
    const now = new Date();
    this.currentDate = now.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  }

  scrollToSection(sectionId: string, event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'app-owner-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatIconModule, MatRippleModule],
  templateUrl: './owner-navbar.component.html',
  styleUrls: ['./owner-navbar.component.css']
})
export class OwnerNavbarComponent implements OnInit {

  ownerName  = 'Owner';
  ownerInitial = 'O';
  menuOpen   = false;
  scrolled   = false;
  profileOpen = false;

  // Nav items — only visible to owners
  navItems = [
    { label: 'Dashboard',   icon: 'dashboard',      route: '/ownerpage'  },
    { label: 'Add PG',      icon: 'add_home',        route: '/addpglist'     },
    { label: 'Add Tenant',  icon: 'person_add',      route: '/owner/add-tenant' },
    { label: 'Tenants',     icon: 'group',           route: '/owner/tenants'    },
    { label: 'Rent Sheet',  icon: 'receipt_long',    route: '/owner/rent-sheet' },
  ];

  constructor(public router: Router) {}

  ngOnInit(): void {
    // Load owner name from localStorage (set during login)
    const firstName = localStorage.getItem('firstName') ?? '';
    const lastName  = localStorage.getItem('lastName')  ?? '';
    this.ownerName  = firstName ? `${firstName} ${lastName}`.trim() : 'Owner';
    this.ownerInitial = firstName ? firstName.charAt(0).toUpperCase() : 'O';
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled = window.scrollY > 20;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-wrapper') && !target.closest('.profile-dropdown')) {
      this.profileOpen = false;
    }
    if (!target.closest('.nav-links') && !target.closest('.hamburger')) {
      this.menuOpen = false;
    }
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
    this.profileOpen = false;
  }

  toggleProfile(): void {
    this.profileOpen = !this.profileOpen;
    this.menuOpen = false;
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  goToProfile(): void {
    this.profileOpen = false;
    this.router.navigate(['/owner/profile']);
  }
}
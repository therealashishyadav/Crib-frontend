import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-management-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatSnackBarModule],
  templateUrl: './management-navbar.component.html',
  styleUrls: ['./management-navbar.component.css'],
})
export class ManagementNavbarComponent implements OnInit {
  // User
  currentUserName = 'Admin';
  currentUserInitial = 'A';
  currentUserRole = 'ADMIN';

  // UI
  dropdownOpen = false;
  isMobile = false;
  mobileMenuOpen = false;

  constructor(private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.checkScreenSize();
    this.readCurrentUser();
  }

  @HostListener('window:resize', [])
  onResize(): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    this.isMobile = window.innerWidth < 768;
    if (!this.isMobile) {
      this.mobileMenuOpen = false;
    }
  }

  private readCurrentUser(): void {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.currentUserName = payload.sub || 'Admin';
      this.currentUserInitial = this.currentUserName.charAt(0).toUpperCase();
      this.currentUserRole = payload.role || 'ADMIN';
    } catch {
      // ignore
    }
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  goToProfile(): void {
    this.dropdownOpen = false;
    this.router.navigate(['/management/profile']);
  }

  goToSettings(): void {
    this.dropdownOpen = false;
    this.router.navigate(['/management/settings']);
  }

  logout(): void {
    this.dropdownOpen = false;
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.snackBar.open('Logged out successfully', 'Close', { duration: 3000 });
    this.router.navigate(['/login']);
  }

  // Click outside to close dropdown
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-dropdown') && !target.closest('.dropdown-menu')) {
      this.dropdownOpen = false;
    }
  }
}
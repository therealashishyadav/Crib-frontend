import { Component, Inject, PLATFORM_ID, OnInit, AfterViewInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { LoginService } from '../../service/login.service';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { LoginEntity } from '../../entity/LoginEntity';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { JwtToken } from '../../entity/JwtToken';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../environments/environment';

declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, MatFormFieldModule, MatFormField,
    MatInputModule, FormsModule, RouterLink,
    MatIconModule, MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, AfterViewInit {

  user: LoginEntity = new LoginEntity();
  jwtToken: JwtToken = new JwtToken();
  token: string = '';
  partyRoles: string = '';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private loginService: LoginService,
    private http: HttpClient,
    private route: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadGoogleScript().then(() => {
        console.log('✅ Google script loaded.');
      }).catch(() => {
        console.error('❌ Google script failed to load.');
        this.snackBar.open('Failed to load Google Sign-In. Please refresh.', 'Close', { duration: 3000 });
      });
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.initializeGoogleButton();
      }, 300);
    }
  }

  // ✅ Fixed: added 'reject' parameter and call it on error
  loadGoogleScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.getElementById('google-script')) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.id = 'google-script';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log('✅ Google script loaded successfully.');
        resolve();
      };
      script.onerror = () => {
        console.error('❌ Failed to load Google script.');
        reject(new Error('Google script load failed'));
      };
      document.head.appendChild(script);
    });
  }

  initializeGoogleButton(): void {
    const container = document.getElementById('googleButton');
    if (!container) {
      console.error('❌ Container #googleButton not found.');
      return;
    }

    if (typeof google === 'undefined' || !google.accounts) {
      console.error('❌ Google library not loaded. Retrying...');
      setTimeout(() => this.initializeGoogleButton(), 500);
      return;
    }

    // ✅ Read client ID from environment
    const GOOGLE_CLIENT_ID = environment.googleClientId;
    if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID.includes('YOUR_')) {
      console.error('❌ Google Client ID is not properly set in environment.');
      this.snackBar.open('Google login is not configured. Contact support.', 'Close', { duration: 5000 });
      return;
    }

    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: this.handleGoogleCredential.bind(this),
      auto_prompt: false
    });

    google.accounts.id.renderButton(
      container,
      {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        shape: 'rectangular',
        text: 'signin_with',
        logo_alignment: 'left'
      }
    );

    console.log('✅ Google button rendered with client ID:', GOOGLE_CLIENT_ID);
  }

  handleGoogleCredential(response: any): void {
    const idToken = response.credential;
    console.log('✅ Google ID token received');

    this.loginService.googleLogin(idToken).subscribe({
      next: (jwtResponse) => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', jwtResponse.token);
          localStorage.setItem('refreshToken', jwtResponse.refreshToken);
        }

        const emailFromToken = this.getEmailFromToken(jwtResponse.token);
        this.fetchUserRole(emailFromToken);
      },
      error: (err) => {
        console.error('Google login failed:', err);
        this.snackBar.open('Google login failed. Please try again.', 'Close', { duration: 3000 });
      }
    });
  }

  login(): void {
    const input = this.user.email.trim();
    const password = this.user.password.trim();
    const isEmail = input.includes('@');
    const isPhone = /^[0-9]{10}$/.test(input);

    if (!input || !password) {
      this.snackBar.open('Please fill all the fields', 'Close', { duration: 3000 });
      return;
    }
    if (!isEmail && !isPhone) {
      this.snackBar.open('Enter a valid email or 10-digit phone number', 'Close', { duration: 3000 });
      return;
    }
    if (password.length < 6) {
      this.snackBar.open('Password must be at least 6 characters long', 'Close', { duration: 3000 });
      return;
    }

    this.loginService.getToken(this.user).subscribe({
      next: (response) => {
        this.token = response.token;
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', this.token);
        }

        const emailFromToken = this.getEmailFromToken(this.token);

        this.loginService.loginUser(this.token).subscribe({
          next: () => this.fetchUserRole(emailFromToken),
          error: () => this.fetchUserRole(emailFromToken)
        });
      },
      error: () => {
        this.snackBar.open('Invalid credentials. Please try again.', 'Close', { duration: 3000 });
      }
    });
  }

  private getEmailFromToken(token: string): string {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub;
    } catch {
      return '';
    }
  }

  private fetchUserRole(email: string): void {
    this.loginService.getRole(email).subscribe({
      next: (role) => {
        this.partyRoles = role;
        console.log('User Role:', this.partyRoles);
        switch (this.partyRoles) {
          case 'USER': this.route.navigate(['/homepage']); break;
          case 'ADMIN': this.route.navigate(['/adminpage']); break;
          case 'MANAGEMENT': this.route.navigate(['/management']); break;
          case 'OWNER': this.route.navigate(['/ownerpage']); break;
          default:
            this.snackBar.open('Enter valid credentials or contact support.', 'Close', { duration: 3000 });
        }
      },
      error: () => {
        this.snackBar.open('Failed to fetch user role. Try again.', 'Close', { duration: 3000 });
      }
    });
  }
}
// import { Component, Inject, PLATFORM_ID } from '@angular/core';
// import { isPlatformBrowser } from '@angular/common';
// import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
// import { LoginService } from '../../service/login.service';
// import { HttpClient } from '@angular/common/http';
// import { Router, RouterLink } from '@angular/router';
// import { LoginEntity } from '../../entity/LoginEntity';
// import { MatInputModule } from '@angular/material/input';
// import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
// import { JwtToken } from '../../entity/JwtToken';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { MatIconModule } from '@angular/material/icon';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [
//     CommonModule, MatFormFieldModule, MatFormField,
//     MatInputModule, FormsModule, RouterLink,
//     MatIconModule, MatSnackBarModule
//   ],
//   templateUrl: './login.component.html',
//   styleUrl: './login.component.css'
// })
// export class LoginComponent {

//   user: LoginEntity = new LoginEntity();
//   jwtToken: JwtToken = new JwtToken();
//   token: string = '';
//   partyRoles: string = '';

//   constructor(
//     @Inject(PLATFORM_ID) private platformId: Object,
//     private loginService: LoginService,
//     private http: HttpClient,
//     private route: Router,
//     private snackBar: MatSnackBar
//   ) {}

//   login(): void {
//     const input = this.user.email.trim();
//     const password = this.user.password.trim();
//     const isEmail = input.includes('@');
//     const isPhone = /^[0-9]{10}$/.test(input);

//     if (!input || !password) {
//       this.snackBar.open('Please fill all the fields', 'Close', { duration: 3000 });
//       return;
//     }
//     if (!isEmail && !isPhone) {
//       this.snackBar.open('Enter a valid email or 10-digit phone number', 'Close', { duration: 3000 });
//       return;
//     }
//     if (password.length < 6) {
//       this.snackBar.open('Password must be at least 6 characters long', 'Close', { duration: 3000 });
//       return;
//     }

//     this.loginService.getToken(this.user).subscribe({
//       next: (response) => {
//         this.token = response.token;
//         if (isPlatformBrowser(this.platformId)) {
//           localStorage.setItem('token', this.token);
//         }

//         const emailFromToken = this.getEmailFromToken(this.token);

//         this.loginService.loginUser(this.token).subscribe({
//           next: () => this.fetchUserRole(emailFromToken),
//           error: () => this.fetchUserRole(emailFromToken)
//         });
//       },
//       error: () => {
//         this.snackBar.open('Invalid credentials. Please try again.', 'Close', { duration: 3000 });
//       }
//     });
//   }

//   private getEmailFromToken(token: string): string {
//     try {
//       const payload = JSON.parse(atob(token.split('.')[1]));
//       return payload.sub; // sub = email set in Account API JwtServiceImpl
//     } catch {
//       return '';
//     }
//   }

//   private fetchUserRole(email: string): void {
//     this.loginService.getRole(email).subscribe({
//       next: (role) => {
//         this.partyRoles = role;
//         console.log('User Role:', this.partyRoles);
//         switch (this.partyRoles) {
//           case 'USER': this.route.navigate(['/homepage']); break;
//           case 'ADMIN': this.route.navigate(['/adminpage']); break;
//           case 'MANAGEMENT': this.route.navigate(['/management']); break;
//           case 'OWNER': this.route.navigate(['/ownerpage']); break;
//           default:
//             this.snackBar.open('Enter valid credentials or contact support.', 'Close', { duration: 3000 });
//         }
//       },
//       error: () => {
//         this.snackBar.open('Failed to fetch user role. Try again.', 'Close', { duration: 3000 });
//       }
//     });
//   }
//    loadGoogleScript(): Promise<void> {
//     return new Promise((resolve) => {
//       const script = document.createElement('script');
//       script.src = 'https://accounts.google.com/gsi/client';
//       script.async = true;
//       script.defer = true;
//       script.onload = () => resolve();
//       document.head.appendChild(script);
//     });
//   }

//   initializeGoogleButton(): void {
//     google.accounts.id.initialize({
//       client_id: 'YOUR_GOOGLE_CLIENT_ID', // <-- Replace with your Client ID
//       callback: this.handleGoogleCredential.bind(this),
//       auto_prompt: false
//     });

//     google.accounts.id.renderButton(
//       document.getElementById('googleButton'),
//       {
//         theme: 'outline',
//         size: 'large',
//         type: 'standard',
//         shape: 'rectangular',
//         text: 'signin_with',
//         logo_alignment: 'left'
//       }
//     );
//   }

//   handleGoogleCredential(response: any): void {
//     const idToken = response.credential;

//     this.loginService.googleLogin(idToken).subscribe({
//       next: (jwtResponse) => {
//         // Store JWT (same as normal login)
//         localStorage.setItem('token', jwtResponse.token);
//         localStorage.setItem('refreshToken', jwtResponse.refreshToken);
//         // Optionally store user info
//         this.router.navigate(['/dashboard']); // or wherever
//       },
//       error: (err) => {
//         this.snackBar.open('Google login failed', 'Close', { duration: 3000 });
//         console.error(err);
//       }
//     });
//   }
// }


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

//  Declare the Google namespace for TypeScript
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
export class LoginComponent implements OnInit, AfterViewInit { // <-- Added OnInit, AfterViewInit

  user: LoginEntity = new LoginEntity();
  jwtToken: JwtToken = new JwtToken();
  token: string = '';
  partyRoles: string = '';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private loginService: LoginService,
    private http: HttpClient,
    private route: Router, // <-- Named 'route' (matches your usage)
    private snackBar: MatSnackBar
  ) { }

  //  1. Load the Google script when the component initializes
  ngOnInit(): void {
    // Only load the script in the browser (not on server)
    if (isPlatformBrowser(this.platformId)) {
      this.loadGoogleScript().then(() => {
        console.log(' Google script loaded. Button will render after view init.');
      });
    }
  }

  //  2. Render the button after the DOM is ready
  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Small delay to ensure the DOM is fully rendered
      setTimeout(() => {
        this.initializeGoogleButton();
      }, 300);
    }
  }

  //  3. Load the Google Identity Services script
  loadGoogleScript(): Promise<void> {
    return new Promise((resolve) => {
      // Check if script already exists
      if (document.getElementById('google-script')) {
        console.log(' Google script already loaded.');
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.id = 'google-script';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log(' Google script loaded successfully.');
        resolve();
      };
      script.onerror = () => {
        console.error(' Failed to load Google script.');
      };
      document.head.appendChild(script);
    });
  }

  //  4. Initialize and render the Google button
  initializeGoogleButton(): void {
    const container = document.getElementById('googleButton');
    if (!container) {
      console.error(' Container #googleButton not found in DOM.');
      return;
    }

    if (typeof google === 'undefined' || !google.accounts) {
      console.error('Google library not loaded yet. Retrying...');
      setTimeout(() => this.initializeGoogleButton(), 500);
      return;
    }

    console.log('Google library found, initializing button...');

    const GOOGLE_CLIENT_ID = '287517103772-o212pl3nd7i8mvbtmftv6hp6d1fgsivu.apps.googleusercontent.com';

    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: this.handleGoogleCredential.bind(this),
      auto_prompt: false,
      cancel_on_tap_outside: false
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

    console.log(' Google button rendered successfully!');
  }

  //  5. Handle the credential response from Google
  handleGoogleCredential(response: any): void {
    const idToken = response.credential;
    console.log(' Google ID token received');

    this.loginService.googleLogin(idToken).subscribe({
      next: (jwtResponse) => {
        // Store tokens in localStorage (browser only)
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', jwtResponse.token);
          localStorage.setItem('refreshToken', jwtResponse.refreshToken);
        }

        // Extract email from the JWT token
        const emailFromToken = this.getEmailFromToken(jwtResponse.token);

        // Fetch the user's role and navigate (reuse existing logic)
        this.fetchUserRole(emailFromToken);
      },
      error: (err) => {
        console.error('Google login failed:', err);
        this.snackBar.open('Google login failed. Please try again.', 'Close', { duration: 3000 });
      }
    });
  }

  //  6. Your existing login() method (unchanged)
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
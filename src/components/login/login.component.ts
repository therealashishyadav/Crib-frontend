// // import { Component } from '@angular/core';
// // import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
// // import { LoginService } from '../../service/login.service';
// // import { HttpClient } from '@angular/common/http';
// // import { Router, RouterLink } from '@angular/router';
// // import { LoginEntity } from '../../entity/LoginEntity';
// // import { MatInputModule } from '@angular/material/input';
// // import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
// // import { JwtToken } from '../../entity/JwtToken';
// // import { CommonModule } from '@angular/common';
// // import { FormsModule } from '@angular/forms';
// // import { MatIconModule } from '@angular/material/icon';

// // @Component({
// //   selector: 'app-login',
// //   standalone: true,
// //   imports: [
// //     CommonModule,
// //     MatFormFieldModule,
// //     MatFormField,
// //     MatInputModule,
// //     FormsModule,
// //     RouterLink,
// //     MatIconModule,
// //     MatSnackBarModule
// //   ],
// //   templateUrl: './login.component.html',
// //   styleUrl: './login.component.css'
// // })
// // export class LoginComponent {

// //   user: LoginEntity = new LoginEntity();
// //   jwtToken: JwtToken = new JwtToken();
// //   token: string = '';
// //   partyRoles: string = '';

// //   constructor(
// //     private loginService: LoginService,
// //     private http: HttpClient,
// //     private route: Router,
// //     private snackBar: MatSnackBar
// //   ) { }

// //   login(): void {
// //     const input = this.user.email.trim();
// //     const password = this.user.password.trim();
// //     const isEmail = input.includes('@');
// //     const isPhone = /^[0-9]{10}$/.test(input);

// //     // Validation
// //     if (!input || !password) {
// //       this.snackBar.open('Please fill all the fields', 'Close', { duration: 3000 });
// //       return;
// //     }

// //     if (!isEmail && !isPhone) {
// //       this.snackBar.open('Enter a valid email or 10-digit phone number', 'Close', { duration: 3000 });
// //       return;
// //     }

// //     if (password.length < 6) {
// //       this.snackBar.open('Password must be at least 6 characters long', 'Close', { duration: 3000 });
// //       return;
// //     }

// //     this.loginService.getToken(this.user).subscribe({
// //       next: (response) => {
// //         this.jwtToken = response;
// //         this.token = response.token;
// //         console.log(this.token);
// //         localStorage.setItem('token', this.token);

// //         this.loginService.loginUser(this.token).subscribe({
// //           next: () => {
// //             const email = this.getEmailFromToken(this.token);
// //             this.fetchUserRole(email);
// //           },
// //           error: (error) => {
// //             console.error('Login failed at user login step:', error);
// //           }
// //         });
// //       },
// //       error: (err) => {
// //         this.snackBar.open('Invalid credentials. Please try again.', 'Close', { duration: 3000 });
// //         console.error('Login failed while getting token:', err);
// //       }
// //     });
// //   }

// //   private getEmailFromToken(token: string): string {
// //     try {
// //       const payload = JSON.parse(atob(token.split('.')[1]));
// //       return payload.sub; // 'sub' is the email stored in JWT
// //     } catch {
// //       return '';
// //     }
// //   }

// //   private fetchUserRole(email: string): void {
// //     this.loginService.getRole(email).subscribe({
// //       next: (role) => {
// //         this.partyRoles = role;
// //         console.log('User Role:', this.partyRoles);

// //         switch (this.partyRoles) {
// //           case 'USER':
// //             this.route.navigate(['/homepage']);
// //             break;
// //           case 'ADMIN':
// //             this.route.navigate(['/adminpage']);
// //             break;
// //           case 'MANAGEMENT':
// //             this.route.navigate(['/management']);
// //             break;
// //           case 'OWNER':
// //             this.route.navigate(['/ownerpage']);
// //             break;
// //           default:
// //             console.error('Unrecognized role:', this.partyRoles);
// //             this.snackBar.open('Enter valid credentials or contact support.', 'Close', { duration: 3000 });
// //         }
// //       },
// //       error: (err) => {
// //         console.error('Failed to fetch role:', err);
// //         this.snackBar.open('Failed to fetch user role. Try again.', 'Close', { duration: 3000 });
// //       }
// //     });
// //   }
// // }

// import { Component } from '@angular/core';
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
//         localStorage.setItem('token', this.token);

//         // Decode JWT to get email — works whether user logged in with email or phone
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

//   // Decode JWT locally — extract email (sub claim)
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
// }




import { Component, Inject, PLATFORM_ID } from '@angular/core';
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
export class LoginComponent {

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
        // ✅ Only access localStorage in browser
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', this.token);
        }

        // Decode JWT to get email — works whether user logged in with email or phone
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

  // Decode JWT locally — extract email (sub claim)
  private getEmailFromToken(token: string): string {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub; // sub = email set in Account API JwtServiceImpl
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
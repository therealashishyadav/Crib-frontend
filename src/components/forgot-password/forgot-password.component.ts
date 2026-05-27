
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

type Step = 'email' | 'otp' | 'password';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {

  currentStep: Step = 'email';
  isLoading        = false;

  email       = '';
  otp         = '';
  newPassword = '';
  confirmPassword = '';
  showPassword    = false;

  private readonly api = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  sendOtp(): void {
    if (!this.email || !this.email.includes('@')) {
      this.snackBar.open('Please enter a valid email address.', 'Close', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    this.http.post<any>(`${this.api}/api/v1/auth/forgot-password`, { email: this.email })
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.currentStep = 'otp';
          this.snackBar.open('OTP sent to your email. Check your inbox.', 'Close', { duration: 4000 });
        },
        error: () => {
          this.isLoading = false;
          // Show same message regardless of error — don't reveal if email exists
          this.currentStep = 'otp';
          this.snackBar.open('If this email is registered, an OTP has been sent.', 'Close', { duration: 4000 });
        }
      });
  }

  verifyOtp(): void {
    if (!this.otp || this.otp.length !== 6) {
      this.snackBar.open('Please enter the 6-digit OTP.', 'Close', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    this.http.post<any>(`${this.api}/api/v1/auth/verify-otp`, {
      email: this.email,
      otp: this.otp
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.currentStep = 'password';
      },
      error: (err) => {
        this.isLoading = false;
        const msg = err?.error?.message ?? 'Invalid or expired OTP. Please try again.';
        this.snackBar.open(msg, 'Close', { duration: 4000 });
      }
    });
  }

  resetPassword(): void {
    if (!this.newPassword || this.newPassword.length < 8) {
      this.snackBar.open('Password must be at least 8 characters.', 'Close', { duration: 3000 });
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.snackBar.open('Passwords do not match.', 'Close', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    this.http.post<any>(`${this.api}/api/v1/auth/reset-password`, {
      email: this.email,
      otp: this.otp,
      newPassword: this.newPassword
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.snackBar.open('Password reset successfully! Please log in.', 'Close', { duration: 4000 });
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.isLoading = false;
        const msg = err?.error?.message ?? 'Something went wrong. Please try again.';
        this.snackBar.open(msg, 'Close', { duration: 4000 });
      }
    });
  }

  resendOtp(): void {
    this.otp = '';
    this.sendOtp();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
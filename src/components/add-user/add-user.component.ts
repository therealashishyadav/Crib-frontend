import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Account } from '../../entity/Account';
import { AccountService } from '../../service/account.service';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
})
export class AddUserComponent {
  user: Account = new Account();
  isLoading = false;

  // Available roles for management to assign
  roles = ['OWNER', 'MANAGEMENT'];

  constructor(
    private accountService: AccountService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  registerUser(): void {
    // Basic validation
    if (!this.user.firstName || !this.user.lastName || !this.user.email || !this.user.password || !this.user.role) {
      this.snackBar.open('Please fill all required fields.', 'Close', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    this.accountService.createUser(this.user).subscribe({
      next: () => {
        this.snackBar.open(`${this.user.role} registered successfully!`, 'Close', { duration: 3000 });
        this.resetForm();
        this.router.navigate(['/management']);
      },
      error: (err) => {
        console.error('Registration failed:', err);
        this.snackBar.open('Registration failed. Please try again.', 'Close', { duration: 3000 });
        this.isLoading = false;
      },
    });
  }

  resetForm(): void {
    this.user = new Account();
    this.isLoading = false;
  }
}
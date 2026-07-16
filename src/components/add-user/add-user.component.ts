// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatSelectModule } from '@angular/material/select';
// import { MatButtonModule } from '@angular/material/button';
// import { Account } from '../../entity/Account';
// import { AccountService } from '../../service/account.service';

// @Component({
//   selector: 'app-add-user',
//   standalone: true,
//   imports: [
//     CommonModule,
//     FormsModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatSelectModule,
//     MatButtonModule,
//     MatSnackBarModule,
//   ],
//   templateUrl: './add-user.component.html',
//   styleUrls: ['./add-user.component.css'],
// })
// export class AddUserComponent {
//   user: Account = new Account();
//   isLoading = false;

//   // Available roles for management to assign
//   roles = ['OWNER', 'MANAGEMENT'];

//   constructor(
//     private accountService: AccountService,
//     private router: Router,
//     private snackBar: MatSnackBar,
//   ) {}

//   registerUser(): void {
//     // Basic validation
//     if (!this.user.firstName || !this.user.lastName || !this.user.email || !this.user.password || !this.user.role) {
//       this.snackBar.open('Please fill all required fields.', 'Close', { duration: 3000 });
//       return;
//     }

//     this.isLoading = true;
//     this.accountService.createUser(this.user).subscribe({
//       next: () => {
//         this.snackBar.open(`${this.user.role} registered successfully!`, 'Close', { duration: 3000 });
//         this.resetForm();
//         this.router.navigate(['/management']);
//       },
//       error: (err) => {
//         console.error('Registration failed:', err);
//         this.snackBar.open('Registration failed. Please try again.', 'Close', { duration: 3000 });
//         this.isLoading = false;
//       },
//     });
//   }

//   resetForm(): void {
//     this.user = new Account();
//     this.isLoading = false;
//   }
// }






import { Component, OnInit } from '@angular/core';
import { Account } from '../../entity/Account';
import { AccountService } from '../../service/account.service';
import { HttpClient } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { first } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';


@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    FormsModule,
    MatSelectModule,
    RouterLink
  ],
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
})
export class AddUserComponent {

  user: Account = new Account();
  confirmPassword: string = '';
  roles = ['OWNER', 'MANAGEMENT'];

  constructor(
    private accountSerivce: AccountService,
    private route: Router,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) { }

  Register(): void {

    const firstName = this.user.firstName;
    const lastName = this.user.lastName;
    const email = this.user.email;
    const phone = this.user.phone;
    const password = this.user.password;

    if (firstName === '' || lastName === '' || email === '' || phone === '' || password === '') {
      this.snackBar.open('Please fill all the fields', 'Close', {
        duration: 3000
      });
      return;
    } else if (!this.user.email.includes('@')) {
      this.snackBar.open('Please enter a valid email address', 'Close', {
        duration: 3000
      });
      return;
    } else if (this.user.password.length < 6) {
      this.snackBar.open('Password must be at least 6 characters long', 'Close', {
        duration: 3000
      });
      return;
    } else if (this.user.phone.length < 10) {
      this.snackBar.open('Phone number must be at least 10 digits long', 'Close', {
        duration: 3000
      });
      return;
    } else if (firstName.length < 2 || lastName.length < 2) {
      this.snackBar.open('First and Last names must be at least 3 characters long', 'Close', {
        duration: 3000
      });
      return;
    } else if (firstName.length > 20 || lastName.length > 20) {
      this.snackBar.open('First and Last names must be at most 20 characters long', 'Close', {
        duration: 3000
      });
      return;
    } else if (firstName.includes(' ') || lastName.includes(' ')) {
      this.snackBar.open('First and Last names cannot contain spaces', 'Close', {
        duration: 3000
      });
      return;
    } else if (phone.includes(' ')) {
      this.snackBar.open('Phone number cannot contain spaces', 'Close', {
        duration: 3000
      });
      return;
    } else if (!/^[a-zA-Z]+$/.test(firstName) || !/^[a-zA-Z]+$/.test(lastName)) {
      this.snackBar.open('First and Last names must contain only letters', 'Close', {
        duration: 3000
      });
      return;
    } else if (!/^\d+$/.test(phone)) {
      this.snackBar.open('Phone number must contain only digits', 'Close', {
        duration: 3000
      });
      return;
    } else if (!/^[a-zA-Z0-9]+$/.test(password)) {
      this.snackBar.open('Password must contain only letters and numbers', 'Close', {
        duration: 3000
      });
      return;
    } else if (this.user.password !== this.confirmPassword) {
      this.snackBar.open('Password Does Not Match', 'Close', {
        duration: 3000
      });
      return;
    }
    console.log('User being sent:', this.user);
    this.accountSerivce.createUser(this.user).subscribe({
      next: (response) => {
        console.log('Registration successful', response);
        this.snackBar.open('Account created successfully!', 'Close', {
          duration: 3000
        });
        this.route.navigate(['/login']);
      },

      error: (error) => {
        console.error('Registration failed', error);
        if (error.error && error.error.error) {
          this.snackBar.open(error.error.error, 'Close', { duration: 3000 });
        } else {
          this.snackBar.open('An error occurred during registration.', 'Close', { duration: 3000 });
        }
      }
    });
  }
}

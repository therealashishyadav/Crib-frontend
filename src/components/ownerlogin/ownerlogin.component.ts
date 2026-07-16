// import { Component } from '@angular/core';
// import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
// import { LoginService } from '../../service/login.service';
// import { HttpClient } from '@angular/common/http';
// import { Router, RouterLink } from '@angular/router';
// import { LoginEntity } from '../../entity/LoginEntity';
// import { MatInputModule } from '@angular/material/input';
// import { JwtToken } from '../../entity/JwtToken';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import {MatIconModule} from '@angular/material/icon';


// @Component({
//   selector: 'app-ownerlogin',
//   standalone: true,
//   imports: [
//     CommonModule,
//     MatFormFieldModule,
//     MatFormField,
//     MatInputModule,
//     FormsModule,
//     RouterLink,
//     MatIconModule
//     ],
//     templateUrl: './ownerlogin.component.html',
//     styleUrl: './ownerlogin.component.css'
//   })
//   export class OwnerloginComponent { 

//   user: LoginEntity = new LoginEntity();
//   jwtToken: JwtToken = new JwtToken();
//   token: string='';

//   login(): void{
//     this.loginService.getToken(this.user).subscribe({
//       next: (response)=>{
//         this.token = response.token;
//         this.jwtToken = response;
//         console.log(this.token);
//         this.loginService.loginUser(this.token).subscribe({
//           next: (userResponse)=>{
//             console.log("Logged In");
//             alert("Login Success");
//             // this.route.navigate(['/homepage']);
//             if(userResponse === 'USER'){
//               this.route.navigate(['/ownerpage']);
//             }
//           },
//           error: (error)=>{
//             console.log("Some Error Occured: "+ error);
//           }
//         })
//       }
//     })
//   }

//   constructor(private loginService: LoginService, private http:HttpClient, private route:Router){}

// }


import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { PropertyCardComponent } from '../property-card/property-card.component';
import { MetaService } from '../../service/meta.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    PropertyCardComponent
  ],
    templateUrl: './ownerlogin.component.html',
    styleUrl: './ownerlogin.component.css'
})
export class OwnerloginComponent implements OnInit {
  featuredProperties = signal<any[]>([]);
  recommendedProperties = signal<any[]>([]);
  trendingProperties = signal<any[]>([]);

  constructor(private metaService: MetaService) {}

  ngOnInit() {
    this.metaService.setPrivatePage('Owner Login — CribUp');
    // Mock data - in a real app, this would come from a service
    this.featuredProperties.set([
      {
        id: 1,
        title: 'Luxury PG for Professionals',
        location: 'Bangalore, Koramangala',
        price: 15000,
        image: 'assets/images/property-1.jpg',
        amenities: ['WiFi', 'AC', 'Food', 'Laundry'],
        rating: 4.8,
        reviews: 124,
        verified: true
      },
      {
        id: 2,
        title: 'Premium Girls PG',
        location: 'Delhi, Saket',
        price: 12000,
        image: 'assets/images/property-2.jpg',
        amenities: ['WiFi', 'Security', 'Food', 'Parking'],
        rating: 4.5,
        reviews: 89,
        verified: true
      },
      {
        id: 3,
        title: 'Executive PG for Working Professionals',
        location: 'Mumbai, Andheri East',
        price: 18000,
        image: 'assets/images/property-3.jpg',
        amenities: ['WiFi', 'AC', 'Gym', 'Housekeeping'],
        rating: 4.7,
        reviews: 156,
        verified: true
      }
    ]);

    this.recommendedProperties.set([...this.featuredProperties()]);
    this.trendingProperties.set([...this.featuredProperties()]);
  }

  toggleFavorite(property: any) {
    property.isFavorite = !property.isFavorite;
    // In a real app, this would update via a service
  }
}
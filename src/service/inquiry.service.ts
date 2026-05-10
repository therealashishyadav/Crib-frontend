// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Inquiry } from '../entity/Inquiry';
// import { environment } from '../environment/environment';

// // const post_url = "http://localhost:8080/inquiry/sendMessage";
// const apiUrl = environment.apiUrl;

// @Injectable({
//   providedIn: 'root'
// })

// export class InquiryService {

//   postInquiry(inquiry: Inquiry) {
//     return this.http.post(apiUrl + '/inquiry/sendMessage', inquiry);
//   }

//   constructor(private http: HttpClient) { }
// }

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Inquiry } from '../entity/Inquiry';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InquiryService {

  constructor(private http: HttpClient) {}

  postInquiry(inquiry: Inquiry) {
    return this.http.post(`${environment.apiUrl}/inquiry/sendMessage`, inquiry);
  }
}
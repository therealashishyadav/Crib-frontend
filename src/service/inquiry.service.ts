import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Inquiry } from '../entity/Inquiry';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InquiryService {

  constructor(private http: HttpClient) {}

  postInquiry(inquiry: Inquiry) {
    return this.http.post(`${environment.apiUrl}/inquiry/sendMessage`, inquiry);
  }

getMyInquiries(): Observable<Inquiry[]> {
  return this.http.get<Inquiry[]>(`${environment.apiUrl}/api/inquiries/my`);
}

getReceivedInquiries(): Observable<Inquiry[]> {
  return this.http.get<Inquiry[]>(`${environment.apiUrl}/api/inquiries/received`);
}
}
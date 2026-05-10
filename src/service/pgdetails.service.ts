import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PgModel } from '../entity/PgModel';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

const post_pg_url = `${environment.apiUrl}/addPGWithFiles`

@Injectable({
  providedIn: 'root'
})
export class PgdetailsService {

postPg(formData: FormData) {
  return this.http.post(post_pg_url, formData);
}

  // private api_Url = 'http://localhost:8080/api/pgs';

  private apiUrl = environment.apiUrl;
  private api_Url = `${this.apiUrl}/api/pgs`;



  getAllPGs(): Observable<PgModel[]> {
    return this.http.get<PgModel[]>(this.api_Url);
  }

  getPGById(id: number): Observable<PgModel> {
    return this.http.get<PgModel>(`${this.api_Url}/${id}`);
  }

  updatePG(id: number, pg: PgModel): Observable<PgModel> {
    return this.http.put<PgModel>(`${this.api_Url}/${id}`, pg);
  }

  deletePG(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api_Url}/${id}`);
  }


  constructor(private http:HttpClient) { }
}

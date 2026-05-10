import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Account } from '../entity/Account';
import { JwtToken } from '../entity/JwtToken';
import { environment } from '../environments/environment';


// const post_url = "http://localhost:8080/api/v1/auth/signup"
const apiUrl = environment.apiUrl;


@Injectable({
  providedIn: 'root'
})
export class AccountService {

  createUser(user:Account){
    return this.http.post(apiUrl + '/api/v1/auth/signup', user);
  }

  constructor(private http:HttpClient) { }
}


import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtToken } from '../entity/JwtToken';
import { LoginEntity } from '../entity/LoginEntity';
import { Role } from '../entity/Role';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';

// const token_url = "http://localhost:8080/api/v1/auth/signin"
// const user_url = "http://localhost:8080/api/v1/USER"
// const role_url = "http://localhost:8080/api/v1/auth/role/"

const apiUrl = environment.apiUrl;
const token_url = apiUrl + '/api/v1/auth/signin';
const user_url = apiUrl + '/api/v1/USER';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  getToken(loginEntity: LoginEntity) {
    const payload: any = { password: loginEntity.password };

    if (loginEntity.email.includes('@')) {
      payload.email = loginEntity.email;
    } else {
      payload.phone = loginEntity.email;
    }

    return this.http.post<JwtToken>(token_url, payload);
  }

  loginUser(token: string) {
    return this.http.get(user_url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

  }

  getRole(identifier: string) {
    // role endpoint only works with email, so pass whatever we have
    return this.http.get<string>(apiUrl + `/api/v1/auth/role/${identifier}`);
  }

  currentUser() {

  }

  constructor(private http: HttpClient) { }
}
// src/service/auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Account } from '../entity/Account';

export interface AppUser {
  email: string;
  role: string;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  private userSubject = new BehaviorSubject<AppUser | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor() {
    // Restore user from localStorage on app start
    const stored = localStorage.getItem(this.USER_KEY);
    if (stored) {
      try {
        this.userSubject.next(JSON.parse(stored));
      } catch {
        this.clear();
      }
    }
  }

  // ─── Token Management ──────────────────────────────────────────────
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // ─── User State ────────────────────────────────────────────────────
  getCurrentUser(): AppUser | null {
    return this.userSubject.value;
  }

  login(user: AppUser, token: string): void {
    this.setToken(token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.userSubject.next(user);
  }

  logout(): void {
    this.clear();
    this.userSubject.next(null);
  }

  private clear(): void {
    this.clearToken();
    localStorage.removeItem(this.USER_KEY);
  }

  // ─── JWT Decode (simple) ──────────────────────────────────────────
  decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }

  // ─── Role Check ────────────────────────────────────────────────────
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }
}
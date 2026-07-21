import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = localStorage.getItem('token');
    const role  = localStorage.getItem('role');
    const allowedRoles: string[] = route.data['roles'] || [];

    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    if (!allowedRoles.includes(role?.toUpperCase() || '')) {
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}
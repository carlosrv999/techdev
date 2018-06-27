import { AuthService } from '../auth/auth.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";

@Injectable()
export class LoginGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isLoggedIn()
      .then(
      (authenticated: boolean) => {
        if (!authenticated) {
          return true;
        } else {
          this.router.navigate(['/home/parkings']);
        }
      }
      );
  }

}

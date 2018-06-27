import { AuthService } from '../auth/auth.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { RouterStateSnapshot, Router, CanLoad, Route } from "@angular/router";

@Injectable()
export class AuthGuard implements CanLoad {

  constructor(private authService: AuthService, private router: Router) { }

  canLoad(route: Route ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isLoggedIn()
      .then(
      (authenticated: boolean) => {
        if (authenticated) {
          return true;
        } else {
          this.router.navigate(['/auth/login']);
        }
      }
      );
  }

}

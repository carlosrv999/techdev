import { Response } from '@angular/http';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { AppUtil } from '../constants/constants';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

  constructor(private http: Http) { }

  loginUser(email: string, password: string) {
    return this.http.post(AppUtil.HTTP + AppUtil.IP + "/companies/login", {
      "email": email,
      "password": password
    }).map((response: Response) => {
      localStorage.setItem('user', JSON.stringify(response.json()));
      return response.json();
    });
  }

  signupUser(objSubmit: any) {
    return this.http.post(AppUtil.HTTP + AppUtil.IP + "/companies", objSubmit).map(
      (response: Response) => {
        let result = response.json();
        return result;
      }
    )
  }

  logoutUser() {
    localStorage.clear();
  }

  isLoggedIn() {
    const promise = new Promise(
      (resolve, reject) => {
        setTimeout(() => {
          if (localStorage.getItem('user')) {
            resolve(true);
          }
          else {
            resolve(false);
          };
        }, 100);
      }
    );
    return promise;
  }

  public isLoggedInSync(): boolean {
    if (localStorage.getItem('user')) {
      return true;
    }
    else {
      return false;
    };
  }

}

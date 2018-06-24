import { Cochera } from './../models/cochera.model';
import { Response } from '@angular/http';
import { Constantes } from './../models/constantes';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
@Injectable()
export class AuthService {
  public cochera: Cochera;

  public setCochera(cochera: Cochera) {
    this.cochera = cochera;
  }

  public getCochera(): Cochera {
    return this.cochera;
  }

  constructor(private http: Http) {}
  loginUser(username: string, password: string) {
    return this.http.post(Constantes.HTTP+Constantes.IP+":"+Constantes.PORT+'/'+Constantes.COCHERA_API+"/login", {
      "username": username,
      "password": password
    });
  }

  isLoggedIn() {
    const promise = new Promise(
      (resolve, reject) => {
        setTimeout(() => {
          if(localStorage.key(0)) {
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

  logoutUser() {
    localStorage.clear();
  }

  public isLoggedInSync(): boolean {
    if(localStorage.key(0)) {
      return true;
    }
    else {
      return false;
    };
  }
}
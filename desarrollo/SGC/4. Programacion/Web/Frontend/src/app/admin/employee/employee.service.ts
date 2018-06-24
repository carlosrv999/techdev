import { Observable } from 'rxjs/Observable';
import { AppUtil } from '../../constants/constants';
import 'rxjs/add/operator/map';
import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class EmployeeService {
  constructor(private http: Http) { }

  getCountEmployees(id_company: string) {
    return this.http.get(AppUtil.HTTP + AppUtil.IP + '/employees/countByCompany?id_company=' + id_company).map(
      (response: Response) => {
        let responseObj = response.json();
        return responseObj.count;
      }
    )
  }

  postEmployee(body: any) {
    return this.http.post(AppUtil.HTTP + AppUtil.IP + '/employees', body).map(
      (response: Response) => {
        let responseObj = response.json();
        return responseObj;
      }
    )
  }

  getEmployees(id_company: string, limit: number, page: number) {
    return this.http.get(`${AppUtil.HTTP}${AppUtil.IP}/employees/byCompany?id_company=${id_company}&limit=${limit}&page=${page}`).map(
      (response: Response) => {
        let responseObj = response.json();
        return responseObj;
      }
    )
  }

  getEmployeeSearch(id_company: string, limit: number, page: number, name: string) {
    return this.http.get(`${AppUtil.HTTP}${AppUtil.IP}/employees/search?id_company=${id_company}&limit=${limit}&page=${page}&name=${name}`).map(
      (response: Response) => {
        let responseObj = response.json();
        return responseObj;
      }
    )
  }

  getCountEmployeeSearch(id_company: string, name: string) {
    return this.http.get(`${AppUtil.HTTP}${AppUtil.IP}/employees/countByCompanyByName?id_company=${id_company}&name=${name}`).map(
      (response: Response) => {
        let responseObj = response.json();
        return responseObj.count;
      }
    )
  }
  
}

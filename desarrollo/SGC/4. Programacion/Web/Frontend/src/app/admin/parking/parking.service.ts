import { Observable } from 'rxjs/Observable';
import { AppUtil } from '../../constants/constants';
import 'rxjs/add/operator/map';
import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ParkingService {
  public id_parking = null;

  constructor(private http: Http) { }

  getParkings(id_company: string, limit: number, page: number) {
    return this.http.get(`${AppUtil.HTTP}${AppUtil.IP}/parking/byCompany?id_company=${id_company}&limit=${limit}&page=${page}`).map(
      (response: Response) => {
        let responseObj = response.json();
        return responseObj;
      }
    )
  }

  getServices(id) {
    return this.http.get(`${AppUtil.HTTP}${AppUtil.IP}/parking/${id}/services`).map(
      (response: Response) => {
        let responseObj = response.json();
        return responseObj;
      }
    )
  }

  getParkingsSearch(id_company: string, limit: number, page: number, name: string) {
    return this.http.get(`${AppUtil.HTTP}${AppUtil.IP}/parking/search?id_company=${id_company}&limit=${limit}&page=${page}&name=${name}`).map(
      (response: Response) => {
        let responseObj = response.json();
        return responseObj;
      }
    )
  }

  getCountParkings(id_company: string) {
    return this.http.get(AppUtil.HTTP + AppUtil.IP + '/parking/countByCompany?id_company=' + id_company).map(
      (response: Response) => {
        let responseObj = response.json();
        return responseObj.count;
      }
    )
  }

  getAllNamesByCompany(id_company: string) {
    return this.http.get(AppUtil.HTTP + AppUtil.IP + '/parking/from-company?id_company=' + id_company).map(
      (response: Response) => {
        let responseObj = response.json();
        return responseObj;
      }
    )
  }

  createParking(objSubmit: any) {
    return this.http.post(`${AppUtil.HTTP}${AppUtil.IP}/parking`, objSubmit).map(
      (response: Response) => {
        let responseObj = response.json();
        return responseObj.count;
      }
    )
  }

  changeParkingPassword(objSubmit: any, id_user) {
    return this.http.patch(`${AppUtil.HTTP}${AppUtil.IP}/users/${id_user}/changePass`, objSubmit).map(
      (response: Response) => {
        let responseObj = response.json();
        return responseObj;
      }
    )
  }

  updateParking(objSubmit: any, id_parking) {
    return this.http.patch(`${AppUtil.HTTP}${AppUtil.IP}/parking/${id_parking}`, objSubmit).map(
      (response) => {
        let responseObj = response.json();
        return responseObj;
      }
    )
  }

  updateService(id: string, objSubmit: any) {
    return this.http.patch(`${AppUtil.HTTP}${AppUtil.IP}/parkingservices/${id}`, objSubmit).map(
      (response) => {
        let responseObj = response.json();
        return responseObj;
      }
    )
  }

  uploadFile(files: any): Observable<any> {
    let url: string = `${AppUtil.HTTP}${AppUtil.IP}/upload-image`;
    return Observable.create(
        observer => {
            const request = new XMLHttpRequest();
            var formData = new FormData();
            files.forEach((element: File) => {
                formData.append("photos", element);
            });
            console.log(formData);
            request.onload = () => {
                if (request.status === 200) {
                    observer.next(request);
                } else {
                    observer.next(new Error(request.statusText));
                }
            };
            request.onerror = () => {
                observer.error(new Error('XMLHttpRequest error: ' + request.statusText));
            }
            request.open('POST', url);
            request.send(formData);
        }
    )
}

  getCountParkingsSearch(id_company: string, name: string) {
    return this.http.get(`${AppUtil.HTTP}${AppUtil.IP}/parking/countByCompanyByName?id_company=${id_company}&name=${name}`).map(
      (response: Response) => {
        let responseObj = response.json();
        return responseObj.count;
      }
    )
  }

  getNotUsedServices(id: string) {
    return this.http.get(`${AppUtil.HTTP}${AppUtil.IP}/parking/${id}/notUsedServices`).map(
      (response: Response) => {
        let responseObj = response.json();
        return responseObj;
      }
    )
  }

  createService(id: string, values) {
    return this.http.post(`${AppUtil.HTTP}${AppUtil.IP}/parking/${id}/services`, values).map(
      (response: Response) => {
        let responseObj = response.json();
        return responseObj;
      }
    )
  }
}

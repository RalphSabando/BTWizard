import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from 'src/app/constants/routes.const';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient) { }

  get(route: string): Observable<any> {
    return this.http.get(`${BaseApi}/${route}`);
  }

  post(route: string, data: any): Observable<any> {
    return this.http.post(`${BaseApi}/${route}`, data);
  }

  put(route: string, data: any): Observable<any> {
    return this.http.put(`${BaseApi}/${route}`, data);
  }
  
  delete(route: string): Observable<any> {
    return this.http.delete(`${BaseApi}/${route}`);
  }

}

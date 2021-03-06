import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs';
​
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  loading = false;
  constructor(public _http: HttpClient) { }
​
  isLoading(){
    return this.loading
  }​

  startLoading(){
    this.loading=true;
  }
  stopLoading(){
    this.loading= false;
  }

  //1. GET
  get(url: string, headers:any = {'Content-Type':  'application/json'}): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders(headers)
    };
    this.startLoading();
    return this._http.get(url, httpOptions)
  }
​
  // 2. POST
  post(url: string, body:object, headers:any = {'Content-Type':  'application/json'}): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders(headers)
    };
    this.startLoading();
    return this._http.post(url, body, httpOptions);
  }
​
  // 3.DELETE
  delete(url: string, headers:any = {'Content-Type':  'application/json'}): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders(headers)
    };
    this.startLoading();
    return this._http.delete(url, httpOptions)
  }
​
  // 4.PUT
  put(url: string, body:object, headers:any = {'Content-Type':  'application/json'}): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders(headers)
    };
    this.startLoading();
    return this._http.put(url, body, httpOptions);
  }
​
}
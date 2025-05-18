import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DetailsSiteService {
  constructor(private http: HttpClient) { }

  getUsers(): Observable<number> {
    return this.http.get<number>('https://creativepeak-api.onrender.com/api/User/Count');
  }

  getImages(): Observable<any[]> {
    return this.http.get<any[]>('https://creativepeak-api.onrender.com/api/Image');
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>('https://creativepeak-api.onrender.com/api/Category');
  }
}

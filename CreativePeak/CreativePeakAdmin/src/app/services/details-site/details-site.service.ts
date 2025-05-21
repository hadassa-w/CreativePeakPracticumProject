import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../modules/user';

@Injectable({
  providedIn: 'root'
})
export class DetailsSiteService {
  constructor(private http: HttpClient) { }

  getCountUsers(): Observable<number> {
    return this.http.get<number>('https://creativepeak-api.onrender.com/api/User/Count');
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('https://creativepeak-api.onrender.com/api/User');
  }

  getImages(): Observable<any[]> {
    return this.http.get<any[]>('https://creativepeak-api.onrender.com/api/Image');
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>('https://creativepeak-api.onrender.com/api/Category');
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../modules/user';
import { firstValueFrom, Observable } from 'rxjs';
import { CreateUser } from '../../modules/createUser';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private http: HttpClient) { }

  getCountUsers(): Observable<number> {
    return this.http.get<number>('https://creativepeak-api.onrender.com/api/User/Count');
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('https://creativepeak-api.onrender.com/api/User');
  }

  async getUserById(userId: number): Promise<void> {
    await firstValueFrom(
      this.http.get<User>(`https://creativepeak-api.onrender.com/api/User/${userId}`)
    );
  }

  async createUser(user: CreateUser): Promise<void> {
    await firstValueFrom(
      this.http.post<User>(`https://creativepeak-api.onrender.com/api/User`, user)
    );
  }

  async updateUser(userId: number, user: User): Promise<void> {
    await firstValueFrom(
      this.http.put<User>(`https://creativepeak-api.onrender.com/api/User/updateWithoutPassword/${userId}`, user)
    );
  }

  async deleteUser(userId: number): Promise<void> {
    await firstValueFrom(
      this.http.delete<void>(`https://creativepeak-api.onrender.com/api/User/${userId}`)
    );
  }

  getImages(): Observable<any[]> {
    return this.http.get<any[]>('https://creativepeak-api.onrender.com/api/Image');
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>('https://creativepeak-api.onrender.com/api/Category');
  }
}

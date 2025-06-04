import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isLoggedIn = new BehaviorSubject<boolean>(false);
  private _userName = new BehaviorSubject<string>('');

  constructor() {
    // Check local storage for existing session
    const storedUser = localStorage.getItem('userName');
    if (storedUser) {
      this._isLoggedIn.next(true);
      this._userName.next(storedUser);
    }
  }

  get isLoggedIn(): boolean {
    return this._isLoggedIn.value;
  }

  get userName(): string {
    return this._userName.value;
  }

  login(username: string, token: string): boolean {
    this._isLoggedIn.next(true);
    this._userName.next(username);
    localStorage.setItem('userName', username);
    localStorage.setItem('token', token);
    return true;
  }

  logout(): void {
    this._isLoggedIn.next(false);
    this._userName.next('');
    localStorage.removeItem('userName');
    localStorage.removeItem('token');
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Placeholder Firebase Auth State
  private userSubject = new BehaviorSubject<User | null>(null);
  
  constructor() {
    // Check local storage for mocked session
    const savedUser = localStorage.getItem('mock_firebase_user');
    if (savedUser) {
      this.userSubject.next(JSON.parse(savedUser));
    }
  }

  get user$(): Observable<User | null> {
    return this.userSubject.asObservable();
  }

  login(email: string, password: string): Observable<boolean> {
    // Mock login simulating Firebase Auth
    const mockUser: User = {
      uid: 'user123',
      email: email,
      displayName: email.split('@')[0]
    };
    
    this.userSubject.next(mockUser);
    localStorage.setItem('mock_firebase_user', JSON.stringify(mockUser));
    
    return of(true).pipe(delay(1000));
  }

  googleSignIn(): Observable<boolean> {
    const mockUser: User = {
      uid: 'googleUser456',
      email: 'user@gmail.com',
      displayName: 'Google User'
    };
    
    this.userSubject.next(mockUser);
    localStorage.setItem('mock_firebase_user', JSON.stringify(mockUser));
    
    return of(true).pipe(delay(800));
  }

  logout() {
    this.userSubject.next(null);
    localStorage.removeItem('mock_firebase_user');
  }

  signup(email: string, password: string): Observable<boolean> {
    return this.login(email, password);
  }
}

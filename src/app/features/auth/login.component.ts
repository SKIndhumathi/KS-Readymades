import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="login-page">
      <div class="auth-box">
        <h2 class="text-center">{{ isLogin ? 'Welcome Back' : 'Create an Account' }}</h2>
        <p class="text-center subtitle" *ngIf="isLogin">Sign in to your KS Readymades account</p>
        <p class="text-center subtitle" *ngIf="!isLogin">Join KS Readymades today</p>
        
        <form [formGroup]="authForm" (ngSubmit)="onSubmit()">
          <div class="form-group" *ngIf="!isLogin">
            <label class="form-label">Name</label>
            <input type="text" formControlName="name" class="form-control" placeholder="John Doe">
          </div>
          
          <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" formControlName="email" class="form-control" placeholder="you&#64;example.com">
          </div>
          
          <div class="form-group">
            <div class="flex-between">
              <label class="form-label" style="margin-bottom:0">Password</label>
              <a href="javascript:void(0)" class="forgot-link" *ngIf="isLogin">Forgot password?</a>
            </div>
            <input type="password" formControlName="password" class="form-control" placeholder="••••••••">
          </div>
          
          <button type="submit" class="btn btn-primary btn-block" [disabled]="authForm.invalid || isLoading">
            {{ isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up') }}
          </button>
        </form>
        
        <div class="divider">
          <span>OR</span>
        </div>
        
        <button class="btn-google" (click)="signInWithGoogle()">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
          Sign {{ isLogin ? 'in' : 'up' }} with Google
        </button>
        
        <div class="auth-switch text-center">
          <p>{{ isLogin ? "Don't have an account?" : "Already have an account?" }} 
            <button class="switch-btn" (click)="toggleMode()">{{ isLogin ? 'Sign up' : 'Sign in' }}</button>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: calc(100vh - 80px);
      padding: 2rem;
    }
    .auth-box {
      width: 100%;
      max-width: 450px;
      padding: 3rem;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-md);
    }
    .auth-box h2 {
      font-size: 2rem;
      margin-bottom: 0.25rem;
    }
    .subtitle {
      color: var(--text-secondary);
      margin-bottom: 2rem;
      font-size: 0.95rem;
    }
    .flex-between {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    .forgot-link {
      font-size: 0.85rem;
      color: var(--text-secondary);
    }
    .forgot-link:hover { color: var(--accent); }
    .divider {
      text-align: center;
      margin: 1.5rem 0;
      position: relative;
    }
    .divider::before {
      content: "";
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: var(--border);
      z-index: 1;
    }
    .divider span {
      position: relative;
      background: var(--surface);
      padding: 0 15px;
      color: var(--text-light);
      font-size: 0.85rem;
      z-index: 2;
    }
    .btn-google {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      padding: 0.85rem;
      background: white;
      border: 1px solid var(--border);
      color: var(--text-primary);
      font-weight: 500;
      font-family: var(--font-sans);
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    .btn-google:hover {
      background: var(--surface-hover);
      border-color: var(--text-light);
    }
    .auth-switch {
      margin-top: 2rem;
      font-size: 0.95rem;
      color: var(--text-secondary);
    }
    .switch-btn {
      color: var(--accent);
      font-weight: 600;
      text-decoration: underline;
      padding: 0;
      background: none;
      border: none;
      cursor: pointer;
      font-family: var(--font-sans);
    }
  `]
})
export class LoginComponent {
  isLogin = true;
  isLoading = false;
  authForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      name: ['']
    });
  }

  toggleMode() {
    this.isLogin = !this.isLogin;
    if (this.isLogin) {
      this.authForm.get('name')?.clearValidators();
    } else {
      this.authForm.get('name')?.setValidators([Validators.required]);
    }
    this.authForm.get('name')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.authForm.invalid) return;
    this.isLoading = true;
    const { email, password } = this.authForm.value;

    const authAction = this.isLogin
      ? this.authService.login(email, password)
      : this.authService.signup(email, password);

    authAction.subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/profile']);
      },
      error: () => {
        this.isLoading = false;
        alert('Authentication failed');
      }
    });
  }

  signInWithGoogle() {
    this.isLoading = true;
    this.authService.googleSignIn().subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/profile']);
      }
    });
  }
}

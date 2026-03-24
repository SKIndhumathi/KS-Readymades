import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { AuthService, User } from '../../../core/services/auth.service';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="ks-header" [class.scrolled]="isScrolled">
      <div class="container header-container">
        
        <!-- Logo -->
        <a routerLink="/" class="ks-logo">
          KS Readymades
        </a>
        
        <!-- Center Navigation -->
        <nav class="ks-nav-center">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
          <a routerLink="/shop" [queryParams]="{category: 'Shirts'}" routerLinkActive="active">Shirts</a>
          <a routerLink="/shop" [queryParams]="{category: 'Trousers'}" routerLinkActive="active">Trousers</a>
          <a routerLink="/shop" [queryParams]="{category: 'T-Shirts'}" routerLinkActive="active">T-Shirts</a>
          <a routerLink="/shop" [queryParams]="{category: 'Accessories'}" routerLinkActive="active">Accessories</a>
        </nav>
        
        <!-- Right Navigation -->
        <div class="ks-nav-right">
          
          <a *ngIf="(user$ | async) === null" routerLink="/login" class="nav-icon-btn">
            Sign In
          </a>
          <a *ngIf="(user$ | async) as user" routerLink="/profile" class="nav-icon-btn">
            {{user.displayName || 'Account'}}
          </a>
          
          <a routerLink="/cart" class="ks-cart-btn" aria-label="Cart">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <span class="cart-badge" *ngIf="(cartCount$ | async) as count">{{ count }}</span>
          </a>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .ks-header {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 1000;
      background-color: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(0,0,0,0.05);
      transition: all var(--transition-normal);
      height: 80px;
      display: flex;
      align-items: center;
    }
    
    .ks-header.scrolled {
      height: 70px;
      background-color: rgba(255, 255, 255, 0.95);
      box-shadow: var(--shadow-sm);
    }
    
    .header-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
    
    /* Logo */
    .ks-logo {
      font-family: var(--font-serif);
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--primary);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      text-decoration: none;
    }
    
    /* Center Nav */
    .ks-nav-center {
      display: flex;
      gap: 2.5rem;
    }
    .ks-nav-center a {
      font-family: var(--font-sans);
      font-size: 0.9rem;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 500;
      position: relative;
    }
    .ks-nav-center a::after {
      content: '';
      position: absolute;
      bottom: -6px;
      left: 0;
      width: 0;
      height: 2px;
      background-color: var(--accent);
      transition: width var(--transition-normal);
    }
    .ks-nav-center a:hover::after, .ks-nav-center a.active::after {
      width: 100%;
    }
    .ks-nav-center a.active {
      color: var(--primary);
    }
    
    /* Right Nav */
    .ks-nav-right {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    
    .nav-icon-btn {
      font-family: var(--font-sans);
      font-size: 0.9rem;
      color: var(--primary);
      font-weight: 500;
      background: none;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .nav-icon-btn:hover {
      color: var(--accent);
    }
    
    .ks-cart-btn {
      position: relative;
      color: var(--primary);
      display: flex;
      align-items: center;
    }
    .ks-cart-btn:hover {
      color: var(--accent);
    }
    
    .cart-badge {
      position: absolute;
      top: -8px;
      right: -10px;
      background-color: var(--accent);
      color: #fff;
      font-size: 0.7rem;
      font-weight: 700;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    @media (max-width: 900px) {
      .ks-nav-center { display: none; }
    }
  `]
})
export class HeaderComponent implements OnInit {
  cartCount$: Observable<number>;
  user$: Observable<User | null>;
  isScrolled = false;

  constructor(
    private cartService: CartService, 
    private authService: AuthService,
    private router: Router
  ) {
    this.cartCount$ = this.cartService.getCart().pipe(
      map(items => items.reduce((sum, item) => sum + item.cartQuantity, 0))
    );
    this.user$ = this.authService.user$;
  }

  ngOnInit(): void {
    window.addEventListener('scroll', () => {
      this.isScrolled = window.scrollY > 20;
    });
    
    // Smooth scroll to top on nav change
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      window.scrollTo(0, 0);
    });
  }
}

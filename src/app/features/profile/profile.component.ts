import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, User } from '../../core/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container section profile-page">
      <div class="profile-layout">
        
        <!-- Sidebar -->
        <aside class="profile-sidebar">
          <div class="user-info" *ngIf="user$ | async as user">
            <div class="avatar">{{ user.displayName.charAt(0).toUpperCase() }}</div>
            <h3>{{ user.displayName }}</h3>
            <p>{{ user.email }}</p>
          </div>
          
          <nav class="profile-nav">
            <a href="javascript:void(0)" class="active">My Orders</a>
            <a href="javascript:void(0)">Account Details</a>
            <a href="javascript:void(0)">Saved Addresses</a>
            <a href="javascript:void(0)">Wishlist</a>
            <button (click)="logout()" class="logout-btn">Log Out</button>
          </nav>
        </aside>

        <!-- Main Content -->
        <div class="profile-content">
          <h2>My Orders</h2>
          
          <div class="orders-list">
            <div class="order-card">
              <div class="order-header">
                <div>
                  <span class="order-id">Order #KS-2026-9810</span>
                  <span class="order-date">Placed on Oct 24, 2026</span>
                </div>
                <div class="order-status delivered">Delivered</div>
              </div>
              <div class="order-body">
                <div class="order-items">
                  <div class="item">
                    <img src="https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=150&q=80" alt="Shirt">
                    <div>
                      <p class="name">Classic White Oxford Shirt</p>
                      <p class="meta">Size: M | Color: White</p>
                    </div>
                  </div>
                </div>
                <div class="order-total">
                  <p>Total Amount</p>
                  <h4>₹2,499</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  `,
  styles: [`
    .profile-page {
      padding-top: 4rem;
    }
    .profile-layout {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 3rem;
    }
    .profile-sidebar {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 2rem 1.5rem;
      height: max-content;
      position: sticky;
      top: 100px;
    }
    .user-info {
      text-align: center;
      margin-bottom: 2rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid var(--border-light);
    }
    .avatar {
      width: 70px;
      height: 70px;
      background: var(--primary);
      color: white;
      font-size: 1.8rem;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      margin: 0 auto 1rem;
    }
    .user-info h3 {
      font-family: var(--font-sans);
      font-size: 1.1rem;
      margin-bottom: 0.3rem;
    }
    .user-info p {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }
    .profile-nav {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .profile-nav a {
      padding: 0.8rem 1rem;
      border-radius: var(--radius-sm);
      font-weight: 500;
      font-size: 0.95rem;
      color: var(--text-secondary);
    }
    .profile-nav a:hover, .profile-nav a.active {
      background: var(--bg-color);
      color: var(--primary);
    }
    .logout-btn {
      margin-top: 1.5rem;
      padding: 0.8rem 1rem;
      text-align: left;
      color: #e53935;
      font-weight: 500;
      background: none;
      border: none;
      cursor: pointer;
      font-family: var(--font-sans);
      font-size: 0.95rem;
    }
    .logout-btn:hover {
      background: #ffebee;
      border-radius: var(--radius-sm);
    }
    .profile-content h2 {
      font-size: 2rem;
      margin-bottom: 2rem;
    }
    .order-card {
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      margin-bottom: 1.5rem;
      overflow: hidden;
    }
    .order-header {
      background: var(--surface-hover);
      padding: 1.25rem 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--border-light);
    }
    .order-id {
      display: block;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }
    .order-date {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }
    .order-status {
      padding: 0.3rem 0.8rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
    }
    .order-status.delivered {
      background: #e6f4ea;
      color: #137333;
    }
    .order-body {
      padding: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .item {
      display: flex;
      gap: 1.25rem;
      align-items: center;
    }
    .item img {
      width: 70px;
      height: 70px;
      object-fit: cover;
      border-radius: var(--radius-sm);
    }
    .item .name {
      font-weight: 600;
      margin-bottom: 0.25rem;
    }
    .item .meta {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }
    .order-total {
      text-align: right;
    }
    .order-total p {
      color: var(--text-secondary);
      font-size: 0.9rem;
      margin-bottom: 0.25rem;
    }
    .order-total h4 {
      font-family: var(--font-sans);
      font-size: 1.3rem;
    }
    @media (max-width: 900px) {
      .profile-layout {
        grid-template-columns: 1fr;
      }
      .profile-sidebar { position: static; }
      .order-body { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
      .order-total { text-align: left; }
    }
  `]
})
export class ProfileComponent implements OnInit {
  user$!: Observable<User | null>;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user$ = this.authService.user$;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="ks-footer">
      <div class="container">
        <div class="footer-grid grid grid-cols-4">
          
          <div class="footer-brand">
            <h3 class="footer-logo">KS Readymades</h3>
            <p class="footer-desc">Premium men's wear for the modern gentleman. Elevate your wardrobe with our curated collections of timeless elegance.</p>
          </div>
          
          <div class="footer-col">
            <h4>Shop</h4>
            <ul>
              <li><a routerLink="/shop" [queryParams]="{category: 'Shirts'}">Casual Shirts</a></li>
              <li><a routerLink="/shop" [queryParams]="{category: 'Trousers'}">Trousers & Jeans</a></li>
              <li><a routerLink="/shop" [queryParams]="{category: 'Suits'}">Premium Suits</a></li>
              <li><a routerLink="/shop" [queryParams]="{category: 'Accessories'}">Accessories</a></li>
            </ul>
          </div>
          
          <div class="footer-col">
            <h4>Company</h4>
            <ul>
              <li><a href="javascript:void(0)">Our Story</a></li>
              <li><a href="javascript:void(0)">Sustainability</a></li>
              <li><a href="javascript:void(0)">Careers</a></li>
              <li><a href="javascript:void(0)">Contact Us</a></li>
            </ul>
          </div>
          
          <div class="footer-col">
            <h4>Client Services</h4>
            <ul>
              <li><a href="javascript:void(0)">Shipping & Returns</a></li>
              <li><a href="javascript:void(0)">Size Guide</a></li>
              <li><a href="javascript:void(0)">FAQ</a></li>
              <li><a href="javascript:void(0)">Bespoke Tailoring</a></li>
            </ul>
          </div>
          
        </div>
        
        <div class="footer-bottom">
          <p>&copy; {{ currentYear }} KS Readymades. All rights reserved.</p>
          <div class="footer-legal">
            <a href="javascript:void(0)">Privacy Policy</a>
            <a href="javascript:void(0)">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .ks-footer {
      background-color: var(--primary);
      color: #fff;
      padding: 5rem 0 2rem 0;
      margin-top: auto;
    }
    
    .footer-grid {
      border-bottom: 1px solid rgba(255,255,255,0.1);
      padding-bottom: 4rem;
      margin-bottom: 2rem;
    }
    
    .footer-logo {
      font-family: var(--font-serif);
      font-size: 1.5rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-bottom: 1rem;
      color: #fff;
    }
    
    .footer-desc {
      color: #9CA3AF;
      font-size: 0.95rem;
      line-height: 1.8;
      max-width: 250px;
    }
    
    .footer-col h4 {
      font-family: var(--font-sans);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-size: 0.85rem;
      font-weight: 600;
      color: #fff;
      margin-bottom: 1.5rem;
    }
    
    .footer-col ul {
      list-style: none;
    }
    
    .footer-col li {
      margin-bottom: 0.8rem;
    }
    
    .footer-col a {
      color: #9CA3AF;
      font-size: 0.95rem;
    }
    
    .footer-col a:hover {
      color: var(--accent);
      padding-left: 5px;
    }
    
    .footer-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #6B7280;
      font-size: 0.85rem;
    }
    
    .footer-legal {
      display: flex;
      gap: 1.5rem;
    }
    
    .footer-legal a {
      color: #6B7280;
    }
    .footer-legal a:hover {
      color: #fff;
    }
    
    @media (max-width: 768px) {
      .footer-bottom {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}

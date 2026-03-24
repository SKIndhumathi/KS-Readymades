import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService, CartItem } from '../../core/services/cart.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="cart-page container section">
      
      <div class="cart-header">
        <h1 class="cart-title">Shopping Bag</h1>
        <p class="cart-count" *ngIf="cartItems.length > 0">{{cartItems.length}} Items</p>
      </div>

      <div class="cart-layout" *ngIf="cartItems.length > 0; else emptyCart">
        
        <!-- Left: Cart Items -->
        <div class="cart-items-section">
          
          <!-- Table Header -->
          <div class="cart-table-header">
            <div class="th-product">Product</div>
            <div class="th-qty">Quantity</div>
            <div class="th-total">Total</div>
          </div>
          
          <!-- Cart Items List -->
          <div class="cart-item" *ngFor="let item of cartItems; let i = index">
            
            <div class="item-product">
              <a [routerLink]="['/product', item.id]" class="item-img">
                <img [src]="item.imageUrl" [alt]="item.name">
              </a>
              <div class="item-details">
                <a [routerLink]="['/product', item.id]" class="item-name">{{item.name}}</a>
                <p class="item-variant">Color: {{item.selectedColor}} | Size: {{item.selectedSize}}</p>
                <p class="item-price">₹{{(item.discountPrice || item.price) | number:'1.0-0'}}</p>
                
                <button class="remove-btn" (click)="removeItem(item)">Remove</button>
              </div>
            </div>
            
            <div class="item-qty">
              <div class="qty-selector">
                <button class="qty-btn" (click)="updateQty(item, item.cartQuantity - 1)">−</button>
                <input type="number" [value]="item.cartQuantity" readonly class="qty-input">
                <button class="qty-btn" (click)="updateQty(item, item.cartQuantity + 1)">+</button>
              </div>
            </div>
            
            <div class="item-total">
              <span class="currency">₹</span>{{ (item.discountPrice || item.price) * item.cartQuantity | number:'1.0-0' }}
            </div>
            
          </div>
        </div>

        <!-- Right: Order Summary -->
        <div class="cart-summary-wrap">
          <div class="cart-summary">
            <h3 class="summary-title">Order Summary</h3>
            
            <div class="summary-row">
              <span class="lbl">Subtotal</span>
              <span class="val">₹{{cartTotal | number:'1.0-0'}}</span>
            </div>
            <div class="summary-row">
              <span class="lbl">Shipping</span>
              <span class="val">Complimentary</span>
            </div>
            
            <div class="summary-divider"></div>
            
            <div class="summary-row summary-total">
              <span class="lbl">Total</span>
              <span class="val">₹{{cartTotal | number:'1.0-0'}}</span>
            </div>
            
            <p class="summary-taxes">Prices are inclusive of all taxes.</p>
            
            <a routerLink="/checkout" class="btn btn-primary btn-block checkout-btn">Proceed to Checkout</a>
            
            <div class="secure-checkout">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              <span>Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>

      <ng-template #emptyCart>
        <div class="empty-cart text-center">
          <div class="empty-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          </div>
          <h2>Your bag is empty</h2>
          <p class="empty-desc">Discover our latest arrivals and elevate your wardrobe.</p>
          <div class="empty-actions">
            <a routerLink="/login" class="btn btn-secondary">Sign In</a>
            <a routerLink="/shop" class="btn btn-primary">Start Shopping</a>
          </div>
        </div>
      </ng-template>
      
    </div>
  `,
  styles: [`
    .cart-page {
      min-height: 70vh;
      padding-top: 4rem;
    }
    
    .cart-header {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      border-bottom: 1px solid var(--border);
      padding-bottom: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .cart-title {
      font-size: 2.5rem;
      font-weight: 400;
    }
    
    .cart-count {
      font-family: var(--font-sans);
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-size: 0.85rem;
    }
    
    .cart-layout {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 4rem;
      align-items: flex-start;
    }
    
    /* Left: Items */
    .cart-items-section {
      width: 100%;
    }
    
    .cart-table-header {
      display: grid;
      grid-template-columns: 3fr 1fr 1fr;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border-light);
      margin-bottom: 2rem;
      font-family: var(--font-sans);
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-secondary);
      font-weight: 600;
    }
    
    .th-qty, .item-qty { text-align: center; }
    .th-total, .item-total { text-align: right; }
    
    .cart-item {
      display: grid;
      grid-template-columns: 3fr 1fr 1fr;
      align-items: center;
      padding-bottom: 2rem;
      margin-bottom: 2rem;
      border-bottom: 1px solid var(--border-light);
    }
    
    .item-product {
      display: flex;
      gap: 1.5rem;
    }
    
    .item-img {
      width: 100px;
      height: 125px;
      background: var(--surface);
      border-radius: var(--radius-sm);
      overflow: hidden;
      flex-shrink: 0;
    }
    .item-img img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .item-name {
      font-family: var(--font-sans);
      font-size: 1.05rem;
      color: var(--primary);
      text-decoration: none;
      font-weight: 500;
      margin-bottom: 0.5rem;
      display: block;
    }
    .item-name:hover {
      color: var(--accent);
    }
    
    .item-variant {
      font-size: 0.85rem;
      color: var(--text-secondary);
      margin-bottom: 0.5rem;
    }
    
    .item-price {
      font-size: 0.95rem;
      color: var(--primary);
      margin-bottom: 1rem;
    }
    
    .remove-btn {
      background: none;
      border: none;
      font-family: var(--font-sans);
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-light);
      cursor: pointer;
      padding: 0;
      text-decoration: underline;
      transition: color var(--transition-fast);
    }
    .remove-btn:hover { color: var(--accent); }
    
    /* Qty Selector */
    .qty-selector {
      display: inline-flex;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      height: 40px;
      overflow: hidden;
    }
    .qty-btn {
      width: 30px;
      background: transparent;
      border: none;
      font-size: 1rem;
      cursor: pointer;
      color: var(--text-secondary);
    }
    .qty-btn:hover { background: var(--surface-hover); }
    .qty-input {
      width: 35px;
      text-align: center;
      border: none;
      font-family: var(--font-sans);
      outline: none;
      font-size: 0.95rem;
    }
    
    .item-total {
      font-family: var(--font-sans);
      font-size: 1.1rem;
      color: var(--primary);
      font-weight: 500;
    }
    
    /* Right: Summary */
    .cart-summary-wrap {
      position: sticky;
      top: 100px;
    }
    
    .cart-summary {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 2rem;
    }
    
    .summary-title {
      font-family: var(--font-sans);
      font-size: 1.2rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 2rem;
      font-weight: 500;
    }
    
    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
      font-family: var(--font-sans);
      font-size: 0.95rem;
    }
    .summary-row .lbl { color: var(--text-secondary); }
    .summary-row .val { color: var(--primary); font-weight: 500; }
    
    .summary-divider {
      height: 1px;
      background-color: var(--border-light);
      margin: 1.5rem 0;
    }
    
    .summary-total {
      font-size: 1.2rem;
    }
    .summary-total .val {
      font-size: 1.5rem;
    }
    
    .summary-taxes {
      font-size: 0.8rem;
      color: var(--text-light);
      text-align: right;
      margin-top: 0.5rem;
      margin-bottom: 2rem;
    }
    
    .checkout-btn {
      padding: 1rem 0;
      font-size: 1rem;
      margin-bottom: 1.5rem;
    }
    
    .secure-checkout {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      color: var(--text-secondary);
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    /* Empty Cart */
    .empty-cart {
      padding: 6rem 0;
      max-width: 500px;
      margin: 0 auto;
    }
    .empty-icon {
      color: var(--border);
      margin-bottom: 1.5rem;
    }
    .empty-cart h2 {
      font-size: 2rem;
      margin-bottom: 1rem;
    }
    .empty-desc {
      color: var(--text-secondary);
      margin-bottom: 2.5rem;
    }
    .empty-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }
    
    @media (max-width: 900px) {
      .cart-layout {
        grid-template-columns: 1fr;
      }
      .cart-summary-wrap {
        position: static;
      }
      .cart-item {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
      .th-qty, .th-total { display: none; }
      .cart-table-header { grid-template-columns: 1fr; }
      
      .item-qty, .item-total { text-align: left; }
    }
  `]
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  cartTotal: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.getCart().subscribe(items => {
      this.cartItems = items;
      this.calculateTotal();
    });
  }

  calculateTotal() {
    this.cartTotal = this.cartItems.reduce((acc, item) => {
      const price = item.discountPrice || item.price;
      return acc + (price * item.cartQuantity);
    }, 0);
  }

  updateQty(item: CartItem, newQty: number) {
    if (newQty < 1) newQty = 1;
    this.cartService.updateQuantity(item.id, item.selectedSize!, item.selectedColor!, newQty);
  }

  removeItem(item: CartItem) {
    this.cartService.removeFromCart(item.id, item.selectedSize!, item.selectedColor!);
  }
}

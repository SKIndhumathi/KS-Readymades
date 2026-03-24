import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService, CartItem } from '../../core/services/cart.service';
import { OrderService, OrderDetails } from '../../core/services/order.service';

declare var Razorpay: any;

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="checkout-page">
      <div class="checkout-header text-center">
        <a routerLink="/" class="checkout-logo">KS Readymades</a>
        <h2>Secure Checkout</h2>
      </div>

      <div class="container section pt-0" *ngIf="cartItems.length > 0; else emptyCart">
        
        <div class="checkout-layout">
          
          <!-- Left: Shipping & Billing -->
          <div class="checkout-form-section">
            <h3 class="section-title-sm">Shipping Information</h3>
            
            <form [formGroup]="checkoutForm" class="checkout-form">
              
              <div class="form-row">
                <div class="form-group w-50">
                  <label class="form-label">First Name</label>
                  <input type="text" formControlName="firstName" class="form-control" [class.invalid]="isInvalid('firstName')">
                  <span class="error-msg" *ngIf="isInvalid('firstName')">Required</span>
                </div>
                <div class="form-group w-50">
                  <label class="form-label">Last Name</label>
                  <input type="text" formControlName="lastName" class="form-control" [class.invalid]="isInvalid('lastName')">
                  <span class="error-msg" *ngIf="isInvalid('lastName')">Required</span>
                </div>
              </div>
              
              <div class="form-group">
                <label class="form-label">Email Address</label>
                <input type="email" formControlName="email" class="form-control" [class.invalid]="isInvalid('email')">
                <span class="error-msg" *ngIf="isInvalid('email')">Valid email required</span>
              </div>
              
              <div class="form-group">
                <label class="form-label">Phone Number</label>
                <input type="tel" formControlName="phone" class="form-control" [class.invalid]="isInvalid('phone')">
                <span class="error-msg" *ngIf="isInvalid('phone')">Valid 10-digit number required</span>
              </div>
              
              <div class="form-group mt-4">
                <label class="form-label">Street Address</label>
                <input type="text" formControlName="address" class="form-control" [class.invalid]="isInvalid('address')">
                <span class="error-msg" *ngIf="isInvalid('address')">Required</span>
              </div>
              
              <div class="form-row">
                <div class="form-group w-33">
                  <label class="form-label">City</label>
                  <input type="text" formControlName="city" class="form-control" [class.invalid]="isInvalid('city')">
                  <span class="error-msg" *ngIf="isInvalid('city')">Required</span>
                </div>
                <div class="form-group w-33">
                  <label class="form-label">State</label>
                  <select formControlName="state" class="form-control" [class.invalid]="isInvalid('state')">
                    <option value="">Select State</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Delhi">Delhi</option>
                  </select>
                  <span class="error-msg" *ngIf="isInvalid('state')">Required</span>
                </div>
                <div class="form-group w-33">
                  <label class="form-label">PIN Code</label>
                  <input type="text" formControlName="zipCode" class="form-control" [class.invalid]="isInvalid('zipCode')">
                  <span class="error-msg" *ngIf="isInvalid('zipCode')">Required</span>
                </div>
              </div>
              
            </form>
            
            <div class="payment-method-stamp mt-5">
              <h3 class="section-title-sm">Payment Method</h3>
              <div class="razorpay-box">
                <div class="rzp-icon">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" alt="Razorpay">
                </div>
                <div class="rzp-text">
                  <strong>Secure Online Payment</strong>
                  <p>Pay via Credit/Debit Cards, UPI, or NetBanking. You will be redirected to the secure Razorpay portal upon placing your order.</p>
                </div>
              </div>
            </div>
            
          </div>
          
          <!-- Right: Order Summary -->
          <div class="checkout-summary-section">
            <div class="sticky-summary">
              <h3 class="section-title-sm">Order Summary</h3>
              
              <div class="summary-items">
                <div class="summary-item" *ngFor="let item of cartItems">
                  <div class="s-img"><img [src]="item.imageUrl"></div>
                  <div class="s-details">
                    <span class="s-name">{{item.name}}</span>
                    <span class="s-variant">{{item.selectedColor}} / {{item.selectedSize}} / Qty: {{item.cartQuantity}}</span>
                  </div>
                  <div class="s-price">₹{{ (item.discountPrice || item.price) * item.cartQuantity | number:'1.0-0' }}</div>
                </div>
              </div>
              
              <div class="summary-totals">
                <div class="s-row">
                  <span>Subtotal</span>
                  <span>₹{{cartTotal | number:'1.0-0'}}</span>
                </div>
                <div class="s-row">
                  <span>Shipping</span>
                  <span>Complimentary</span>
                </div>
                <div class="s-row s-total-row">
                  <span>Total</span>
                  <span class="s-total-price">₹{{cartTotal | number:'1.0-0'}}</span>
                </div>
              </div>
              
              <button class="btn btn-primary btn-block place-order-btn" (click)="placeOrder()" [disabled]="isProcessing">
                <span *ngIf="!isProcessing; else loading">Place Order & Pay</span>
                <ng-template #loading>Processing...</ng-template>
              </button>
              
              <p class="terms-text mt-3">By placing your order, you agree to KS Readymades' <a href="javascript:void(0)">Privacy Notice</a> and <a href="javascript:void(0)">Conditions of Use</a>.</p>
            </div>
          </div>
          
        </div>
      </div>
      
      <ng-template #emptyCart>
        <div class="container text-center py-5">
          <h2>Your bag is empty</h2>
          <p class="mb-4">You have no items in your shopping bag to checkout.</p>
          <a routerLink="/shop" class="btn btn-primary">Return to Shop</a>
        </div>
      </ng-template>

    </div>
  `,
  styles: [`
    .checkout-page {
      background-color: var(--bg-color);
      min-height: 100vh;
      padding-bottom: 5rem;
    }
    
    .checkout-header {
      padding: 2rem 0;
      border-bottom: 1px solid var(--border);
      background: var(--surface);
      margin-bottom: 3rem;
    }
    .checkout-logo {
      font-family: var(--font-serif);
      font-size: 1.8rem;
      font-weight: 700;
      color: var(--primary);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      text-decoration: none;
      display: block;
      margin-bottom: 0.5rem;
    }
    .checkout-header h2 {
      font-family: var(--font-sans);
      font-size: 1rem;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: var(--text-secondary);
      font-weight: 400;
    }
    
    .checkout-layout {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 5rem;
    }
    
    .section-title-sm {
      font-family: var(--font-sans);
      font-size: 1.1rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--primary);
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border);
      margin-bottom: 2rem;
      font-weight: 500;
    }
    
    /* Form */
    .form-row {
      display: flex;
      gap: 1.5rem;
    }
    .w-50 { width: 50%; }
    .w-33 { width: 33.33%; }
    
    .form-control.invalid {
      border-color: #EF4444;
      background-color: #FEF2F2;
    }
    .error-msg {
      color: #EF4444;
      font-size: 0.75rem;
      margin-top: 0.25rem;
      display: block;
    }
    
    /* Razorpay Box */
    .razorpay-box {
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 1.5rem;
      display: flex;
      gap: 1.5rem;
      align-items: center;
      background: var(--surface);
    }
    .rzp-icon {
      flex-shrink: 0;
      width: 100px;
      height: auto;
    }
    .rzp-icon img { width: 100%; }
    .rzp-text strong { display: block; margin-bottom: 0.5rem; font-family: var(--font-sans); color: var(--primary); }
    .rzp-text p { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6; }
    
    /* Summary */
    .sticky-summary {
      position: sticky;
      top: 30px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 2rem;
    }
    
    .summary-items {
      max-height: 40vh;
      overflow-y: auto;
      margin-bottom: 1.5rem;
    }
    
    .summary-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding-bottom: 1rem;
      margin-bottom: 1rem;
      border-bottom: 1px solid var(--border-light);
    }
    .s-img { width: 50px; height: 65px; border-radius: 4px; overflow: hidden; }
    .s-img img { width: 100%; height: 100%; object-fit: cover; }
    .s-details { flex: 1; display: flex; flex-direction: column; }
    .s-name { font-family: var(--font-sans); font-size: 0.9rem; font-weight: 500; color: var(--primary); }
    .s-variant { font-size: 0.75rem; color: var(--text-secondary); }
    .s-price { font-weight: 500; color: var(--primary); font-size: 0.95rem; }
    
    .summary-totals {
      font-family: var(--font-sans);
    }
    .s-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.8rem;
      color: var(--text-secondary);
      font-size: 0.95rem;
    }
    .s-total-row {
      border-top: 1px solid var(--border);
      padding-top: 1rem;
      margin-top: 1rem;
      color: var(--primary);
      font-weight: 500;
      font-size: 1.1rem;
    }
    .s-total-price { font-size: 1.3rem; }
    
    .place-order-btn {
      margin-top: 2rem;
      padding: 1rem;
      font-size: 1.05rem;
    }
    .place-order-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    
    .terms-text {
      text-align: center;
      font-size: 0.75rem;
      color: var(--text-secondary);
    }
    .terms-text a { color: var(--text-secondary); text-decoration: underline; }
    
    @media (max-width: 900px) {
      .checkout-layout { grid-template-columns: 1fr; gap: 3rem; }
      .form-row { flex-direction: column; gap: 0; }
      .w-50, .w-33 { width: 100%; }
    }
  `]
})
export class CheckoutComponent implements OnInit {
  checkoutForm!: FormGroup;
  cartItems: CartItem[] = [];
  cartTotal: number = 0;
  isProcessing: boolean = false;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkoutForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required]
    });

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

  isInvalid(field: string): boolean {
    const control = this.checkoutForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  placeOrder() {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    this.isProcessing = true;
    this.initiateRazorpayPayment();
  }

  initiateRazorpayPayment() {
    const formVals = this.checkoutForm.value;
    
    const options = {
      key: 'rzp_test_SUyUSfSaRwznos', 
      amount: this.cartTotal * 100, 
      currency: "INR",
      name: "KS Readymades",
      description: "Premium Men's Wear Order",
      image: "https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg",
      handler: (response: any) => {
        // Payment successful
        this.submitOrderToNotion(response.razorpay_payment_id);
      },
      prefill: {
        name: `${formVals.firstName} ${formVals.lastName}`,
        email: formVals.email,
        contact: formVals.phone
      },
      theme: {
        color: "#1A1A1A"
      },
      modal: {
        ondismiss: () => {
          this.isProcessing = false;
        }
      }
    };

    const rzp = new Razorpay(options);
    
    rzp.on('payment.failed', (response: any) => {
      alert("Payment Failed. Reason: " + response.error.description);
      this.isProcessing = false;
    });

    rzp.open();
  }

  submitOrderToNotion(paymentId: string) {
    const vals = this.checkoutForm.value;
    const itemsDescription = this.cartItems.map(item => `${item.name} (${item.selectedSize}, ${item.selectedColor}) x${item.cartQuantity}`).join('\n');

    const orderDetails: OrderDetails = {
      orderId: 'ORD-' + Math.floor(100000 + Math.random() * 900000).toString(),
      customerName: `${vals.firstName} ${vals.lastName}`,
      email: vals.email,
      phone: vals.phone,
      shippingAddress: `${vals.address}, ${vals.city}, ${vals.state} ${vals.zipCode}`,
      items: itemsDescription,
      totalAmount: this.cartTotal,
      paymentMethod: 'Razorpay Online',
      paymentId: paymentId
    };

    this.orderService.createOrder(orderDetails).subscribe({
      next: () => {
        this.cartService.clearCart();
        this.isProcessing = false;
        alert(`Payment Successful! Thank you for your order, ${orderDetails.customerName}.\nOrder ID: ${orderDetails.orderId}`);
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Failed to create Notion order record:', err);
        // Even if Notion fails, payment was successful
        this.cartService.clearCart();
        this.isProcessing = false;
        alert('Payment Successful! Your order ID is ' + orderDetails.orderId + '. There was an issue recording it in our system, but your payment was received.');
        this.router.navigate(['/']);
      }
    });
  }
}

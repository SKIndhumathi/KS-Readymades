import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../shared/models/product.model';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="product-page" *ngIf="product$ | async as product">
      <!-- Breadcrumbs -->
      <div class="container section pb-0">
        <nav class="breadcrumb">
          <a routerLink="/">Home</a> <span class="sep">/</span>
          <a [routerLink]="['/shop']" [queryParams]="{category: product.category}">{{product.category}}</a> <span class="sep">/</span>
          <span class="current">{{product.name}}</span>
        </nav>
      </div>

      <div class="product-layout container section pt-4">
        
        <!-- Left: Image Gallery -->
        <div class="product-gallery">
          <div class="main-image">
            <img [src]="selectedImage || product.imageUrl" [alt]="product.name">
          </div>
          
          <div class="thumbnail-list" *ngIf="product.additionalImages?.length">
            <button class="thumb-btn" 
                    [class.active]="selectedImage === product.imageUrl || !selectedImage" 
                    (click)="selectedImage = product.imageUrl">
              <img [src]="product.imageUrl" [alt]="product.name">
            </button>
            <button class="thumb-btn" *ngFor="let img of product.additionalImages" 
                    [class.active]="selectedImage === img" 
                    (click)="selectedImage = img">
              <img [src]="img" [alt]="product.name">
            </button>
          </div>
        </div>

        <!-- Right: Product Info -->
        <div class="product-info-wrap">
          <div class="product-info-sticky">
            <h1 class="product-title">{{product.name}}</h1>
            
            <div class="product-price-row mt-2 mb-4">
              <div class="price" [class.has-discount]="product.discountPrice">
                <span class="currency">₹</span>{{product.price | number:'1.0-0'}}
              </div>
              <div class="price-discount" *ngIf="product.discountPrice">
                <span class="currency">₹</span>{{product.discountPrice | number:'1.0-0'}}
              </div>
            </div>
            
            <p class="product-desc mb-4">{{product.description}}</p>
            
            <!-- Variants -->
            <div class="variants-section mb-4">
              
              <div class="variant-group mb-3">
                <div class="variant-label">Color: <span>{{selectedColor}}</span></div>
                <div class="variant-options">
                  <button *ngFor="let color of product.colors" 
                          class="color-btn" 
                          [class.active]="selectedColor === color"
                          (click)="selectedColor = color">
                    {{color}}
                  </button>
                </div>
              </div>
              
              <div class="variant-group">
                <div class="variant-label">Size: <span>{{selectedSize}}</span></div>
                <div class="variant-options">
                  <button *ngFor="let size of product.sizes" 
                          class="size-btn" 
                          [class.active]="selectedSize === size"
                          (click)="selectedSize = size">
                    {{size}}
                  </button>
                </div>
              </div>
              
            </div>
            
            <!-- Quantity and Add to Cart -->
            <div class="action-section mb-4">
              <div class="qty-selector">
                <button class="qty-btn" (click)="qty = qty > 1 ? qty - 1 : 1">−</button>
                <input type="number" [(ngModel)]="qty" min="1" max="{{product.quantity}}" readonly class="qty-input">
                <button class="qty-btn" (click)="qty = qty < product.quantity ? qty + 1 : product.quantity">+</button>
              </div>
              
              <button class="btn btn-primary btn-block add-to-cart-btn" 
                      [disabled]="product.stockStatus === 'Out of Stock'"
                      (click)="addToCart(product)">
                {{ addedToCart ? 'Added to Bag' : (product.stockStatus === 'Out of Stock' ? 'Out of Stock' : 'Add to Bag') }}
              </button>
            </div>
            
            <button class="btn btn-secondary btn-block mb-4" 
                    [disabled]="product.stockStatus === 'Out of Stock'"
                    (click)="buyNow(product)">
              Proceed to Checkout
            </button>
            
            <!-- Accordion Info -->
            <div class="product-details-accordion">
              <div class="acc-item">
                <h4 class="acc-title">Product Details</h4>
                <div class="acc-content">
                  <ul>
                    <li>Premium quality material ensuring maximum comfort.</li>
                    <li>Tailored for a sophisticated, modern fit.</li>
                    <li>Designed exclusively by KS Readymades.</li>
                  </ul>
                </div>
              </div>
              <div class="acc-item">
                <h4 class="acc-title">Shipping & Returns</h4>
                <div class="acc-content">
                  <p>Complimentary shipping and returns on all orders over ₹5,000. Delivered in pristine custom packaging.</p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
        
      </div>
    </div>
  `,
  styles: [`
    .product-page {
      background-color: var(--bg-color);
      min-height: 100vh;
    }
    
    .breadcrumb {
      font-family: var(--font-sans);
      font-size: 0.85rem;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    .breadcrumb a { color: var(--text-secondary); }
    .breadcrumb a:hover { color: var(--primary); }
    .breadcrumb .sep { margin: 0 8px; color: var(--border); }
    .breadcrumb .current { color: var(--primary); font-weight: 500; }
    
    .product-layout {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 5rem;
      align-items: flex-start;
    }
    
    /* LEFT: Gallery */
    .product-gallery {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .main-image {
      width: 100%;
      background-color: var(--surface);
      border-radius: var(--radius-sm);
      overflow: hidden;
    }
    
    .main-image img {
      width: 100%;
      height: auto;
      object-fit: contain;
    }
    
    .thumbnail-list {
      display: flex;
      gap: 1rem;
      overflow-x: auto;
      padding-bottom: 0.5rem;
    }
    
    .thumb-btn {
      width: 80px;
      height: 100px;
      flex-shrink: 0;
      border: 1px solid transparent;
      background: var(--surface);
      cursor: pointer;
      border-radius: var(--radius-sm);
      overflow: hidden;
      opacity: 0.6;
      transition: all var(--transition-fast);
      padding: 0;
    }
    
    .thumb-btn.active, .thumb-btn:hover {
      opacity: 1;
      border-color: var(--primary);
    }
    
    .thumb-btn img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    /* RIGHT: Info Sticky */
    .product-info-wrap {
      position: relative;
    }
    
    .product-info-sticky {
      position: sticky;
      top: 100px;
      padding-bottom: 2rem;
    }
    
    .product-title {
      font-size: 2.5rem;
      font-weight: 400;
      margin-bottom: 0.5rem;
    }
    
    .product-price-row {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .price {
      font-size: 1.5rem;
      color: var(--text-secondary);
    }
    
    .price.has-discount {
      text-decoration: line-through;
      color: var(--text-light);
      font-size: 1.1rem;
    }
    
    .price-discount {
      font-size: 1.5rem;
      color: var(--primary);
      font-weight: 500;
    }
    
    .product-desc {
      color: var(--text-secondary);
      font-size: 1.05rem;
      line-height: 1.8;
      border-bottom: 1px solid var(--border-light);
      padding-bottom: 2rem;
    }
    
    /* Variants */
    .variant-label {
      font-family: var(--font-sans);
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 0.8rem;
      color: var(--text-secondary);
      font-weight: 600;
    }
    .variant-label span { color: var(--primary); font-weight: 400; }
    
    .variant-options {
      display: flex;
      flex-wrap: wrap;
      gap: 0.8rem;
    }
    
    .color-btn, .size-btn {
      background: transparent;
      border: 1px solid var(--border);
      padding: 0.6rem 1.2rem;
      cursor: pointer;
      font-family: var(--font-sans);
      font-size: 0.9rem;
      color: var(--text-secondary);
      transition: all var(--transition-fast);
      border-radius: var(--radius-sm);
    }
    
    .color-btn:hover, .size-btn:hover {
      border-color: var(--primary);
      color: var(--primary);
    }
    
    .color-btn.active, .size-btn.active {
      border-color: var(--primary);
      background-color: var(--primary);
      color: #fff;
    }
    
    /* Actions */
    .action-section {
      display: grid;
      grid-template-columns: 120px 1fr;
      gap: 1rem;
      margin-top: 2rem;
    }
    
    .qty-selector {
      display: flex;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      overflow: hidden;
      height: 50px;
    }
    
    .qty-btn {
      width: 40px;
      background: #fff;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      color: var(--text-secondary);
      transition: background var(--transition-fast);
    }
    .qty-btn:hover { background: var(--surface-hover); }
    
    .qty-input {
      width: 40px;
      border: none;
      text-align: center;
      font-family: var(--font-sans);
      font-size: 1rem;
      outline: none;
    }
    
    .add-to-cart-btn {
      height: 50px;
      font-size: 1rem;
    }
    .add-to-cart-btn:disabled {
      background-color: var(--border);
      color: var(--text-light);
      cursor: not-allowed;
      box-shadow: none;
      transform: none;
    }
    
    /* Accordion */
    .product-details-accordion {
      border-top: 1px solid var(--border);
      margin-top: 2rem;
    }
    
    .acc-item {
      border-bottom: 1px solid var(--border-light);
      padding: 1.5rem 0;
    }
    
    .acc-title {
      font-family: var(--font-sans);
      font-size: 0.95rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--primary);
      margin-bottom: 1rem;
    }
    
    .acc-content {
      color: var(--text-secondary);
      font-size: 0.95rem;
      line-height: 1.6;
    }
    .acc-content ul { padding-left: 1.2rem; }
    .acc-content li { margin-bottom: 0.5rem; }
    
    @media (max-width: 900px) {
      .product-layout {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
      .product-info-sticky {
        position: static;
      }
    }
  `]
})
export class ProductDetailsComponent implements OnInit {
  product$!: Observable<Product | undefined>;
  selectedImage: string | null = null;
  selectedSize: string = 'M';
  selectedColor: string = 'Blue';
  qty: number = 1;
  addedToCart: boolean = false;
  Math = Math;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.product$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        return this.productService.getProductById(id!);
      })
    );
  }

  addToCart(product: Product) {
    if (!this.selectedSize || !this.selectedColor) {
      alert('Please select a size and color');
      return;
    }
    this.cartService.addToCart(product, Number(this.qty), this.selectedSize, this.selectedColor);
    
    this.addedToCart = true;
    setTimeout(() => {
      this.addedToCart = false;
    }, 2000);
  }

  buyNow(product: Product) {
    if (!this.selectedSize || !this.selectedColor) {
      alert('Please select a size and color');
      return;
    }
    this.cartService.addToCart(product, Number(this.qty), this.selectedSize, this.selectedColor);
    this.router.navigate(['/checkout']);
  }
}

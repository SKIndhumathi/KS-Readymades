import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="ks-product-card group">
      <a [routerLink]="['/product', product.id]" class="card-link">
        
        <!-- Image Container -->
        <div class="card-img-wrap">
          <img [src]="product.imageUrl" [alt]="product.name">
          
          <!-- Badges -->
          <div class="card-badges">
            <span class="badge badge-sale" *ngIf="product.discountPrice">Sale</span>
            <span class="badge badge-new" *ngIf="product.newArrival">New</span>
          </div>
          
          <!-- Quick Action Overlay -->
          <div class="quick-action">
            <span>Discover</span>
          </div>
        </div>
        
        <!-- Info Container -->
        <div class="card-info">
          <h3 class="product-title">{{product.name}}</h3>
          
          <div class="price-container">
            <span class="price" [class.has-discount]="product.discountPrice">
              <span class="currency">₹</span>{{product.price | number:'1.0-0'}}
            </span>
            <span class="price-discount" *ngIf="product.discountPrice">
              <span class="currency">₹</span>{{product.discountPrice | number:'1.0-0'}}
            </span>
          </div>
        </div>
      </a>
    </div>
  `,
  styles: [`
    .ks-product-card {
      display: block;
      width: 100%;
    }
    
    .card-link {
      display: block;
      text-decoration: none;
      color: inherit;
    }
    
    /* Image Wrap */
    .card-img-wrap {
      position: relative;
      aspect-ratio: 3/4;
      background-color: var(--surface-hover);
      margin-bottom: 1.25rem;
      overflow: hidden;
      border-radius: var(--radius-sm);
    }
    
    .card-img-wrap img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform var(--transition-slow);
    }
    
    .ks-product-card:hover .card-img-wrap img {
      transform: scale(1.05);
    }
    
    /* Badges */
    .card-badges {
      position: absolute;
      top: 10px;
      left: 10px;
      display: flex;
      flex-direction: column;
      gap: 5px;
      z-index: 2;
    }
    
    .badge {
      font-family: var(--font-sans);
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      padding: 4px 8px;
      font-weight: 600;
      color: #fff;
    }
    
    .badge-sale { background-color: var(--primary); }
    .badge-new { background-color: var(--accent); }
    
    /* Quick Action */
    .quick-action {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      background-color: rgba(255, 255, 255, 0.95);
      padding: 15px;
      text-align: center;
      transform: translateY(100%);
      transition: transform var(--transition-normal);
      z-index: 2;
    }
    
    .quick-action span {
      font-family: var(--font-sans);
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--primary);
      font-weight: 500;
    }
    
    .ks-product-card:hover .quick-action {
      transform: translateY(0);
    }
    
    /* Info */
    .card-info {
      text-align: center;
    }
    
    .product-title {
      font-family: var(--font-sans);
      font-size: 0.95rem;
      font-weight: 400;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: color var(--transition-fast);
    }
    
    .ks-product-card:hover .product-title {
      color: var(--accent);
    }
    
    .price-container {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
      font-family: var(--font-sans);
    }
    
    .price {
      font-size: 0.95rem;
      color: var(--text-secondary);
    }
    
    .price.has-discount {
      text-decoration: line-through;
      color: var(--text-light);
      font-size: 0.85rem;
    }
    
    .price-discount {
      font-size: 0.95rem;
      color: var(--primary);
      font-weight: 500;
    }
    
    .currency {
      font-size: 0.8rem;
      margin-right: 2px;
    }
  `]
})
export class ProductCardComponent {
  @Input() product!: Product;
}

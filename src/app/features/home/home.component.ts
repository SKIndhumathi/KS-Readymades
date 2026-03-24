import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../shared/models/product.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="premium-home">
      
      <!-- Premium Hero Section -->
      <section class="hero-section">
        <div class="hero-bg">
          <img src="https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=1920&q=80" alt="Premium Men's Wear">
          <div class="hero-overlay"></div>
        </div>
        
        <div class="container hero-content">
          <h4 class="hero-subtitle">The New Standard</h4>
          <h1 class="hero-title">Elevate Your<br>Wardrobe</h1>
          <p class="hero-desc">Discover our curated collection of timeless elegance and masterful tailoring. Designed for the modern gentleman.</p>
          <div class="hero-actions">
            <a routerLink="/shop" class="btn btn-accent">Explore Collection</a>
          </div>
        </div>
      </section>

      <!-- Elegant Category Showcase -->
      <section class="section categories-section">
        <div class="container">
          <h2 class="section-title">Shop by Category</h2>
          
          <div class="grid grid-cols-3 category-grid">
            
            <a routerLink="/shop" [queryParams]="{category: 'Suits'}" class="category-card">
              <div class="cat-img-wrap">
                <img src="https://images.unsplash.com/photo-1594938298596-70f56fb3caa9?w=800&q=80" alt="Bespoke Suits">
              </div>
              <div class="cat-content">
                <h3>Bespoke Suits</h3>
                <span class="view-link">View Collection</span>
              </div>
            </a>
            
            <a routerLink="/shop" [queryParams]="{category: 'Shirts'}" class="category-card">
              <div class="cat-img-wrap">
                <img src="https://images.unsplash.com/photo-1626497764746-6dc36546b388?w=800&q=80" alt="Casual Shirts">
              </div>
              <div class="cat-content">
                <h3>Signature Shirts</h3>
                <span class="view-link">View Collection</span>
              </div>
            </a>
            
            <a routerLink="/shop" [queryParams]="{category: 'Accessories'}" class="category-card">
              <div class="cat-img-wrap">
                <img src="https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80" alt="Accessories">
              </div>
              <div class="cat-content">
                <h3>Fine Accessories</h3>
                <span class="view-link">View Collection</span>
              </div>
            </a>
            
          </div>
        </div>
      </section>

      <!-- Featured Collection -->
      <section class="section featured-section">
        <div class="container">
          <div class="featured-header">
            <h2 class="featured-title">Featured Arrivals</h2>
            <a routerLink="/shop" class="view-all-link">Discover All <span class="arrow">→</span></a>
          </div>
          
          <div class="featured-carousel">
            <div class="featured-item" *ngFor="let product of featuredProducts$ | async">
              <a [routerLink]="['/product', product.id]" class="product-minimal-card">
                <div class="img-container">
                  <img [src]="product.imageUrl" [alt]="product.name">
                  <div class="hover-action">Quick View</div>
                </div>
                <div class="product-info">
                  <h4 class="product-name">{{product.name}}</h4>
                  <p class="product-price">
                    <span class="currency">₹</span>{{product.discountPrice || product.price | number:'1.0-0'}}
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Brand Story Teaser -->
      <section class="story-section">
        <div class="grid grid-cols-2">
          <div class="story-img">
            <img src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1000&q=80" alt="Tailoring Process">
          </div>
          <div class="story-content">
            <h4 class="story-subtitle">Our Heritage</h4>
            <h2 class="story-title">Crafted with Uncompromising Precision</h2>
            <p class="story-desc">Every piece in our collection represents the pinnacle of sartorial excellence. We source the finest fabrics from globally renowned mills and employ master tailors to create garments that stand the test of time.</p>
            <button class="btn btn-secondary mt-3">Read Our Story</button>
          </div>
        </div>
      </section>
      
    </div>
  `,
  styles: [`
    .premium-home {
      width: 100%;
      overflow: hidden;
    }
    
    /* Hero Section */
    .hero-section {
      height: 100vh;
      min-height: 600px;
      position: relative;
      display: flex;
      align-items: center;
      padding-top: 80px; /* Offset for header */
    }
    
    .hero-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
    }
    
    .hero-bg img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center 20%;
    }
    
    .hero-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(to right, rgba(26, 26, 26, 0.85) 0%, rgba(26, 26, 26, 0.4) 100%);
    }
    
    .hero-content {
      position: relative;
      z-index: 1;
      max-width: 800px;
      color: #fff;
    }
    
    .hero-subtitle {
      font-family: var(--font-sans);
      font-size: 0.9rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--accent);
      margin-bottom: 1.5rem;
    }
    
    .hero-title {
      font-size: 4.5rem;
      font-weight: 400;
      color: #fff;
      margin-bottom: 2rem;
      line-height: 1.1;
    }
    
    .hero-desc {
      font-size: 1.1rem;
      color: #E5E7EB;
      max-width: 500px;
      line-height: 1.8;
      margin-bottom: 3rem;
    }
    
    /* Category Section */
    .categories-section {
      background-color: var(--surface);
    }
    
    .category-card {
      position: relative;
      overflow: hidden;
      border-radius: var(--radius-sm);
      display: block;
      aspect-ratio: 4/5;
    }
    
    .cat-img-wrap {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    
    .cat-img-wrap img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform var(--transition-slow);
    }
    
    .category-card:hover .cat-img-wrap img {
      transform: scale(1.05);
    }
    
    .cat-content {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      padding: 2rem;
      background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
      color: #fff;
      display: flex;
      flex-direction: column;
    }
    
    .cat-content h3 {
      font-size: 1.8rem;
      color: #fff;
      margin-bottom: 0.5rem;
      transform: translateY(10px);
      transition: transform var(--transition-normal);
    }
    
    .view-link {
      font-family: var(--font-sans);
      text-transform: uppercase;
      font-size: 0.8rem;
      letter-spacing: 0.1em;
      color: var(--accent);
      opacity: 0;
      transform: translateY(10px);
      transition: all var(--transition-normal);
    }
    
    .category-card:hover .cat-content h3 {
      transform: translateY(0);
    }
    
    .category-card:hover .view-link {
      opacity: 1;
      transform: translateY(0);
    }
    
    /* Featured Section */
    .featured-section {
      background-color: var(--bg-color);
      padding: 6rem 0;
    }
    
    .featured-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 3rem;
      border-bottom: 1px solid var(--border);
      padding-bottom: 1rem;
    }
    
    .featured-title {
      font-size: 2rem;
      color: var(--primary);
    }
    
    .view-all-link {
      font-family: var(--font-sans);
      text-transform: uppercase;
      font-size: 0.85rem;
      letter-spacing: 0.1em;
      color: var(--text-secondary);
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .view-all-link:hover {
      color: var(--accent);
    }
    
    .view-all-link .arrow {
      transition: transform var(--transition-fast);
    }
    .view-all-link:hover .arrow {
      transform: translateX(5px);
    }
    
    .featured-carousel {
      display: flex;
      gap: 2rem;
      overflow-x: auto;
      padding-bottom: 2rem;
      scrollbar-width: none; /* Firefox */
    }
    .featured-carousel::-webkit-scrollbar {
      display: none; /* Chrome */
    }
    
    .featured-item {
      min-width: 300px;
      flex: 0 0 auto;
    }
    
    .product-minimal-card {
      display: block;
      group: hover;
    }
    
    .img-container {
      position: relative;
      aspect-ratio: 3/4;
      overflow: hidden;
      background-color: #f0f0f0;
      border-radius: var(--radius-sm);
      margin-bottom: 1.5rem;
    }
    
    .img-container img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform var(--transition-slow);
    }
    
    .product-minimal-card:hover .img-container img {
      transform: scale(1.03);
    }
    
    .hover-action {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      background-color: rgba(255,255,255,0.9);
      color: var(--primary);
      text-align: center;
      padding: 1rem;
      font-family: var(--font-sans);
      text-transform: uppercase;
      font-size: 0.8rem;
      letter-spacing: 0.1em;
      font-weight: 500;
      transform: translateY(100%);
      transition: transform var(--transition-normal);
    }
    
    .product-minimal-card:hover .hover-action {
      transform: translateY(0);
    }
    
    .product-info {
      text-align: center;
    }
    
    .product-name {
      font-family: var(--font-sans);
      font-size: 1rem;
      font-weight: 500;
      color: var(--primary);
      margin-bottom: 0.5rem;
    }
    
    .product-price {
      font-family: var(--font-sans);
      color: var(--text-secondary);
      font-size: 0.95rem;
    }
    
    .currency {
      font-size: 0.8rem;
      margin-right: 2px;
    }
    
    /* Story Section */
    .story-section {
      background-color: var(--surface);
    }
    
    .story-img img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      min-height: 600px;
    }
    
    .story-content {
      padding: 6rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
    }
    
    .story-subtitle {
      font-family: var(--font-sans);
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: var(--accent);
      font-size: 0.85rem;
      margin-bottom: 1.5rem;
    }
    
    .story-title {
      font-size: 2.5rem;
      margin-bottom: 2rem;
    }
    
    .story-desc {
      color: var(--text-secondary);
      font-size: 1.1rem;
      line-height: 1.8;
      margin-bottom: 2rem;
    }
    
    @media (max-width: 1024px) {
      .hero-title { font-size: 3.5rem; }
      .story-content { padding: 4rem; }
    }
    @media (max-width: 768px) {
      .hero-title { font-size: 2.5rem; }
      .story-img img { min-height: 300px; }
      .story-content { padding: 3rem 1.5rem; }
    }
  `]
})
export class HomeComponent implements OnInit {
  featuredProducts$!: Observable<Product[]>;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.featuredProducts$ = this.productService.getFeaturedProducts();
  }
}

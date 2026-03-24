import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../shared/models/product.model';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, FormsModule],
  template: `
    <div class="shop-page container section">
      
      <!-- Page Header -->
      <div class="shop-header text-center">
        <h1 class="shop-title">Our Collection</h1>
        <p class="shop-desc">Explore our curated selection of premium men's wear.</p>
      </div>
      
      <div class="shop-layout">
        
        <!-- Sidebar Filters -->
        <aside class="shop-sidebar">
          <div class="filter-group">
            <h3 class="filter-title">Category</h3>
            <ul class="filter-list">
              <li><label class="custom-radio"><input type="radio" name="cat" value="All" [(ngModel)]="selectedCategory" (change)="filterProducts()"><span>All Collections</span></label></li>
              <li><label class="custom-radio"><input type="radio" name="cat" value="Shirts" [(ngModel)]="selectedCategory" (change)="filterProducts()"><span>Shirts</span></label></li>
              <li><label class="custom-radio"><input type="radio" name="cat" value="Trousers" [(ngModel)]="selectedCategory" (change)="filterProducts()"><span>Trousers</span></label></li>
              <li><label class="custom-radio"><input type="radio" name="cat" value="T-Shirts" [(ngModel)]="selectedCategory" (change)="filterProducts()"><span>T-Shirts</span></label></li>
              <li><label class="custom-radio"><input type="radio" name="cat" value="Jeans" [(ngModel)]="selectedCategory" (change)="filterProducts()"><span>Jeans</span></label></li>
              <li><label class="custom-radio"><input type="radio" name="cat" value="Accessories" [(ngModel)]="selectedCategory" (change)="filterProducts()"><span>Accessories</span></label></li>
            </ul>
          </div>
          
          <div class="filter-group mt-4">
            <h3 class="filter-title">Sort By</h3>
            <ul class="filter-list">
              <li><label class="custom-radio"><input type="radio" name="sort" value="default" [(ngModel)]="sortBy" (change)="filterProducts()"><span>Recommended</span></label></li>
              <li><label class="custom-radio"><input type="radio" name="sort" value="price_low" [(ngModel)]="sortBy" (change)="filterProducts()"><span>Price: Low to High</span></label></li>
              <li><label class="custom-radio"><input type="radio" name="sort" value="price_high" [(ngModel)]="sortBy" (change)="filterProducts()"><span>Price: High to Low</span></label></li>
              <li><label class="custom-radio"><input type="radio" name="sort" value="newest" [(ngModel)]="sortBy" (change)="filterProducts()"><span>Newest Arrivals</span></label></li>
            </ul>
          </div>
          
          <button class="btn btn-secondary btn-block mt-4" (click)="clearFilters()">Clear Filters</button>
        </aside>
        
        <!-- Product Grid -->
        <main class="shop-main">
          <div class="shop-controls">
            <span class="results-count">{{ filteredProducts.length }} results showing</span>
          </div>
          
          <div class="grid grid-cols-3 shop-grid" *ngIf="filteredProducts.length > 0; else noProducts">
            <app-product-card *ngFor="let product of filteredProducts" [product]="product"></app-product-card>
          </div>
          
          <ng-template #noProducts>
            <div class="no-results text-center pb-5 pt-5">
              <h3 class="mb-2">No products found</h3>
              <p>Try adjusting your search or filters to find what you're looking for.</p>
              <button class="btn btn-primary mt-3" (click)="clearFilters()">View All Collections</button>
            </div>
          </ng-template>
        </main>
        
      </div>
    </div>
  `,
  styles: [`
    .shop-header {
      margin-top: 40px;
      margin-bottom: 50px;
    }
    
    .shop-title {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    
    .shop-desc {
      color: var(--text-secondary);
      font-size: 1.1rem;
      max-width: 600px;
      margin: 0 auto;
    }
    
    .shop-layout {
      display: grid;
      grid-template-columns: 250px 1fr;
      gap: 40px;
    }
    
    /* Sidebar */
    .shop-sidebar {
      position: sticky;
      top: 120px;
      height: fit-content;
    }
    
    .filter-title {
      font-family: var(--font-sans);
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid var(--border);
      padding-bottom: 0.5rem;
      color: var(--primary);
    }
    
    .filter-list {
      list-style: none;
    }
    
    .filter-list li {
      margin-bottom: 0.8rem;
    }
    
    /* Custom Radio styling */
    .custom-radio {
      display: flex;
      align-items: center;
      cursor: pointer;
      font-size: 0.95rem;
      color: var(--text-secondary);
      transition: color var(--transition-fast);
    }
    
    .custom-radio:hover {
      color: var(--primary);
    }
    
    .custom-radio input {
      display: none;
    }
    
    .custom-radio span {
      position: relative;
      padding-left: 25px;
    }
    
    .custom-radio span::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 14px;
      height: 14px;
      border: 1px solid var(--border);
      border-radius: 50%;
      transition: all var(--transition-fast);
    }
    
    .custom-radio input:checked + span {
      color: var(--primary);
      font-weight: 500;
    }
    
    .custom-radio input:checked + span::before {
      border-color: var(--accent);
    }
    
    .custom-radio input:checked + span::after {
      content: '';
      position: absolute;
      left: 4px;
      top: 50%;
      transform: translateY(-50%);
      width: 8px;
      height: 8px;
      background-color: var(--accent);
      border-radius: 50%;
    }
    
    /* Main Area */
    .shop-controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border-light);
    }
    
    .results-count {
      font-size: 0.9rem;
      color: var(--text-secondary);
    }
    
    .shop-grid {
      gap: 2rem 1.5rem;
    }
    
    .no-results {
      padding: 5rem 0;
    }
    
    @media (max-width: 1024px) {
      .shop-layout {
        grid-template-columns: 200px 1fr;
        gap: 30px;
      }
      .shop-grid {
        grid-template-columns: repeat(2, 1fr) !important;
      }
    }
    
    @media (max-width: 768px) {
      .shop-layout {
        grid-template-columns: 1fr;
      }
      .shop-sidebar {
        position: static;
        margin-bottom: 2rem;
      }
      .filter-list {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
      }
      .filter-list li { margin: 0; }
    }
  `]
})
export class ShopComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  
  selectedCategory: string = 'All';
  sortBy: string = 'default';
  searchQuery: string = '';

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
      this.filteredProducts = [...data];
      
      this.route.queryParams.subscribe(params => {
        if (params['category']) {
          this.selectedCategory = params['category'];
        }
        if (params['search']) {
          this.searchQuery = params['search'].toLowerCase();
        } else {
          this.searchQuery = '';
        }
        this.filterProducts();
      });
    });
  }

  filterProducts() {
    let result = this.products;

    if (this.selectedCategory !== 'All') {
      result = result.filter(p => p.category === this.selectedCategory);
    }

    if (this.searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(this.searchQuery) || 
        p.description.toLowerCase().includes(this.searchQuery)
      );
    }

    if (this.sortBy === 'price_low') {
      result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    } else if (this.sortBy === 'price_high') {
      result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    }

    this.filteredProducts = result;
  }
  
  clearFilters() {
    this.selectedCategory = 'All';
    this.sortBy = 'default';
    this.searchQuery = '';
    this.filterProducts();
  }
}

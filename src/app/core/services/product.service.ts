import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, shareReplay } from 'rxjs/operators';
import { Product } from '../../shared/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private notionDbUrl = '/notion-api/v1/databases/3399845a2add4d0a913a0aaa9b4a1e58/query';
  
  // Cache the products so we don't hit the API on every component load
  private productsCache$!: Observable<Product[]>;

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    if (!this.productsCache$) {
      this.productsCache$ = this.http.post<any>(this.notionDbUrl, {}).pipe(
        map(response => this.mapNotionResponse(response)),
        catchError(err => {
          console.error('Error fetching from Notion:', err);
          return of([]);
        }),
        shareReplay(1)
      );
    }
    return this.productsCache$;
  }

  getProductById(id: string): Observable<Product | undefined> {
    return this.getProducts().pipe(
      map(products => products.find(p => p.id === id))
    );
  }

  getFeaturedProducts(): Observable<Product[]> {
    return this.getProducts().pipe(map(products => products.filter(p => p.featured)));
  }

  getNewArrivals(): Observable<Product[]> {
    return this.getProducts().pipe(map(products => products.filter(p => p.newArrival)));
  }

  getBestSellers(): Observable<Product[]> {
    return this.getProducts().pipe(map(products => products.filter(p => p.bestSeller)));
  }

  private mapNotionResponse(response: any): Product[] {
    if (!response || !response.results) return [];
    
    return response.results.map((page: any) => {
      const p = page.properties;
      return {
        id: page.id,
        name: p?.Name?.title?.[0]?.plain_text || 'Unnamed Product',
        description: p?.Description?.rich_text?.[0]?.plain_text || 'No description available',
        price: p?.Price?.number || 0,
        discountPrice: p?.DiscountPrice?.number || undefined,
        category: p?.Category?.select?.name || 'Uncategorized',
        sizes: p?.Sizes?.multi_select?.map((s: any) => s.name) || [],
        colors: p?.Colors?.multi_select?.map((c: any) => c.name) || [],
        imageUrl: p?.Image?.files?.[0]?.file?.url || p?.Image?.files?.[0]?.external?.url || 'https://via.placeholder.com/600x800?text=No+Image',
        additionalImages: p?.AdditionalImages?.files?.map((f: any) => f.file?.url || f.external?.url) || [],
        stockStatus: p?.StockStatus?.select?.name || 'In Stock',
        quantity: p?.Quantity?.number || 0,
        featured: p?.Featured?.checkbox || false,
        newArrival: p?.NewArrival?.checkbox || false,
        bestSeller: p?.BestSeller?.checkbox || false,
        rating: 5 // Default mock rating
      };
    });
  }
}


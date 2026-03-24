import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../../shared/models/product.model';

export interface CartItem extends Product {
  cartQuantity: number;
  selectedSize: string;
  selectedColor: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  private cartTotalSubject = new BehaviorSubject<number>(0);

  constructor() {
    this.loadCart();
  }

  getCart(): Observable<CartItem[]> {
    return this.cartSubject.asObservable();
  }

  getCartTotal(): Observable<number> {
    return this.cartTotalSubject.asObservable();
  }

  addToCart(product: Product, quantity: number, size: string, color: string) {
    const existingItem = this.cartItems.find(
      item => item.id === product.id && item.selectedSize === size && item.selectedColor === color
    );

    if (existingItem) {
      existingItem.cartQuantity += quantity;
    } else {
      this.cartItems.push({
        ...product,
        cartQuantity: quantity,
        selectedSize: size,
        selectedColor: color
      });
    }

    this.updateCart();
  }

  removeFromCart(productId: string, size: string, color: string) {
    this.cartItems = this.cartItems.filter(
      item => !(item.id === productId && item.selectedSize === size && item.selectedColor === color)
    );
    this.updateCart();
  }

  updateQuantity(productId: string, size: string, color: string, quantity: number) {
    const item = this.cartItems.find(
      i => i.id === productId && i.selectedSize === size && i.selectedColor === color
    );
    if (item && quantity > 0) {
      item.cartQuantity = quantity;
      this.updateCart();
    }
  }

  clearCart() {
    this.cartItems = [];
    this.updateCart();
  }

  private updateCart() {
    this.cartSubject.next([...this.cartItems]);
    const total = this.cartItems.reduce((sum, item) => {
      const itemPrice = item.discountPrice || item.price;
      return sum + (itemPrice * item.cartQuantity);
    }, 0);
    this.cartTotalSubject.next(total);
    this.saveCart();
  }

  private saveCart() {
    localStorage.setItem('mens_wear_cart', JSON.stringify(this.cartItems));
  }

  private loadCart() {
    const savedCart = localStorage.getItem('mens_wear_cart');
    if (savedCart) {
      try {
        this.cartItems = JSON.parse(savedCart);
        this.updateCart();
      } catch (e) {
        console.error('Error loading cart from localStorage', e);
      }
    }
  }
}

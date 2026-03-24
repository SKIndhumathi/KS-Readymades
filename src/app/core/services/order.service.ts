import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface OrderDetails {
  orderId: string;
  customerName: string;
  email: string;
  phone: string;
  shippingAddress: string;
  items: string;
  totalAmount: number;
  paymentMethod: string;
  paymentId: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  // TODO: Replace with your actual Notion Orders Database ID
  private notionOrdersDbId = '32cfeba4-f074-8133-9c5b-c1083f852d04';
  private notionApiUrl = '/notion-api/v1/pages';

  constructor(private http: HttpClient) { }

  /**
   * Pushes a completed order to the Notion Orders Database.
   * Called by CheckoutComponent after a successful payment.
   */
  createOrder(order: OrderDetails): Observable<any> {

    if (this.notionOrdersDbId === 'YOUR_NOTION_ORDERS_DB_ID') {
      console.warn('⚠️ Order Not Saved to Notion: Replace "YOUR_NOTION_ORDERS_DB_ID" in order.service.ts with your real Notion Database ID!');
      // Return fake success so checkout flow is not interrupted
      return of({ success: false, error: 'Database ID not configured' });
    }

    const payload = {
      parent: { database_id: this.notionOrdersDbId },
      properties: {
        "Name": {
          title: [{ text: { content: `Order #${order.orderId}` } }]
        },
        "Customer Name": {
          rich_text: [{ text: { content: order.customerName } }]
        },
        "Email": {
          email: order.email
        },
        "Phone": {
          phone_number: order.phone
        },
        "Address": {
          rich_text: [{ text: { content: order.shippingAddress } }]
        },
        "Total Amount": {
          number: order.totalAmount
        },
        "Items": {
          rich_text: [{ text: { content: order.items } }]
        },
        "Payment Status": {
          select: { name: "Paid" }
        },
        "Payment Method": {
          rich_text: [{ text: { content: order.paymentMethod } }]
        },
        "Payment ID": {
          rich_text: [{ text: { content: order.paymentId } }]
        }
      }
    };

    return this.http.post<any>(this.notionApiUrl, payload).pipe(
      catchError(err => {
        console.error('Failed to save order to Notion:', err);
        return of({ success: false, error: err.message });
      })
    );
  }
}

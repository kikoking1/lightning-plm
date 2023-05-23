import { Injectable } from '@angular/core';
import { Product } from './product';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiURL } from 'src/app/common/global-constants';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  productUrl = apiURL + 'Product';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productUrl + '/0/100');
  }

  getById(id: number) {
    return this.http.get<Product>(`${this.productUrl}/${id}`);
  }

  add(product: Product) {
    return this.http.post<Product>(this.productUrl, product);
  }

  edit(product: Product) {
    return this.http.put<Product>(`${this.productUrl}`, product);
  }

  delete(product: Product) {
    return this.http.delete<Product>(`${this.productUrl}/${product.id}`);
  }
}

import { Injectable } from '@angular/core';
import { Product } from './product';
import { HttpClient } from '@angular/common/http';
import { Subject, catchError } from 'rxjs';
import { apiURL } from 'src/app/common/global-constants';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  productUrl = apiURL + 'Product';

  products$ = this.http.get<Product[]>(`${this.productUrl}/0/100`);

  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  addProduct(newProduct?: Product) {
    this.http
      .post<Product>(`${this.productUrl}`, newProduct)
      .pipe(
        catchError((err) => {
          this.errorMessageSubject.next(err);
          return [];
        })
      )
      .subscribe((product) => {
        console.log(product);
        this.router.navigate(['/products']);
      });
  }
}

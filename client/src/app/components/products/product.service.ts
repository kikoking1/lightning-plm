import { Injectable } from '@angular/core';
import { Product } from './product';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  Subject,
  catchError,
  concatMap,
  map,
  merge,
  of,
  tap,
  throwError,
} from 'rxjs';
import { apiURL } from 'src/app/common/global-constants';
import { Action } from 'src/app/common/interfaces/entity-action';
import { LoadingService } from 'src/app/common/services/loading.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  productUrl = apiURL + 'Product';
  private emptyProduct!: Product;

  private productsSubject = new BehaviorSubject<Product[]>([]);
  products$ = this.productsSubject.asObservable();

  private productModifiedSubject = new BehaviorSubject<Action<Product>>({
    item: this.emptyProduct,
    action: 'none',
  });

  productModifiedAction$ = this.productModifiedSubject.asObservable();

  productsStream$ = merge(
    this.products$,
    this.productModifiedAction$.pipe(
      concatMap((operation) => this.saveProduct(operation)),
      concatMap(() => this.getProducts())
    )
  );

  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  constructor(private http: HttpClient) {}

  saveProduct(operation: Action<Product>): Observable<Action<Product>> {
    const product = operation.item;
    if (operation.action === 'add') {
      return this.http.post<Product>(this.productUrl, product).pipe(
        map((product) => ({ item: product, action: operation.action })),
        catchError(this.handleError)
      );
    }
    if (operation.action === 'delete') {
      return this.http.delete<Product>(`${this.productUrl}/${product.id}`).pipe(
        // Return the original product so it can be removed from the array
        map(() => ({ item: product, action: operation.action })),
        catchError(this.handleError)
      );
    }
    if (operation.action === 'update') {
      return this.http.put<Product>(`${this.productUrl}`, product).pipe(
        // Return the original product so it can replace the product in the array
        map(() => ({ item: product, action: operation.action })),
        catchError(this.handleError)
      );
    }
    // If there is no operation, return the product
    return of(operation);
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productUrl + '/0/100').pipe(
      // Emit the data into the stream
      tap((products) => this.productsSubject.next(products)),
      catchError(this.handleError)
    );
  }

  getById(id: number) {
    return this.http
      .get<Product>(`${this.productUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  add(product: Product) {
    this.productModifiedSubject.next({
      item: product,
      action: 'add',
    });
  }

  edit(product: Product) {
    this.productModifiedSubject.next({
      item: product,
      action: 'update',
    });
  }

  delete(product: Product) {
    this.productModifiedSubject.next({
      item: product,
      action: 'delete',
    });
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.message}`;
    }
    return throwError(() => errorMessage);
  }
}

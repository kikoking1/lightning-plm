import { Injectable } from '@angular/core';
import { Product } from './product';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Subject, catchError, combineLatest, map } from 'rxjs';
import { apiURL } from 'src/app/common/global-constants';
import { Router } from '@angular/router';
import { EntityAction } from 'src/app/common/interfaces/entity-action';
import { EntityActionType } from 'src/app/common/enums/entity-action-type';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  productUrl = apiURL + 'Product';

  private productActionSubject = new BehaviorSubject<EntityAction>({
    action: EntityActionType.Load,
    payload: null,
  } as EntityAction);

  productAction$ = this.productActionSubject.asObservable();

  products$ = combineLatest([
    this.http.get<Product[]>(`${this.productUrl}/0/100`),
    this.productAction$,
  ]).pipe(
    map(([products, eAction]) => {
      if (eAction.action === EntityActionType.Delete) {
        return products.filter((product) => product.id !== eAction.payload);
      } else {
        return products;
      }
    })
  );

  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  getById(id: number) {
    return this.http.get<Product>(`${this.productUrl}/${id}`).pipe(
      catchError((err) => {
        this.errorMessageSubject.next(err);
        return [];
      })
    );
  }

  add(newProduct?: Product) {
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

  edit(newProduct?: Product) {
    this.http
      .put<Product>(`${this.productUrl}`, newProduct)
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

  delete(id: number) {
    this.http.delete(`${this.productUrl}/${id}`).subscribe(() => {
      this.productActionSubject.next({
        action: EntityActionType.Delete,
        payload: id,
      } as EntityAction);
    });
  }
}

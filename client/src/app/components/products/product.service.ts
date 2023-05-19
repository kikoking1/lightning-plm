import { Injectable } from '@angular/core';
import { Product } from './product';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Subject, catchError, combineLatest, map } from 'rxjs';
import { apiURL } from 'src/app/common/global-constants';
import { Router } from '@angular/router';
import { EntityAction } from 'src/app/common/interfaces/entity-action';
import { EntityActionType } from 'src/app/common/enums/entity-action-type';
import { LoadingService } from 'src/app/common/services/loading.service';

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

  constructor(
    private http: HttpClient,
    private router: Router,
    private loadingService: LoadingService
  ) {}

  getById(id: number) {
    return this.http.get<Product>(`${this.productUrl}/${id}`).pipe(
      catchError((err) => {
        this.errorMessageSubject.next(err);
        this.loadingService.setLoading(false);
        return [];
      })
    );
  }

  add(newProduct?: Product) {
    this.loadingService.setLoading(true);
    this.http
      .post<Product>(`${this.productUrl}`, newProduct)
      .pipe(
        catchError((err) => {
          this.errorMessageSubject.next(err);
          this.loadingService.setLoading(false);
          return [];
        })
      )
      .subscribe((product) => {
        console.log(product);
        this.router.navigate(['/products']);
        this.loadingService.setLoading(false);
      });
  }

  edit(newProduct?: Product) {
    this.loadingService.setLoading(true);
    this.http
      .put<Product>(`${this.productUrl}`, newProduct)
      .pipe(
        catchError((err) => {
          this.errorMessageSubject.next(err);
          this.loadingService.setLoading(false);
          return [];
        })
      )
      .subscribe((product) => {
        this.router.navigate(['/products']);
        this.loadingService.setLoading(false);
      });
  }

  delete(id: number) {
    this.loadingService.setLoading(true);
    this.http
      .delete(`${this.productUrl}/${id}`)
      .pipe(
        catchError((err) => {
          this.errorMessageSubject.next(err);
          this.loadingService.setLoading(false);
          return [];
        })
      )
      .subscribe(() => {
        this.productActionSubject.next({
          action: EntityActionType.Delete,
          payload: id,
        } as EntityAction);
        this.loadingService.setLoading(false);
      });
  }
}

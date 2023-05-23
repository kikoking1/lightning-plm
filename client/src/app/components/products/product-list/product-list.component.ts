import { Component } from '@angular/core';
import { ProductService } from '../product.service';
import { Product } from '../product';
import { BehaviorSubject, catchError, tap } from 'rxjs';
import { ErrorService } from 'src/app/common/services/error.service';
import { LoadingService } from 'src/app/common/services/loading.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent {
  productsSubject: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>(
    [] as Product[]
  );
  products$ = this.productsSubject.asObservable();

  constructor(
    private productService: ProductService,
    private errorService: ErrorService,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts() {
    this.productService
      .getProducts()
      .pipe(
        catchError((err) => {
          this.loadingService.setLoading(false);
          this.errorService.setError(err.error);
          return [];
        })
      )
      .subscribe((products) => {
        this.loadingService.setLoading(false);
        this.productsSubject.next(products);
      });
  }

  delete(product: Product) {
    this.loadingService.setLoading(true);
    this.productService
      .delete(product)
      .pipe(
        catchError((err) => {
          this.loadingService.setLoading(false);
          this.errorService.setError(err.error);
          return [];
        })
      )
      .subscribe(() => {
        this.fetchProducts();
      });
  }
}

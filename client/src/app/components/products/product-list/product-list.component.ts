import { Component } from '@angular/core';
import { ProductService } from '../product.service';
import { Product } from '../product';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent {
  products$ = this.productService.productsStream$;

  constructor(private productService: ProductService) {}

  delete(product: Product) {
    this.productService.delete(product);
  }
}

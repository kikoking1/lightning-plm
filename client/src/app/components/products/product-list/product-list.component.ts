import { Component } from '@angular/core';
import { ProductService } from '../product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent {
  products$ = this.productService.products$;

  constructor(private productService: ProductService, private router: Router) {}

  delete(id: number) {
    this.productService.delete(id);
  }
}

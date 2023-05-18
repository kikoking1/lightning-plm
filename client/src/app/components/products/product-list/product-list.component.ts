import { Component } from '@angular/core';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent {
  products$ = this.productService.products$;

  constructor(private productService: ProductService) {}

  ngOnInit() {}

  delete(id: number) {
    this.productService.delete(id);
  }
}

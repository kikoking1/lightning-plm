import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from '../product';
import { Observable, Subscription } from 'rxjs';
import { ProductService } from '../product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
})
export class ProductAddComponent {
  productAddForm!: FormGroup;
  productNameDisplay$: Observable<string> | undefined;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productAddForm = this.fb.group({
      name: ['', [Validators.required]],
    });

    this.productNameDisplay$ =
      this.productAddForm.controls['name']?.valueChanges;
  }

  save(): void {
    this.productService.add(this.productAddForm.value as Product);
    this.router.navigate(['/products']);
  }
}

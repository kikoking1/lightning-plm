import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from '../product';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.scss'],
})
export class ProductAddComponent {
  productAddForm!: FormGroup;
  productNameDisplay$: Observable<string> | undefined;
  errorMessage$: Observable<string> | undefined;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.productAddForm = this.fb.group({
      name: ['', [Validators.required]],
    });

    this.productNameDisplay$ =
      this.productAddForm.controls['name']?.valueChanges;

    this.errorMessage$ = this.productService.errorMessage$;
  }

  save(): void {
    this.productService.add(this.productAddForm.value as Product);
  }
}

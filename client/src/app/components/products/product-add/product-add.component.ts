import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from '../product';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.scss'],
})
export class ProductAddComponent {
  productAddForm!: FormGroup;
  product = new Product();

  productName$: Observable<string> | undefined = this.productAddForm.get(
    'productAddForm.name'
  )?.valueChanges;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.productAddForm = this.fb.group({
      name: ['', [Validators.required]],
    });
  }

  save(): void {
    console.log(this.productAddForm);
    console.log('Saved: ' + JSON.stringify(this.productAddForm.value));
  }
}

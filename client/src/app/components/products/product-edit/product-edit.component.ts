import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss'],
})
export class ProductEditComponent {
  productEditForm!: FormGroup;

  errorMessage$: Observable<string> | undefined;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private activatedRoute: ActivatedRoute
  ) {}

  async ngOnInit(): Promise<void> {
    const id = Number(this.activatedRoute.snapshot.paramMap.get('id'));

    this.productEditForm = this.fb.group({
      id: ['', [Validators.required]],
      name: ['', [Validators.required]],
    });

    this.productService.getById(id).subscribe((product) => {
      this.productEditForm.setValue(product);
    });

    this.errorMessage$ = this.productService.errorMessage$;
  }

  save(): void {
    this.productService.edit(this.productEditForm.value as Product);
  }
}

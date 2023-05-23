import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from '../product';
import { Observable, catchError, throwError } from 'rxjs';
import { ProductService } from '../product.service';
import { Router } from '@angular/router';
import { ErrorService } from 'src/app/common/services/error.service';
import { LoadingService } from 'src/app/common/services/loading.service';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
})
export class ProductAddComponent {
  productAddForm: FormGroup;
  productNameDisplay$: Observable<string> | undefined;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private loadingService: LoadingService,
    private errorService: ErrorService
  ) {
    this.productAddForm = this.fb.group({
      name: ['', [Validators.required]],
    });

    this.productNameDisplay$ =
      this.productAddForm.controls['name']?.valueChanges;
  }

  save(): void {
    this.productService
      .add(this.productAddForm.value as Product)
      .pipe(
        catchError((err) => {
          this.loadingService.setLoading(false);
          this.errorService.setError(err.error);
          return throwError(() => err.error);
        })
      )
      .subscribe(() => {
        this.loadingService.setLoading(false);
        this.router.navigate(['/products']);
      });
  }
}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from '../product';
import { Observable, catchError, of, throwError } from 'rxjs';
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
  isLoading$: Observable<boolean> = this.loadingService.isLoading$;

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
    this.loadingService.setLoading(true);
    this.productService.add(this.productAddForm.value as Product).subscribe({
      next: () => {
        this.loadingService.setLoading(false);
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.loadingService.setLoading(false);
        this.errorService.setError(err.error);
      },
    });
  }
}

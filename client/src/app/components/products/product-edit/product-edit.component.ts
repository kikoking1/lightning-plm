import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription, catchError, throwError } from 'rxjs';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from 'src/app/common/services/loading.service';
import { ErrorService } from 'src/app/common/services/error.service';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
})
export class ProductEditComponent {
  productEditForm: FormGroup;

  private getByIdSub: Subscription | undefined;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private loadingService: LoadingService,
    private errorService: ErrorService
  ) {
    this.productEditForm = this.fb.group({
      id: ['', [Validators.required]],
      name: ['', [Validators.required]],
    });
  }

  async ngOnInit(): Promise<void> {
    const id = Number(this.activatedRoute.snapshot.paramMap.get('id'));

    this.loadingService.setLoading(true);
    this.getByIdSub = this.productService
      .getById(id)
      .pipe(
        catchError((err) => {
          this.loadingService.setLoading(false);
          this.errorService.setError(err.error);
          return throwError(() => err.error);
        })
      )
      .subscribe((product) => {
        this.loadingService.setLoading(false);
        this.productEditForm.setValue(product);
      });
  }

  save(): void {
    this.loadingService.setLoading(true);
    this.productService
      .edit(this.productEditForm.value as Product)
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

  ngOnDestroy(): void {
    if (this.getByIdSub) {
      this.getByIdSub.unsubscribe();
    }
  }
}

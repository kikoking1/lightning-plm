import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from 'src/app/common/services/loading.service';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
})
export class ProductEditComponent {
  productEditForm!: FormGroup;

  private getByIdSub: Subscription | undefined;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    const id = Number(this.activatedRoute.snapshot.paramMap.get('id'));

    this.productEditForm = this.fb.group({
      id: ['', [Validators.required]],
      name: ['', [Validators.required]],
    });

    this.getByIdSub = this.productService.getById(id).subscribe((product) => {
      this.productEditForm.setValue(product);
    });
  }

  save(): void {
    this.productService.edit(this.productEditForm.value as Product);
    this.router.navigate(['/products']);
  }

  ngOnDestroy(): void {
    this.getByIdSub?.unsubscribe();
  }
}

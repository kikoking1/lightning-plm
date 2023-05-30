import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Product } from '../product';
import { ProductAddComponent } from './product-add.component';

describe('ProductAddComponent', () => {
  let component: ProductAddComponent;
  let fb: FormBuilder;
  let productService: any;
  let router: Router;
  let loadingService: any;
  let errorService: any;

  beforeEach(() => {
    fb = new FormBuilder();
    productService = jasmine.createSpyObj('ProductService', ['add']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    loadingService = jasmine.createSpyObj('LoadingService', ['setLoading']);
    errorService = jasmine.createSpyObj('ErrorService', ['setError']);

    component = new ProductAddComponent(
      fb,
      productService,
      router,
      loadingService,
      errorService
    );
  });

  it('should create a productAddForm with a name control', () => {
    expect(component.productAddForm).toBeDefined();
    expect(component.productAddForm instanceof FormGroup).toBe(true);
    expect(component.productAddForm.controls['name']).toBeDefined();
  });

  it('should call setError when product service add method throws error', () => {
    const product: Product = { name: 'Test Product' };
    (component.productAddForm.value as Product) = product;

    productService.add.and.returnValue(
      new Observable((observer) => observer.error({ error: 'Test Error' }))
    );

    component.save();

    expect(productService.add).toHaveBeenCalledWith(product);
    expect(loadingService.setLoading).toHaveBeenCalledWith(true);
    expect(loadingService.setLoading).toHaveBeenCalledWith(false);
    expect(errorService.setError).toHaveBeenCalledWith('Test Error');
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should call setLoading and navigate when save method is called successfully', () => {
    const product: Product = { name: 'Test Product' };
    (component.productAddForm.value as Product) = product;

    productService.add.and.returnValue(of(product));

    component.save();

    expect(productService.add).toHaveBeenCalledWith(product);
    expect(loadingService.setLoading).toHaveBeenCalledWith(false);
    expect(router.navigate).toHaveBeenCalledWith(['/products']);
  });
});

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { ProductListComponent } from './components/products/product-list/product-list.component';
import { ProductAddComponent } from './components/products/product-add/product-add.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {
    path: 'products',
    component: ProductListComponent,
  },
  { path: 'products/add', component: ProductAddComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

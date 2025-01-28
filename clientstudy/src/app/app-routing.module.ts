import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { VendorHomeComponent } from './vendor/vendor-home/vendor-home.component';
import { ProductHomeComponent } from './product/product-home/product-home.component';
import { GeneratorComponent } from './generator/generator.component';
import { ViewerComponent } from './viewer/viewer.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent, title: 'Client Study - Home' },
{ path: '', component: HomeComponent, title: 'Client Study - Home' },
{path: 'vendors',component:VendorHomeComponent,title:'Client Study - Vendors'},
{path: 'products',component:ProductHomeComponent,title:'Client Study - Products'},
{path: 'generator',component:GeneratorComponent,title:'Client Study - Generator'},
{path: 'viewer',component:ViewerComponent,title:'Client Study - Viewer'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

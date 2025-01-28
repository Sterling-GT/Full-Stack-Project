import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
// added imports
import { MatComponentsModule } from './mat-components/mat-components.module';
import { HomeComponent } from './home/home.component';
import { VendorModule } from './vendor/vendor.module';
import { provideHttpClient, withFetch } from '@angular/common/http';
@NgModule({

imports: [
BrowserModule,
AppRoutingModule,
BrowserAnimationsModule,
MatComponentsModule,
VendorModule
],
providers: [provideHttpClient(withFetch())],
bootstrap: [AppComponent],
declarations: [AppComponent, HomeComponent]
})
export class AppModule {}
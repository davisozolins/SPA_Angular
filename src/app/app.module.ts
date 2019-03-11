import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { UsersComponent } from './Components/users.component';
import { VehiclesComponent } from './Components/vehicles.component';
import { MapComponent } from './Components/map.component';

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    VehiclesComponent,
    MapComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

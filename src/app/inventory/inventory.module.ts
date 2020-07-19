import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryRoutingModule } from './inventory-routing.module';
import { MaterialModule } from '../material.module';
import { InventoryHomeComponent } from './inventory-home/inventory-home.component';
import { StockEntryComponent } from './stock-entry/stock-entry.component';
import { ProductsComponent } from './products/products.component';
import { CategoriesComponent } from './categories/categories.component';
import {InventoryComponent} from './inventory.component';


@NgModule({
  declarations: [ InventoryHomeComponent, StockEntryComponent, ProductsComponent, CategoriesComponent, InventoryComponent],
  imports: [
    CommonModule,
    InventoryRoutingModule,
    MaterialModule
  ]
})
export class InventoryModule { }

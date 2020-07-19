import { NgModule } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

const materials = [ MatButtonModule, MatToolbarModule, MatIconModule, MatTooltipModule ];

@NgModule({
  declarations: [],
  imports: materials,
  exports: materials
})
export class MaterialModule { }

import { NgModule } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';

const materials = [ MatButtonModule, MatToolbarModule, MatIconModule, MatTooltipModule, MatCardModule, MatFormFieldModule ];

@NgModule({
  declarations: [],
  imports: materials,
  exports: materials
})
export class MaterialModule { }

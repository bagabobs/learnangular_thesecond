import { NgModule } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';

const materials = [ MatButtonModule, MatToolbarModule, MatIconModule, MatTooltipModule, MatCardModule, MatFormFieldModule,
  MatInputModule, MatSnackBarModule, MatDialogModule, MatSidenavModule, MatListModule ];

@NgModule({
  declarations: [],
  imports: materials,
  exports: materials
})
export class MaterialModule { }

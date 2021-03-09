import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatNativeDateModule} from '@angular/material/core';
import {BrowserModule} from '@angular/platform-browser';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';

import { AppComponent } from './app.component';
import { TopBarComponent } from './top-bar/top-bar-component';
import { NameDropdownComponent } from './name-dropdown/name-dropdown.component';
import { SlotDetailsComponent } from './slot-details/slot-details.component';
import { SlotSelectorComponent } from './slot-selector/slot-selector.component';
import { AppRoutingModule } from './app-routing.module';
import { DemoMaterialModule } from './material-module'

// Default MatFormField appearance to 'fill' as that is the new recommended approach and the
// `legacy` and `standard` appearances are scheduled for deprecation in version 10.
// This makes the examples that use MatFormField render the same in StackBlitz as on the docs site.
@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    AppRoutingModule,
    DemoMaterialModule,
  ],
  declarations: [
    AppComponent,
    TopBarComponent,
    NameDropdownComponent,
    SlotDetailsComponent,
    SlotSelectorComponent,
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  ]
})
export class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

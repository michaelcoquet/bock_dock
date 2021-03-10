import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component'
import { SlotSelectorComponent } from './slot-selector/slot-selector.component';
import { SlotDetailsComponent } from './slot-details/slot-details.component';

const routes: Routes = [
  { path: 'home', component: SlotSelectorComponent },
  { path: 'slot/:id', component: SlotDetailsComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full'},
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

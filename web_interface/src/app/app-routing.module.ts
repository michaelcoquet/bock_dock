import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SlotSelectorComponent } from './slot-selector/slot-selector.component';

const routes: Routes = [
  { path: '', component: SlotSelectorComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component'
import { SlotDetailsComponent } from './slot-details/slot-details.component';
import { BottomBarComponent } from './bottom-bar/bottom-bar.component';
import { HomeComponent } from './home/home.component'

const routes: Routes = [
  { path: 'home', component: BottomBarComponent },
  { path: 'slot/:id', component: SlotDetailsComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full'},
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

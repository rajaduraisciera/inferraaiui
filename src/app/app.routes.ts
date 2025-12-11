
import { LoginpageComponent } from './loginpage/loginpage.component';
import { SearchpageComponent } from './searchpage/searchpage.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  { path: 'login', component: LoginpageComponent },
  { path: 'searchpage', component: SearchpageComponent },
  { path: '', component: LoginpageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }


import { LoginpageComponent } from './loginpage/loginpage.component';
import { SearchpageComponent } from './searchpage/searchpage.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ModeselectionComponent } from './modeselection/modeselection.component';
import { LogoutComponent } from './logout/logout.component';

export const routes: Routes = [
  { path: 'login', component: LoginpageComponent },
  // { path: 'searchpage', component: SearchpageComponent },
   {
        path: 'searchpage',
        component: ModeselectionComponent
    },
    {
    path: 'logout',
    component: LogoutComponent,
  },
  { path: '', component: LoginpageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }

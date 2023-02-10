import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TripsListComponent } from './components/trips-list/trips-list.component';
import { AddTripComponent } from './components/add-trip/add-trip.component';
import { HomeComponent } from './components/home/home.component';
import { CartComponent } from './components/cart/cart.component';
import { TripDetailsComponent } from './components/trip-details/trip-details.component';
import { Err404Component } from './components/err404/err404.component';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';
import { AuthGuard, canActivate, redirectLoggedInTo, redirectUnauthorizedTo} from '@angular/fire/auth-guard'
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  {path: '', component:HomeComponent},
  {path: 'offer', component:TripsListComponent},
  {path: 'manage', component:AddTripComponent,  ...canActivate(() => redirectUnauthorizedTo(['signin']))},
  {path: 'cart', component:CartComponent, canActivate: [AuthGuard], data: {
    authGuardPipe: () => redirectUnauthorizedTo(['signin'])
  }},
  {path: 'signin', component:SigninComponent},
  {path: 'signup', component:SignupComponent},
  {path: 'offer/details/:id', component:TripDetailsComponent,canActivate: [AuthGuard],data: {
    authGuardPipe: () => redirectUnauthorizedTo(['signin'])
  }},
  {path: 'admin-panel', component:AdminPanelComponent, canActivate: [AuthGuard,AdminGuard] , data: {
    authGuardPipe: () => redirectUnauthorizedTo(['err404'])
  }},
  {path: 'err404',component: Err404Component},
  {path: '**', component: Err404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

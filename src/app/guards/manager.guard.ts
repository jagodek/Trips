import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { User } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ManagerGuard implements CanActivate {

  userObject!:User;
  isLogged:boolean = false;

  constructor(private auth: AuthService){
    this.auth.getUserObject().subscribe(val => {this.userObject=val});
    this.auth.getLoggedValue().subscribe(val => {this.isLogged=  val});
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this.isLogged && ( this.userObject.role === 'manager' || this.userObject.role === 'admin'))
      return true;
      else
      return false;
  }

}

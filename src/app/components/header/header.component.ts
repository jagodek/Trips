import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces';
import { TripsService } from '../../services/trips.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent{

  isLogged:boolean=false;
  userObject!:User;

  constructor(private service:TripsService,private auth:AuthService, private  router: Router){
    this.auth.getLoggedValue().subscribe(val =>{
      this.isLogged = val;
    })
    this.auth.getUserObject().subscribe(val => {
      this.userObject=val;

    })
  }
  reset(){
    this.service.removeAll();
    this.service.uploadFromJsonAlll();
  }


  signOut(){
    this.auth.signOut();
    this.router.navigate(['signin']);

  }
}

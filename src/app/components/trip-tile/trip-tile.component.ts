import { Component,Input, OnInit,Output,EventEmitter, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { FormBuilder,FormControl,FormGroup } from '@angular/forms';
import { CartService } from '../../services/cart.service';

import { Trip, TripLocal } from '../../Trip';
import { TripsService } from '../../services/trips.service';
import { User } from 'src/app/interfaces';
import { empty } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trip-tile',
  templateUrl: './trip-tile.component.html',
  styleUrls: ['./trip-tile.component.sass']
})
export class TripTileComponent implements OnInit{
  @Input() trip!:TripLocal;
  @Output() delete: EventEmitter<any> = new EventEmitter();
  colors:string[] = ["#ff695e","#ffaf5e","#fff45e","#00000000"];

  reserved:number=0;
  loaded:boolean= false;

  @Input() cheap!:boolean;
  @Input() expensive!:boolean;

  isLogged:boolean=false;
  userObject!:User;

  star = new FormControl('');

  numbers = [1,2,3,4,5];

  constructor(private fb:FormBuilder,private tripService:TripsService,private cartService: CartService,private auth:AuthService,private router:Router){
    this.auth.getLoggedValue().subscribe(val => {this.isLogged = val});

  }
  ngOnInit():void{
    this.auth.getUserObject().subscribe(val => {


      this.userObject = val;
      this.reserved = this.searchReserved(this.trip.id);
    });


  }

  searchReserved(id:string){

    for(let i =0;i<this.userObject.userTrips.length;i++){
      if(id === this.userObject.userTrips[i].id && this.userObject.userTrips[i].state === 'reserved'){
        return this.userObject.userTrips[i].noPlaces;
      }
    }
    return 0;
  }

  increment():void{
    if(this.isLogged){
    this.reserved++;
    this.cartService.putCart(this.trip);
    }
    else{
      this.router.navigate(['signin']);
    }
  }
  decrement():void{
    if(this.isLogged){
    this.reserved--;
    this.cartService.removeCart(this.trip);
    }
    else{
      this.router.navigate(['signin']);
    }
  }
  min(a:number,b:number):number{
    if(a<b)
      return a;
    return b;
  }
  deleteAction():void{
    if(this.trip)
      this.delete.emit(this.trip.id);
  }

  // rating(e:number){
  //   if(this.trip)
  //   {
  //     this.trip.stars = 2*e+1;
  //   }
  // }
}


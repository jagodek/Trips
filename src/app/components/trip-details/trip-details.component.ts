import { Component, OnInit,Input,Output, EventEmitter } from '@angular/core';
import { Router,ActivatedRoute,ParamMap } from '@angular/router';
import { Trip, TripLocal } from '../../Trip';
import {map, take} from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TripsService } from '../../services/trips.service';
import { CartService } from '../../services/cart.service';
import { NgForm } from '@angular/forms';
import { Review } from '../../Review';
import { AstMemoryEfficientTransformer } from '@angular/compiler';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/interfaces';

@Component({
  selector: 'app-trip-details',
  templateUrl: './trip-details.component.html',
  styleUrls: ['./trip-details.component.sass']
})
export class TripDetailsComponent implements OnInit{
onSubmit(form:NgForm) {
  const opinion:Review = form.value;
  opinion.user = "Michal";
  this.trip.reviews.push(opinion);

  this.tripService.addReview(this.id,this.tripService.convertToTrip(this.trip));
  form.reset();
  this.stars=0;
}
change_photo(i: number) {
  this.current_photo = i;
}

  @Output() delete: EventEmitter<any> = new EventEmitter();
  colors:string[] = ["#ff695e","#ffaf5e","#fff45e","#00000000"];

  reserved=0;
  numbers = [1,2,3,4,5];
  user_stars=0;
  banned=false;

  trip!:TripLocal;
  tripTmp!:any;
  id!:string;
  current_photo=0;

  stars=0;
  comment="";

  isLogged = false;
  userObject!:User;

  constructor(private tripService:TripsService,private cartService:CartService,private route:ActivatedRoute,private auth:AuthService,private router:Router){
    this.auth.getLoggedValue().subscribe(val => {this.isLogged = val});

  }

  searchReserved(id:string){
    for(let i =0;i<this.userObject.userTrips.length;i++){
      if(id === this.userObject.userTrips[i].id && this.userObject.userTrips[i].state === 'reserved'){
        return this.userObject.userTrips[i].noPlaces;
      }
    }
    return 0;
  }

  ngOnInit(): void {
    this.auth.handleUser();
    const id:Observable<string> =this.route.params.pipe(map(p => p['id']));
    id.subscribe(p=>{
      this.id = p
      //
      this.tripService.getTripByid(this.id).subscribe(a =>{
        this.tripTmp = a;
        this.tripTmp.freeSlots = this.tripTmp.maxPeople - this.tripTmp.people;
        this.tripTmp.userStars = 0;
        this.tripTmp.stars = 10;
        this.tripTmp.id = this.id;
        this.trip = this.tripTmp;
      this.auth.getUserObject().subscribe(val => {
        this.userObject = val;
        this.reserved = this.searchReserved(this.trip.id);
        this.banned = this.userObject.banned;
      });
      })

      // this.service.getTripByid(this.id);
    });


    // this.service.getTripById(this.id).subscribe(a => {
    //   this.trip = a;
    // })
    // let tmp  = this.service.getTripByid(this.id);
    // this.trip = this.service.getTripByid(this.id);

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
    if(this.trip){
    }
  }

  rating(e:number){
    if(this.trip)
    {
      this.user_stars = e;
    }
  }

}

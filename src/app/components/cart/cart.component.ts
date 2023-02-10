import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { CartService } from '../../services/cart.service';
import { Trip, TripLocal, TripWithId } from '../../Trip';
import { TripsService } from '../../services/trips.service';
import { AuthService } from 'src/app/services/auth.service';
import { User, userTrip } from 'src/app/interfaces';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.sass']
})
export class CartComponent implements OnInit{

  userTrips:userTrip[] = [];
  trips:TripWithId[] = [];

  constructor(private tripService:TripsService,private cartService: CartService,private auth: AuthService){}

  ngOnInit(): void {
    this.cartService.getUserTrips().subscribe(
      (data)=>{
        this.userTrips = data;
        this.userTrips.forEach(element => {
          var trip = this.tripService.getTripByIdLocal(element.id);
          if(trip)
            this.trips.push(trip);
        });
      }
    )


  //   this.auth.getLoggedValue().subscribe((val) =>{
  //     if(val){
  //     this.cartService.getCart().subscribe(data => {
  //       data.userTrips.forEach(elem =>{
  //         if(elem.state === "reserved"){
  //          this.tripService.getTripByid(elem.id).pipe(take(1)).subscribe(tri =>{
  //             let freeSlots = tri.maxPeople - tri.people - elem.noPlaces
  //             this.trips.push(this.tripService.convertToLocal(tri,elem.id,freeSlots))
  //             this.ordered.push(elem.noPlaces);
  //           }
  //           );
  //         }
  //       })
  //     });
  //     this.cartService.getCart().subscribe(data => {
  //       data.userTrips.forEach(elem =>{
  //         if(elem.state === "bought"){
  //          this.tripService.getTripByid(elem.id).pipe(take(1)).subscribe(tri =>{
  //             let freeSlots = tri.maxPeople - tri.people - elem.noPlaces
  //             this.tripsBought.push(this.tripService.convertToLocal(tri,elem.id,freeSlots))
  //             this.bought.push(elem.noPlaces);
  //           }
  //           );
  //         }
  //       })

  //     });
  //   }
  // })

  }

  buyAll(){
    var tmp = [];
    for(let i =0;i<this.trips.length;i++){
      if(this.userTrips[i].state === 'reserved'){
        this.userTrips[i].state = 'bought';
        this.trips[i].people += this.userTrips[i].noPlaces;
        this.cartService.updateTrip(this.trips[i]);
      }
    }
    this.cartService.setUserTrips(this.userTrips);
    this.auth.getUserObject().pipe(take(1)).subscribe((data) =>{
      data.userTrips = this.userTrips;


      this.auth.setUserObject(data);
    })


      // let flag = false;

      // this.tripService.updatePlaces(this.trips[i].id,this.ordered[i]);
      // for(let k =0;k<this.tripsBought.length;k++){
      //   if(this.tripsBought[k].id === this.trips[i].id){
      //     this.bought[k] += this.ordered[i];
      //     flag = true;
      //   }
      // }
      // if(!flag){
      //   this.tripsBought.push(this.trips[i]);
      //   this.bought.push(this.ordered[i]);
      // }
      // this.auth.handleUser();

  }


  increment(i:number):void{

      this.cartService.putCart(this.tripService.convertToLocal(this.trips[i],this.trips[i].id,this.trips[i].maxPeople - this.trips[i].people));
  }
  decrement(i:number):void{


    this.cartService.removeCart(this.tripService.convertToLocal(this.trips[i],this.trips[i].id,this.trips[i].maxPeople - this.trips[i].people));

  }


  buyOne(i:number){
    this.userTrips[i].state = 'bought';
    this.trips[i].people += this.userTrips[i].noPlaces;
    this.cartService.updateTrip(this.trips[i]);
    this.cartService.setUserTrips(this.userTrips);
    this.auth.getUserObject().pipe(take(1)).subscribe((data) =>{
      data.userTrips = this.userTrips;


      this.auth.setUserObject(data);
    });

  }
}

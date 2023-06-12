import { Injectable, OnInit } from '@angular/core';
import { Trip, TripLocal, TripWithId } from '../Trip';
import { collection, Firestore,collectionData, docData } from '@angular/fire/firestore';
import { addDoc,deleteDoc,doc,getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { User, userTrip } from '../interfaces';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { convertToTrip } from '../functions'

@Injectable({
  providedIn: 'root'
})
export class CartService {

  isLogged:boolean=false;
  userObject! :User;
  userTrips = new BehaviorSubject<userTrip[]>([]);

  coll = collection(this.db,"users");
  constructor(private db:Firestore,private auth: AuthService ) {
    this.auth.getLoggedValue().subscribe(val =>{
      this.isLogged = val;

    })
    this.auth.getUserObject().subscribe(val => {
      this.userObject=val;
      this.setUserTrips(this.userObject.userTrips);
    })}


  setUserTrips(uT:userTrip[]){
    this.userTrips.next(uT);
  }


  getUserTrips():Observable<userTrip[]>{
    return this.userTrips.asObservable();
  }





  putCart(trip:TripLocal):void{

    if(this.isLogged&&this.userObject){
      let found = false;

      for(var i =0;i<this.userTrips.value.length;i++){
        var tripp = this.userTrips.value[i];
        if(tripp.id === trip.id && tripp.state === 'reserved'){
          tripp.noPlaces++;
          found = true;
        }
      }
      if(!found){
        this.userTrips.value.push({id:trip.id,noPlaces:1,state:"reserved"});
      }
    this.userObject.userTrips= this.userTrips.value;
    this.setUserTrips(this.userObject.userTrips);
    this.auth.setUserObject(this.userObject);

    let usr = doc(this.db,'/users',this.userObject.userId);
    setDoc(usr,this.userObject);
    }




    // for(let i=0;i<this.cartTrips.length;i++){
    //   if(this.cartTrips[i].id === trip.id){
    //     this.ordered[i] += 1;
    //


    //     return;
    //   }
    // }
    // this.cartTrips.push(trip);
    // this.ordered.push(1);
    //
  }





  removeCart(trip:TripLocal):void{
    if(this.isLogged){
      let found = false;

      for(var i =0;i<this.userTrips.value.length;i++){
        var tripp = this.userTrips.value[i];
        if(tripp.id === trip.id && tripp.state === 'reserved'){
          if( tripp.noPlaces === 1){
            this.userTrips.value.splice(i,1);
          }
          else{
            tripp.noPlaces--;
          }
        }
      }
      this.userObject.userTrips= this.userTrips.value;
      this.auth.setUserObject(this.userObject);

      let usr = doc(this.db,'/users',this.userObject.userId);
      setDoc(usr,this.userObject);

    // let usr = doc(this.db,'/users',this.userObject.userId);
    // let source = docData(doc(this.db,'/users',this.userObject.userId)) as Observable<User>;

    // source.pipe(take(1)).subscribe(a =>{
    //   for(let i=0;i<a.userTrips.length;i++){
    //     if(a.userTrips[i].id === trip.id){
    //       if( a.userTrips[i].noPlaces === 1){
    //         a.userTrips.splice(i,1);
    //       }
    //       else{
    //         a.userTrips[i].noPlaces--;
    //       }
    //     }
    //   }

    //   setDoc(usr,a);

   }





    // let id = trip.id;
    // for(let i=0;i<this.cartTrips.length;i++){
    //   if(this.cartTrips[i].id === id){
    //     if(this.ordered[i] > 1){
    //       this.ordered[i]-=1;
    //
    //       return;
    //     }
    //     if(this.ordered[i] === 1){
    //       this.cartTrips.splice(i,1);
    //       this.ordered.splice(i,1);
    //
    //       return;
    //     }
    //   }
    // }
    //
    // return;
  }

  getCartFromDb(){

  }

  getCart(){
    if (this.isLogged){

      let source = docData(doc(this.db,'/users',this.userObject.userId)) as Observable<User>;
      return source;
    }
    return new Observable<User>;
  }
  getOrdered(tripId:string){
    // let usr = doc(this.db,'/users',this.userObject!.userId);
    // let source = docData(doc(this.db,'/users',this.userObject!.userId)) as Observable<User>;

    // return source.pipe(take(1),map(a=>{
    //   let noOrdered:number =0;
    //   for(let i=0;i<a.userTrips.length;i++){

    //   if(tripId === a.userTrips[i].id && a.userTrips[i].state === "reserved"){
    //       noOrdered = a.userTrips[i].noPlaces;
    //       return noOrdered;
    //   }
    //   }

    //   return noOrdered;
    //   }
    // ));

    for(let i =0; i < this.userTrips.value.length;i++){
      if(tripId === this.userTrips.value[i].id && this.userTrips.value[i].state === 'bought'){
        return this.userTrips.value[i].noPlaces;
      }
    }
    return 0;
  }


  getReserved(tripId:string){
    for(let i =0; i < this.userTrips.value.length;i++){
      if(tripId === this.userTrips.value[i].id && this.userTrips.value[i].state === 'reserved'){
        return this.userTrips.value[i].noPlaces;
      }
    }
    return 0;
  }

  buyFromCart(tripId:string){
    let usr = doc(this.db,'/users',this.userObject!.userId);
    let source = docData(doc(this.db,'/users',this.userObject!.userId)) as Observable<User>;

    source.pipe(take(1)).subscribe(a =>{
      let found = false;
      for(let i=0;i<a.userTrips.length;i++){
        if(a.userTrips[i].id === tripId){
          a.userTrips[i].state = "bought";
        }
      }
      setDoc(usr,a);
    })

  }

  updateTrip(trip:any){
    var docc = doc(this.db,'/trips',trip.id);
    const tr = convertToTrip(trip);
    setDoc(docc,tr);
  }





  // getOrdered(trip:TripLocal){
  //   for(let i=0;i<this.cartTrips.length;i++){
  //     if(this.cartTrips[i].id === trip.id){
  //       return this.ordered[i];
  //     }
  //   }
  //   return 0;
  // }



}






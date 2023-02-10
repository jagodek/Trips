import { Component, OnInit,Input,Output, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { JsonPipe } from '@angular/common';

import { Trip, TripLocal } from '../../Trip';
import { Review } from '../../Review';
import { TripsService } from '../../services/trips.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FilterPipe } from '../../FilterPipe';
import { FilterSet } from '../../FiltersSet';
import { Router } from '@angular/router';
import { waitForAsync } from '@angular/core/testing';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-trips-list',
  templateUrl: './trips-list.component.html',
  styleUrls: ['./trips-list.component.sass']
})
export class TripsListComponent implements OnInit,OnChanges{
  trips:TripLocal[]=[];
  loaded=false;
  expensive!:number;
  cheap!:number;

  tripFilters!:FormGroup;

  filterSet!:FilterSet;

  constructor(private tripService:TripsService,private fb:FormBuilder,private router: Router,private auth: AuthService){
  }

  countries:string[]=[];


  ngOnChanges(changes: SimpleChanges) {
  }

  ngOnInit(): void {
    this.auth.handleUser();
    // this.tripService.newTrips.forEach(element => {
    //   this.trips.push(element)
    // });
    if(this.trips)
      this.updateMinMax(this.trips);

    this.tripService.getTrips().subscribe((data:any[]) => {
      data.forEach((elem) => {
        elem.freeSlots = elem.maxPeople - elem.people;
        elem.stars = this.tripService.getStars(elem.reviews);
        this.trips.push(elem);
      });

      // });
      // this.trips.push(data.map<Trip>(elem => {elem.freeSlots = elem.maxPeople - elem.people;
      //   elem.stars = this.getStars(elem.reviews);
      // }));

      let s = new Set(data.map(a => {return a.country}));
      this.countries = Array.from(s);
      this.updateMinMax(this.trips);
      this.loaded = true;
    }
    )
  }
  getStars(arr:Array<Review>){
    let s =0;
    let c = 0;
    arr.forEach(element => {
      s+=element.stars;
      c++;
    });
    if(c==0)
      return 1;
    return Math.floor((s/c)*2)+1;
  }

  updateMinMax(tripsArr:TripLocal[]){
    this.expensive = Math.max.apply(Math,tripsArr.map(a => {return a.price}));
    this.cheap = Math.min.apply(Math,tripsArr.map(a => {return a.price}));
  }

  onDelete(idDel:string):void{
    this.auth.handleUser();
    if(this.trips)
    this.trips = this.trips.filter(a=>{return a.id != idDel});
    if(this.trips)
      this.updateMinMax(this.trips);
  }

  applyFilter(e:FilterSet){
    if(e)
    this.filterSet = e;
  }





}

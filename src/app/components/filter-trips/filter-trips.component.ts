import { Component, Input, OnChanges, OnInit, SimpleChanges,Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CountryCheck } from '../../CountryCheck';
import { FilterSet } from '../../FiltersSet';
import { Trip, TripLocal } from '../../Trip';
import { TripsService } from '../../services/trips.service';
import { AuthService } from 'src/app/services/auth.service';
import { BehaviorSubject } from 'rxjs';
import { deepCopy } from '@firebase/util';

@Component({
  selector: 'app-filter-trips',
  templateUrl: './filter-trips.component.html',
  styleUrls: ['./filter-trips.component.sass']
})
export class FilterTripsComponent implements OnInit{

  @Output() filterSet:EventEmitter<FilterSet> = new EventEmitter<FilterSet>();

  countries_obj:CountryCheck[]= [];


  expensive!:number;

  cheap!:number;

  formGroup!:FormGroup;
  today  = new Date();
  curr = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());



  constructor(private service: TripsService,private fb:FormBuilder,private auth:AuthService){
  this.formGroup = this.fb.group({
      check:[false],
      low:[],
      high:[],
      dateFrom:[new Date(2022,12,11)],
      dateTo:[new Date(2025,12,1)],
      rating:[0]
    })
  }






  ngOnInit(){
    this.formGroup.controls['low'].setValue(this.cheap);
    this.formGroup.controls['high'].setValue(this.expensive);

    this.service.getTrips().subscribe((data) => {

      let countries:string[] = [];
      data.forEach(tripp => {
        countries.push(tripp.country);
      });
      let s = new Set(countries);
      let b = Array.from(s);
      this.countries_obj =b.map(a =>{return {name:a,checked:false}});

      this.expensive = Math.max.apply(Math,data.map(a => {return a.price}));
      this.cheap = Math.min.apply(Math,data.map(a => {return a.price}));
      this.formGroup.get('low')?.setValue(this.cheap);
      this.formGroup.get('high')?.setValue(this.expensive);
      console.log('cheap',this.cheap);

    })



  }
  updateCountry(c:number){

    if(this.countries_obj[c].checked){
      this.countries_obj[c].checked = false;
    }
    else{
      this.countries_obj[c].checked = true;
    }
  }
  update(){
    let countries = deepCopy(this.countries_obj);
    let newFilter:FilterSet ={countries:countries,
    minPrice: this.formGroup.controls['low'].value,
    maxPrice:this.formGroup.controls['high'].value,
    dateFrom: this.formGroup.controls['dateFrom'].value,
    dateTo:this.formGroup.controls['dateTo'].value,
    rating:this.formGroup.controls['rating'].value
    } as const;


    this.filterSet.emit(newFilter);
  }




  reset(){
    this.formGroup.reset();
    this.formGroup.controls['low'].setValue(this.cheap);
    this.formGroup.controls['high'].setValue(this.expensive);
    this.formGroup.controls['dateFrom'].setValue(new Date(2022,12 ,1));
    this.formGroup.controls['dateTo'].setValue(new Date(2025,12 ,1));

    this.countries_obj.forEach(element => {
      element.checked = false;
    });
    let countries = deepCopy(this.countries_obj);
    let newFilter:FilterSet ={countries:countries,
    minPrice:this.cheap,
    maxPrice:this.expensive,
    dateFrom: new Date(2022,12,1),
    dateTo: new Date(2025,12,1),
    rating:0} as const;
    this.filterSet.emit(newFilter);
  }


}

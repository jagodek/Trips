import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormControl,FormGroup, Validators } from '@angular/forms';
import { TripsService } from '../../services/trips.service';
import { DatePipe, formatDate } from '@angular/common';
import { validDateValidator } from './validators/valid-date';
import { Trip } from '../../Trip';
import { AuthService } from 'src/app/services/auth.service';
import { toDate } from 'src/app/functions';

@Component({
  selector: 'app-add-trip',
  templateUrl: './add-trip.component.html',
  styleUrls: ['./add-trip.component.sass']
})
export class AddTripComponent implements OnInit{
  addForm!:FormGroup;
  editForm!:FormGroup;
  pType = "add";
  myDateFilter(date: Date): boolean{
    date = new Date(date);  //niepotrzebne?
    let d = new Date(date.getFullYear(), date.getMonth(),date.getDate());
    let today  = new Date();
    let curr = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return curr.getTime() < d.getTime();
  }

  trips!:Trip[];

  constructor(private fb: FormBuilder,private tripService: TripsService,private datePipe:DatePipe,private auth: AuthService){
  }
  ngOnInit(): void {
    this.auth.handleUser();
    this.tripService.getTrips().subscribe(val => {
      this.trips =val;
    })
    this.addForm = this.fb.group({
      name: ['',Validators.required],
      country: ['',[Validators.minLength(3),Validators.required]],
      dateBegin: ['',[Validators.required,validDateValidator()]],
      dateEnd: ['',Validators.required],
      price: ['',[Validators.required,Validators.min(1)]],
      maxPeople: ['',[Validators.required,Validators.min(1)]],
      description: ['',Validators.required],
      photo: ['',Validators.required]
    })
    this.editForm = this.fb.group({
      name: ['',Validators.required],
      country: ['',[Validators.minLength(3),Validators.required]],
      dateBegin: ['',[Validators.required]],
      dateEnd: ['',Validators.required],
      price: ['',[Validators.required,Validators.min(1)]],
      maxPeople: ['',[Validators.required,Validators.min(1)]],
      description: ['',Validators.required],
      photo: ['',Validators.required]
    })
  }

  onSubmit():void{
    // console.warn(this.addForm.value);
    let data = this.addForm.value;
    data.photos = data.photo;
    delete data.photo;
    data.people = 0;
    data.freeSlots = data.maxPeople - data.people;
    data.dateBegin = this.datePipe.transform(data.dateBegin, 'dd.MM.yyyy');
    data.dateEnd = this.datePipe.transform(data.dateEnd, 'dd.MM.yyyy');
    data.reviews = [];
    this.tripService.addTrip(data);
    this.addForm.reset();
    this.auth.handleUser();
  }

  mock():void{
    let trip = {
      name:"Boże narodzenie w Rzymie",
      country:"Polska",
      dateBegin:"22.12.2022",
      dateEnd:"28.12.2022",
      price:1248,
      maxPeople:6,
      people:0,
      description:"Padwa • Rzym • Watykan • ",
      photos:['https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/POLSKA_mapa_woj_z_powiatami.png/330px-POLSKA_mapa_woj_z_powiatami.png'],
      reviews:[],
      // id:undefined
      // freeSlots:6,
      // id:-1,
      // stars:1,
      // user_stars:1

    }
    this.addForm.setValue({...trip});
    this.tripService.addTrip(trip);
  }

  onSubmitEdit(){
    let data = this.editForm.value;
    data.photos = data.photo;
    delete data.photo;
    data.people = 0;
    data.freeSlots = data.maxPeople - data.people;
    data.dateBegin = this.datePipe.transform(data.dateBegin, 'dd.MM.yyyy');
    data.dateEnd = this.datePipe.transform(data.dateEnd, 'dd.MM.yyyy');
    data.reviews = [];
    this.tripService.editTrip(data);
    this.editForm.reset();
    this.auth.handleUser();
  }


  toggle(val:string){
    this.pType = val;
  }

  choose(trip:Trip){
    if(this.editForm){
      this.editForm.get('name')!.setValue(trip.name);
      this.editForm.get('country')!.setValue(trip.country);
      this.editForm.get('dateBegin')!.setValue(toDate(trip.dateBegin));
      this.editForm.get('dateEnd')!.setValue(toDate(trip.dateEnd));
      this.editForm.get('price')!.setValue(trip.price);
      this.editForm.get('maxPeople')!.setValue(trip.maxPeople);
      this.editForm.get('description')!.setValue(trip.description);
      this.editForm.get('photo')!.setValue(trip.photos[0]);


  }}



}

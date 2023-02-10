import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError,of, BehaviorSubject } from 'rxjs';
import { catchError, retry, tap, filter, map,take } from 'rxjs/operators';
import { Review } from './../Review';
import { Trip, TripLocal, TripWithId } from './../Trip';
import { LocalizedString, ThisReceiver } from '@angular/compiler';
import { collection, Firestore,collectionData, docData } from '@angular/fire/firestore';
import { addDoc,deleteDoc,doc,getDoc, setDoc, updateDoc } from 'firebase/firestore';




@Injectable({
  providedIn: 'root'
})
export class TripsService {
  localURL = "assets/trips.json";
  newTrips:Trip[]=[];

  coll = collection(this.db,"trips");
  private trips= new BehaviorSubject<TripWithId[]>([]);

  constructor(private http:HttpClient,private db:Firestore ) {
    this.getTripsFromDb().subscribe((val) =>{
      this.addAllTripsToLocal(val);
    })
  }

  addAllTripsToLocal(arr:TripWithId[]){
    this.trips.next(arr);
  }

  getTrips():Observable<Trip[]>{
    return this.trips.asObservable();
  }

  getTripByIdLocal(tripId:string){
    for(let i =0;i<this.trips.value.length;i++){
      if(this.trips.value[i].id === tripId){
        return this.trips.value[i];
      }
    }
    return undefined;
  }



  uploadFromJsonAlll(){
    let trips=[]

    this.getTripsURL().pipe(take(1)).subscribe(a => {
      trips = a;
      a.forEach(element => {
          addDoc(this.coll,element);
      });
    })
  }


  getTripsFromDb(){
    return collectionData(this.coll,{idField: 'id'}) as Observable<TripWithId[]>;
  }


  removeAll(){
    collectionData(this.coll,{idField: 'id'}).pipe(take(1)).subscribe(a => {a.forEach(element => {
      this.removeById(element['id']);
    });})
  }

  removeById(id:string){
    const dc = doc(this.db,'/trips',id);
    deleteDoc(dc);
  }

  getTripsURL(){
    return this.http.get<Trip[]>(this.localURL);
  }

  addTrip(trip:any){

    addDoc(this.coll,trip);
  }

  getTripByid(id:string):Observable<Trip>{
    return docData(doc(this.db,'/trips',id)) as Observable<Trip> ;
  }


  addReview(id:string, newTrip:Trip){
    let trip = doc(this.db,'/trips',id);
    setDoc(trip,newTrip);
  }

  convertToTrip(trip:TripLocal){
    const tmp: Partial<TripLocal> = {...trip};
    delete tmp.freeSlots;
    delete tmp.id;
    delete tmp.stars;
    return tmp as Trip;

  }

  convertToLocal(trip:Trip,id_:string,freeSlots_:number){
    const tmp:Partial<TripLocal> = {...trip};
    tmp.id = id_;
    tmp.freeSlots = freeSlots_;
    tmp.stars = this.getStars(trip.reviews);
    return tmp as TripLocal;
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

  updatePlaces(tripId:string,boughtPlaces:number ){
    const dc = doc(this.db,'/trips',tripId);
    let source = docData(dc) as Observable<Trip>;
    source.pipe(take(1)).subscribe(data => {
      data.people+=boughtPlaces;
      setDoc(dc,data);
    })

  }

  editTrip(trip:any){
    const dc = doc(this.db,'/trips',trip.id);

  }


}

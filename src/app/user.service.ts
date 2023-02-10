import { Injectable } from '@angular/core';
import { collection, Firestore,collectionData, docData } from '@angular/fire/firestore';
import { addDoc,deleteDoc,doc,getDoc } from 'firebase/firestore';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  buyTrip(tripId:string,places:number){

  }
}

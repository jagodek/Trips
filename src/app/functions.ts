import { Trip, TripLocal } from "./Trip";

export function toDate(date:string){
  var dateParts = date.split(".");
  var dateObject = new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]);
  return dateObject;
}

export function  convertToTrip(trip:TripLocal){
  const tmp: Partial<TripLocal> = {...trip};
  delete tmp.freeSlots;
  delete tmp.id;
  delete tmp.stars;
  return tmp as Trip;

}

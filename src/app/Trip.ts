import { Review } from "./Review"



export interface Trip{

  name:string,
  country:string,
    dateBegin:string,
    dateEnd:string,
    price:number,
    maxPeople:number,
    people:number,
    description:string,
    photos:string[],
    reviews:Array<Review>

    // freeSlots:number,    //additional fields not in json
    // stars:number,
    // user_stars:number,
}

export interface TripWithId extends Trip{
  id:string
}

export interface TripLocal extends Trip{
  id:string,
  freeSlots:number,
  stars:number,
}


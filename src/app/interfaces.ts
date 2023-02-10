import { TripLocal } from "./Trip"

export interface userTrip{
  id:string,
  noPlaces:number,
  state:string
}


export interface User{

}

export interface SigninCredentials{
  email: string,
  password: string
}

export interface SignupCredentials extends SigninCredentials{
  name:string
}

export interface User {
  name:string,
  userTrips:userTrip[],
  role:string,
  banned:boolean,
  userId:string,
  email:string
}


export interface settings{
  timeoutType:string,
  timeoutValue:number
}

export interface cartElement{
  trip:TripLocal
  num:number
}


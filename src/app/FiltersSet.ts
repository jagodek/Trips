import { CountryCheck } from "./CountryCheck"
export interface FilterSet{
  countries: CountryCheck[],
  minPrice: number,
  maxPrice: number,
  dateFrom: Date,
  dateTo: Date,
  rating:number
}

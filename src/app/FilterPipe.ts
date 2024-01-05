import { Pipe, PipeTransform } from '@angular/core';
import { Trip, TripLocal } from './Trip';
import { CountryCheck } from './CountryCheck';
import { FilterSet } from './FiltersSet';
import { filter } from 'rxjs';

@Pipe({
  name: 'FilterPipe',
  pure: false, // if changes dependend on something else than arguments
})
export class FilterPipe implements PipeTransform {
  transform(allTrips: TripLocal[], filterSet: FilterSet): TripLocal[] {
    if (filterSet) {
      let allFalse = filterSet.countries.map((a) => {return a.checked;});

      if (!allFalse.every((a) => a == false))
      {
        allTrips = allTrips.filter((trip) => {
          for (let country of filterSet.countries)
          {
            if (country.name === trip.country && country.checked)
            {
              return trip;
            }
          }
          return;
        });
      }
      allTrips = allTrips.filter(a => a.price >= filterSet.minPrice && a.price <= filterSet.maxPrice)
      allTrips = allTrips.filter(a => this.compareDates(filterSet.dateFrom,a.dateBegin) <= 0 && this.compareDates(filterSet.dateTo,a.dateEnd) >= 0)
      // allTrips = allTrips.filter(a => a.stars > filterSet.rating*2+1)
      return allTrips;
    } else {
      return allTrips;
    }
  }


  compareDates(d1:Date, d2:string){
    const [day, month, year] = d2.split('.');
    const date = new Date(+year, +month - 1, +day);
    let tmp = new Date(d1);
    d1 = new Date(tmp.getFullYear(),tmp.getMonth(),tmp.getDate());

    if(d1>date){
      return 1;
    }
    else if(d1==date){
      return 0;
    }
    return -1;

  }
}


import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
  // implements method transfrom(value: any, ...args: any[]): any
  // https://angular.io/api/core/PipeTransform

  transform(value: string, limit = 25, completeWords = false, ellipsis = '...') {
    if (completeWords) {
      limit = value.substr(0, limit).lastIndexOf(' '); //cuts string at limit then cuts remaining string at last space
    }
    return value.length > limit ? value.substr(0, limit) + ellipsis : value;
  }
}

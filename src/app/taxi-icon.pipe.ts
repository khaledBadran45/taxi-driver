import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'taxiIcon'
})
export class TaxiIconPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}

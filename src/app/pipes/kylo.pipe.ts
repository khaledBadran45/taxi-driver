import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'kilo',
})
export class KyloPipe implements PipeTransform {
  transform(value: number) {
    return (value / 1000).toFixed() + ' km';
  }
}

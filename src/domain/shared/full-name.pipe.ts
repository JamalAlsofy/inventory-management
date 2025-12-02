import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fullName',
  standalone: true
})
export class FullNamePipe implements PipeTransform {

  transform(emp: { firstName: string; lastName?: string }): string {
    if (!emp) return '';
    return `${emp.firstName} ${emp.lastName ?? ''}`.trim();
  }

}

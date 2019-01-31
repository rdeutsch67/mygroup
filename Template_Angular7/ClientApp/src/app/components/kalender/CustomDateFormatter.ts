 import { CalendarDateFormatter, DateFormatterParams } from 'angular-calendar';
 import { formatDate } from '@angular/common';

 class CustomDateFormatter extends CalendarDateFormatter {

     public monthViewColumnHeader({date, locale}: DateFormatterParams): string {
       return formatDate(date, 'EEE', locale); // use short week days
     }

 }

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

/*export function getBaseUrl() {
  //return document.getElementsByTagName('base')[0].href;
  return 'http://localhost:4200';
}*/

const providers = [
  //{ provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] }
  //{ provide: 'BASE_URL', useFactory: 'http://localhost:4200', deps: [] }
];

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic(providers).bootstrapModule(AppModule)
  .catch(err => console.log(err));

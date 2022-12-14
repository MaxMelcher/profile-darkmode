
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

export function getBaseUrl() {
  return document.getElementsByTagName('base')[0].href;
}

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic([
  { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] }
]).bootstrapModule(AppModule)
  .catch(err => {
    
  });


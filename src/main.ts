import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import * as SendBird from 'sendbird';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .then(() => {
    console.log('init SendBird');
    const appId = '9DA1B1F4-0BE6-4DA8-82C5-2E81DAB56F23'; // DEMO SAMPLE APP_ID
    const sb = new SendBird({ appId });
    sb.connect('test_user', function(user, err) {
      console.log('[connect func] res: ', user, ' err: ', err);
    })
  })
  .catch(err => console.log(err));

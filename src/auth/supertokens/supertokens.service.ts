import { Inject, Injectable } from '@nestjs/common';
import supertokens from 'supertokens-node';
import Session from 'supertokens-node/recipe/session';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import Dashboard from 'supertokens-node/recipe/dashboard';

import { ConfigInjectionToken, AuthModuleConfig } from '../config.interface';

@Injectable()
export class SupertokensService {
  constructor(@Inject(ConfigInjectionToken) private config: AuthModuleConfig) {
    supertokens.init({
      appInfo: config.appInfo,
      supertokens: {
        connectionURI:
          'https://st-dev-daa0b600-96b0-11ee-ba63-d36c9a2da200.aws.supertokens.io',
        apiKey: 'Dkw39OBbn=OhNwg3VCzlC1XuDP',
      },
      recipeList: [
        EmailPassword.init(),
        Session.init(),
        Dashboard.init({ admins: ['sackmannva@gmail.com'] }),
      ],
    });
  }
}

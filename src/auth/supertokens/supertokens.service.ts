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
      supertokens: {
        connectionURI: config.connectionURI,
        apiKey: config.apiKey,
      },
      appInfo: config.appInfo,
      recipeList: [
        EmailPassword.init(),
        Session.init(),
        Dashboard.init({ admins: ['sackmannva@gmail.com'] }),
      ],
    });
  }
}

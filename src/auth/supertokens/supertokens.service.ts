import { Inject, Injectable } from '@nestjs/common';
import supertokens from 'supertokens-node';
import Session from 'supertokens-node/recipe/session';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import Dashboard from 'supertokens-node/recipe/dashboard';

import { ConfigInjectionToken, AuthModuleConfig } from '../config.interface';
import { TherapistDTO } from 'src/therapist/controllers/therapist/therapistDTO.entity';
import { TherapistService } from 'src/therapist/services/therapist/therapist.service';

@Injectable()
export class SupertokensService {
  constructor(
    @Inject(ConfigInjectionToken) private config: AuthModuleConfig,
    private therapistService: TherapistService,
  ) {
    supertokens.init({
      debug: true,
      supertokens: {
        connectionURI: config.connectionURI,
        apiKey: config.apiKey,
      },
      appInfo: config.appInfo,
      recipeList: [
        EmailPassword.init({
          override: {
            functions: (originalImplementation) => {
              return {
                ...originalImplementation,
                signUp: async function (input) {
                  // First we call the original implementation of signUpPOST.
                  const response = await originalImplementation.signUp(input);

                  // Post sign up response, we check if it was successful
                  if (
                    response.status === 'OK' &&
                    response.user.loginMethods.length === 1
                  ) {
                    const emails = response.user.emails;
                    if (emails.length > 0) {
                      const email = emails.at(0);
                      const therapistDTO = new TherapistDTO();
                      therapistDTO.email = email;
                      therapistDTO.id = response.user.id;
                      therapistService.createTherapist(therapistDTO);
                    }
                  }
                  return response;
                },
              };
            },
          },
        }),
        Session.init(),
        Dashboard.init({ admins: ['admin@acme.com'] }),
      ],
    });
  }
}

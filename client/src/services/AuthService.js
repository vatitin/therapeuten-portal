import KeycloakPatientService from './KeycloakPatientService';
import KeycloakTherapistService from './KeycloakTherapistService';

//todo use a better way to handle roles
export const Role = Object.freeze({
    PATIENT:   'patient',
    THERAPIST: 'therapist',
    GUEST:     'guest',
  });

class AuthService {
    constructor() {
        this._role = Role.GUEST;
        this._initialized = false;
    }

  async init() {

    //todo check why there is an infinite loop without this check and if this check is an appropriate solution
    if (this._initialized) {
        return this._role;
    };

    this._initialized = true;

    try {
        await KeycloakPatientService.init();
    } catch { console.log("error here")}
    console.log("KeycloakPatientService initialized: " + KeycloakPatientService.isAuthenticated());
    if (KeycloakPatientService.isAuthenticated()) {
      this._role = 'patient';
      return this._role;
    }

    await KeycloakTherapistService.init();
    if (KeycloakTherapistService.isAuthenticated()) {
      this._role = 'therapist';
      return this._role;
    }
    this._role = 'guest';
    return this._role;
  }

  loginPatient(redirectUri) {
    return KeycloakPatientService.login(redirectUri);
  }

  loginTherapist(redirectUri) {
    return KeycloakTherapistService.login(redirectUri);
  }

  logout() {
    if (this.role === 'patient') KeycloakPatientService.logout();
    if (this.role === 'therapist') KeycloakTherapistService.logout();
    this._role = 'guest';
    this._initialized = false;
    window.location.href = '/';
  }

  get role() { return this._role; }

  get email() {

    // if (this._role === "patient") {
    //   const email = await KeycloakPatientService.keycloak.tokenParsed.email ?? null;
    //   return email;
    // }
    // if (this._role === "patient") {
    //   return await KeycloakTherapistService.keycloak.tokenParsed.email ?? null;
    // }
    return 'someEmail';
  }

}

const authService = new AuthService();

export default authService;

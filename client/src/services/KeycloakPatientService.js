import Keycloak from 'keycloak-js';

class KeycloakPatientService {
  keycloak = null;

  init() {
    if (this.keycloak) return Promise.resolve(this.keycloak.authenticated);
    this.keycloak = new Keycloak({
      url: 'http://localhost:8080',
      realm: 'patient-therapist-platform',
      clientId: 'patient-client',
    });
    return this.keycloak.init({
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
    });
  }

  login() {
    this.keycloak.login();
  }

  logout() {
    this.keycloak.logout();
  }

  getToken() {
    return this.keycloak.token;
  }

  isAuthenticated() {
    return this.keycloak.authenticated;
  }

  updateToken() {
    return this.keycloak.updateToken(70); 
  }

  getUserId() {
    if (this.keycloak && this.keycloak.tokenParsed) {
      return this.keycloak.tokenParsed.sub;
    }
    return null;
  }
}

const keycloakPatientService = new KeycloakPatientService();

export default keycloakPatientService;

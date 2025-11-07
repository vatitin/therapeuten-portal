import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
    url: 'http://localhost:8080',
    realm: 'patient-therapist-platform',
    clientId: 'patient-client',
});

export default keycloak;
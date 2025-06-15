import { Button, Group } from "@mantine/core"
import { useKeycloak } from "@react-keycloak/web";

export function AuthButtons() {

    const { keycloak, initialized } = useKeycloak();

    function handlePatientLogin(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        event.preventDefault();
        if (keycloak) {
        keycloak.login({
            redirectUri: window.location.origin,
        });
        }
    }

    function handleTherapistLogin(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        event.preventDefault();
        if (keycloak) {
        keycloak.login({
            redirectUri: window.location.origin,
            idpHint: 'therapist', // assumes a Keycloak IdP alias for therapists
        });
        }
    }

    return (
        <Group gap="xs">
            <Button variant="default" onClick={handlePatientLogin} disabled={!initialized}>
                Log in
            </Button>
            <Button onClick={handleTherapistLogin} disabled={!initialized}>
                Therapeuten-Anmeldung
            </Button>
        </Group>
    )
}


# MQTT Client Documentation

## Topics

### Reçus par le client mqtt

- /component/data:
    - Mise à jour des données reçues par un capteur
    - data attendues:
    ```json
        {
            "uuid": "string", // l'identifiant unique du capteur
            "temparture": "number", // la température actuelle
            "humidity": "number", // le taux d'humidité actuelle
        }
    ```

- validate/:uuid:
    - Valide ou non l'ajout d'un nouveau composant
    - :uuid : l'uuid reçue dans /check/:uuid (aka. l'uuid du composant)
    - data attendues: 
    ```json
        {
            "validate": "boolean" // true si tout est ok false sinon (ex: déjà associé à un utilisateur)
        }
    ```

### Envoyés par le client mqtt

- /activate/:uuid:
    - Active un régulateur
    - uuid: l'uuid du régulateur a activer
    - data envoyées:
    ```json
        {
            "uuid": "string", // l'identifiant du régulateur à activer
        }
    ```

- /deactivate/:uuid:
    - Désactive un régulateur
    - uuid: l'uuid du régulateur a désactiver
    - data envoyées:
    ```json
        {
            "uuid": "string", // l'identifiant du régulateur à activer
        }
    ```

- /check/:uuid:
    - Verifie l'existence et la disponibilité du nouveau composant à créer
    - :uuid : L'uuid entré par l'utilisateur
    - data envoyées: N/A

- /alarm/unlink/:uuid
    - Retire le lien entre l'utisateur et le régulateur
    - :uuid : L'uuid du régulateur à modifier
    - data envoyées: N/A

- /component/unlink/:uuid
    - Retire le lien entre l'utisateur et le capteur
    - :uuid : L'uuid du capteur à modifier
    - data envoyées: N/A

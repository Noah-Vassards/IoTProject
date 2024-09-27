# MQTT Client Documentation

## Topics

### Reçus par le client mqtt

- /component/new:
    - Enregistre un nouveau capteur pour un utilisateur
    - data attendues: 
    ```json
        {
            "uuid": "string", // l'identifiant unique du capteur
            "user": "A définir" // un moyen d'identifer le proprietaire du capteur
        }
    ```

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

- alarm/new:
    - Enrigistre un nouveau régulateur pour un utilisateur
    - data attendues: 
    ```json
        {
            "uuid": "string", // l'identifiant unique du capteur
            "user": "A définir" // un moyen d'identifer le proprietaire du capteur
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

- alarm/activate:
    - Active un régulateur
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

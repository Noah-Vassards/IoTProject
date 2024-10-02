# Documentation du back-end

## Routes

URL: http://localhost:3001/dev

### Users

- DELETE /users/deleteByEmail/?email=$email
    - Supprime un utilisateur via son email
    - Paramètre: 
    ```
        $email: l'email de l'utilisateur à supprimer
    ```

- GET /users
    - Permet de récuperer tous les utilisateurs inscrits dans la base de données
        - Utilisable seuelement en localhost

- POST /users/:id/components
    - Ajoute un nouveau capteur et le lie à un utilisateur
    - Paramètre: 
    ```
        id: l'id de l'utilisateur
    ```
    - body:
    ```json
        {
            "uuid": "string", // l'identifiant unique du nouveau capteur
            "name": "string", // le nom personnalisé du capteur (optionel)
            "data": "{date: Date, temperature: number, humidity: number}" // les relevés de températures et d'humidité (optionel)
        }
    ```

- GET /users/:id/components
    - Permets de récupérer tous les capteurs liés à un utilisateur
    - Paramètre: 
    ```
        id: l'id de l'utilisateur
    ```
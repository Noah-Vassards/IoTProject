document.addEventListener('DOMContentLoaded', function() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const componentInput = document.getElementById('component');
    const submitButton = document.getElementById('submit-button') || null;
    const createAccountButton = document.getElementById('create-account-button') || null;
    const errorMessage = document.getElementById('error-message');
    let uuid = '';  // Variable pour stocker le UUID

    // Fonction pour récupérer le UUID de l'ESP8266
    function fetchUUID() {
        return fetch('/getUUID')
            .then(response => response.json())
            .then(data => {
                uuid = parseInt(data.uuid, 16);  // Stocke le UUID récupéré
                console.log('UUID récupéré : ' + uuid);  // Log après récupération
            })
            .catch(error => {
                console.error('Erreur lors de la récupération du UUID :', error);
            });
    }

    // Récupérer le UUID au chargement de la page
    fetchUUID();

    if (submitButton) {
        // Gérer la connexion
        submitButton.addEventListener('click', function(e) {
            e.preventDefault();
            const name = "test";
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();
            const component = String(uuid);
            const alarm = component ? component + 'A' : '';  // Génère `alarm` automatiquement


            if (email === '' || password === '') {
                errorMessage.textContent = 'Veuillez remplir tous les champs.';
                errorMessage.style.display = 'block';
                return;
            }

            errorMessage.style.display = 'none';
            // Envoie la requête de connexion au serveur local
            fetch('http://35.180.242.193:3001/dev/account/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ name, email, password, component, alarm })  // Inclut `alarm`
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log('Connexion réussie :', data);
                } else {
                    errorMessage.textContent = data.message || 'Échec de la connexion.';
                    errorMessage.style.display = 'block';
                }
            })
            .catch(error => {
                console.error('Erreur lors de la connexion :', error);
                errorMessage.textContent = 'Erreur de connexion.';
                errorMessage.style.display = 'block';
            });
        });
    }

    if (createAccountButton) {
        // Gérer la création de compte
        createAccountButton.addEventListener('click', function(e) {
            e.preventDefault();
            const name = "test";
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();
            const component = String(uuid);
            const alarm = component ? component + 'A' : '';  // Génère `alarm` automatiquement

            if (email === '' || password === '') {
                errorMessage.textContent = 'Veuillez remplir tous les champs pour créer un compte.';
                errorMessage.style.display = 'block';
                return;
            }

            errorMessage.style.display = 'none';
            const signUpData = {
                name: name,
                email: email,
                password: password,
                component: component || undefined,  // facultatif
                alarm: alarm || undefined           // facultatif
            };

            console.log(signUpData);

            // Envoie la requête de création de compte au serveur local
            fetch('http://35.180.242.193:3001/dev/account/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signUpData)  // Inclut `alarm`
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erreur du serveur: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    console.log('Compte créé avec succès :', data);
                } else {
                    errorMessage.textContent = data.message || 'Échec de la création du compte.';
                    errorMessage.style.display = 'block';
                }
            })
            .catch(error => {
                console.error('Erreur lors de la création du compte :', error);
                errorMessage.textContent = 'Erreur lors de la création du compte. Veuillez réessayer.';
                errorMessage.style.display = 'block';
            });
        });
    }
});
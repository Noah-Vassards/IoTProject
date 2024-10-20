document.addEventListener('DOMContentLoaded', function() {
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const submitButton = document.getElementById('submit-button') || null;
  const createAccountButton = document.getElementById('create-account-button') || null;
  const errorMessage = document.getElementById('error-message');
  let uuid = '';  // Variable pour stocker l'UUID

  // Fetch the UUID from ESP8266
  function fetchUUID() {
      alert('Fetching UUID...');  // Alerte avant de récupérer l'UUID
      return fetch('/getUUID')
          .then(response => response.json())
          .then(data => {
              uuid = parseInt(data.uuid, 16);  // Store the fetched UUID
              alert('UUID fetched: ' + uuid);  // Alerte après avoir récupéré l'UUID
          })
          .catch(error => {
              alert('Error fetching UUID: ' + error);  // Alerte en cas d'erreur
              console.error('Error fetching UUID:', error);
          });
  }
  alert(fetchUUID())// Fetch the UUID when the page loads

  if (submitButton) {
      // Gestion de la connexion
      submitButton.addEventListener('click', function(e) {
          e.preventDefault();
          const email = emailInput.value.trim();
          const password = passwordInput.value.trim();

          if (email === '' || password === '') {
              errorMessage.textContent = 'Veuillez remplir tous les champs.';
              errorMessage.style.display = 'block';
              return;
          }

          errorMessage.style.display = 'none';

          alert('Attempting login...');  // Alerte avant d'envoyer la requête de connexion

          fetch('/login', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ email, password, uuid })  // Envoi des données
          })
          .then(response => response.json())
          .then(data => {
              alert('Login successful!');  // Alerte après une connexion réussie
              console.log('Login response:', data);
          })
          .catch(error => {
              alert('Error during login: ' + error);  // Alerte en cas d'erreur lors de la connexion
              console.error('Error:', error);
              errorMessage.textContent = 'Erreur de connexion.';
              errorMessage.style.display = 'block';
          });
      });
  }

  if (createAccountButton) {
      // Gestion de la création de compte
      createAccountButton.addEventListener('click', function(e) {
          e.preventDefault();
          const email = emailInput.value.trim();
          const password = passwordInput.value.trim();

          if (email === '' || password === '') {
              errorMessage.textContent = 'Veuillez remplir tous les champs pour créer un compte.';
              errorMessage.style.display = 'block';
              return;
          }

          errorMessage.style.display = 'none';

          alert('Attempting to create account...');  // Alerte avant d'envoyer la requête de création de compte

          fetch('/create-account', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ email, password, uuid })  // Envoi des données
          })
          .then(response => response.json())
          .then(data => {
              alert('Account created successfully!');  // Alerte après la création réussie du compte
              console.log('Account creation response:', data);
          })
          .catch(error => {
              alert('Error during account creation: ' + error);  // Alerte en cas d'erreur lors de la création de compte
              console.error('Error:', error);
              errorMessage.textContent = 'Erreur lors de la création du compte.';
              errorMessage.style.display = 'block';
          });
      });
  }
});
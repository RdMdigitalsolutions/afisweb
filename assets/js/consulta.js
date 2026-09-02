(function () {
  'use strict';
  const login = document.getElementById('login-form');
  const loginView = document.getElementById('login-view');
  const dashboard = document.getElementById('dashboard-view');
  const loginError = document.getElementById('login-error');
  const consult = document.getElementById('consult-form');

  login.addEventListener('submit', (event) => {
    event.preventDefault();
    const user = document.getElementById('login-user');
    const code = document.getElementById('login-code');
    if (!user.value.trim() || !code.value.trim()) {
      loginError.textContent = 'Completa los dos campos con datos ficticios para continuar.';
      (!user.value.trim() ? user : code).focus();
      return;
    }
    loginError.textContent = '';
    loginView.hidden = true;
    dashboard.hidden = false;
    dashboard.querySelector('h1').focus();
  });
  document.getElementById('logout').addEventListener('click', () => {
    login.reset(); consult.reset(); dashboard.hidden = true; loginView.hidden = false;
    document.getElementById('login-user').focus();
  });
  document.getElementById('consult-file').addEventListener('change', (event) => {
    const file = event.target.files[0];
    document.getElementById('consult-file-info').textContent = file ? `Archivo ficticio seleccionado: ${file.name} (${Math.ceil(file.size / 1024)} KB). No se leerá.` : 'No se leerá ni enviará el contenido.';
  });
  consult.addEventListener('submit', (event) => {
    event.preventDefault();
    const error = document.getElementById('consult-error');
    const required = [...consult.querySelectorAll('[required]')];
    const invalid = required.find((field) => !field.value.trim());
    if (invalid) { error.textContent = 'Completa los campos obligatorios con información ficticia.'; invalid.focus(); return; }
    error.textContent = 'Consulta de demostración completada. No se ha enviado ni almacenado ningún dato.';
    consult.reset(); document.getElementById('consult-file-info').textContent = 'No se leerá ni enviará el contenido.';
  });
}());

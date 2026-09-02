(function () {
  'use strict';
  const form = document.getElementById('quote-form');
  const steps = [...document.querySelectorAll('.form-step')];
  const next = document.getElementById('next');
  const back = document.getElementById('back');
  const finish = document.getElementById('finish');
  const live = document.getElementById('form-live');
  const home = document.getElementById('home-fields');
  const vehicle = document.getElementById('vehicle-fields');
  const modal = document.getElementById('modal');
  let current = 1;
  let previousType = '';
  let opener = null;

  const normalize = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const insurerList = [...new Set(window.AfisInsurers)].sort((a, b) => normalize(a).localeCompare(normalize(b), 'es'));
  const priority = ['MAPFRE', 'Allianz', 'AXA', 'Mutua Madrileña', 'Línea Directa', 'Generali', 'Occident', 'Reale', 'Zurich', 'Caser', 'Pelayo', 'Verti', 'FIATC', 'MGS', 'Helvetia', 'Mussap', 'SegurCaixa Adeslas', 'Admiral', 'Qualitas Auto', 'Fénix Directo'];
  const ordered = [...priority, ...insurerList.filter((name) => !priority.includes(name))];
  const datalist = document.getElementById('insurer-options');
  ordered.forEach((name) => { const option = document.createElement('option'); option.value = name; datalist.append(option); });

  function setDisabled(container, disabled) {
    container.querySelectorAll('input, select, textarea').forEach((field) => { field.disabled = disabled; });
  }
  function selectedType() { return form.querySelector('input[name="insurance-type"]:checked')?.value || ''; }
  function showRiskFields() {
    const type = selectedType();
    home.hidden = type !== 'hogar'; vehicle.hidden = type === 'hogar';
    setDisabled(home, type !== 'hogar'); setDisabled(vehicle, type === 'hogar');
    document.getElementById('vehicle-name').textContent = type === 'moto' ? 'moto' : 'coche';
    const isManual = form.querySelector('input[name="id-method"]:checked')?.value === 'manual';
    document.getElementById('dni-manual').hidden = !isManual;
    document.getElementById('dni-file').hidden = isManual;
    document.getElementById('home-dni').disabled = !isManual || type !== 'hogar';
    document.getElementById('home-dni-file').disabled = isManual || type !== 'hogar';
  }
  function updateStep() {
    steps.forEach((step, index) => { const isActive = index + 1 === current; step.hidden = !isActive; step.classList.toggle('active', isActive); });
    document.querySelectorAll('.stepper li').forEach((item, index) => item.classList.toggle('active', index + 1 <= current));
    document.getElementById('progress-fill').style.width = `${((current - 1) / 3) * 100}%`;
    document.getElementById('step-count').textContent = `Paso ${current} de 4 · quedan ${4 - current} ${4 - current === 1 ? 'paso' : 'pasos'}`;
    back.hidden = current === 1; next.hidden = current === 4; finish.hidden = current !== 4;
    const heading = steps[current - 1].querySelector('legend, h2'); if (heading) heading.focus?.();
  }
  function message(text) { live.textContent = text; }
  function fail(field, text) { message(text); field.focus(); return false; }
  function validateDni(value) {
    const compact = value.replace(/[\s-]/g, '').toUpperCase();
    const match = compact.match(/^([XYZ]?)(\d{7,8})([A-Z])$/);
    if (!match) return false;
    const number = (match[1] === 'X' ? '0' : match[1] === 'Y' ? '1' : match[1] === 'Z' ? '2' : '') + match[2];
    return 'TRWAGMYFPDXBNJZSQVHLCKE'.charAt(Number(number) % 23) === match[3];
  }
  function validateStep() {
    const type = selectedType();
    if (current === 1 && !type) return fail(form.querySelector('input[name="insurance-type"]'), 'Selecciona Hogar, Coche o Moto para continuar.');
    if (current === 2 && type === 'hogar') {
      const fields = [['home-value', 'Indica el capital de contenido a asegurar.'], ['home-address', 'Indica una dirección ficticia.'], ['home-postcode', 'Indica un código postal ficticio de cinco cifras.'], ['home-town', 'Indica un municipio ficticio.'], ['home-province', 'Indica una provincia ficticia.']];
      for (const [id, text] of fields) { const field = document.getElementById(id); if (!field.value.trim() || (id === 'home-postcode' && !/^\d{5}$/.test(field.value))) return fail(field, text); }
      const method = form.querySelector('input[name="id-method"]:checked').value;
      if (method === 'manual') { const dni = document.getElementById('home-dni'); dni.value = dni.value.replace(/[\s-]/g, '').toUpperCase(); if (!validateDni(dni.value)) return fail(dni, 'Introduce un DNI o NIE ficticio con formato válido.'); }
      else if (!document.getElementById('home-dni-file').files.length) return fail(document.getElementById('home-dni-file'), 'Selecciona un documento ficticio para la demostración.');
    }
    if (current === 2 && (type === 'coche' || type === 'moto')) {
      const noPolicy = document.getElementById('no-previous-policy').checked;
      if (!noPolicy) { for (const id of ['previous-policy', 'insurer']) { const field = document.getElementById(id); if (!field.value.trim()) return fail(field, 'Completa la información de la póliza anterior o marca que no dispones de ella.'); } }
    }
    if (current === 3) {
      const name = document.getElementById('first-name'), surname = document.getElementById('last-name'), phone = document.getElementById('phone'), email = document.getElementById('email');
      if (!name.value.trim()) return fail(name, 'Indica un nombre ficticio.'); if (!surname.value.trim()) return fail(surname, 'Indica unos apellidos ficticios.');
      if (!/^(?:\+34\s?)?[6789]\d{8}$/.test(phone.value.replace(/[\s.-]/g, ''))) return fail(phone, 'Introduce un teléfono español ficticio válido.');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) return fail(email, 'Introduce un correo electrónico ficticio válido.');
    }
    if (current === 4 && !document.getElementById('privacy-consent').checked) return fail(document.getElementById('privacy-consent'), 'Debes confirmar que has leído la información básica para finalizar la demostración.');
    message(''); return true;
  }
  function fileSummary(field) {
    const file = field.files[0]; return file ? `<li><strong>${field.closest('.form-field').querySelector('label').textContent}:</strong> Documento seleccionado · ${file.name} (${Math.ceil(file.size / 1024)} KB)</li>` : '';
  }
  function createSummary() {
    const type = selectedType(); const lines = [`<li><strong>Modalidad:</strong> ${type === 'hogar' ? 'Hogar' : type === 'coche' ? 'Coche' : 'Moto'}</li>`];
    if (type === 'hogar') { const dni = document.getElementById('home-dni').value; lines.push(`<li><strong>Capital de contenido:</strong> ${document.getElementById('home-value').value || '—'} €</li>`, `<li><strong>Vivienda:</strong> ${document.getElementById('home-town').value}, ${document.getElementById('home-province').value}</li>`); lines.push(dni ? `<li><strong>DNI/NIE:</strong> ${dni.slice(0, 2)}*****${dni.slice(-2)}</li>` : fileSummary(document.getElementById('home-dni-file'))); }
    else { lines.push(`<li><strong>Póliza anterior:</strong> ${document.getElementById('no-previous-policy').checked ? 'No dispone de póliza anterior' : document.getElementById('previous-policy').value}</li>`, `<li><strong>Aseguradora:</strong> ${document.getElementById('no-previous-policy').checked ? '—' : document.getElementById('insurer').value}</li>`); ['technical-file', 'permit-file', 'dni-front', 'dni-back', 'license-front', 'license-back'].forEach((id) => { const row = fileSummary(document.getElementById(id)); if (row) lines.push(row); }); }
    lines.push(`<li><strong>Contacto:</strong> ${document.getElementById('first-name').value} ${document.getElementById('last-name').value} · ${document.getElementById('phone').value} · ${document.getElementById('email').value}</li>`);
    document.getElementById('summary').innerHTML = `<ul>${lines.join('')}</ul>`;
  }
  function resetContainer(container) { container.querySelectorAll('input:not([type="radio"]), textarea, select').forEach((field) => { if (field.type === 'checkbox') field.checked = false; else field.value = ''; }); }
  function resetDemo() { form.reset(); current = 1; previousType = ''; home.hidden = true; vehicle.hidden = true; setDisabled(home, true); setDisabled(vehicle, true); document.querySelectorAll('.file-field small').forEach((small) => { small.textContent = small.closest('#dni-file') ? 'JPG, JPEG, PNG o PDF · máximo 10 MB · nunca se leerá el contenido.' : ''; }); message('Demostración reiniciada.'); updateStep(); }
  form.querySelectorAll('input[name="insurance-type"]').forEach((input) => input.addEventListener('change', () => { if (previousType && previousType !== input.value) resetContainer(previousType === 'hogar' ? home : vehicle); previousType = input.value; showRiskFields(); }));
  form.querySelectorAll('input[name="id-method"]').forEach((input) => input.addEventListener('change', showRiskFields));
  document.getElementById('home-range').addEventListener('input', (event) => { document.getElementById('home-value').value = event.target.value; });
  document.getElementById('home-value').addEventListener('input', (event) => { document.getElementById('home-range').value = Math.min(200000, Math.max(0, event.target.value || 0)); });
  document.getElementById('no-previous-policy').addEventListener('change', (event) => { ['previous-policy', 'insurer'].forEach((id) => { const field = document.getElementById(id); field.disabled = event.target.checked; if (event.target.checked) field.value = ''; }); });
  form.querySelectorAll('input[type="file"]').forEach((input) => input.addEventListener('change', (event) => { const file = event.target.files[0]; const small = event.target.closest('.form-field').querySelector('small'); if (!file) return; if (file.size > 10 * 1024 * 1024) { event.target.value = ''; if (small) small.textContent = 'El archivo supera los 10 MB. Selecciona un archivo ficticio más pequeño.'; return; } if (small) small.textContent = `Documento seleccionado: ${file.name} (${Math.ceil(file.size / 1024)} KB). No se leerá su contenido.`; }));
  next.addEventListener('click', () => { if (!validateStep()) return; if (current === 3) createSummary(); current += 1; updateStep(); });
  back.addEventListener('click', () => { current -= 1; updateStep(); });
  form.addEventListener('submit', (event) => { event.preventDefault(); if (!validateStep()) return; opener = document.activeElement; modal.hidden = false; document.body.classList.add('modal-open'); document.getElementById('modal-title').focus(); });
  function closeModal() { modal.hidden = true; document.body.classList.remove('modal-open'); resetDemo(); if (opener) opener.focus(); }
  document.getElementById('close-modal').addEventListener('click', closeModal); document.getElementById('modal-accept').addEventListener('click', closeModal); document.getElementById('reset-demo').addEventListener('click', resetDemo);
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !modal.hidden) closeModal(); });
  setDisabled(home, true); setDisabled(vehicle, true); updateStep();
}());

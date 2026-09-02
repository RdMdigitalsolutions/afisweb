(function () {
  'use strict';
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.primary-nav');
  if (menuButton && menu) {
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!open));
      menu.classList.toggle('is-open', !open);
    });
  }

  document.querySelectorAll('[data-demo-message]').forEach((button) => {
    button.addEventListener('click', () => {
      const target = document.querySelector(button.dataset.demoMessage);
      if (target) { target.hidden = false; target.focus(); }
    });
  });
}());

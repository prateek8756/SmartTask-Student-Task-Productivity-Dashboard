/* ==========================================================================
   app.js — shared shell: sidebar/mobile nav, theme toggle, toast, confirm modal
   ========================================================================== */
(function () {
  function initTheme() {
    const profile = window.SmartTaskData.getProfile();
    document.documentElement.setAttribute('data-theme', profile.theme || 'dark');
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', current);
        const p = window.SmartTaskData.getProfile();
        p.theme = current;
        window.SmartTaskData.saveProfile(p);
      });
    }
  }

  function initMobileNav() {
    const menuBtn = document.getElementById('menuBtn');
    const sidebar = document.getElementById('sidebar');
    const scrim = document.getElementById('scrim');
    if (!menuBtn || !sidebar || !scrim) return;
    const open = () => { sidebar.classList.add('open'); scrim.classList.add('open'); };
    const close = () => { sidebar.classList.remove('open'); scrim.classList.remove('open'); };
    menuBtn.addEventListener('click', open);
    scrim.addEventListener('click', close);
  }

  function highlightActiveNav() {
    const page = document.body.getAttribute('data-page');
    document.querySelectorAll('[data-nav]').forEach((link) => {
      if (link.getAttribute('data-nav') === page) link.classList.add('active');
      else link.classList.remove('active');
    });
  }

  function showToast(message, type) {
    let wrap = document.querySelector('.toast-wrap');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.className = 'toast-wrap';
      document.body.appendChild(wrap);
    }
    const toast = document.createElement('div');
    toast.className = 'toast' + (type === 'error' ? ' error' : '');
    toast.textContent = message;
    wrap.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity .2s ease';
      setTimeout(() => toast.remove(), 200);
    }, 2600);
  }

  function openConfirmModal({ title, message, confirmLabel, onConfirm }) {
    const scrim = document.getElementById('confirmScrim');
    if (!scrim) return;
    scrim.querySelector('[data-modal-title]').textContent = title || 'Are you sure?';
    scrim.querySelector('[data-modal-message]').textContent = message || '';
    const confirmBtn = scrim.querySelector('[data-modal-confirm]');
    confirmBtn.textContent = confirmLabel || 'Confirm';
    scrim.classList.add('open');

    const cleanup = () => {
      scrim.classList.remove('open');
      confirmBtn.removeEventListener('click', onConfirmHandler);
    };
    function onConfirmHandler() {
      cleanup();
      if (onConfirm) onConfirm();
    }
    confirmBtn.addEventListener('click', onConfirmHandler);
    scrim.querySelectorAll('[data-modal-cancel]').forEach((btn) => {
      btn.onclick = cleanup;
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileNav();
    highlightActiveNav();
  });

  window.SmartTaskApp = { showToast, openConfirmModal };
})();

/**
 * SmartKisan Web Platform - Main Application Controller
 */

// Toast notification helper
window.showToast = (message, type = 'info', duration = 3500) => {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  let icon = 'ℹ️';
  if (type === 'success') icon = '✅';
  if (type === 'error') icon = '⚠️';
  if (type === 'warning') icon = '🔔';

  toast.innerHTML = `
    <div style="display:flex; align-items:center; gap:10px;">
      <span style="font-size:16px;">${icon}</span>
      <span>${message}</span>
    </div>
    <button type="button" style="background:transparent; color:#9CA3AF; font-size:16px; border:none; cursor:pointer;" onclick="this.parentElement.remove()">✕</button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, duration);
};

// Application Controller
const App = (() => {
  const updateNavbar = () => {
    const isAuthed = Auth.isAuthenticated();
    const user = Auth.getUser();

    const navLinks = document.getElementById('nav-links');
    const navUser = document.getElementById('nav-user');
    const lang = I18N.getLang();

    if (isAuthed && user) {
      if (navLinks) {
        navLinks.style.display = 'flex';
        navLinks.innerHTML = `
          <li>
            <a href="#/dashboard" class="nav-link">
              <span>📊</span>
              <span>${I18N.t('dashboard')}</span>
            </a>
          </li>
          <li>
            <a href="#/pumps" class="nav-link">
              <span>🚰</span>
              <span>${I18N.t('pumps')}</span>
            </a>
          </li>
          <li>
            <a href="#/fields" class="nav-link">
              <span>🗺️</span>
              <span>${I18N.t('fields')}</span>
            </a>
          </li>
          <li>
            <a href="#/schedules" class="nav-link">
              <span>⏱️</span>
              <span>${I18N.t('schedules')}</span>
            </a>
          </li>
          <li>
            <a href="#/sensors" class="nav-link">
              <span>📡</span>
              <span>${I18N.t('sensors')}</span>
            </a>
          </li>
          <li>
            <a href="#/ai-advisory" class="nav-link">
              <span>🤖</span>
              <span>${I18N.t('aiAdvisory')}</span>
            </a>
          </li>
          <li>
            <a href="#/reports" class="nav-link">
              <span>📑</span>
              <span>${I18N.t('reports')}</span>
            </a>
          </li>
        `;
      }

      if (navUser) {
        navUser.innerHTML = `
          <!-- Language Selector Pill -->
          <div class="lang-switcher">
            <button type="button" class="btn-lang ${lang === 'en' ? 'active' : ''}" data-lang="en">EN</button>
            <button type="button" class="btn-lang ${lang === 'hi' ? 'active' : ''}" data-lang="hi">हिन्दी</button>
          </div>

          <div class="user-pill">
            <div class="user-avatar">${(user.name || 'F')[0].toUpperCase()}</div>
            <div>
              <div class="user-name">${user.name || 'Farmer'}</div>
              <span class="user-role-badge">${user.role || 'Farmer'}</span>
            </div>
          </div>

          <button type="button" class="btn-logout" id="btn-navbar-logout">
            <span>🚪</span>
            <span>${I18N.t('logout')}</span>
          </button>
        `;

        // Bind Language Selector
        navUser.querySelectorAll('.btn-lang').forEach(btn => {
          btn.addEventListener('click', () => {
            const selectedLang = btn.getAttribute('data-lang');
            I18N.setLang(selectedLang);
          });
        });

        // Bind Logout
        const logoutBtn = document.getElementById('btn-navbar-logout');
        if (logoutBtn) {
          logoutBtn.addEventListener('click', () => {
            Auth.logout();
          });
        }
      }
    } else {
      if (navLinks) {
        navLinks.style.display = 'none';
      }
      if (navUser) {
        navUser.innerHTML = `
          <!-- Language Selector Pill -->
          <div class="lang-switcher" style="margin-right: 10px;">
            <button type="button" class="btn-lang ${lang === 'en' ? 'active' : ''}" data-lang="en">EN</button>
            <button type="button" class="btn-lang ${lang === 'hi' ? 'active' : ''}" data-lang="hi">हिन्दी</button>
          </div>
          <a href="#/login" class="nav-link">${I18N.t('login')}</a>
          <a href="#/register" class="btn-primary" style="padding: 6px 14px; font-size: 13px; width: auto;">${I18N.t('register')}</a>
        `;

        navUser.querySelectorAll('.btn-lang').forEach(btn => {
          btn.addEventListener('click', () => {
            const selectedLang = btn.getAttribute('data-lang');
            I18N.setLang(selectedLang);
          });
        });
      }
    }
  };

  const init = () => {
    updateNavbar();
    window.addEventListener('auth-state-changed', updateNavbar);
    window.addEventListener('language-changed', updateNavbar);
    Router.init();
  };

  return {
    init,
    updateNavbar
  };
})();

// Bootstrap when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

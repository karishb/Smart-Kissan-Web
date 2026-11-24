/**
 * SmartKisan Web Platform - Main Application Controller
 * Modernized Navigation Architecture with Nested Settings & Dropdown Suites
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
  // Helper to close all active dropdowns
  const closeAllDropdowns = () => {
    document.querySelectorAll('.nav-dropdown-item.open').forEach(el => el.classList.remove('open'));
    const userPanel = document.getElementById('user-dropdown-panel');
    if (userPanel) userPanel.classList.remove('open');
    const userTrigger = document.getElementById('btn-user-pill-trigger');
    if (userTrigger) userTrigger.classList.remove('open');
  };

  // Farm Settings Modal Logic
  const openFarmSettings = () => {
    closeAllDropdowns();
    const modal = document.getElementById('modal-farm-settings');
    if (!modal) return;

    // Load saved settings
    const savedName = localStorage.getItem('smartkisan_farm_name') || 'SmartKisan Agricultural Hub - Zone 1';
    const savedUnit = localStorage.getItem('smartkisan_unit') || 'acres';
    const savedCutoff = localStorage.getItem('smartkisan_pump_cutoff') || '45';
    const savedRate = localStorage.getItem('smartkisan_rms_rate') || '4.5';
    const savedAlerts = localStorage.getItem('smartkisan_audio_alerts') !== 'false';

    const nameInput = document.getElementById('setting-farm-name');
    if (nameInput) nameInput.value = savedName;

    const unitRadio = document.querySelector(`input[name="farm-unit"][value="${savedUnit}"]`);
    if (unitRadio) unitRadio.checked = true;

    const cutoffSelect = document.getElementById('setting-pump-cutoff');
    if (cutoffSelect) cutoffSelect.value = savedCutoff;

    const rateSelect = document.getElementById('setting-rms-rate');
    if (rateSelect) rateSelect.value = savedRate;

    const alertsCheckbox = document.getElementById('setting-audio-alerts');
    if (alertsCheckbox) alertsCheckbox.checked = savedAlerts;

    modal.style.display = 'flex';
  };

  const closeFarmSettings = () => {
    const modal = document.getElementById('modal-farm-settings');
    if (modal) modal.style.display = 'none';
  };

  const saveFarmSettings = (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('setting-farm-name');
    const unitRadio = document.querySelector('input[name="farm-unit"]:checked');
    const cutoffSelect = document.getElementById('setting-pump-cutoff');
    const rateSelect = document.getElementById('setting-rms-rate');
    const alertsCheckbox = document.getElementById('setting-audio-alerts');

    if (nameInput) localStorage.setItem('smartkisan_farm_name', nameInput.value.trim());
    if (unitRadio) localStorage.setItem('smartkisan_unit', unitRadio.value);
    if (cutoffSelect) localStorage.setItem('smartkisan_pump_cutoff', cutoffSelect.value);
    if (rateSelect) localStorage.setItem('smartkisan_rms_rate', rateSelect.value);
    if (alertsCheckbox) localStorage.setItem('smartkisan_audio_alerts', alertsCheckbox.checked ? 'true' : 'false');

    closeFarmSettings();
    showToast('Farm configuration & measurement units saved!', 'success');
  };

  // Theme Management
  const toggleTheme = () => {
    const isDark = document.body.classList.toggle('dark-theme');
    localStorage.setItem('smartkisan_app_theme', isDark ? 'dark' : 'light');
    
    // Also toggle industrial theme on RMS view if present
    const rmsContainer = document.querySelector('.rms-view-container');
    if (rmsContainer) {
      if (isDark) {
        rmsContainer.classList.add('rms-theme-dark');
        rmsContainer.classList.remove('rms-theme-brand');
      } else {
        rmsContainer.classList.remove('rms-theme-dark');
        rmsContainer.classList.add('rms-theme-brand');
      }
    }

    const statusText = document.getElementById('theme-toggle-status-text');
    if (statusText) {
      statusText.textContent = isDark ? 'Switch to Standard Light' : 'Switch to Industrial Dark';
    }

    showToast(isDark ? 'Industrial Dark Mode enabled' : 'Standard Light Mode enabled', 'info');
  };

  const updateNavbar = () => {
    const isAuthed = Auth.isAuthenticated();
    const user = Auth.getUser();

    const navLinks = document.getElementById('nav-links');
    const navUser = document.getElementById('nav-user');
    const lang = I18N.getLang();
    const isDark = localStorage.getItem('smartkisan_app_theme') === 'dark';

    if (isDark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }

    if (isAuthed && user) {
      if (navLinks) {
        navLinks.style.display = 'flex';
        navLinks.innerHTML = `
          <!-- 1. Primary Dashboard -->
          <li>
            <a href="#/dashboard" class="nav-link">
              <span class="nav-icon">📊</span>
              <span>${I18N.t('dashboard')}</span>
            </a>
          </li>

          <!-- 2. Farm GIS & Parcels -->
          <li>
            <a href="#/fields" class="nav-link">
              <span class="nav-icon">🗺️</span>
              <span>${I18N.t('fields')}</span>
            </a>
          </li>

          <!-- 3. Nested Irrigation & Automation Suite -->
          <li class="nav-dropdown-item" id="nav-dropdown-irrigation">
            <button type="button" class="nav-dropdown-trigger" aria-haspopup="true">
              <span class="nav-icon">🚰</span>
              <span>${I18N.t('irrigationSuite')}</span>
              <span class="nav-chevron">▾</span>
            </button>
            <div class="nav-dropdown-menu">
              <div class="dropdown-header-label">WATER & AUTOMATION</div>
              <a href="#/pumps" class="nav-dropdown-link">
                <span class="dropdown-link-icon">🚰</span>
                <div class="dropdown-link-text">
                  <span class="dropdown-link-title">${I18N.t('pumps')}</span>
                  <span class="dropdown-link-desc">${I18N.t('pumpsDesc')}</span>
                </div>
              </a>
              <a href="#/schedules" class="nav-dropdown-link">
                <span class="dropdown-link-icon">⏱️</span>
                <div class="dropdown-link-text">
                  <span class="dropdown-link-title">${I18N.t('schedules')}</span>
                  <span class="dropdown-link-desc">${I18N.t('schedulesDesc')}</span>
                </div>
              </a>
              <a href="#/sensors" class="nav-dropdown-link">
                <span class="dropdown-link-icon">📡</span>
                <div class="dropdown-link-text">
                  <span class="dropdown-link-title">${I18N.t('sensors')}</span>
                  <span class="dropdown-link-desc">${I18N.t('sensorsDesc')}</span>
                </div>
              </a>
            </div>
          </li>

          <!-- 4. Dedicated RMS Hardware Telemetry Direct Tab (Pulsing Live Badge) -->
          <li>
            <a href="#/rms-logs" class="nav-link nav-link-rms">
              <span class="nav-icon">📶</span>
              <span>${I18N.t('rmsLogs')}</span>
              <span class="nav-live-indicator">LIVE</span>
            </a>
          </li>

          <!-- 5. Nested Agronomy & Precision Advisory Suite -->
          <li class="nav-dropdown-item" id="nav-dropdown-agronomy">
            <button type="button" class="nav-dropdown-trigger" aria-haspopup="true">
              <span class="nav-icon">🌱</span>
              <span>${I18N.t('agronomySuite')}</span>
              <span class="nav-chevron">▾</span>
            </button>
            <div class="nav-dropdown-menu">
              <div class="dropdown-header-label">PRECISION AGRONOMY</div>
              <a href="#/ai-advisory" class="nav-dropdown-link">
                <span class="dropdown-link-icon">🤖</span>
                <div class="dropdown-link-text">
                  <span class="dropdown-link-title">${I18N.t('aiAdvisory')}</span>
                  <span class="dropdown-link-desc">${I18N.t('advisoryDesc')}</span>
                </div>
              </a>
              <a href="#/fertilizer" class="nav-dropdown-link">
                <span class="dropdown-link-icon">🧪</span>
                <div class="dropdown-link-text">
                  <span class="dropdown-link-title">${I18N.t('fertilizer')}</span>
                  <span class="dropdown-link-desc">${I18N.t('fertilizerDesc')}</span>
                </div>
              </a>
              <a href="#/schemes" class="nav-dropdown-link">
                <span class="dropdown-link-icon">🏛️</span>
                <div class="dropdown-link-text">
                  <span class="dropdown-link-title">${I18N.t('schemes')}</span>
                  <span class="dropdown-link-desc">${I18N.t('schemesDesc')}</span>
                </div>
              </a>
            </div>
          </li>

          <!-- 6. Reports & DSR Records -->
          <li>
            <a href="#/reports" class="nav-link">
              <span class="nav-icon">📑</span>
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

          <!-- Unified User & Nested Settings Dropdown Menu -->
          <div class="user-menu-dropdown" id="user-menu-dropdown-wrap">
            <button type="button" class="btn-user-pill" id="btn-user-pill-trigger">
              <div class="user-avatar">${(user.name || 'F')[0].toUpperCase()}</div>
              <div class="user-pill-info">
                <span class="user-pill-name">${user.name || 'Farmer'}</span>
                <span class="user-role-badge">${user.role || 'Farmer'}</span>
              </div>
              <span class="nav-chevron">▾</span>
            </button>

            <div class="user-dropdown-panel" id="user-dropdown-panel">
              <div class="user-panel-header">
                <div class="user-avatar-lg">${(user.name || 'F')[0].toUpperCase()}</div>
                <div class="user-panel-meta">
                  <div class="user-panel-name">${user.name || 'Farmer Ramesh'}</div>
                  <div class="user-panel-email">${user.email || 'farmer.ramesh@smartkisan.in'}</div>
                  <div class="user-panel-status">
                    <span class="status-pulse-dot"></span>
                    <span>SmartKisan Verified Hub</span>
                  </div>
                </div>
              </div>

              <div class="user-panel-divider"></div>

              <div class="user-panel-section">
                <div class="panel-section-title">FARM & SYSTEM PREFERENCES</div>
                
                <button type="button" class="user-panel-action" id="btn-open-farm-settings">
                  <div class="action-icon-wrap" style="background: #E8F5E9; color: #2E7D32;">⚙️</div>
                  <div class="action-meta">
                    <span class="action-title">${I18N.t('settingsTitle')}</span>
                    <span class="action-desc">${I18N.t('farmSettingsDesc')}</span>
                  </div>
                </button>

                <button type="button" class="user-panel-action" id="btn-toggle-app-theme">
                  <div class="action-icon-wrap" style="background: #F1F5F9; color: #334155;">🌓</div>
                  <div class="action-meta">
                    <span class="action-title">${I18N.t('themeMode')}</span>
                    <span class="action-desc" id="theme-toggle-status-text">${isDark ? 'Switch to Standard Light' : 'Switch to Industrial Dark'}</span>
                  </div>
                </button>

                <a href="#/rms-logs" class="user-panel-action" id="link-user-rms-stream">
                  <div class="action-icon-wrap" style="background: #E0F2FE; color: #0284C7;">📶</div>
                  <div class="action-meta">
                    <span class="action-title">${I18N.t('liveStream')}</span>
                    <span class="action-desc">4.5s stream • 27 active pumps</span>
                  </div>
                </a>
              </div>

              <div class="user-panel-divider"></div>

              <div class="user-panel-footer">
                <button type="button" class="btn-panel-logout" id="btn-navbar-logout">
                  <span>🚪</span>
                  <span>${I18N.t('logout')}</span>
                </button>
              </div>
            </div>
          </div>
        `;

        // Bind Language Selector
        navUser.querySelectorAll('.btn-lang').forEach(btn => {
          btn.addEventListener('click', () => {
            const selectedLang = btn.getAttribute('data-lang');
            I18N.setLang(selectedLang);
          });
        });

        // Bind User Menu Trigger
        const userTrigger = document.getElementById('btn-user-pill-trigger');
        const userPanel = document.getElementById('user-dropdown-panel');
        if (userTrigger && userPanel) {
          userTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = userPanel.classList.toggle('open');
            userTrigger.classList.toggle('open', isOpen);
            // Close other nav dropdowns
            document.querySelectorAll('.nav-dropdown-item.open').forEach(el => el.classList.remove('open'));
          });
        }

        // Bind Farm Settings Opener
        const openSettingsBtn = document.getElementById('btn-open-farm-settings');
        if (openSettingsBtn) {
          openSettingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openFarmSettings();
          });
        }

        // Bind Theme Toggle
        const themeBtn = document.getElementById('btn-toggle-app-theme');
        if (themeBtn) {
          themeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleTheme();
          });
        }

        // Bind Logout
        const logoutBtn = document.getElementById('btn-navbar-logout');
        if (logoutBtn) {
          logoutBtn.addEventListener('click', () => {
            Auth.logout();
          });
        }

        const rmsLink = document.getElementById('link-user-rms-stream');
        if (rmsLink) {
          rmsLink.addEventListener('click', () => {
            closeAllDropdowns();
          });
        }
      }

      // Bind Nav Dropdown Triggers (Irrigation & Agronomy)
      if (navLinks) {
        navLinks.querySelectorAll('.nav-dropdown-trigger').forEach(trigger => {
          trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const parentItem = trigger.closest('.nav-dropdown-item');
            if (!parentItem) return;

            const wasOpen = parentItem.classList.contains('open');
            closeAllDropdowns();
            if (!wasOpen) {
              parentItem.classList.add('open');
            }
          });
        });

        // Close dropdown when clicking a child link
        navLinks.querySelectorAll('.nav-dropdown-link, .nav-link').forEach(link => {
          link.addEventListener('click', () => {
            closeAllDropdowns();
            // Also close mobile menu if open
            if (navLinks) navLinks.classList.remove('mobile-open');
          });
        });
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

  const bindGlobalEvents = () => {
    // Close dropdowns on click outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-dropdown-item') && !e.target.closest('#user-menu-dropdown-wrap')) {
        closeAllDropdowns();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAllDropdowns();
        closeFarmSettings();
      }
    });

    // Mobile Hamburger Toggle
    const mobileToggle = document.getElementById('btn-nav-mobile-toggle');
    const navLinks = document.getElementById('nav-links');
    if (mobileToggle && navLinks) {
      mobileToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.toggle('mobile-open');
      });
    }

    // Modal Events
    const closeModalBtn = document.getElementById('btn-close-farm-settings');
    const cancelModalBtn = document.getElementById('btn-cancel-farm-settings');
    const settingsForm = document.getElementById('farm-settings-form');

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeFarmSettings);
    if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeFarmSettings);
    if (settingsForm) settingsForm.addEventListener('submit', saveFarmSettings);

    const modalOverlay = document.getElementById('modal-farm-settings');
    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeFarmSettings();
      });
    }
  };

  const init = () => {
    updateNavbar();
    bindGlobalEvents();
    window.addEventListener('auth-state-changed', updateNavbar);
    window.addEventListener('language-changed', updateNavbar);
    Router.init();
  };

  const refreshView = () => {
    if (window.Router) {
      window.Router.navigate();
    }
  };

  return {
    init,
    updateNavbar,
    refreshView,
    closeAllDropdowns,
    openFarmSettings,
    closeFarmSettings,
    toggleTheme
  };
})();

// Bootstrap when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

/**
 * SmartKisan Web Platform - Main Application Controller
 * HubSpot-Inspired Two-Tier Header Architecture
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
  // Helper to close all active dropdown menus
  const closeAllDropdowns = () => {
    document.querySelectorAll('.nav-dropdown-item.open').forEach(el => el.classList.remove('open'));
    document.querySelectorAll('.utility-dropdown-menu.open').forEach(el => el.classList.remove('open'));
    document.querySelectorAll('.utility-link.open').forEach(el => el.classList.remove('open'));
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
    showToast('Farm preferences & units saved!', 'success');
  };

  // High Contrast / Theme Management
  const setTheme = (isDark) => {
    if (isDark) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('smartkisan_app_theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('smartkisan_app_theme', 'light');
    }

    const themeCheck = document.getElementById('check-util-theme');
    if (themeCheck) themeCheck.checked = isDark;

    // Synchronize RMS theme if present
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
  };

  const toggleTheme = () => {
    const isCurrentlyDark = document.body.classList.contains('dark-theme');
    setTheme(!isCurrentlyDark);
    showToast(!isCurrentlyDark ? 'High Contrast mode enabled' : 'Standard theme restored', 'info');
  };

  const updateNavbar = () => {
    const isAuthed = Auth.isAuthenticated();
    const user = Auth.getUser();

    const navLinks = document.getElementById('nav-links');
    const actionButtons = document.getElementById('header-action-buttons');
    const lang = I18N.getLang();
    const isDark = localStorage.getItem('smartkisan_app_theme') === 'dark';

    setTheme(isDark);

    // Update Utility Bar State
    const currentLangText = document.getElementById('util-current-lang-text');
    if (currentLangText) {
      currentLangText.textContent = lang === 'hi' ? 'हिन्दी' : 'English';
    }

    const userDropdown = document.getElementById('util-user-dropdown');
    const syncBtn = document.getElementById('btn-util-sync-telemetry');
    const farmSettingsBtn = document.getElementById('btn-util-farm-settings');
    const userAvatar = document.getElementById('util-user-avatar');
    const userName = document.getElementById('util-user-name');
    const dropdownUserName = document.getElementById('util-dropdown-user-name');
    const dropdownUserEmail = document.getElementById('util-dropdown-user-email');

    if (isAuthed && user) {
      if (userDropdown) userDropdown.style.display = 'block';
      if (syncBtn) syncBtn.style.display = 'inline-flex';
      if (farmSettingsBtn) farmSettingsBtn.style.display = 'inline-flex';

      const initial = (user.name || 'F')[0].toUpperCase();
      if (userAvatar) userAvatar.textContent = initial;
      if (userName) userName.textContent = user.name || 'Farmer';
      if (dropdownUserName) dropdownUserName.textContent = user.name || 'Farmer';
      if (dropdownUserEmail) dropdownUserEmail.textContent = user.email || '';
    } else {
      if (userDropdown) userDropdown.style.display = 'none';
      if (syncBtn) syncBtn.style.display = 'none';
      if (farmSettingsBtn) farmSettingsBtn.style.display = 'none';
    }

    if (isAuthed && user) {
      if (actionButtons) {
        actionButtons.style.display = 'flex';
        actionButtons.innerHTML = `
          <a href="#/schedules" class="btn-nav-secondary">
            <span>+ New Schedule</span>
          </a>
          <a href="#/rms-logs" class="btn-nav-primary">
            <span class="pulse-ring"></span>
            <span>Live Telemetry</span>
          </a>
        `;
      }
      if (navLinks) {
        navLinks.innerHTML = `
          <!-- 1. Dashboard -->
          <li class="main-nav-item">
            <a href="#/dashboard" class="main-nav-link">
              <span>${I18N.t('dashboard')}</span>
            </a>
          </li>

          <!-- 2. Farm GIS & Crops -->
          <li class="main-nav-item">
            <a href="#/fields" class="main-nav-link">
              <span>${I18N.t('fields')}</span>
            </a>
          </li>

          <!-- 3. Irrigation & IoT (HubSpot-Style Mega-Menu Dropdown) -->
          <li class="main-nav-item nav-dropdown-item" id="nav-dropdown-irrigation">
            <button type="button" class="main-nav-link nav-dropdown-trigger" aria-haspopup="true">
              <span>${I18N.t('irrigationSuite')}</span>
              <span class="nav-chevron">▾</span>
            </button>
            <div class="nav-dropdown-menu">
              <div class="dropdown-header-label">AUTOMATION & WATER MANAGEMENT</div>
              <a href="#/pumps" class="nav-dropdown-link">
                <div class="dropdown-link-icon-box">🚰</div>
                <div class="dropdown-link-text">
                  <span class="dropdown-link-title">${I18N.t('pumps')}</span>
                  <span class="dropdown-link-desc">${I18N.t('pumpsDesc')}</span>
                </div>
              </a>
              <a href="#/schedules" class="nav-dropdown-link">
                <div class="dropdown-link-icon-box">⏱️</div>
                <div class="dropdown-link-text">
                  <span class="dropdown-link-title">${I18N.t('schedules')}</span>
                  <span class="dropdown-link-desc">${I18N.t('schedulesDesc')}</span>
                </div>
              </a>
              <a href="#/sensors" class="nav-dropdown-link">
                <div class="dropdown-link-icon-box">📡</div>
                <div class="dropdown-link-text">
                  <span class="dropdown-link-title">${I18N.t('sensors')}</span>
                  <span class="dropdown-link-desc">${I18N.t('sensorsDesc')}</span>
                </div>
              </a>
            </div>
          </li>

          <!-- 4. RMS Hardware Logs (Direct Prominent Link with LIVE Badge) -->
          <li class="main-nav-item">
            <a href="#/rms-logs" class="main-nav-link nav-link-rms">
              <span>${I18N.t('rmsLogs')}</span>
              <span class="nav-live-badge">LIVE</span>
            </a>
          </li>

          <!-- 5. Agronomy & Precision Advisory (Mega-Menu Dropdown) -->
          <li class="main-nav-item nav-dropdown-item" id="nav-dropdown-agronomy">
            <button type="button" class="main-nav-link nav-dropdown-trigger" aria-haspopup="true">
              <span>${I18N.t('agronomySuite')}</span>
              <span class="nav-chevron">▾</span>
            </button>
            <div class="nav-dropdown-menu">
              <div class="dropdown-header-label">PRECISION AGRICULTURE</div>
              <a href="#/ai-advisory" class="nav-dropdown-link">
                <div class="dropdown-link-icon-box">🤖</div>
                <div class="dropdown-link-text">
                  <span class="dropdown-link-title">${I18N.t('aiAdvisory')}</span>
                  <span class="dropdown-link-desc">${I18N.t('advisoryDesc')}</span>
                </div>
              </a>
              <a href="#/fertilizer" class="nav-dropdown-link">
                <div class="dropdown-link-icon-box">🧪</div>
                <div class="dropdown-link-text">
                  <span class="dropdown-link-title">${I18N.t('fertilizer')}</span>
                  <span class="dropdown-link-desc">${I18N.t('fertilizerDesc')}</span>
                </div>
              </a>
              <a href="#/schemes" class="nav-dropdown-link">
                <div class="dropdown-link-icon-box">🏛️</div>
                <div class="dropdown-link-text">
                  <span class="dropdown-link-title">${I18N.t('schemes')}</span>
                  <span class="dropdown-link-desc">${I18N.t('schemesDesc')}</span>
                </div>
              </a>
            </div>
          </li>

          <!-- 6. DSR & Reports -->
          <li class="main-nav-item">
            <a href="#/reports" class="main-nav-link">
              <span>${I18N.t('reports')}</span>
            </a>
          </li>
        `;
      }

      // Bind Main Nav Dropdown Triggers
      if (navLinks) {
        navLinks.querySelectorAll('.nav-dropdown-trigger').forEach(trigger => {
          trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const parent = trigger.closest('.nav-dropdown-item');
            if (!parent) return;

            const wasOpen = parent.classList.contains('open');
            closeAllDropdowns();
            if (!wasOpen) {
              parent.classList.add('open');
            }
          });
        });

        // Close on link click
        navLinks.querySelectorAll('.nav-dropdown-link, .main-nav-link').forEach(link => {
          link.addEventListener('click', () => {
            closeAllDropdowns();
            const mobileNav = document.querySelector('.main-menu-nav');
            if (mobileNav) mobileNav.classList.remove('mobile-open');
          });
        });
      }
    } else {
      // Logged out / Public state: replace mini toggle with prominent CTA button + clean public links
      if (actionButtons) {
        actionButtons.style.display = 'flex';
        actionButtons.innerHTML = `
          <a href="#/login" class="btn-nav-secondary" id="btn-header-login">
            <span>Sign In</span>
          </a>
          <a href="#/register" class="btn-register-prominent" id="btn-header-register">
            <span>Register Farm</span>
            <span class="btn-arrow">→</span>
          </a>
        `;
      }
      if (navLinks) {
        navLinks.innerHTML = `
          <li class="main-nav-item">
            <a href="#/schemes" class="main-nav-link">
              <span>🏛️ ${I18N.t('schemes') || 'Govt Schemes'}</span>
            </a>
          </li>
          <li class="main-nav-item">
            <a href="#/fertilizer" class="main-nav-link">
              <span>🧪 ${I18N.t('fertilizer') || 'Fertilizer Calculator'}</span>
            </a>
          </li>
          <li class="main-nav-item">
            <a href="#/rms-logs" class="main-nav-link">
              <span>📶 RMS Telemetry Logs</span>
            </a>
          </li>
        `;
      }
    }
  };

  const bindGlobalEvents = () => {
    // Utility Language Dropdown Toggle
    const langBtn = document.getElementById('btn-util-lang-trigger');
    const langMenu = document.getElementById('util-lang-menu');
    if (langBtn && langMenu) {
      langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = langMenu.classList.toggle('open');
        langBtn.classList.toggle('open', isOpen);
      });
    }

    // Language Selection Items
    document.querySelectorAll('#util-lang-menu .util-menu-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const selectedLang = btn.getAttribute('data-lang');
        I18N.setLang(selectedLang);
        closeAllDropdowns();
      });
    });

    // High Contrast / Theme Toggle Switch
    const themeCheckbox = document.getElementById('check-util-theme');
    if (themeCheckbox) {
      themeCheckbox.addEventListener('change', () => {
        toggleTheme();
      });
    }

    // Live Telemetry Sync Action
    const syncBtn = document.getElementById('btn-util-sync-telemetry');
    if (syncBtn) {
      syncBtn.addEventListener('click', () => {
        syncBtn.style.transform = 'rotate(180deg)';
        syncBtn.style.transition = 'transform 0.5s ease';
        setTimeout(() => {
          syncBtn.style.transform = 'none';
        }, 500);
        showToast('Telemetry synced: 45 daily heartbeats & 27 active pumps online', 'success');
      });
    }

    // Utility User Account Dropdown Toggle
    const userBtn = document.getElementById('btn-util-user-trigger');
    const userMenu = document.getElementById('util-user-menu');
    if (userBtn && userMenu) {
      userBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = userMenu.classList.toggle('open');
        userBtn.classList.toggle('open', isOpen);
      });
    }

    // Preferences Modal Buttons
    const utilPrefBtn = document.getElementById('btn-util-farm-settings');
    const menuPrefBtn = document.getElementById('btn-menu-farm-settings');
    if (utilPrefBtn) utilPrefBtn.addEventListener('click', openFarmSettings);
    if (menuPrefBtn) menuPrefBtn.addEventListener('click', openFarmSettings);

    // Logout Button
    const logoutBtn = document.getElementById('btn-util-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        Auth.logout();
      });
    }

    // Close Dropdowns on Click Outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.utility-dropdown') && !e.target.closest('.nav-dropdown-item')) {
        closeAllDropdowns();
      }
    });

    // Escape Key Listener
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAllDropdowns();
        closeFarmSettings();
      }
    });

    // Mobile Hamburger Navigation Toggle
    const mobileToggle = document.getElementById('btn-nav-mobile-toggle');
    const mobileNav = document.querySelector('.main-menu-nav');
    if (mobileToggle && mobileNav) {
      mobileToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileNav.classList.toggle('mobile-open');
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

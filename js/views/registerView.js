/**
 * SmartKisan Web Platform - Register View
 * Harmonized with Mobile App Registration API & Contracts
 */

const RegisterView = {
  render() {
    return `
      <div class="auth-wrapper">
        <div class="auth-card-container">
          
          <!-- Left Hero Pane -->
          <div class="auth-hero-pane">
            <div>
              <div class="hero-brand">
                <div class="brand-icon">🌾</div>
                <span>SmartKisan</span>
              </div>
              <div class="hero-tagline">
                Join 25,000+ Indian farmers optimizing water, electricity, and crop yields
              </div>
            </div>

            <ul class="hero-highlights">
              <li>
                <span class="icon">💧</span>
                <div>
                  <strong>Save 35% Irrigation Water</strong>
                  <p style="opacity: 0.85; font-size: 13px;">AI schedules run pumps during optimal soil absorption windows.</p>
                </div>
              </li>
              <li>
                <span class="icon">📱</span>
                <div>
                  <strong>Unified Web & Mobile Sync</strong>
                  <p style="opacity: 0.85; font-size: 13px;">Manage everything from desktop or the SmartKisan Android APK seamlessly.</p>
                </div>
              </li>
              <li>
                <span class="icon">📊</span>
                <div>
                  <strong>Audit-Ready Agrarian DSR</strong>
                  <p style="opacity: 0.85; font-size: 13px;">Export daily water usage, electricity metrics, and crop logs directly to Excel.</p>
                </div>
              </li>
            </ul>

            <div class="hero-footer">
              SmartKisan • Built for Indian Agrarian Excellence
            </div>
          </div>

          <!-- Right Form Pane -->
          <div class="auth-form-pane" style="padding-top: 32px; padding-bottom: 32px;">
            <div class="auth-header" style="margin-bottom: 16px;">
              <h2 class="auth-title">Register Your Farm</h2>
              <p class="auth-subtitle">Create your SmartKisan account to connect pumps and fields</p>
            </div>

            <!-- Error Alert Banner -->
            <div id="register-error-alert" class="auth-error-alert" style="display: none;" role="alert">
              <span class="alert-icon">⚠️</span>
              <span id="register-error-message">Registration failed</span>
            </div>

            <form id="register-form">
              <!-- Full Name & Desired Username -->
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" for="reg-name">Full Name *</label>
                  <div class="input-container">
                    <span class="input-icon">👤</span>
                    <input 
                      type="text" 
                      id="reg-name" 
                      class="form-input" 
                      placeholder="e.g. Ramesh Singh" 
                      required 
                      autocomplete="name"
                    />
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label" for="reg-username">
                    Username <span style="font-weight: normal; color: var(--text-light);">(optional)</span>
                  </label>
                  <div class="input-container">
                    <span class="input-icon">🏷️</span>
                    <input 
                      type="text" 
                      id="reg-username" 
                      class="form-input" 
                      placeholder="e.g. ramesh_punjab" 
                      autocomplete="username"
                    />
                  </div>
                  <div id="username-status" class="input-status-hint"></div>
                </div>
              </div>

              <!-- Email & Phone Number -->
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" for="reg-email">Email Address *</label>
                  <div class="input-container">
                    <span class="input-icon">✉️</span>
                    <input 
                      type="email" 
                      id="reg-email" 
                      class="form-input" 
                      placeholder="e.g. ramesh@smartkisan.in" 
                      required 
                      autocomplete="email"
                    />
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label" for="reg-phone">Phone Number *</label>
                  <div class="input-container">
                    <span class="input-icon">📞</span>
                    <input 
                      type="tel" 
                      id="reg-phone" 
                      class="form-input" 
                      placeholder="e.g. 9876543210" 
                      required 
                      autocomplete="tel"
                    />
                  </div>
                </div>
              </div>

              <!-- Farm District & Farm Name -->
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" for="reg-location">Farm District / State</label>
                  <div class="input-container">
                    <span class="input-icon">📍</span>
                    <input 
                      type="text" 
                      id="reg-location" 
                      class="form-input" 
                      placeholder="e.g. Ludhiana, Punjab" 
                    />
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label" for="reg-farm-name">Farm Name / Holding</label>
                  <div class="input-container">
                    <span class="input-icon">🌱</span>
                    <input 
                      type="text" 
                      id="reg-farm-name" 
                      class="form-input" 
                      placeholder="e.g. Ramesh Green Acres" 
                    />
                  </div>
                </div>
              </div>

              <!-- Password & Confirm Password -->
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" for="reg-password">Password *</label>
                  <div class="input-container">
                    <span class="input-icon">🔒</span>
                    <input 
                      type="password" 
                      id="reg-password" 
                      class="form-input" 
                      placeholder="Minimum 6 characters" 
                      required 
                      autocomplete="new-password"
                    />
                    <button type="button" class="toggle-password" id="btn-toggle-reg-pwd" aria-label="Toggle password">
                      👁️
                    </button>
                  </div>
                  <!-- Password Strength Meter -->
                  <div class="pwd-strength-container" id="pwd-strength-box" style="display: none;">
                    <div class="pwd-strength-track">
                      <div class="pwd-strength-fill" id="pwd-strength-fill"></div>
                    </div>
                    <span class="pwd-strength-label" id="pwd-strength-label"></span>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label" for="reg-confirm-password">Confirm Password *</label>
                  <div class="input-container">
                    <span class="input-icon">🔒</span>
                    <input 
                      type="password" 
                      id="reg-confirm-password" 
                      class="form-input" 
                      placeholder="Re-enter password" 
                      required 
                      autocomplete="new-password"
                    />
                    <button type="button" class="toggle-password" id="btn-toggle-reg-conf-pwd" aria-label="Toggle password">
                      👁️
                    </button>
                  </div>
                  <div id="pwd-match-status" class="input-status-hint"></div>
                </div>
              </div>

              <div class="form-options" style="margin-bottom: 20px;">
                <label class="checkbox-label">
                  <input type="checkbox" id="reg-terms" required checked />
                  <span style="font-size: 12px;">I agree to SmartKisan Terms of Service and Privacy Policy</span>
                </label>
              </div>

              <button type="submit" class="btn-primary" id="btn-register-submit">
                <span>Complete Farm Registration</span>
                <span>→</span>
              </button>
            </form>

            <div class="auth-switch" style="margin-top: 18px;">
              Already registered? 
              <a href="#/login">Sign in here</a>
            </div>
          </div>

        </div>
      </div>
    `;
  },

  mount() {
    const form = document.getElementById('register-form');
    const nameInput = document.getElementById('reg-name');
    const usernameInput = document.getElementById('reg-username');
    const emailInput = document.getElementById('reg-email');
    const phoneInput = document.getElementById('reg-phone');
    const locationInput = document.getElementById('reg-location');
    const farmNameInput = document.getElementById('reg-farm-name');
    const passwordInput = document.getElementById('reg-password');
    const confirmPasswordInput = document.getElementById('reg-confirm-password');
    const submitBtn = document.getElementById('btn-register-submit');
    const errorAlert = document.getElementById('register-error-alert');
    const errorMessage = document.getElementById('register-error-message');
    const usernameStatus = document.getElementById('username-status');
    const pwdStrengthBox = document.getElementById('pwd-strength-box');
    const pwdStrengthFill = document.getElementById('pwd-strength-fill');
    const pwdStrengthLabel = document.getElementById('pwd-strength-label');
    const pwdMatchStatus = document.getElementById('pwd-match-status');
    const togglePwdBtn = document.getElementById('btn-toggle-reg-pwd');
    const toggleConfPwdBtn = document.getElementById('btn-toggle-reg-conf-pwd');

    const showError = (msg) => {
      if (errorMessage) errorMessage.textContent = msg;
      if (errorAlert) {
        errorAlert.style.display = 'flex';
        errorAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      if (window.showToast) {
        window.showToast(msg, 'error');
      }
    };

    const hideError = () => {
      if (errorAlert) errorAlert.style.display = 'none';
    };

    // Toggle Password Visibility
    if (togglePwdBtn && passwordInput) {
      togglePwdBtn.addEventListener('click', () => {
        const isPassword = passwordInput.getAttribute('type') === 'password';
        passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
        togglePwdBtn.textContent = isPassword ? '🙈' : '👁️';
      });
    }

    if (toggleConfPwdBtn && confirmPasswordInput) {
      toggleConfPwdBtn.addEventListener('click', () => {
        const isPassword = confirmPasswordInput.getAttribute('type') === 'password';
        confirmPasswordInput.setAttribute('type', isPassword ? 'text' : 'password');
        toggleConfPwdBtn.textContent = isPassword ? '🙈' : '👁️';
      });
    }

    // Username format validation logic matching backend/src/utils/username.js
    const validateUsernameFormat = (raw) => {
      const name = String(raw || '').trim();
      if (!name) return null;
      if (name.length < 3) return 'Needs at least 3 characters.';
      if (name.length > 20) return 'Can be at most 20 characters.';
      if (name.includes('@')) return 'Cannot contain @. Use email box for email.';
      if (/\s/.test(name)) return 'Cannot contain spaces.';
      if (!/^[a-zA-Z]/.test(name)) return 'Must start with a letter.';
      if (!/^[a-zA-Z][a-zA-Z0-9._]{2,19}$/.test(name)) return 'Use only letters, numbers, dots, and underscores.';
      if (name.includes('..')) return 'Cannot contain two dots together.';
      if (name.endsWith('.')) return 'Cannot end with a dot.';
      const reserved = ['admin', 'smartkisan', 'kisan', 'root', 'support', 'help', 'api', 'test'];
      if (reserved.includes(name.toLowerCase())) return 'That username is reserved.';
      return null;
    };

    // Live Username Validation Feedback (Debounced)
    let usernameDebounceTimer = null;
    if (usernameInput && usernameStatus) {
      usernameInput.addEventListener('input', () => {
        clearTimeout(usernameDebounceTimer);
        const val = usernameInput.value.trim();
        if (!val) {
          usernameStatus.textContent = '';
          usernameStatus.className = 'input-status-hint';
          return;
        }

        usernameDebounceTimer = setTimeout(() => {
          const problem = validateUsernameFormat(val);
          if (problem) {
            usernameStatus.textContent = `⚠️ ${problem}`;
            usernameStatus.className = 'input-status-hint hint-error';
          } else {
            usernameStatus.textContent = '✓ Username format valid';
            usernameStatus.className = 'input-status-hint hint-success';
          }
        }, 250);
      });
    }

    // Password Strength Meter
    if (passwordInput && pwdStrengthBox) {
      passwordInput.addEventListener('input', () => {
        const val = passwordInput.value;
        if (!val) {
          pwdStrengthBox.style.display = 'none';
          return;
        }

        pwdStrengthBox.style.display = 'flex';
        let score = 0;
        if (val.length >= 6) score += 1;
        if (val.length >= 8) score += 1;
        if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score += 1;
        if (/\d/.test(val) || /[^A-Za-z0-9]/.test(val)) score += 1;

        if (score <= 1) {
          pwdStrengthFill.style.width = '25%';
          pwdStrengthFill.style.background = '#e53935';
          pwdStrengthLabel.textContent = 'Weak';
          pwdStrengthLabel.style.color = '#e53935';
        } else if (score === 2 || score === 3) {
          pwdStrengthFill.style.width = '65%';
          pwdStrengthFill.style.background = '#fb8c00';
          pwdStrengthLabel.textContent = 'Good';
          pwdStrengthLabel.style.color = '#fb8c00';
        } else {
          pwdStrengthFill.style.width = '100%';
          pwdStrengthFill.style.background = '#2e7d32';
          pwdStrengthLabel.textContent = 'Strong';
          pwdStrengthLabel.style.color = '#2e7d32';
        }

        // Also re-check confirmation match
        checkPasswordMatch();
      });
    }

    // Live Password Match Check
    const checkPasswordMatch = () => {
      if (!confirmPasswordInput || !pwdMatchStatus) return;
      const pwd = passwordInput.value;
      const conf = confirmPasswordInput.value;

      if (!conf) {
        pwdMatchStatus.textContent = '';
        pwdMatchStatus.className = 'input-status-hint';
        return;
      }

      if (pwd === conf) {
        pwdMatchStatus.textContent = '✓ Passwords match';
        pwdMatchStatus.className = 'input-status-hint hint-success';
      } else {
        pwdMatchStatus.textContent = '⚠️ Passwords do not match';
        pwdMatchStatus.className = 'input-status-hint hint-error';
      }
    };

    if (confirmPasswordInput) {
      confirmPasswordInput.addEventListener('input', checkPasswordMatch);
    }

    // Form Submit Handler
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideError();

        const name = nameInput.value.trim();
        const username = usernameInput ? usernameInput.value.trim() : '';
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();
        const location = locationInput ? locationInput.value.trim() : '';
        const farmName = farmNameInput ? farmNameInput.value.trim() : '';
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (!name || !email || !phone || !password) {
          showError('Please fill in all required fields (Name, Email, Phone, Password).');
          return;
        }

        // Validate username format if provided
        if (username) {
          const problem = validateUsernameFormat(username);
          if (problem) {
            showError(`Invalid username: ${problem}`);
            return;
          }
        }

        if (password.length < 6) {
          showError('Password must be at least 6 characters long.');
          return;
        }

        if (password !== confirmPassword) {
          showError('Passwords do not match. Please re-enter.');
          return;
        }

        try {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span class="auth-spinner"></span> <span>Creating your farm account...</span>';

          const payload = {
            name,
            email,
            phone,
            password,
            location: location || undefined,
            farmName: farmName || undefined
          };

          if (username) {
            payload.username = username;
          }

          const res = await Auth.register(payload);

          window.showToast(`Welcome to SmartKisan, ${res.user.name}! Your farm is now registered.`, 'success');
          window.location.hash = '#/dashboard';
        } catch (err) {
          const displayErr = err.message || 'Registration failed. Please check your details and try again.';
          showError(displayErr);
        } finally {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Complete Farm Registration</span> <span>→</span>';
        }
      });
    }
  },

  unmount() {}
};

window.RegisterView = RegisterView;

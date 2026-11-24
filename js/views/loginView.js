/**
 * SmartKisan Web Platform - Login View
 */

const LoginView = {
  render() {
    return `
      <div class="auth-wrapper">
        <div class="auth-card-container">
          
          <!-- Left Hero Pane -->
          <div class="auth-hero-pane">
            <div>
              <div class="hero-brand">
                <div class="brand-icon">🌱</div>
                <span>SmartKisan</span>
              </div>
              <div class="hero-tagline">
                India's Next-Generation IoT & AI Precision Agriculture Platform
              </div>
            </div>

            <ul class="hero-highlights">
              <li>
                <span class="icon">⚡</span>
                <div>
                  <strong>Live Pump Automation</strong>
                  <p style="opacity: 0.85; font-size: 13px;">Instant telemetry, run logs, and direct IoT power control via MQTT.</p>
                </div>
              </li>
              <li>
                <span class="icon">🗺️</span>
                <div>
                  <strong>GIS Farm Mapping</strong>
                  <p style="opacity: 0.85; font-size: 13px;">Satellite parcels, crop boundaries, and live water ripple pulse indicators.</p>
                </div>
              </li>
              <li>
                <span class="icon">🤖</span>
                <div>
                  <strong>Intelligent Scheduling</strong>
                  <p style="opacity: 0.85; font-size: 13px;">Weather-aware soil irrigation schedules with full bilingual voice support.</p>
                </div>
              </li>
            </ul>

            <div class="hero-footer">
              SmartKisan Portal v${CONFIG.APP_VERSION} • Secure Agrarian Cloud
            </div>
          </div>

          <!-- Right Form Pane -->
          <div class="auth-form-pane">
            <div class="auth-header">
              <h2 class="auth-title">Farmer Login</h2>
              <p class="auth-subtitle">Sign in with your email, username, or registered mobile</p>
            </div>

            <!-- Error Alert Banner -->
            <div id="login-error-alert" class="auth-error-alert" style="display: none;" role="alert">
              <span class="alert-icon">⚠️</span>
              <span id="login-error-message">Invalid credentials</span>
            </div>

            <!-- Quick Demo Fill Helpers -->
            <div class="demo-account-box">
              <div class="demo-box-header">
                <span>⚡ Quick Demo Credentials</span>
              </div>
              <div class="demo-buttons-row">
                <button type="button" class="btn-demo-fill" id="btn-demo-farmer">
                  🌾 Farmer Demo
                </button>
                <button type="button" class="btn-demo-fill" id="btn-demo-agronomist">
                  🔬 Agronomist Demo
                </button>
              </div>
            </div>

            <form id="login-form">
              <div class="form-group">
                <label class="form-label" for="login-identifier">Email, Username, or Phone</label>
                <div class="input-container">
                  <span class="input-icon">👤</span>
                  <input 
                    type="text" 
                    id="login-identifier" 
                    class="form-input" 
                    placeholder="e.g. ramesh@smartkisan.in or 9876543210" 
                    required 
                    autocomplete="username"
                  />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="login-password">Password</label>
                <div class="input-container">
                  <span class="input-icon">🔒</span>
                  <input 
                    type="password" 
                    id="login-password" 
                    class="form-input" 
                    placeholder="Enter your password" 
                    required 
                    autocomplete="current-password"
                  />
                  <button type="button" class="toggle-password" id="btn-toggle-pwd" aria-label="Toggle password visibility">
                    👁️
                  </button>
                </div>
              </div>

              <div class="form-options">
                <label class="checkbox-label">
                  <input type="checkbox" id="login-remember" checked />
                  <span>Remember me</span>
                </label>
                <a href="javascript:void(0)" id="link-forgot-pwd" style="font-size: 13px;">Forgot password?</a>
              </div>

              <button type="submit" class="btn-primary" id="btn-login-submit">
                <span>Sign In to Dashboard</span>
                <span>→</span>
              </button>
            </form>

            <div class="auth-switch">
              Don't have an account yet? 
              <a href="#/register">Register your Farm</a>
            </div>
          </div>

        </div>
      </div>
    `;
  },

  mount() {
    const form = document.getElementById('login-form');
    const identifierInput = document.getElementById('login-identifier');
    const passwordInput = document.getElementById('login-password');
    const rememberCheckbox = document.getElementById('login-remember');
    const togglePwdBtn = document.getElementById('btn-toggle-pwd');
    const demoFarmerBtn = document.getElementById('btn-demo-farmer');
    const demoAgronomistBtn = document.getElementById('btn-demo-agronomist');
    const forgotPwdLink = document.getElementById('link-forgot-pwd');
    const submitBtn = document.getElementById('btn-login-submit');
    const errorAlert = document.getElementById('login-error-alert');
    const errorMessage = document.getElementById('login-error-message');

    // Restore remembered identifier if saved previously
    const savedIdentifier = localStorage.getItem('smartkisan_remembered_identifier');
    if (savedIdentifier && identifierInput) {
      identifierInput.value = savedIdentifier;
      if (rememberCheckbox) rememberCheckbox.checked = true;
    }

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

    // Demo Fill: Farmer
    if (demoFarmerBtn) {
      demoFarmerBtn.addEventListener('click', async () => {
        hideError();
        identifierInput.value = 'farmer.ramesh@smartkisan.in';
        passwordInput.value = 'kisan123';
        try {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span class="auth-spinner"></span> <span>Logging in...</span>';
          const res = await Auth.login('farmer.ramesh@smartkisan.in', 'kisan123');
          window.showToast(`Welcome back, ${res.user.name || 'Farmer Ramesh'}!`, 'success');
          window.location.hash = '#/dashboard';
        } catch (err) {
          // Fallback demo session if remote backend is cold/offline
          Auth.setSession('demo-jwt-token-smartkisan-2026', {
            id: 'user-demo-1',
            name: 'Farmer Ramesh',
            email: 'farmer.ramesh@smartkisan.in',
            role: 'user'
          });
          window.showToast('Demo session activated! Welcome, Farmer Ramesh.', 'success');
          window.location.hash = '#/dashboard';
        } finally {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Sign In to Dashboard</span> <span>→</span>';
        }
      });
    }

    // Demo Fill: Agronomist
    if (demoAgronomistBtn) {
      demoAgronomistBtn.addEventListener('click', async () => {
        hideError();
        identifierInput.value = 'agronomist.verma@smartkisan.in';
        passwordInput.value = 'agriAdmin123';
        try {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span class="auth-spinner"></span> <span>Logging in...</span>';
          const res = await Auth.login('agronomist.verma@smartkisan.in', 'agriAdmin123');
          window.showToast(`Welcome, ${res.user.name || 'Dr. Verma'}!`, 'success');
          window.location.hash = '#/dashboard';
        } catch (err) {
          Auth.setSession('demo-jwt-token-agronomist-2026', {
            id: 'user-demo-2',
            name: 'Dr. Verma (Agronomist)',
            email: 'agronomist.verma@smartkisan.in',
            role: 'admin'
          });
          window.showToast('Agronomist demo session activated!', 'success');
          window.location.hash = '#/dashboard';
        } finally {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Sign In to Dashboard</span> <span>→</span>';
        }
      });
    }

    // Forgot Password Hint
    if (forgotPwdLink) {
      forgotPwdLink.addEventListener('click', () => {
        window.showToast('To reset password, enter your registered email on the mobile app or call SmartKisan Support: 1800-SMART-KISAN', 'info');
      });
    }

    // Form Submit
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideError();

        const identifier = identifierInput.value.trim();
        const password = passwordInput.value;
        const rememberMe = rememberCheckbox ? rememberCheckbox.checked : false;

        if (!identifier || !password) {
          showError('Please enter both your identifier (email/username) and password.');
          return;
        }

        try {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span class="auth-spinner"></span> <span>Verifying credentials...</span>';

          const res = await Auth.login(identifier, password);

          // Handle Remember Me persistence
          if (rememberMe) {
            localStorage.setItem('smartkisan_remembered_identifier', identifier);
          } else {
            localStorage.removeItem('smartkisan_remembered_identifier');
          }

          window.showToast(`Welcome back, ${res.user.name || 'Farmer'}!`, 'success');
          window.location.hash = '#/dashboard';
        } catch (err) {
          const displayErr = err.message || 'Login failed. Please check your credentials.';
          showError(displayErr);
        } finally {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Sign In to Dashboard</span> <span>→</span>';
        }
      });
    }
  },

  unmount() {
    // Cleanup if necessary
  }
};

window.LoginView = LoginView;

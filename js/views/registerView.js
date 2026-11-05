/**
 * SmartKisan Web Platform - Register View
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
                Join over 25,000+ Indian farmers optimizing water and crop yields
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
            <div class="auth-header" style="margin-bottom: 20px;">
              <h2 class="auth-title">Register Your Farm</h2>
              <p class="auth-subtitle">Create your SmartKisan account to connect pumps and fields</p>
            </div>

            <form id="register-form">
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
                    />
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" for="reg-email">Email Address *</label>
                  <div class="input-container">
                    <span class="input-icon">✉️</span>
                    <input 
                      type="email" 
                      id="reg-email" 
                      class="form-input" 
                      placeholder="e.g. ramesh@farm.in" 
                      required 
                    />
                  </div>
                </div>

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
              </div>

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
                    />
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
                    />
                  </div>
                </div>
              </div>

              <div class="form-options" style="margin-bottom: 20px;">
                <label class="checkbox-label">
                  <input type="checkbox" id="reg-terms" required checked />
                  <span style="font-size: 12px;">I agree to the SmartKisan Terms of Service and Privacy Policy</span>
                </label>
              </div>

              <button type="submit" class="btn-primary" id="btn-register-submit">
                <span>Complete Registration</span>
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
    const emailInput = document.getElementById('reg-email');
    const phoneInput = document.getElementById('reg-phone');
    const locationInput = document.getElementById('reg-location');
    const passwordInput = document.getElementById('reg-password');
    const confirmPasswordInput = document.getElementById('reg-confirm-password');
    const submitBtn = document.getElementById('btn-register-submit');

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();
        const location = locationInput ? locationInput.value.trim() : '';
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (!name || !email || !phone || !password) {
          window.showToast('Please fill in all required fields.', 'warning');
          return;
        }

        if (password.length < 6) {
          window.showToast('Password must be at least 6 characters long.', 'warning');
          return;
        }

        if (password !== confirmPassword) {
          window.showToast('Passwords do not match. Please re-enter.', 'error');
          return;
        }

        try {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span>Creating your farm account...</span>';

          const res = await Auth.register({
            name,
            email,
            phone,
            password,
            location
          });

          window.showToast(`Farm registered successfully! Welcome, ${res.user.name}.`, 'success');
          window.location.hash = '#/dashboard';
        } catch (err) {
          window.showToast(err.message || 'Registration failed. Please try again.', 'error');
        } finally {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Complete Registration</span> <span>→</span>';
        }
      });
    }
  },

  unmount() {}
};

window.RegisterView = RegisterView;

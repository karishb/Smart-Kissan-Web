/**
 * SmartKisan Web Platform - Pumps View
 * Dedicated Smart Pump & Motor Command Center
 */

const PumpsView = {
  onPumpUpdate: null,

  render() {
    return `
      <div class="page-container">
        <!-- View Header -->
        <div class="dashboard-header">
          <div>
            <h1 class="welcome-title">
              <span>🚰 Smart Pumps & Motor Controllers</span>
            </h1>
            <p class="welcome-subtitle">
              Live IoT telemetry, power controls, and real-time operational mode switching
            </p>
          </div>

          <div class="header-actions">
            <button type="button" class="btn-primary" id="btn-open-add-pump" style="width: auto;">
              <span>+ Add New Pump</span>
            </button>
          </div>
        </div>

        <!-- Telemetry Summary Cards -->
        <div class="kpi-grid" style="margin-bottom: 24px;">
          <div class="kpi-card">
            <div class="kpi-icon-box green"><span>⚡</span></div>
            <div class="kpi-info">
              <div class="kpi-label">Active Running Pumps</div>
              <div class="kpi-value" id="pumps-active-stat">-- / --</div>
              <div class="kpi-subtext highlight-green">Live water discharge</div>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-icon-box blue"><span>💧</span></div>
            <div class="kpi-info">
              <div class="kpi-label">Total Flow Rate</div>
              <div class="kpi-value" id="pumps-flow-stat">670 <span style="font-size: 14px; font-weight: 500;">L/min</span></div>
              <div class="kpi-subtext">Active operational capacity</div>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-icon-box amber"><span>⏱️</span></div>
            <div class="kpi-info">
              <div class="kpi-label">Today's Run Time</div>
              <div class="kpi-value">5.2 <span style="font-size: 14px; font-weight: 500;">Hours</span></div>
              <div class="kpi-subtext">Cumulative farm pumping</div>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-icon-box earth"><span>🔌</span></div>
            <div class="kpi-info">
              <div class="kpi-label">Energy Consumed</div>
              <div class="kpi-value">12.4 <span style="font-size: 14px; font-weight: 500;">kWh</span></div>
              <div class="kpi-subtext">Grid & Solar combined</div>
            </div>
          </div>
        </div>

        <!-- Filter Pill Chips -->
        <div style="display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap;">
          <button type="button" class="map-filter-chip active" data-pfilter="all">All Pumps (4)</button>
          <button type="button" class="map-filter-chip" data-pfilter="running">Active Running</button>
          <button type="button" class="map-filter-chip" data-pfilter="standby">Standby</button>
          <button type="button" class="map-filter-chip" data-pfilter="solar">Solar Powered</button>
          <button type="button" class="map-filter-chip" data-pfilter="submersible">Submersible</button>
        </div>

        <!-- Detailed Pumps Grid -->
        <div class="pumps-grid" id="pumps-full-grid" style="grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));">
          <div style="padding: 40px; text-align: center; color: var(--text-muted); grid-column: 1/-1;">
            Loading pump hardware controllers...
          </div>
        </div>

        <!-- Modal: Add New Pump -->
        <div class="modal-backdrop" id="modal-add-pump" style="display: none;">
          <div class="modal-card">
            <div class="modal-header">
              <h3>Connect New Smart Pump Controller</h3>
              <button type="button" class="btn-close-modal" id="btn-close-add-pump">✕</button>
            </div>
            <form id="form-add-pump" style="padding: 24px;">
              <div class="form-group">
                <label class="form-label">Pump / Motor Name</label>
                <input type="text" class="form-input" id="add-pump-name" placeholder="e.g. Tubewell 5 (East Farm)" required />
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div class="form-group">
                  <label class="form-label">Motor Type</label>
                  <select class="form-input" id="add-pump-type">
                    <option value="submersible">Submersible</option>
                    <option value="solar">Solar DC Pump</option>
                    <option value="monoblock">Monoblock</option>
                    <option value="centrifugal">Centrifugal Drip</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Power Rating (HP)</label>
                  <input type="number" step="0.5" class="form-input" id="add-pump-hp" value="5.0" required />
                </div>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div class="form-group">
                  <label class="form-label">Discharge Flow Rate (L/min)</label>
                  <input type="number" class="form-input" id="add-pump-flow" value="350" required />
                </div>
                <div class="form-group">
                  <label class="form-label">Parcel / Location</label>
                  <input type="text" class="form-input" id="add-pump-location" placeholder="e.g. North Parcel A" required />
                </div>
              </div>
              <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 10px;">
                <button type="button" class="btn-outline" style="width: auto; padding: 10px 18px;" onclick="document.getElementById('modal-add-pump').style.display='none'">Cancel</button>
                <button type="submit" class="btn-primary" style="width: auto; padding: 10px 22px;">Register Pump</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  },

  async mount() {
    await this.loadPumps();
    this.bindModals();

    this.onPumpUpdate = () => {
      this.loadPumps();
    };
    window.addEventListener('pump-status-updated', this.onPumpUpdate);
  },

  async loadPumps(filter = 'all') {
    const container = document.getElementById('pumps-full-grid');
    if (!container) return;

    try {
      const res = await API.pumps.getAll();
      let pumps = res.pumps || [];

      // Update Top Stats
      const runningCount = pumps.filter(p => p.status === 'on').length;
      const statEl = document.getElementById('pumps-active-stat');
      if (statEl) statEl.textContent = `${runningCount} / ${pumps.length}`;

      // Filter handling
      if (filter === 'running') pumps = pumps.filter(p => p.status === 'on');
      if (filter === 'standby') pumps = pumps.filter(p => p.status !== 'on');
      if (filter === 'solar') pumps = pumps.filter(p => p.type === 'solar');
      if (filter === 'submersible') pumps = pumps.filter(p => p.type === 'submersible');

      if (pumps.length === 0) {
        container.innerHTML = `
          <div style="padding: 40px; text-align: center; color: var(--text-muted); grid-column: 1/-1; background: white; border-radius: 12px; border: 1px dashed var(--border);">
            No pumps match the selected filter.
          </div>
        `;
        return;
      }

      container.innerHTML = pumps.map(pump => {
        const isRunning = pump.status === 'on';
        const modes = ['manual', 'auto', 'timer', 'schedule', 'sensor', 'ai'];
        const currentMode = (pump.mode || 'manual').toLowerCase();

        return `
          <div class="pump-card ${isRunning ? 'running' : ''}" style="background: #FFFFFF; border: 1px solid var(--border); box-shadow: var(--shadow-sm); border-radius: var(--radius-lg); padding: 22px;">
            <div class="pump-card-header" style="margin-bottom: 14px;">
              <div>
                <div class="pump-name" style="font-size: 17px;">${pump.name}</div>
                <div class="pump-field" style="margin-top: 3px;">📍 ${pump.location || 'Main Parcel'}</div>
              </div>
              <div class="pump-status-indicator">
                <span class="status-dot ${isRunning ? 'active' : ''}"></span>
                <span style="font-size: 13px; font-weight: 600;">${isRunning ? 'Running' : 'Standby'}</span>
              </div>
            </div>

            <!-- Operating Mode Selector -->
            <div style="margin-bottom: 16px;">
              <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px;">
                Operating Mode
              </div>
              <div class="mode-chips-container" style="display: flex; gap: 6px; flex-wrap: wrap;">
                ${modes.map(m => `
                  <button 
                    type="button" 
                    class="btn-mode-chip ${currentMode === m ? 'active' : ''}"
                    data-pump-id="${pump.id}"
                    data-mode="${m}"
                  >
                    ${m.toUpperCase()}
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Telemetry Matrix -->
            <div class="pump-telemetry-row" style="grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 16px; background: var(--bg-card-subtle); padding: 10px;">
              <div class="telemetry-item">
                Rating
                <strong>${pump.power_rating || '5.0'} HP</strong>
              </div>
              <div class="telemetry-item">
                Discharge
                <strong>${pump.flow_rate || '350'} L/m</strong>
              </div>
              <div class="telemetry-item">
                Today Litres
                <strong>${(pump.today_litres || 2450).toLocaleString()} L</strong>
              </div>
            </div>

            ${pump.schedule_time ? `
              <div style="background: var(--warning-bg); border: 1px solid #FDE68A; padding: 6px 12px; border-radius: var(--radius-sm); font-size: 12px; color: #92400E; margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between;">
                <span>⏱️ Scheduled: <strong>${pump.schedule_time}</strong></span>
                <a href="#/schedules" style="font-weight: 600; font-size: 11px;">Edit</a>
              </div>
            ` : ''}

            <!-- Card Actions -->
            <div class="pump-card-footer" style="padding-top: 10px; border-top: 1px solid var(--border);">
              <a href="#/schedules" class="btn-demo-fill" style="padding: 8px 14px; text-decoration: none;">
                📅 Manage Schedule
              </a>

              <button 
                type="button" 
                class="btn-toggle-pump ${isRunning ? 'turn-off' : 'turn-on'}"
                data-id="${pump.id}"
                data-next-action="${isRunning ? 'off' : 'on'}"
                style="padding: 9px 20px; font-size: 13px;"
              >
                <span>${isRunning ? 'Turn Off' : 'Turn On'}</span>
              </button>
            </div>
          </div>
        `;
      }).join('');

      // Bind Pump Toggle Buttons
      container.querySelectorAll('.btn-toggle-pump').forEach(btn => {
        btn.addEventListener('click', async () => {
          const pumpId = btn.getAttribute('data-id');
          const nextAction = btn.getAttribute('data-next-action');
          btn.disabled = true;
          btn.textContent = 'Updating...';

          try {
            if (window.SmartKisanSocket && typeof window.SmartKisanSocket.sendPumpCommand === 'function') {
              await window.SmartKisanSocket.sendPumpCommand(pumpId, nextAction);
            } else {
              await API.pumps.control(pumpId, nextAction);
            }
            window.showToast(`Pump switched ${nextAction.toUpperCase()}`, 'success');
            await this.loadPumps(filter);
          } catch (err) {
            window.showToast(`Error: ${err.message}`, 'error');
          }
        });
      });

      // Bind Mode Switcher Chips
      container.querySelectorAll('.btn-mode-chip').forEach(chip => {
        chip.addEventListener('click', async () => {
          const pumpId = chip.getAttribute('data-pump-id');
          const mode = chip.getAttribute('data-mode');

          try {
            await API.pumps.setMode(pumpId, mode);
            window.showToast(`Operating mode updated to ${mode.toUpperCase()}`, 'info');
            await this.loadPumps(filter);
          } catch (err) {
            window.showToast(`Failed to update mode: ${err.message}`, 'error');
          }
        });
      });

      // Bind Filters
      document.querySelectorAll('[data-pfilter]').forEach(chip => {
        chip.addEventListener('click', () => {
          document.querySelectorAll('[data-pfilter]').forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          this.loadPumps(chip.getAttribute('data-pfilter'));
        });
      });

    } catch (e) {
      console.error(e);
    }
  },

  bindModals() {
    const openBtn = document.getElementById('btn-open-add-pump');
    const closeBtn = document.getElementById('btn-close-add-pump');
    const modal = document.getElementById('modal-add-pump');
    const form = document.getElementById('form-add-pump');

    if (openBtn && modal) {
      openBtn.addEventListener('click', () => { modal.style.display = 'flex'; });
    }
    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });
    }

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('add-pump-name').value.trim();
        const type = document.getElementById('add-pump-type').value;
        const hp = document.getElementById('add-pump-hp').value;
        const flow = document.getElementById('add-pump-flow').value;
        const location = document.getElementById('add-pump-location').value.trim();

        try {
          await API.pumps.addPump({
            name,
            type,
            powerRating: hp,
            flowRate: flow,
            location,
            mode: 'manual'
          });
          window.showToast(`Pump "${name}" added successfully!`, 'success');
          modal.style.display = 'none';
          form.reset();
          await this.loadPumps();
        } catch (err) {
          window.showToast(`Failed to add pump: ${err.message}`, 'error');
        }
      });
    }
  },

  unmount() {
    if (this.onPumpUpdate) {
      window.removeEventListener('pump-status-updated', this.onPumpUpdate);
      this.onPumpUpdate = null;
    }
  }
};

window.PumpsView = PumpsView;

/**
 * SmartKisan Web Platform - Schedules View
 * Precision Irrigation Scheduling & Rain-Aware Automation
 */

const SchedulesView = {
  render() {
    return `
      <div class="page-container">
        <!-- View Header -->
        <div class="dashboard-header">
          <div>
            <h1 class="welcome-title">
              <span>⏱️ Smart Irrigation Schedules</span>
            </h1>
            <p class="welcome-subtitle">
              Automate pump run-windows, repeat days, soil moisture thresholds, and weather-aware protection
            </p>
          </div>

          <div class="header-actions">
            <button type="button" class="btn-primary" id="btn-open-add-schedule" style="width: auto;">
              <span>+ Create New Schedule</span>
            </button>
          </div>
        </div>

        <!-- Schedule Automation Highlights -->
        <div class="kpi-grid" style="margin-bottom: 24px;">
          <div class="kpi-card">
            <div class="kpi-icon-box green"><span>⏰</span></div>
            <div class="kpi-info">
              <div class="kpi-label">Active Automated Schedules</div>
              <div class="kpi-value" id="schedules-active-count">3 Active</div>
              <div class="kpi-subtext highlight-green">Synced via MQTT Cloud</div>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-icon-box blue"><span>💧</span></div>
            <div class="kpi-info">
              <div class="kpi-label">Planned Irrigation Today</div>
              <div class="kpi-value">4.5 <span style="font-size: 14px; font-weight: 500;">Hours</span></div>
              <div class="kpi-subtext">Optimal morning absorption</div>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-icon-box amber"><span>🌧️</span></div>
            <div class="kpi-info">
              <div class="kpi-label">Weather Guard</div>
              <div class="kpi-value">Active</div>
              <div class="kpi-subtext">Auto-pause if rain forecast</div>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-icon-box earth"><span>💰</span></div>
            <div class="kpi-info">
              <div class="kpi-label">Estimated Water Saved</div>
              <div class="kpi-value">35%</div>
              <div class="kpi-subtext">Preventing over-saturation</div>
            </div>
          </div>
        </div>

        <!-- Schedules Grid -->
        <div class="panel-header" style="margin-bottom: 16px;">
          <h2 style="font-size: 18px; font-weight: 700;">Configured Pump Schedules</h2>
          <span class="panel-action">Synced with Android App & MQTT</span>
        </div>

        <div class="pumps-grid" id="schedules-cards-grid" style="grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));">
          <div style="padding: 40px; text-align: center; color: var(--text-muted); grid-column: 1/-1;">
            Loading irrigation schedules...
          </div>
        </div>
      </div>

      <!-- Add Schedule Modal -->
      <div id="modal-add-schedule" class="modal-backdrop" style="display: none;">
        <div class="modal-card">
          <div class="modal-header">
            <h3>Configure Pump Irrigation Schedule</h3>
            <button type="button" class="btn-close-modal" id="btn-close-add-schedule">✕</button>
          </div>
          <form id="form-add-schedule" style="padding: 20px;">
            <div class="form-group">
              <label class="form-label">Select Pump Controller *</label>
              <select id="sch-pump-id" class="form-input" style="padding: 10px 14px;">
                <option value="pump-01">Tubewell 1 (North Parcel A - Wheat)</option>
                <option value="pump-02">Solar Pump 2 (Polyhouse 1 - Bell Pepper)</option>
                <option value="pump-03">Borewell 3 (South Parcel B - Cotton)</option>
                <option value="pump-04">Drip System Pump 4 (East Parcel C - Tomato)</option>
              </select>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Start Time (IST) *</label>
                <input type="time" id="sch-start-time" class="form-input" value="06:00" required />
              </div>
              <div class="form-group">
                <label class="form-label">Stop Time (IST) *</label>
                <input type="time" id="sch-stop-time" class="form-input" value="08:30" required />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Repeat Days</label>
              <div style="display: flex; gap: 8px; flex-wrap: wrap;" id="sch-days-picker">
                <label class="checkbox-label"><input type="checkbox" name="sch-day" value="Mon" checked /> Mon</label>
                <label class="checkbox-label"><input type="checkbox" name="sch-day" value="Tue" /> Tue</label>
                <label class="checkbox-label"><input type="checkbox" name="sch-day" value="Wed" checked /> Wed</label>
                <label class="checkbox-label"><input type="checkbox" name="sch-day" value="Thu" /> Thu</label>
                <label class="checkbox-label"><input type="checkbox" name="sch-day" value="Fri" checked /> Fri</label>
                <label class="checkbox-label"><input type="checkbox" name="sch-day" value="Sat" /> Sat</label>
                <label class="checkbox-label"><input type="checkbox" name="sch-day" value="Sun" checked /> Sun</label>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Soil Cutoff Moisture (%)</label>
                <input type="number" id="sch-moisture-cutoff" class="form-input" value="65" />
              </div>
              <div class="form-group" style="display: flex; align-items: center; margin-top: 24px;">
                <label class="checkbox-label">
                  <input type="checkbox" id="sch-weather-guard" checked />
                  <span style="font-weight: 600;">Rain Forecast Guard</span>
                </label>
              </div>
            </div>

            <button type="submit" class="btn-primary" style="margin-top: 10px;">
              <span>Activate Irrigation Schedule</span>
            </button>
          </form>
        </div>
      </div>
    `;
  },

  async mount() {
    await this.loadSchedules();
    this.bindModals();
  },

  async loadSchedules() {
    const container = document.getElementById('schedules-cards-grid');
    if (!container) return;

    try {
      const res = await API.pumps.getSchedules();
      const schedules = res.schedules || [];

      const countEl = document.getElementById('schedules-active-count');
      if (countEl) countEl.textContent = `${schedules.filter(s => s.is_active).length} Active`;

      if (schedules.length === 0) {
        container.innerHTML = `
          <div style="padding: 40px; text-align: center; color: var(--text-muted); grid-column: 1/-1; background: white; border-radius: 12px; border: 1px dashed var(--border);">
            No automated schedules configured. Click "+ Create New Schedule" to get started.
          </div>
        `;
        return;
      }

      container.innerHTML = schedules.map(sch => {
        const days = Array.isArray(sch.repeat_days) ? sch.repeat_days.join(', ') : 'Daily';

        return `
          <div class="dash-panel" style="margin-bottom: 0; background: #FFFFFF; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); border: 1px solid var(--border); padding: 22px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px;">
              <div>
                <h3 style="font-size: 17px; font-weight: 700; color: var(--text-main);">${sch.pump_name}</h3>
                <div style="font-size: 13px; color: var(--text-muted); margin-top: 2px;">📍 ${sch.field_name}</div>
              </div>
              <span class="mode-badge schedule" style="font-size: 12px;">ACTIVE SCHEDULE</span>
            </div>

            <!-- Time Window Box -->
            <div style="background: var(--warning-bg); border: 1px solid #FDE68A; border-radius: var(--radius-md); padding: 14px; margin-bottom: 16px; text-align: center;">
              <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #92400E; margin-bottom: 4px;">
                Irrigation Time Window
              </div>
              <div style="font-size: 22px; font-weight: 800; color: #78350F; letter-spacing: -0.5px;">
                ${sch.start_time} → ${sch.stop_time} <span style="font-size: 13px; font-weight: 600;">IST</span>
              </div>
              <div style="font-size: 12px; color: #B45309; margin-top: 2px;">
                Duration: ${sch.duration_mins || 90} Minutes
              </div>
            </div>

            <!-- Metadata Details -->
            <div class="pump-telemetry-row" style="grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 16px; background: var(--bg-card-subtle); padding: 10px;">
              <div class="telemetry-item">
                Repeat Frequency
                <strong>${days}</strong>
              </div>
              <div class="telemetry-item">
                Cutoff Moisture
                <strong>&gt; ${sch.soil_moisture_threshold || 65}%</strong>
              </div>
            </div>

            ${sch.weather_guard ? `
              <div style="font-size: 12px; color: var(--primary); display: flex; align-items: center; gap: 6px; margin-bottom: 16px;">
                <span>🌧️ Rain Forecast Protection Enabled</span>
              </div>
            ` : ''}

            <!-- Footer Actions -->
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border); padding-top: 12px;">
              <span style="font-size: 12px; color: var(--text-muted);">Sync: MQTT Active</span>

              <button 
                type="button" 
                class="btn-delete-schedule" 
                data-sch-id="${sch.id}"
                data-pump-id="${sch.pump_id}"
                style="background: transparent; color: var(--danger); border: 1px solid #FECACA; padding: 6px 12px; border-radius: var(--radius-sm); font-size: 12px; font-weight: 600;"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        `;
      }).join('');

      // Delete Schedule Handlers
      container.querySelectorAll('.btn-delete-schedule').forEach(btn => {
        btn.addEventListener('click', async () => {
          const schId = btn.getAttribute('data-sch-id');
          const pumpId = btn.getAttribute('data-pump-id');
          if (confirm('Are you sure you want to remove this automated irrigation schedule?')) {
            try {
              await API.pumps.deleteSchedule(pumpId, schId);
              window.showToast('Schedule deleted successfully.', 'info');
              await this.loadSchedules();
            } catch (err) {
              window.showToast(`Error: ${err.message}`, 'error');
            }
          }
        });
      });

    } catch (e) {
      console.error(e);
    }
  },

  bindModals() {
    const openBtn = document.getElementById('btn-open-add-schedule');
    const closeBtn = document.getElementById('btn-close-add-schedule');
    const modal = document.getElementById('modal-add-schedule');
    const form = document.getElementById('form-add-schedule');

    if (openBtn && modal) {
      openBtn.addEventListener('click', () => { modal.style.display = 'flex'; });
    }
    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });
    }

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const pumpId = document.getElementById('sch-pump-id').value;
        const startTime = document.getElementById('sch-start-time').value;
        const stopTime = document.getElementById('sch-stop-time').value;
        const cutoff = document.getElementById('sch-moisture-cutoff').value;
        const weatherGuard = document.getElementById('sch-weather-guard').checked;

        const selectedDays = Array.from(document.querySelectorAll('input[name="sch-day"]:checked')).map(cb => cb.value);

        try {
          await API.pumps.createSchedule(pumpId, {
            start_time: startTime,
            stop_time: stopTime,
            repeat_days: selectedDays.length ? selectedDays : ['Daily'],
            soil_moisture_threshold: parseInt(cutoff) || 65,
            weather_guard: weatherGuard
          });
          window.showToast('Irrigation schedule created and deployed via MQTT!', 'success');
          modal.style.display = 'none';
          form.reset();
          await this.loadSchedules();
        } catch (err) {
          window.showToast(`Error: ${err.message}`, 'error');
        }
      });
    }
  },

  unmount() {}
};

window.SchedulesView = SchedulesView;

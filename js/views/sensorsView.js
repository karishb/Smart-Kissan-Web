/**
 * SmartKisan Web Platform - Sensors View
 * IoT Soil Probes, Depth Telemetry & Micro-Climate Hardware Telemetry
 */

const SensorsView = {
  render() {
    return `
      <div class="page-container">
        <!-- View Header -->
        <div class="dashboard-header">
          <div>
            <h1 class="welcome-title">
              <span>📡 IoT Hardware Probes & Telemetry</span>
            </h1>
            <p class="welcome-subtitle">
              Dual-depth soil moisture sensors, root-zone temperature, NPK macronutrients, and aquifer depth
            </p>
          </div>

          <div class="header-actions">
            <button type="button" class="btn-refresh" id="btn-sync-sensors">
              <span>🔄</span>
              <span>Sync Sensor Nodes</span>
            </button>
          </div>
        </div>

        <!-- Sensor Health Stat Cards -->
        <div class="kpi-grid" style="margin-bottom: 24px;">
          <div class="kpi-card">
            <div class="kpi-icon-box green"><span>📶</span></div>
            <div class="kpi-info">
              <div class="kpi-label">Connected Hardware Nodes</div>
              <div class="kpi-value">4 / 4 Online</div>
              <div class="kpi-subtext highlight-green">LoRa & Cellular Gateway Active</div>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-icon-box blue"><span>💧</span></div>
            <div class="kpi-info">
              <div class="kpi-label">Average 15cm Moisture</div>
              <div class="kpi-value">60.6%</div>
              <div class="kpi-subtext">Active crop root zone</div>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-icon-box amber"><span>🌡️</span></div>
            <div class="kpi-info">
              <div class="kpi-label">Average Soil Temp</div>
              <div class="kpi-value">22.8°C</div>
              <div class="kpi-subtext">Optimal microbial activity</div>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-icon-box earth"><span>🔋</span></div>
            <div class="kpi-info">
              <div class="kpi-label">Solar Battery Average</div>
              <div class="kpi-value">91%</div>
              <div class="kpi-subtext">Photovoltaic power health</div>
            </div>
          </div>
        </div>

        <!-- Sensor Nodes Grid -->
        <div class="panel-header" style="margin-bottom: 16px;">
          <h2 style="font-size: 18px; font-weight: 700;">Live Sensor Probes</h2>
          <span class="panel-action">Updating every 60s via MQTT</span>
        </div>

        <div class="pumps-grid" id="sensors-cards-grid" style="grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));">
          <!-- Rendered by mount -->
        </div>
      </div>
    `;
  },

  async mount() {
    await this.loadSensors();

    const syncBtn = document.getElementById('btn-sync-sensors');
    if (syncBtn) {
      syncBtn.addEventListener('click', async () => {
        syncBtn.disabled = true;
        await this.loadSensors();
        syncBtn.disabled = false;
        window.showToast('Sensor nodes and soil moisture probes updated.', 'success');
      });
    }
  },

  async loadSensors() {
    const container = document.getElementById('sensors-cards-grid');
    if (!container) return;

    try {
      const res = await API.sensors.getAll();
      const sensors = res.sensors || [];

      container.innerHTML = sensors.map(node => {
        const hasDepth = node.depth_15cm != null;
        const isOptimal = (node.depth_15cm || 60) >= 55;

        return `
          <div class="dash-panel" style="margin-bottom: 0; background: #FFFFFF; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); border: 1px solid var(--border); padding: 22px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px;">
              <div>
                <h3 style="font-size: 16px; font-weight: 700; color: var(--text-main);">${node.name}</h3>
                <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">📍 ${node.field}</div>
              </div>
              <div style="display: flex; align-items: center; gap: 6px;">
                <span class="status-dot active"></span>
                <span style="font-size: 11px; font-weight: 700; color: var(--success); text-transform: uppercase;">ONLINE</span>
              </div>
            </div>

            <!-- Signal & Battery Bar -->
            <div style="display: flex; justify-content: space-between; background: var(--bg-card-subtle); padding: 6px 12px; border-radius: var(--radius-sm); font-size: 12px; margin-bottom: 14px;">
              <span>🔋 Battery: <strong>${node.battery}%</strong></span>
              <span>📶 Signal: <strong>${node.signal_dbm} dBm</strong></span>
              <span>⏱️ Sync: <strong>${node.last_sync}</strong></span>
            </div>

            ${hasDepth ? `
              <!-- Moisture Telemetry 15cm & 30cm -->
              <div style="margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
                  <span>Surface Root Zone (15 cm):</span>
                  <strong style="color: ${isOptimal ? 'var(--primary)' : 'var(--warning)'};">${node.depth_15cm}% Moisture</strong>
                </div>
                <div class="progress-bar-bg" style="height: 8px;">
                  <div class="progress-bar-fill ${isOptimal ? 'optimal' : 'low'}" style="width: ${node.depth_15cm}%;"></div>
                </div>
              </div>

              <div style="margin-bottom: 14px;">
                <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
                  <span>Sub-Surface Layer (30 cm):</span>
                  <strong>${node.depth_30cm}% Moisture</strong>
                </div>
                <div class="progress-bar-bg" style="height: 8px;">
                  <div class="progress-bar-fill optimal" style="width: ${node.depth_30cm}%;"></div>
                </div>
              </div>

              <!-- Thermal & NPK Matrix -->
              <div class="pump-telemetry-row" style="grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 8px; background: var(--bg-card-subtle); padding: 8px;">
                <div class="telemetry-item">
                  Soil Temp
                  <strong>${node.soil_temp}°C</strong>
                </div>
                <div class="telemetry-item">
                  Ambient
                  <strong>${node.ambient_temp || 28}°C</strong>
                </div>
                <div class="telemetry-item">
                  Humidity
                  <strong>${node.humidity || 50}%</strong>
                </div>
              </div>

              <div style="font-size: 11px; color: var(--text-muted); margin-top: 8px; background: #F8FAFC; padding: 6px 10px; border-radius: var(--radius-sm);">
                NPK Fertility: <strong>N: ${node.npk?.n || 120}</strong> • <strong>P: ${node.npk?.p || 25}</strong> • <strong>K: ${node.npk?.k || 160} kg/ha</strong>
              </div>
            ` : `
              <!-- Aquifer Telemetry -->
              <div style="background: var(--info-bg); border: 1px solid #BFDBFE; border-radius: var(--radius-md); padding: 16px; text-align: center; margin-bottom: 12px;">
                <div style="font-size: 11px; font-weight: 700; color: #1E40AF; text-transform: uppercase;">Water Table Depth</div>
                <div style="font-size: 26px; font-weight: 800; color: #1E3A8A; margin: 4px 0;">${node.water_table_ft} <span style="font-size: 14px;">Feet</span></div>
                <div style="font-size: 12px; color: #3B82F6;">Sustainable Aquifer Zone</div>
              </div>
              <div class="telemetry-item" style="text-align: center;">
                Borewell Discharge: <strong>${node.flow_sensor_rate} L/min</strong>
              </div>
            `}
          </div>
        `;
      }).join('');

    } catch (e) {
      console.error(e);
    }
  },

  unmount() {}
};

window.SensorsView = SensorsView;

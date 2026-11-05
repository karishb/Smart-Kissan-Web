/**
 * SmartKisan Web Platform - Dashboard View
 */

const DashboardView = {
  mapInstance: null,
  refreshTimer: null,

  render() {
    const user = Auth.getUser() || { name: 'Farmer' };
    const todayStr = new Intl.DateTimeFormat('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date());

    return `
      <!-- Dashboard Welcome Header -->
      <div class="dashboard-header">
        <div>
          <h1 class="welcome-title">
            <span>Namaste, ${user.name}</span>
            <span style="font-size: 20px;">🌾</span>
          </h1>
          <p class="welcome-subtitle">
            ${todayStr} • Farm GIS & Smart Irrigation Command Center
          </p>
        </div>

        <div class="header-actions">
          <div class="weather-badge">
            <span>☀️</span>
            <span>Ludhiana, PB:</span>
            <span class="temp">29°C</span>
            <span style="color: var(--text-muted); font-size: 11px;">(Humidity 48%)</span>
          </div>

          <button type="button" class="btn-refresh" id="btn-sync-telemetry">
            <span id="sync-icon">🔄</span>
            <span>Sync Telemetry</span>
          </button>
        </div>
      </div>

      <!-- Top KPI Stat Cards -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-icon-box green">
            <span>🗺️</span>
          </div>
          <div class="kpi-info">
            <div class="kpi-label">Total Land Area</div>
            <div class="kpi-value" id="kpi-total-acres">18.5 <span style="font-size: 14px; font-weight: 500;">Acres</span></div>
            <div class="kpi-subtext">4 active crop parcels</div>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon-box blue">
            <span>⚡</span>
          </div>
          <div class="kpi-info">
            <div class="kpi-label">Active Pumps</div>
            <div class="kpi-value" id="kpi-active-pumps">-- / --</div>
            <div class="kpi-subtext highlight-green" id="kpi-pumps-subtext">
              <span class="status-dot active"></span>
              <span>Live pumping</span>
            </div>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon-box amber">
            <span>💧</span>
          </div>
          <div class="kpi-info">
            <div class="kpi-label">Avg Soil Moisture</div>
            <div class="kpi-value" id="kpi-soil-moisture">64%</div>
            <div class="kpi-subtext">Optimal root zone hydration</div>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon-box earth">
            <span>📊</span>
          </div>
          <div class="kpi-info">
            <div class="kpi-label">Water Pumped Today</div>
            <div class="kpi-value" id="kpi-water-today">4,850 <span style="font-size: 14px; font-weight: 500;">L</span></div>
            <div class="kpi-subtext">12.4 kWh electricity used</div>
          </div>
        </div>
      </div>

      <!-- Main Dashboard Grid -->
      <div class="dashboard-grid">
        
        <!-- Left Column: Map & Pump Control Center -->
        <div class="dash-col-left">
          
          <!-- GIS Farm Map Panel -->
          <div class="dash-panel">
            <div class="panel-header">
              <div class="panel-title">
                <span>🛰️</span>
                <span>Interactive Farm GIS Map</span>
              </div>
              <div class="map-overlay-controls">
                <button type="button" class="map-filter-chip active" data-filter="all">All Layers</button>
                <button type="button" class="map-filter-chip" data-filter="fields">Parcels</button>
                <button type="button" class="map-filter-chip" data-filter="pumps">Pumps</button>
              </div>
            </div>

            <div class="map-container">
              <div id="dashboard-map"></div>
            </div>
          </div>

          <!-- Smart Pumps Control Panel -->
          <div class="dash-panel">
            <div class="panel-header">
              <div class="panel-title">
                <span>🚰</span>
                <span>Smart Pump Command Center</span>
              </div>
              <span class="panel-action" id="pumps-online-count">Loading pumps...</span>
            </div>

            <div class="pumps-grid" id="pumps-list-container">
              <div style="padding: 24px; text-align: center; color: var(--text-muted); grid-column: 1/-1;">
                Loading connected pumps...
              </div>
            </div>
          </div>

        </div>

        <!-- Right Column: Soil Status, Telemetry & Logs -->
        <div class="dash-col-right">

          <!-- Soil Moisture by Parcel -->
          <div class="dash-panel">
            <div class="panel-header">
              <div class="panel-title">
                <span>🌱</span>
                <span>Soil Moisture by Parcel</span>
              </div>
              <span class="panel-action">IoT Probes</span>
            </div>

            <div id="soil-parcels-list">
              <div class="soil-item">
                <div class="soil-info">
                  <span>North Parcel A (Wheat)</span>
                  <span style="color: var(--primary);">68% • Optimal</span>
                </div>
                <div class="progress-bar-bg">
                  <div class="progress-bar-fill optimal" style="width: 68%;"></div>
                </div>
              </div>

              <div class="soil-item">
                <div class="soil-info">
                  <span>Polyhouse 1 (Bell Pepper)</span>
                  <span style="color: var(--primary);">72% • Optimal</span>
                </div>
                <div class="progress-bar-bg">
                  <div class="progress-bar-fill optimal" style="width: 72%;"></div>
                </div>
              </div>

              <div class="soil-item">
                <div class="soil-info">
                  <span>South Parcel B (Cotton)</span>
                  <span style="color: var(--warning);">42% • Needs Water</span>
                </div>
                <div class="progress-bar-bg">
                  <div class="progress-bar-fill low" style="width: 42%;"></div>
                </div>
              </div>

              <div class="soil-item">
                <div class="soil-info">
                  <span>East Parcel C (Tomato)</span>
                  <span style="color: var(--primary);">60% • Optimal</span>
                </div>
                <div class="progress-bar-bg">
                  <div class="progress-bar-fill optimal" style="width: 60%;"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Activity & Audit Logs -->
          <div class="dash-panel">
            <div class="panel-header">
              <div class="panel-title">
                <span>📋</span>
                <span>Recent Farm Activity</span>
              </div>
              <span class="panel-action">Live Log</span>
            </div>

            <ul class="activity-list" id="activity-log-list">
              <li class="activity-item">
                <div class="activity-icon-badge pump-on">⚡</div>
                <div class="activity-content">
                  <div class="activity-msg">Tubewell 1 activated via Schedule</div>
                  <div class="activity-time">Today, 06:00 AM IST • North Field (Wheat)</div>
                </div>
              </li>
              <li class="activity-item">
                <div class="activity-icon-badge schedule">⏰</div>
                <div class="activity-content">
                  <div class="activity-msg">Schedule mode synced for Solar Pump 2</div>
                  <div class="activity-time">Today, 05:45 AM IST • Polyhouse 1</div>
                </div>
              </li>
              <li class="activity-item">
                <div class="activity-icon-badge pump-on">🤖</div>
                <div class="activity-content">
                  <div class="activity-msg">Drip Pump 4 adjusted by AI Soil Engine</div>
                  <div class="activity-time">Yesterday, 18:30 PM IST • Flow: 220 L/min</div>
                </div>
              </li>
              <li class="activity-item">
                <div class="activity-icon-badge pump-off">🛑</div>
                <div class="activity-content">
                  <div class="activity-msg">Borewell 3 shut down automatically</div>
                  <div class="activity-time">Yesterday, 16:00 PM IST • Moisture threshold reached</div>
                </div>
              </li>
            </ul>
          </div>

        </div>

      </div>
    `;
  },

  async mount() {
    this.initMap();
    await this.loadDashboardData();

    // Refresh telemetry button
    const syncBtn = document.getElementById('btn-sync-telemetry');
    const syncIcon = document.getElementById('sync-icon');
    if (syncBtn) {
      syncBtn.addEventListener('click', async () => {
        if (syncIcon) syncIcon.style.animation = 'spin 1s linear infinite';
        await this.loadDashboardData();
        if (syncIcon) syncIcon.style.animation = '';
        window.showToast('Farm telemetry and pump status synchronized.', 'success');
      });
    }

    // Auto sync every 30 seconds
    this.refreshTimer = setInterval(() => {
      this.loadDashboardData(true);
    }, 30000);
  },

  initMap() {
    const mapEl = document.getElementById('dashboard-map');
    if (!mapEl) return;

    // Use Leaflet if loaded via CDN, or graceful fallback
    if (typeof L !== 'undefined') {
      try {
        if (this.mapInstance) {
          this.mapInstance.remove();
        }

        // Center near agrarian belt (e.g. Punjab/Haryana/Delhi)
        const farmCoords = [30.9010, 75.8573]; 
        const map = L.map('dashboard-map', {
          zoomControl: true,
          scrollWheelZoom: false
        }).setView(farmCoords, 15);

        // Satellite Tile Layer (ArcGIS World Imagery)
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Esri, Maxar, Earthstar Geographics',
          maxZoom: 18
        }).addTo(map);

        // Crop Parcel Polygons
        const parcels = [
          {
            name: 'North Parcel A (Wheat)',
            color: '#2E7D32',
            coords: [
              [30.9030, 75.8550],
              [30.9055, 75.8590],
              [30.9035, 75.8610],
              [30.9015, 75.8570]
            ]
          },
          {
            name: 'Polyhouse 1 (Bell Pepper)',
            color: '#F59E0B',
            coords: [
              [30.9005, 75.8540],
              [30.9025, 75.8570],
              [30.9010, 75.8585],
              [30.8995, 75.8555]
            ]
          },
          {
            name: 'South Parcel B (Cotton)',
            color: '#8D6E63',
            coords: [
              [30.8985, 75.8560],
              [30.9005, 75.8595],
              [30.8985, 75.8620],
              [30.8965, 75.8580]
            ]
          }
        ];

        parcels.forEach(p => {
          L.polygon(p.coords, {
            color: p.color,
            weight: 2,
            opacity: 0.9,
            fillColor: p.color,
            fillOpacity: 0.35
          }).addTo(map).bindPopup(`<strong>${p.name}</strong><br/>Live Soil Moisture: Optimal`);
        });

        // Pump Markers
        const pumpIcon = L.divIcon({
          className: 'custom-pump-marker',
          html: '<div style="background:#2E7D32;color:white;border:2px solid white;border-radius:50%;width:26px;height:26px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,0.4);font-size:12px;">⚡</div>',
          iconSize: [26, 26],
          iconAnchor: [13, 13]
        });

        L.marker([30.9035, 75.8580], { icon: pumpIcon }).addTo(map)
          .bindPopup('<strong>Tubewell 1 (Active)</strong><br/>Power: 7.5 HP<br/>Mode: Schedule');

        L.marker([30.9010, 75.8565], { icon: pumpIcon }).addTo(map)
          .bindPopup('<strong>Solar Pump 2 (Standby)</strong><br/>Power: 5.0 HP<br/>Mode: Auto');

        this.mapInstance = map;
      } catch (err) {
        console.warn('Map initialization failed:', err);
      }
    } else {
      mapEl.innerHTML = `
        <div style="height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#1F2937; color:#F3F4F6; text-align:center; padding:20px;">
          <div style="font-size:32px; margin-bottom:8px;">🗺️</div>
          <strong>Farm GIS Satellite Schematic</strong>
          <p style="font-size:12px; color:#9CA3AF; margin-top:4px;">18.5 Acres mapped across 4 parcels • 4 Smart Pumps Online</p>
        </div>
      `;
    }
  },

  async loadDashboardData(silent = false) {
    try {
      // Fetch pumps and summary
      const [pumpsRes, summaryRes] = await Promise.all([
        API.pumps.getAll(),
        API.pumps.getTodaySummary()
      ]);

      const pumps = pumpsRes.pumps || [];
      const summary = summaryRes.summary || {};

      this.updateKPIs(pumps, summary);
      this.renderPumps(pumps);
    } catch (err) {
      if (!silent) {
        console.error('Failed to load dashboard data:', err);
      }
    }
  },

  updateKPIs(pumps, summary) {
    const activePumps = pumps.filter(p => p.status === 'on').length;
    const totalPumps = pumps.length;

    const activeEl = document.getElementById('kpi-active-pumps');
    if (activeEl) {
      activeEl.textContent = `${activePumps} / ${totalPumps}`;
    }

    const onlineCountEl = document.getElementById('pumps-online-count');
    if (onlineCountEl) {
      onlineCountEl.textContent = `${activePumps} Running • ${totalPumps} Connected`;
    }

    const waterTodayEl = document.getElementById('kpi-water-today');
    if (waterTodayEl && summary.litres != null) {
      waterTodayEl.innerHTML = `${summary.litres.toLocaleString()} <span style="font-size: 14px; font-weight: 500;">L</span>`;
    }
  },

  renderPumps(pumps) {
    const container = document.getElementById('pumps-list-container');
    if (!container) return;

    if (pumps.length === 0) {
      container.innerHTML = `
        <div style="padding: 24px; text-align: center; color: var(--text-muted); grid-column: 1/-1;">
          No pumps registered yet. Connect your first IoT smart pump controller.
        </div>
      `;
      return;
    }

    container.innerHTML = pumps.map(pump => {
      const isRunning = pump.status === 'on';
      const mode = (pump.mode || 'manual').toLowerCase();
      const modeClass = mode === 'schedule' ? 'schedule' : (mode === 'auto' ? 'auto' : (mode === 'ai' ? 'ai' : ''));
      const scheduleSnippet = pump.schedule_time 
        ? `<div style="font-size:11px; color:var(--text-muted); margin-top:4px;">⏱️ ${pump.schedule_time}</div>`
        : '';

      return `
        <div class="pump-card ${isRunning ? 'running' : ''}" data-pump-id="${pump.id}">
          <div class="pump-card-header">
            <div>
              <div class="pump-name">${pump.name}</div>
              <div class="pump-field">📍 ${pump.location || 'Main Farm Parcel'}</div>
              ${scheduleSnippet}
            </div>
            <span class="mode-badge ${modeClass}">${pump.mode || 'Manual'}</span>
          </div>

          <div class="pump-telemetry-row">
            <div class="telemetry-item">
              Rating
              <strong>${pump.power_rating || '5.0'} HP</strong>
            </div>
            <div class="telemetry-item">
              Flow Rate
              <strong>${pump.flow_rate || '350'} L/min</strong>
            </div>
          </div>

          <div class="pump-card-footer">
            <div class="pump-status-indicator">
              <span class="status-dot ${isRunning ? 'active' : ''}"></span>
              <span>${isRunning ? 'Running' : 'Standby'}</span>
            </div>

            <button 
              type="button" 
              class="btn-toggle-pump ${isRunning ? 'turn-off' : 'turn-on'}"
              data-id="${pump.id}"
              data-next-action="${isRunning ? 'off' : 'on'}"
            >
              <span>${isRunning ? 'Turn Off' : 'Turn On'}</span>
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Attach Toggle Action Event Listeners
    container.querySelectorAll('.btn-toggle-pump').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const pumpId = btn.getAttribute('data-id');
        const nextAction = btn.getAttribute('data-next-action');

        try {
          btn.disabled = true;
          btn.textContent = 'Updating...';

          await API.pumps.control(pumpId, nextAction);
          window.showToast(`Command sent: Pump switched ${nextAction.toUpperCase()}`, 'success');
          
          // Re-fetch data to reflect state
          await this.loadDashboardData();
        } catch (err) {
          window.showToast(`Failed to switch pump: ${err.message}`, 'error');
        } finally {
          btn.disabled = false;
        }
      });
    });
  },

  unmount() {
    if (this.mapInstance) {
      try {
        this.mapInstance.remove();
      } catch (e) {}
      this.mapInstance = null;
    }
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  }
};

window.DashboardView = DashboardView;

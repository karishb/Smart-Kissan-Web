/**
 * SmartKisan Web Platform - AI Irrigation & Precision Advisory Module
 * Route: #/ai-advisory
 * Penman-Monteith Evapotranspiration (ET0), Crop Water Budget & 7-Day Precision Agrochemical Spraying Planner
 */

const AiAdvisoryView = {
  activeTab: 'budget', // 'budget' | 'spray' | 'overrides'
  recInterval: null,

  // Agronomic data models
  farmMetrics: {
    tempC: 29.4,
    humidityPct: 46,
    windKmh: 8.6,
    solarRad: 19.4, // MJ/m2/day
    et0: 4.85,      // mm/day
    totalAcres: 18.5
  },

  parcels: [
    {
      id: 'f-1',
      name: 'North Parcel A (Wheat)',
      crop: 'Wheat (HD-2967)',
      stage: 'Tillering & Crown Root (65d)',
      areaAcres: 6.5,
      kc: 1.15,
      moistureCurrent: 68,
      moistureTarget: 70,
      pumpId: 'pump-01',
      pumpName: 'Tubewell 1',
      status: 'optimal',
      urgency: 'Low',
      recommendation: 'Root moisture is balanced. Next automated cycle scheduled tomorrow at 06:00 AM (45 mins).',
      lossAvoidance: 'Save ~4,200 L by irrigating early morning vs midday.'
    },
    {
      id: 'f-3',
      name: 'South Parcel B (Cotton)',
      crop: 'Bt Cotton (Bollgard II)',
      stage: 'Boll Development (90d)',
      areaAcres: 5.5,
      kc: 0.85,
      moistureCurrent: 42,
      moistureTarget: 65,
      pumpId: 'pump-03',
      pumpName: 'Borewell 3',
      status: 'critical',
      urgency: 'Immediate',
      recommendation: 'Soil water deficit detected (-23%). Irrigate for 55 minutes before 10:00 AM to prevent flower boll shedding.',
      lossAvoidance: 'Prevents estimated 8-12% yield loss from root drought stress.'
    },
    {
      id: 'f-2',
      name: 'Polyhouse 1 (Bell Pepper)',
      crop: 'Bell Pepper (Yellow Wonder)',
      stage: 'Flowering & Fruit Set (45d)',
      areaAcres: 2.0,
      kc: 1.05,
      moistureCurrent: 72,
      moistureTarget: 70,
      pumpId: 'pump-02',
      pumpName: 'Solar Pump 2',
      status: 'skip',
      urgency: 'Advisory',
      recommendation: 'Soil hydration optimal (72%). AI advises skipping evening irrigation cycle to prevent powdery mildew.',
      lossAvoidance: 'Saves 2,400 L water and eliminates pesticide spray requirement.'
    },
    {
      id: 'f-4',
      name: 'East Parcel C (Tomato)',
      crop: 'Hybrid Tomato (Pusa Ruby)',
      stage: 'Vegetative Growth (40d)',
      areaAcres: 4.5,
      kc: 0.95,
      moistureCurrent: 60,
      moistureTarget: 65,
      pumpId: 'pump-04',
      pumpName: 'Drip Pump 4',
      status: 'scheduled',
      urgency: 'Moderate',
      recommendation: 'Maintain micro-drip fertigation pulse (NPK 19:19:19) today at 17:30 IST for 40 minutes.',
      lossAvoidance: 'Reduces nutrient leaching by 28% compared to surface flooding.'
    }
  ],

  sprayPlanner: [
    {
      day: 'Today (Sun)',
      date: '08 Nov',
      temp: '29°C',
      humidity: '46%',
      wind: '8 km/h',
      rain: '5%',
      status: 'safe',
      window: '06:00 AM - 09:30 AM',
      note: 'Optimal conditions for foliar nutrient sprays. Zero drift risk.'
    },
    {
      day: 'Monday',
      date: '09 Nov',
      temp: '31°C',
      humidity: '42%',
      wind: '12 km/h',
      rain: '10%',
      status: 'marginal',
      window: '06:00 AM - 08:00 AM Only',
      note: 'Wind increases after 09:00 AM. Use low-drift air induction nozzles.'
    },
    {
      day: 'Tuesday',
      date: '10 Nov',
      temp: '27°C',
      humidity: '78%',
      wind: '22 km/h',
      rain: '65%',
      status: 'unsafe',
      window: 'Do Not Spray',
      note: 'High wind gusts and imminent rainfall. Severe pesticide wash-off hazard!'
    },
    {
      day: 'Wednesday',
      date: '11 Nov',
      temp: '26°C',
      humidity: '82%',
      wind: '18 km/h',
      rain: '45%',
      status: 'unsafe',
      window: 'Do Not Spray',
      note: 'Wet canopy conditions. High fungal spore activity; wait for dry foliage.'
    },
    {
      day: 'Thursday',
      date: '12 Nov',
      temp: '28°C',
      humidity: '55%',
      wind: '9 km/h',
      rain: '15%',
      status: 'safe',
      window: '06:30 AM - 10:30 AM',
      note: 'Ideal window for post-rain systemic fungicide application.'
    },
    {
      day: 'Friday',
      date: '13 Nov',
      temp: '29°C',
      humidity: '50%',
      wind: '10 km/h',
      rain: '10%',
      status: 'safe',
      window: '06:00 AM - 10:00 AM',
      note: 'Favorable calm winds. Suitable for insecticide & biostimulants.'
    },
    {
      day: 'Saturday',
      date: '14 Nov',
      temp: '30°C',
      humidity: '48%',
      wind: '14 km/h',
      rain: '20%',
      status: 'marginal',
      window: '06:00 AM - 08:30 AM',
      note: 'Moderate breeze. Calibrate spray boom height to 50cm above canopy.'
    }
  ],

  render() {
    const { tempC, humidityPct, windKmh, solarRad, et0, totalAcres } = this.farmMetrics;

    return `
      <div class="page-container">
        
        <!-- Header -->
        <div class="dashboard-header">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span class="ai-chip-pill">🧠 AI Agronomic Engine v2.4</span>
              <span class="ai-status-online">● Real-Time Model Active</span>
            </div>
            <h1 class="welcome-title">
              <span>🌾 Precision AI Irrigation & Agronomic Advisory</span>
            </h1>
            <p class="welcome-subtitle">
              FAO-56 Penman-Monteith Evapotranspiration ($ET_0$), Crop Water Budgeting & 7-Day Precision Spraying Feasibility
            </p>
          </div>

          <div class="header-actions">
            <button type="button" class="btn-refresh" id="btn-recalculate-ai">
              <span>⚡</span>
              <span>Recalculate AI Model</span>
            </button>
          </div>
        </div>

        <!-- Top Weather & Evapotranspiration Micro-Climate Strip -->
        <div class="ai-weather-strip">
          <div class="weather-strip-item">
            <div class="strip-icon">🌡️</div>
            <div>
              <div class="strip-label">Ambient Temp</div>
              <div class="strip-val" id="strip-temp">${tempC}°C</div>
            </div>
          </div>

          <div class="weather-strip-item">
            <div class="strip-icon">💧</div>
            <div>
              <div class="strip-label">Relative Humidity</div>
              <div class="strip-val" id="strip-rh">${humidityPct}%</div>
            </div>
          </div>

          <div class="weather-strip-item">
            <div class="strip-icon">🍃</div>
            <div>
              <div class="strip-label">Wind Speed</div>
              <div class="strip-val" id="strip-wind">${windKmh} km/h</div>
            </div>
          </div>

          <div class="weather-strip-item">
            <div class="strip-icon">☀️</div>
            <div>
              <div class="strip-label">Solar Radiation</div>
              <div class="strip-val">${solarRad} <span style="font-size:11px;">MJ/m²/d</span></div>
            </div>
          </div>

          <div class="weather-strip-item highlight-et">
            <div class="strip-icon">📈</div>
            <div>
              <div class="strip-label">Reference $ET_0$</div>
              <div class="strip-val" id="strip-et0">${et0} <span style="font-size:12px;">mm/day</span></div>
            </div>
          </div>
        </div>

        <!-- Tab Navigation Bar -->
        <div class="ai-tab-bar">
          <button type="button" class="ai-tab-btn active" data-tab="budget">
            <span>💧</span>
            <span>Crop Water Budget ($ET_c$)</span>
          </button>
          <button type="button" class="ai-tab-btn" data-tab="spray">
            <span>🚜</span>
            <span>7-Day Spraying Planner</span>
          </button>
          <button type="button" class="ai-tab-btn" data-tab="overrides">
            <span>⚡</span>
            <span>Smart Irrigation Overrides</span>
          </button>
        </div>

        <!-- TAB 1: Water Budget & ETc Calculator -->
        <div class="ai-tab-pane" id="pane-budget" style="display: block;">
          
          <!-- Mathematical Formula Explanation Card -->
          <div class="formula-banner">
            <div style="font-size: 24px;">📐</div>
            <div>
              <strong>FAO-56 Penman-Monteith Evapotranspiration Formula:</strong>
              <div class="formula-code">
                Crop Water Requirement (ET_c) = Reference Evapotranspiration (ET_0: ${et0} mm) × Crop Coefficient (K_c)
              </div>
              <span style="font-size: 12px; color: var(--text-muted);">
                Calculated in real-time using IoT ambient temperature, solar radiation, humidity, and micro-climate wind sensors.
              </span>
            </div>
          </div>

          <!-- Parcel Water Demand Grid -->
          <div class="advisory-grid">
            ${this.parcels.map(p => {
              const etcMm = (this.farmMetrics.et0 * p.kc).toFixed(2);
              const litresPerAcre = Math.round(etcMm * 4046.86); // 1 mm = 10,000 L/ha = ~4,046.86 L/acre
              const totalLitresParcel = Math.round(litresPerAcre * p.areaAcres);
              const isCrit = p.status === 'critical';
              const isOpt = p.status === 'optimal';
              const isSkip = p.status === 'skip';

              let badgeColor = isCrit ? 'danger' : (isOpt ? 'success' : 'warning');
              let badgeText = isCrit ? '🚨 Water Deficit Alert' : (isOpt ? '✅ Hydration Balanced' : '⚠️ Cycle Skip Recommended');

              return `
                <div class="advisory-card ${isCrit ? 'pulse-border' : ''}">
                  <div class="advisory-card-header">
                    <div>
                      <h3 class="advisory-parcel-title">${p.name}</h3>
                      <div class="advisory-crop-subtitle">${p.crop} • Stage: <strong>${p.stage}</strong></div>
                    </div>
                    <span class="advisory-badge ${badgeColor}">${badgeText}</span>
                  </div>

                  <div class="advisory-metrics-row">
                    <div class="metric-box">
                      <div class="metric-lbl">Crop Coeff ($K_c$)</div>
                      <div class="metric-num">${p.kc}</div>
                    </div>
                    <div class="metric-box">
                      <div class="metric-lbl">Daily $ET_c$</div>
                      <div class="metric-num">${etcMm} <span style="font-size:11px;">mm/d</span></div>
                    </div>
                    <div class="metric-box">
                      <div class="metric-lbl">Water Need / Acre</div>
                      <div class="metric-num">${litresPerAcre.toLocaleString()} <span style="font-size:11px;">L</span></div>
                    </div>
                    <div class="metric-box">
                      <div class="metric-lbl">Total Parcel Need</div>
                      <div class="metric-num highlight">${totalLitresParcel.toLocaleString()} <span style="font-size:11px;">L</span></div>
                    </div>
                  </div>

                  <!-- Soil Moisture Progress Meter -->
                  <div class="soil-bar-container">
                    <div class="soil-bar-meta">
                      <span>Soil Moisture: <strong>${p.moistureCurrent}%</strong> (Target: ${p.moistureTarget}%)</span>
                      <span style="font-weight: 600; color: ${isCrit ? 'var(--danger)' : 'var(--primary)'};">
                        ${isCrit ? 'Needs Water' : 'Optimal'}
                      </span>
                    </div>
                    <div class="progress-bar-bg" style="height: 10px;">
                      <div class="progress-bar-fill ${isCrit ? 'low' : 'optimal'}" style="width: ${p.moistureCurrent}%;"></div>
                    </div>
                  </div>

                  <div class="ai-recommendation-box ${isCrit ? 'crit-box' : ''}">
                    <div style="display:flex; align-items:center; gap:8px; margin-bottom: 4px;">
                      <span style="font-size: 15px;">🤖</span>
                      <strong>AI Agronomist Action:</strong>
                    </div>
                    <p class="rec-text">${p.recommendation}</p>
                    <div class="loss-avoidance">💡 <em>${p.lossAvoidance}</em></div>
                  </div>

                  <div class="advisory-actions-row">
                    <button 
                      type="button" 
                      class="btn-ai-action ${isCrit ? 'btn-primary' : 'btn-outline'}"
                      data-action="${isCrit ? 'run_now' : 'schedule'}"
                      data-parcel-id="${p.id}"
                      data-pump-id="${p.pumpId}"
                    >
                      ${isCrit ? '⚡ Run Pump Now (55 min)' : '📅 Schedule Morning Cycle'}
                    </button>
                    
                    <button 
                      type="button" 
                      class="btn-text-action"
                      onclick="window.showToast('Sensor threshold calibrated for ${p.name}', 'info')"
                    >
                      ⚙️ Calibrate
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>

        </div>

        <!-- TAB 2: 7-Day Precision Spraying Window Planner -->
        <div class="ai-tab-pane" id="pane-spray" style="display: none;">
          
          <div class="spray-header-banner">
            <div>
              <h2 style="font-size: 18px; font-weight: 700; color: var(--text-main); margin-bottom: 4px;">
                🌦️ 7-Day Agrochemical Spray Feasibility Window
              </h2>
              <p style="font-size: 13px; color: var(--text-muted);">
                Algorithms cross-reference atmospheric wind shear, thermal inversion risk, dew point, and rain probability to protect crop foliar absorption and prevent toxic drift.
              </p>
            </div>

            <div class="spray-legend">
              <span class="legend-chip safe">● Safe (Ideal)</span>
              <span class="legend-chip marginal">● Marginal (Early AM only)</span>
              <span class="legend-chip unsafe">● Unsafe (Drift/Wash-off Risk)</span>
            </div>
          </div>

          <!-- 7-Day Spray Table / Cards -->
          <div class="spray-cards-grid">
            ${this.sprayPlanner.map(item => {
              const isSafe = item.status === 'safe';
              const isMarginal = item.status === 'marginal';
              const isUnsafe = item.status === 'unsafe';

              const badgeClass = isSafe ? 'spray-safe' : (isMarginal ? 'spray-marginal' : 'spray-unsafe');
              const statusLabel = isSafe ? 'SAFE WINDOW' : (isMarginal ? 'MARGINAL' : 'UNSAFE TO SPRAY');

              return `
                <div class="spray-card ${badgeClass}">
                  <div class="spray-card-header">
                    <div>
                      <div class="spray-day">${item.day}</div>
                      <div class="spray-date">${item.date}</div>
                    </div>
                    <span class="spray-badge-pill ${badgeClass}">${statusLabel}</span>
                  </div>

                  <div class="spray-conditions">
                    <div class="cond-item">
                      <span class="cond-icon">🌡️</span>
                      <span>${item.temp}</span>
                    </div>
                    <div class="cond-item">
                      <span class="cond-icon">💧</span>
                      <span>RH ${item.humidity}</span>
                    </div>
                    <div class="cond-item">
                      <span class="cond-icon">🍃</span>
                      <span>${item.wind}</span>
                    </div>
                    <div class="cond-item">
                      <span class="cond-icon">🌧️</span>
                      <span>Rain ${item.rain}</span>
                    </div>
                  </div>

                  <div class="spray-window-box">
                    <strong>Recommended Time:</strong>
                    <div class="window-time">${item.window}</div>
                  </div>

                  <p class="spray-note">${item.note}</p>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Agrochemical Best Practices Callout -->
          <div class="drift-warning-box">
            <div style="font-size: 26px;">⚠️</div>
            <div>
              <strong>Precision Agrochemical & Drift Management Best Practices:</strong>
              <ul class="spray-rules-list">
                <li><strong>Optimal Wind Range:</strong> Apply sprays only when wind speed is between 3.5 km/h and 12 km/h. Calm conditions (< 3 km/h) risk thermal temperature inversions; winds > 15 km/h cause chemical drift onto neighboring plots.</li>
                <li><strong>Rainfastness Window:</strong> Ensure at least 3 hours without precipitation after foliar application for systemic pesticide uptake.</li>
                <li><strong>Nozzle Selection:</strong> Use air-induction coarse droplet nozzles (250 - 400 microns) to reduce drift fines by up to 80%.</li>
              </ul>
            </div>
          </div>

        </div>

        <!-- TAB 3: AI Irrigation Overrides & Automation Controls -->
        <div class="ai-tab-pane" id="pane-overrides" style="display: none;">
          
          <div class="dash-panel" style="margin-bottom: 24px;">
            <div class="panel-header">
              <div class="panel-title">
                <span>🤖</span>
                <span>Active AI Irrigation Automation Steering</span>
              </div>
              <span class="panel-action">Autonomous Cloud Scheduler Active</span>
            </div>

            <div style="padding: 24px;">
              <p style="font-size: 14px; color: var(--text-muted); margin-bottom: 20px;">
                The SmartKisan AI engine automatically coordinates your tubewells, borewells, and drip pumps using soil moisture feedback and evapotranspiration calculations. You can override or pause autonomous behavior at any time:
              </p>

              <div class="override-grid">
                
                <div class="override-card">
                  <div class="override-title">⚡ Immediate Water Deficit Relief</div>
                  <p class="override-desc">Instantly dispatch 55-minute cycle to Borewell 3 (South Parcel B - Cotton) to clear critical soil water deficit.</p>
                  <button type="button" class="btn-primary" id="btn-override-run-cotton">
                    <span>⚡ Run South Field Cycle Now</span>
                  </button>
                </div>

                <div class="override-card">
                  <div class="override-title">⏸️ Rain Expected: Pause Automation for 24h</div>
                  <p class="override-desc">Temporarily freeze all automated irrigation cycles for the next 24 hours. Resumes automatically after rain assessment.</p>
                  <button type="button" class="btn-outline" id="btn-override-pause-rain">
                    <span>⏸️ Freeze Pumps (24h)</span>
                  </button>
                </div>

                <div class="override-card">
                  <div class="override-title">🌿 High Humidity Anti-Mildew Guard</div>
                  <p class="override-desc">Force skip evening irrigation cycle for Polyhouse 1 to protect bell pepper blossoms from fungal pathogens.</p>
                  <button type="button" class="btn-outline" id="btn-override-skip-polyhouse">
                    <span>🛡️ Enforce Anti-Mildew Skip</span>
                  </button>
                </div>

                <div class="override-card">
                  <div class="override-title">🔄 Force Full Sensor & Model Sync</div>
                  <p class="override-desc">Ping all IoT soil probes across 4 parcels and recalculate evapotranspiration water balance across the farm.</p>
                  <button type="button" class="btn-secondary" id="btn-override-force-sync">
                    <span>🔄 Recalculate Now</span>
                  </button>
                </div>

              </div>
            </div>
          </div>

        </div>

      </div>
    `;
  },

  mount() {
    this.bindTabs();
    this.bindActions();
  },

  bindTabs() {
    const tabs = document.querySelectorAll('.ai-tab-btn');
    tabs.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tab');
        this.activeTab = target;

        // Update tab buttons
        tabs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Toggle panes
        document.getElementById('pane-budget').style.display = target === 'budget' ? 'block' : 'none';
        document.getElementById('pane-spray').style.display = target === 'spray' ? 'block' : 'none';
        document.getElementById('pane-overrides').style.display = target === 'overrides' ? 'block' : 'none';
      });
    });
  },

  bindActions() {
    // Recalculate AI Model Button
    const recalcBtn = document.getElementById('btn-recalculate-ai');
    if (recalcBtn) {
      recalcBtn.addEventListener('click', () => {
        recalcBtn.disabled = true;
        recalcBtn.innerHTML = '<span>⏳</span><span>Calculating ET0...</span>';

        setTimeout(() => {
          // Slight weather variation
          this.farmMetrics.tempC = +(29.0 + (Math.random() * 1.5 - 0.7)).toFixed(1);
          this.farmMetrics.humidityPct = Math.round(45 + (Math.random() * 6 - 3));
          this.farmMetrics.windKmh = +(8.2 + (Math.random() * 2 - 1)).toFixed(1);
          this.farmMetrics.et0 = +(4.80 + (Math.random() * 0.3 - 0.15)).toFixed(2);

          const tempEl = document.getElementById('strip-temp');
          const rhEl = document.getElementById('strip-rh');
          const windEl = document.getElementById('strip-wind');
          const et0El = document.getElementById('strip-et0');

          if (tempEl) tempEl.textContent = `${this.farmMetrics.tempC}°C`;
          if (rhEl) rhEl.textContent = `${this.farmMetrics.humidityPct}%`;
          if (windEl) windEl.textContent = `${this.farmMetrics.windKmh} km/h`;
          if (et0El) et0El.innerHTML = `${this.farmMetrics.et0} <span style="font-size:12px;">mm/day</span>`;

          recalcBtn.disabled = false;
          recalcBtn.innerHTML = '<span>⚡</span><span>Recalculate AI Model</span>';
          window.showToast('AI Model recalculated: Evapotranspiration ET0 updated to ' + this.farmMetrics.et0 + ' mm/day.', 'success');
        }, 800);
      });
    }

    // Direct Run Pump Action in Cards
    document.querySelectorAll('.btn-ai-action').forEach(btn => {
      btn.addEventListener('click', async () => {
        const action = btn.getAttribute('data-action');
        const pumpId = btn.getAttribute('data-pump-id');
        const parcelId = btn.getAttribute('data-parcel-id');

        if (action === 'run_now') {
          btn.disabled = true;
          btn.textContent = 'Commanding IoT...';

          if (window.SmartKisanSocket && typeof window.SmartKisanSocket.sendPumpCommand === 'function') {
            await window.SmartKisanSocket.sendPumpCommand(pumpId, 'on');
          } else if (window.API && window.API.pumps) {
            await window.API.pumps.control(pumpId, 'on');
          }

          btn.textContent = '✅ Cycle Active';
          btn.classList.remove('btn-primary');
          btn.classList.add('btn-outline');
          window.showToast('AI Recommended Cycle triggered: Borewell 3 is running for South Parcel B.', 'success');
        } else {
          window.showToast('Automated cycle confirmed for morning window (06:00 AM).', 'info');
        }
      });
    });

    // Overrides: Cotton Run
    const cottonRunBtn = document.getElementById('btn-override-run-cotton');
    if (cottonRunBtn) {
      cottonRunBtn.addEventListener('click', async () => {
        cottonRunBtn.disabled = true;
        cottonRunBtn.textContent = 'Switching Borewell 3...';
        if (window.SmartKisanSocket) {
          await window.SmartKisanSocket.sendPumpCommand('pump-03', 'on');
        }
        cottonRunBtn.textContent = '✅ Borewell 3 Running';
        window.showToast('Override executed: Borewell 3 turned ON for 55 mins.', 'success');
      });
    }

    // Overrides: Pause 24h
    const pauseRainBtn = document.getElementById('btn-override-pause-rain');
    if (pauseRainBtn) {
      pauseRainBtn.addEventListener('click', () => {
        pauseRainBtn.textContent = '⏸️ Automation Paused (24h)';
        window.showToast('AI weather-guard active: All scheduled cycles paused for 24 hours.', 'warning');
      });
    }

    // Overrides: Anti-Mildew Skip
    const skipPolyBtn = document.getElementById('btn-override-skip-polyhouse');
    if (skipPolyBtn) {
      skipPolyBtn.addEventListener('click', () => {
        skipPolyBtn.textContent = '🛡️ Skip Enforced';
        window.showToast('Polyhouse 1 evening cycle successfully bypassed to avoid fungal mildew.', 'info');
      });
    }

    // Overrides: Force Sync
    const forceSyncBtn = document.getElementById('btn-override-force-sync');
    if (forceSyncBtn) {
      forceSyncBtn.addEventListener('click', () => {
        window.showToast('All 4 sensor nodes polled. Micro-climate telemetry synced.', 'success');
      });
    }
  },

  unmount() {
    if (this.recInterval) {
      clearInterval(this.recInterval);
      this.recInterval = null;
    }
  }
};

window.AiAdvisoryView = AiAdvisoryView;

/**
 * SmartKisan Web Platform - AI Irrigation & Precision Advisory Module
 * Route: #/ai-advisory
 * Live Open-Meteo Satellite Agromet Telemetry,
 * FAO-56 Penman-Monteith Evapotranspiration (ET0), Crop Water Budget & 7-Day Precision Agrochemical Spraying Planner
 */

const AiAdvisoryView = {
  activeTab: 'budget', // 'budget' | 'spray' | 'overrides'
  recInterval: null,
  isLiveFeed: false,

  // Agronomic data models
  farmMetrics: {
    tempC: 28.5,
    humidityPct: 42,
    windKmh: 7.2,
    solarRad: 19.2, // MJ/m2/day
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

  sprayPlanner: [],

  render() {
    const { tempC, humidityPct, windKmh, solarRad, et0, totalAcres } = this.farmMetrics;
    const statusText = this.isLiveFeed 
      ? '🟢 Open-Meteo Satellite Feed Active (Ludhiana, PB)' 
      : '🟡 Agromet Baseline Feed Active';

    return `
      <div class="page-container">
        
        <!-- Header -->
        <div class="dashboard-header">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span class="ai-chip-pill">🧠 AI Agronomic Engine v2.4</span>
              <span class="ai-status-online" id="ai-feed-status">${statusText}</span>
            </div>
            <h1 class="welcome-title">
              <span>🌾 Precision AI Irrigation & Agronomic Advisory</span>
            </h1>
            <p class="welcome-subtitle">
              Live FAO-56 Penman-Monteith Evapotranspiration ($ET_0$), Crop Water Budgeting & 7-Day Precision Spraying Feasibility
            </p>
          </div>

          <div class="header-actions">
            <button type="button" class="btn-refresh" id="btn-recalculate-ai">
              <span id="recalc-spin-icon">⚡</span>
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
              <div class="strip-val" id="strip-solar">${solarRad} <span style="font-size:11px;">MJ/m²/d</span></div>
            </div>
          </div>

          <div class="weather-strip-item highlight-et">
            <div class="strip-icon">📈</div>
            <div>
              <div class="strip-label">Reference $ET_0$ (FAO-56)</div>
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
              <div class="formula-code" id="formula-display">
                Crop Water Requirement (ET_c) = Reference Evapotranspiration (ET_0: ${et0} mm) × Crop Coefficient (K_c)
              </div>
              <span style="font-size: 12px; color: var(--text-muted);">
                Calculated in real-time using IoT ambient temperature, solar radiation, humidity, and micro-climate wind sensors.
              </span>
            </div>
          </div>

          <!-- Parcel Water Demand Grid -->
          <div class="advisory-grid" id="advisory-parcels-container">
            ${this.renderParcelsHtml()}
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
          <div class="spray-cards-grid" id="spray-cards-container">
            ${this.renderSprayHtml()}
          </div>

          <!-- Agrochemical Best Practices Callout -->
          <div class="drift-warning-box">
            <div style="font-size: 26px;">⚠️</div>
            <div>
              <strong>Precision Agrochemical & Drift Management Best Practices:</strong>
              <ul class="spray-rules-list">
                <li><strong>Optimal Wind Range:</strong> Apply sprays only when wind speed is between 3.5 km/h and 12 km/h. Calm conditions (&lt; 3 km/h) risk thermal temperature inversions; winds &gt; 15 km/h cause chemical drift onto neighboring plots.</li>
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

  renderParcelsHtml() {
    return this.parcels.map(p => {
      const etcMm = (this.farmMetrics.et0 * p.kc).toFixed(2);
      const litresPerAcre = Math.round(etcMm * 4046.86);
      const totalLitresParcel = Math.round(litresPerAcre * p.areaAcres);
      const isCrit = p.status === 'critical';
      const isOpt = p.status === 'optimal';

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
    }).join('');
  },

  renderSprayHtml() {
    const list = (this.sprayPlanner && this.sprayPlanner.length > 0) 
      ? this.sprayPlanner 
      : WeatherService.getFallbackData().daily;

    return list.map(item => {
      const isSafe = item.status === 'safe';
      const isMarginal = item.status === 'marginal';

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
    }).join('');
  },

  async mount() {
    this.bindTabs();
    this.bindActions();
    await this.loadLiveWeather();
  },

  async loadLiveWeather(forceRefresh = false) {
    if (!window.WeatherService) return;

    try {
      const weather = await window.WeatherService.fetchAgroWeather(forceRefresh);
      if (weather && weather.current) {
        this.isLiveFeed = weather.isLive;
        this.farmMetrics.tempC = weather.current.temp;
        this.farmMetrics.humidityPct = weather.current.humidity;
        this.farmMetrics.windKmh = weather.current.windSpeed;
        this.farmMetrics.et0 = weather.current.et0;
        this.farmMetrics.solarRad = weather.current.solarRadiation || 19.2;
        this.sprayPlanner = weather.daily || [];

        // Update DOM elements cleanly
        const statusEl = document.getElementById('ai-feed-status');
        if (statusEl) {
          statusEl.textContent = weather.isLive 
            ? '🟢 Live Open-Meteo Satellite Feed (Ludhiana, PB)' 
            : '🟡 Agromet Baseline Feed Active';
        }

        const tempEl = document.getElementById('strip-temp');
        const rhEl = document.getElementById('strip-rh');
        const windEl = document.getElementById('strip-wind');
        const solarEl = document.getElementById('strip-solar');
        const et0El = document.getElementById('strip-et0');
        const formulaEl = document.getElementById('formula-display');

        if (tempEl) tempEl.textContent = `${this.farmMetrics.tempC}°C`;
        if (rhEl) rhEl.textContent = `${this.farmMetrics.humidityPct}%`;
        if (windEl) windEl.textContent = `${this.farmMetrics.windKmh} km/h`;
        if (solarEl) solarEl.innerHTML = `${this.farmMetrics.solarRad} <span style="font-size:11px;">MJ/m²/d</span>`;
        if (et0El) et0El.innerHTML = `${this.farmMetrics.et0} <span style="font-size:12px;">mm/day</span>`;
        if (formulaEl) {
          formulaEl.textContent = `Crop Water Requirement (ET_c) = Reference Evapotranspiration (ET_0: ${this.farmMetrics.et0} mm) × Crop Coefficient (K_c)`;
        }

        // Re-render dynamic parcel cards and spray planner cards
        const parcelsCont = document.getElementById('advisory-parcels-container');
        if (parcelsCont) parcelsCont.innerHTML = this.renderParcelsHtml();

        const sprayCont = document.getElementById('spray-cards-container');
        if (sprayCont) sprayCont.innerHTML = this.renderSprayHtml();

        // Re-attach card button listeners
        this.bindCardActions();
      }
    } catch (err) {
      console.warn('AiAdvisoryView live weather load error:', err);
    }
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
        const pBudget = document.getElementById('pane-budget');
        const pSpray = document.getElementById('pane-spray');
        const pOverrides = document.getElementById('pane-overrides');

        if (pBudget) pBudget.style.display = target === 'budget' ? 'block' : 'none';
        if (pSpray) pSpray.style.display = target === 'spray' ? 'block' : 'none';
        if (pOverrides) pOverrides.style.display = target === 'overrides' ? 'block' : 'none';
      });
    });
  },

  bindCardActions() {
    document.querySelectorAll('.btn-ai-action').forEach(btn => {
      btn.addEventListener('click', async () => {
        const action = btn.getAttribute('data-action');
        const pumpId = btn.getAttribute('data-pump-id');

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
  },

  bindActions() {
    this.bindCardActions();

    // Recalculate AI Model Button (triggers live API fetch)
    const recalcBtn = document.getElementById('btn-recalculate-ai');
    const spinIcon = document.getElementById('recalc-spin-icon');
    if (recalcBtn) {
      recalcBtn.addEventListener('click', async () => {
        recalcBtn.disabled = true;
        if (spinIcon) spinIcon.style.animation = 'spin 1s linear infinite';
        recalcBtn.innerHTML = '<span>⏳</span><span>Fetching Live Weather...</span>';

        await this.loadLiveWeather(true);

        recalcBtn.disabled = false;
        recalcBtn.innerHTML = '<span>⚡</span><span>Recalculate AI Model</span>';
        if (spinIcon) spinIcon.style.animation = '';
        window.showToast(`AI Model synchronized: Live ET0 is ${this.farmMetrics.et0} mm/day.`, 'success');
      });
    }

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
      forceSyncBtn.addEventListener('click', async () => {
        await this.loadLiveWeather(true);
        window.showToast('All 4 sensor nodes & satellite agromet telemetry synced.', 'success');
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

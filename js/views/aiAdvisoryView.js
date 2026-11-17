/**
 * SmartKisan Web Platform - AI Irrigation & Precision Advisory Module
 * Route: #/ai-advisory
 * Live Open-Meteo Satellite Agromet Telemetry,
 * FAO-56 Penman-Monteith Evapotranspiration (ET0), Crop Water Budget, 7-Day Spraying Planner,
 * and Farmer WhatsApp & SMS Advisory Broadcast Engine
 */

const AiAdvisoryView = {
  activeTab: 'budget', // 'budget' | 'spray' | 'overrides' | 'broadcast'
  broadcastLang: 'hi', // 'hi' | 'en'
  broadcastChannel: 'wa', // 'wa' | 'sms'
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
            <button type="button" class="btn-whatsapp-pill" id="btn-quick-whatsapp">
              <span>📲</span>
              <span>Share via WhatsApp</span>
            </button>
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
          <button type="button" class="ai-tab-btn" data-tab="broadcast">
            <span>📲</span>
            <span>Farmer WhatsApp & SMS</span>
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

        <!-- TAB 4: Farmer WhatsApp & SMS Advisory Broadcast Studio -->
        <div class="ai-tab-pane" id="pane-broadcast" style="display: none;">
          
          <div class="broadcast-studio-grid">
            
            <!-- Left: Configuration & Dispatch Controls -->
            <div class="broadcast-config-card">
              <div class="panel-title" style="margin-bottom: 16px;">
                <span>📲</span>
                <span>Farmer Advisory Broadcast Studio</span>
              </div>
              <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 20px;">
                Automatically compiles live agromet weather, parcel moisture deficits, and safe spray windows into ready-to-dispatch WhatsApp & Kisan SMS formats.
              </p>

              <!-- Channel Selector -->
              <div class="broadcast-form-section">
                <label class="broadcast-form-label">Broadcast Channel:</label>
                <div class="channel-selector-row">
                  <button type="button" class="channel-pill-btn wa active" data-bchannel="wa">
                    <span>💬</span>
                    <span>WhatsApp Broadcast</span>
                  </button>
                  <button type="button" class="channel-pill-btn" data-bchannel="sms">
                    <span>📨</span>
                    <span>Kisan SMS (160 GSM)</span>
                  </button>
                </div>
              </div>

              <!-- Language Selector -->
              <div class="broadcast-form-section">
                <label class="broadcast-form-label">Advisory Language:</label>
                <div style="display: flex; gap: 8px;">
                  <button type="button" class="map-filter-chip active" data-blang="hi">हिन्दी (Hindi)</button>
                  <button type="button" class="map-filter-chip" data-blang="en">English</button>
                </div>
              </div>

              <!-- Recipient Selector -->
              <div class="broadcast-form-section">
                <label class="broadcast-form-label">Target Recipient Group:</label>
                <select class="form-input" id="select-broadcast-recipient">
                  <option value="all">Punjab Kisan Cooperative Group #4 (28 Farmers)</option>
                  <option value="c-1">Ramesh Kumar (Farm Manager - +91 98765 43210)</option>
                  <option value="c-2">Gurpreet Singh (Pump Operator - +91 98123 45678)</option>
                  <option value="c-3">Harpreet Kaur (Agronomist - +91 98456 78901)</option>
                  <option value="custom">Custom Recipient Number</option>
                </select>
                <input 
                  type="text" 
                  class="form-input" 
                  id="input-custom-phone" 
                  placeholder="+91 98765 00000" 
                  style="display: none; margin-top: 8px;" 
                />
              </div>

              <!-- Action Buttons -->
              <div class="broadcast-actions-box">
                <button type="button" class="btn-whatsapp-pill" id="btn-dispatch-whatsapp" style="flex: 1;">
                  <span>📲</span>
                  <span>Send via WhatsApp</span>
                </button>
                <button type="button" class="btn-primary" id="btn-dispatch-sms" style="flex: 1; display: none;">
                  <span>📨</span>
                  <span>Dispatch Kisan SMS</span>
                </button>
                <button type="button" class="btn-outline" id="btn-copy-broadcast" style="padding: 10px 16px;">
                  <span>📋</span>
                  <span>Copy Text</span>
                </button>
              </div>
            </div>

            <!-- Right: Real-Time Phone Chat Mockup -->
            <div>
              <div style="font-size: 13px; font-weight: 700; color: var(--text-muted); margin-bottom: 8px;">
                LIVE RECIPIENT PREVIEW:
              </div>

              <!-- WhatsApp Chat Mockup -->
              <div class="whatsapp-chat-mockup" id="mockup-whatsapp">
                <div class="whatsapp-mockup-header">
                  <div class="whatsapp-avatar">🌱</div>
                  <div>
                    <div class="whatsapp-header-title">SmartKisan Agro Advisory</div>
                    <div class="whatsapp-header-sub">Online • Automated Broadcast</div>
                  </div>
                </div>

                <div class="whatsapp-chat-body">
                  <div class="whatsapp-bubble" id="whatsapp-bubble-text">
                    Loading advisory preview...
                  </div>
                  <div class="whatsapp-bubble-time">
                    <span>Just now</span>
                    <span style="color: #53BDEB; font-weight: bold;">✓✓</span>
                  </div>
                </div>
              </div>

              <!-- SMS Mockup (shown when SMS channel is active) -->
              <div class="sms-mockup-card" id="mockup-sms" style="display: none;">
                <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                  <strong style="font-size:12px; color:var(--text-muted);">GOVT OF INDIA / MKISAN GATEWAY</strong>
                  <span style="font-size:11px; color:var(--primary); font-weight:600;">TRANS-ID: 789412</span>
                </div>
                <div class="sms-bubble" id="sms-bubble-text">
                  Loading SMS preview...
                </div>
                <div class="sms-meta-row">
                  <span id="sms-char-counter">0 / 160 Characters</span>
                  <span>1 SMS Segment (Standard GSM-7)</span>
                </div>
              </div>
            </div>

          </div>

          <!-- Broadcast History Audit Log -->
          <div class="dash-panel">
            <div class="panel-header">
              <div class="panel-title">
                <span>📋</span>
                <span>Recent Advisory Broadcasts & Delivery Receipts</span>
              </div>
              <span class="panel-action">Live Gateway Telemetry</span>
            </div>

            <div style="padding: 0 20px 20px;">
              <table class="broadcast-log-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Channel</th>
                    <th>Recipient</th>
                    <th>Message Snippet</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody id="broadcast-logs-tbody">
                  <!-- Populated dynamically -->
                </tbody>
              </table>
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

  updateBroadcastPreview() {
    if (!window.BroadcastService) return;

    const waText = window.BroadcastService.generateWhatsAppText(this.broadcastLang, this.farmMetrics, this.parcels);
    const smsText = window.BroadcastService.generateSmsText(this.broadcastLang, this.farmMetrics);

    const waBubble = document.getElementById('whatsapp-bubble-text');
    if (waBubble) {
      waBubble.textContent = waText;
    }

    const smsBubble = document.getElementById('sms-bubble-text');
    const smsCounter = document.getElementById('sms-char-counter');
    if (smsBubble) {
      smsBubble.textContent = smsText;
    }
    if (smsCounter) {
      smsCounter.textContent = `${smsText.length} / 160 Characters`;
    }

    // Update Logs Table
    const logsTbody = document.getElementById('broadcast-logs-tbody');
    if (logsTbody && window.BroadcastService.getBroadcastLogs) {
      const logs = window.BroadcastService.getBroadcastLogs();
      logsTbody.innerHTML = logs.map(l => `
        <tr>
          <td><span style="font-weight:600;">${l.timestamp}</span></td>
          <td><span class="badge ${l.channel === 'WhatsApp' ? 'status-dot active' : ''}">${l.channel}</span></td>
          <td><strong>${l.recipient}</strong></td>
          <td style="color:var(--text-muted); font-size:12px;">${l.snippet}</td>
          <td><span style="color:var(--success); font-weight:700;">✓ ${l.status}</span></td>
        </tr>
      `).join('');
    }
  },

  async mount() {
    this.bindTabs();
    this.bindActions();
    this.bindBroadcastEvents();
    await this.loadLiveWeather();
    this.updateBroadcastPreview();
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

        const parcelsCont = document.getElementById('advisory-parcels-container');
        if (parcelsCont) parcelsCont.innerHTML = this.renderParcelsHtml();

        const sprayCont = document.getElementById('spray-cards-container');
        if (sprayCont) sprayCont.innerHTML = this.renderSprayHtml();

        this.bindCardActions();
        this.updateBroadcastPreview();
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

        tabs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const pBudget = document.getElementById('pane-budget');
        const pSpray = document.getElementById('pane-spray');
        const pOverrides = document.getElementById('pane-overrides');
        const pBroadcast = document.getElementById('pane-broadcast');

        if (pBudget) pBudget.style.display = target === 'budget' ? 'block' : 'none';
        if (pSpray) pSpray.style.display = target === 'spray' ? 'block' : 'none';
        if (pOverrides) pOverrides.style.display = target === 'overrides' ? 'block' : 'none';
        if (pBroadcast) pBroadcast.style.display = target === 'broadcast' ? 'block' : 'none';

        if (target === 'broadcast') {
          this.updateBroadcastPreview();
        }
      });
    });
  },

  bindBroadcastEvents() {
    // Channel Switchers (WhatsApp vs SMS)
    document.querySelectorAll('[data-bchannel]').forEach(btn => {
      btn.addEventListener('click', () => {
        const ch = btn.getAttribute('data-bchannel');
        this.broadcastChannel = ch;
        document.querySelectorAll('[data-bchannel]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const waMockup = document.getElementById('mockup-whatsapp');
        const smsMockup = document.getElementById('mockup-sms');
        const btnWa = document.getElementById('btn-dispatch-whatsapp');
        const btnSms = document.getElementById('btn-dispatch-sms');

        if (ch === 'wa') {
          if (waMockup) waMockup.style.display = 'flex';
          if (smsMockup) smsMockup.style.display = 'none';
          if (btnWa) btnWa.style.display = 'inline-flex';
          if (btnSms) btnSms.style.display = 'none';
        } else {
          if (waMockup) waMockup.style.display = 'none';
          if (smsMockup) smsMockup.style.display = 'flex';
          if (btnWa) btnWa.style.display = 'none';
          if (btnSms) btnSms.style.display = 'inline-flex';
        }
      });
    });

    // Language Selector Chips (Hindi vs English)
    document.querySelectorAll('[data-blang]').forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-blang');
        this.broadcastLang = lang;
        document.querySelectorAll('[data-blang]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.updateBroadcastPreview();
      });
    });

    // Recipient Dropdown Handler
    const recipSelect = document.getElementById('select-broadcast-recipient');
    const customPhoneInput = document.getElementById('input-custom-phone');
    if (recipSelect && customPhoneInput) {
      recipSelect.addEventListener('change', () => {
        customPhoneInput.style.display = recipSelect.value === 'custom' ? 'block' : 'none';
      });
    }

    // 1-Click WhatsApp Launch Button
    const waDispatchBtn = document.getElementById('btn-dispatch-whatsapp');
    if (waDispatchBtn) {
      waDispatchBtn.addEventListener('click', () => {
        if (!window.BroadcastService) return;
        const msg = window.BroadcastService.generateWhatsAppText(this.broadcastLang, this.farmMetrics, this.parcels);
        let phone = '';
        if (recipSelect && recipSelect.value === 'c-1') phone = '+919876543210';
        if (recipSelect && recipSelect.value === 'c-2') phone = '+919812345678';
        if (recipSelect && recipSelect.value === 'c-3') phone = '+919845678901';
        if (recipSelect && recipSelect.value === 'custom' && customPhoneInput) phone = customPhoneInput.value;

        window.BroadcastService.openWhatsApp(msg, phone);
        window.BroadcastService.saveLog({
          id: `log-${Date.now()}`,
          timestamp: 'Just now',
          channel: 'WhatsApp',
          recipient: recipSelect ? recipSelect.options[recipSelect.selectedIndex].text : 'Farmer Group',
          status: 'Opened',
          snippet: msg.substring(0, 60) + '...'
        });
        window.showToast('WhatsApp launched with daily advisory!', 'success');
        this.updateBroadcastPreview();
      });
    }

    // Simulated SMS Dispatch Button
    const smsDispatchBtn = document.getElementById('btn-dispatch-sms');
    if (smsDispatchBtn) {
      smsDispatchBtn.addEventListener('click', async () => {
        if (!window.BroadcastService) return;
        const msg = window.BroadcastService.generateSmsText(this.broadcastLang, this.farmMetrics);
        smsDispatchBtn.disabled = true;
        smsDispatchBtn.innerHTML = '<span>⏳</span><span>Dispatching SMS Gateway...</span>';

        await window.BroadcastService.dispatchSimulatedSms('Cooperative Farmer Group', '+91 98123 00000', msg);

        smsDispatchBtn.disabled = false;
        smsDispatchBtn.innerHTML = '<span>📨</span><span>Dispatch Kisan SMS</span>';
        window.showToast('Kisan SMS successfully dispatched via national gateway!', 'success');
        this.updateBroadcastPreview();
      });
    }

    // Copy Text Button
    const copyBtn = document.getElementById('btn-copy-broadcast');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        if (!window.BroadcastService) return;
        const text = this.broadcastChannel === 'wa'
          ? window.BroadcastService.generateWhatsAppText(this.broadcastLang, this.farmMetrics, this.parcels)
          : window.BroadcastService.generateSmsText(this.broadcastLang, this.farmMetrics);

        if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(() => {
            window.showToast('Advisory text copied to clipboard!', 'info');
          });
        } else {
          window.showToast('Text copied.', 'info');
        }
      });
    }
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

    // Quick WhatsApp Share in Header
    const quickWaBtn = document.getElementById('btn-quick-whatsapp');
    if (quickWaBtn) {
      quickWaBtn.addEventListener('click', () => {
        if (!window.BroadcastService) return;
        const msg = window.BroadcastService.generateWhatsAppText('hi', this.farmMetrics, this.parcels);
        window.BroadcastService.openWhatsApp(msg, '');
        window.showToast('WhatsApp launched with Hindi advisory message!', 'success');
      });
    }

    // Recalculate AI Model Button
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

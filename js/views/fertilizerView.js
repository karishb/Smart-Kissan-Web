/**
 * SmartKisan Web Platform - NPK Fertilizer Dosage & Bag Calculator
 * Route: #/fertilizer
 * Science-backed recommendations from Indian Agricultural Universities & Soil Health Card standards.
 */

const FertilizerView = (() => {
  // Crop Database with standard university recommended doses (kg/ha as N - P2O5 - K2O)
  const CROPS = [
    { key: 'wheat', label: 'Wheat (गेहूं)', icon: '🌾', n: 120, p: 60, k: 40, fym: '4-5 tonnes', stageNote: 'Basal at sowing + 2 splits at CRI & Booting' },
    { key: 'rice', label: 'Paddy / Rice (धान)', icon: '🌾', n: 120, p: 60, k: 40, fym: '5 tonnes', stageNote: 'Basal + Tillering (21d) + Panicle initiation (42d)' },
    { key: 'maize', label: 'Maize (मक्का)', icon: '🌽', n: 150, p: 75, k: 60, fym: '6 tonnes', stageNote: 'Basal + Knee-high stage + Tasseling stage' },
    { key: 'cotton', label: 'Bt Cotton (कपास)', icon: '☁️', n: 150, p: 75, k: 75, fym: '5 tonnes', stageNote: 'Basal + Square formation + Peak flowering' },
    { key: 'sugarcane', label: 'Sugarcane (गन्ना)', icon: '🎋', n: 250, p: 115, k: 115, fym: '10 tonnes', stageNote: 'Basal at planting + 45 days + 90 days earthing up' },
    { key: 'potato', label: 'Potato (आलू)', icon: '🥔', n: 180, p: 80, k: 100, fym: '8 tonnes', stageNote: 'Basal (100% P, 100% K, 50% N) + Top dressing at earthing up' },
    { key: 'tomato', label: 'Tomato (टमाटर)', icon: '🍅', n: 100, p: 50, k: 50, fym: '6 tonnes', stageNote: 'Basal at transplanting + 3 equal splits every 25 days' },
    { key: 'mustard', label: 'Mustard (सरसों)', icon: '🌼', n: 80, p: 40, k: 20, fym: '4 tonnes', stageNote: 'Basal (100% P, 100% K, 50% N) + 30 days after sowing' },
    { key: 'soybean', label: 'Soybean (सोयाबीन)', icon: '🌱', n: 30, p: 60, k: 40, fym: '3 tonnes', stageNote: 'Starter dose at sowing (legume fixes atmospheric nitrogen)' }
  ];

  // Commercial Fertilizers & Subsidized MRP
  const FERTILIZERS = {
    urea: { label: 'Urea (यूरिया)', n: 0.46, p: 0, k: 0, bagKg: 45, price: 266.50 },
    dap: { label: 'DAP (डीएपी)', n: 0.18, p: 0.46, k: 0, bagKg: 50, price: 1350.00 },
    mop: { label: 'MOP / Potash (पोटाश)', n: 0, p: 0, k: 0.60, bagKg: 50, price: 1612.00 }
  };

  // Land area conversions to Hectares
  const AREA_CONVERSION = {
    acre: 0.404686,
    bigha: 0.2529,   // Pucca Bigha (North India)
    hectare: 1.0
  };

  // State
  let selectedCropKey = 'wheat';
  let landArea = 2.5;
  let areaUnit = 'acre';
  let soilN = 'medium'; // 'low' | 'medium' | 'high'
  let soilP = 'medium';
  let soilK = 'medium';

  // Band adjustment factors printed on Govt Soil Health Cards:
  // Low gets +25%, Medium gets 100%, High gets -25%
  const BAND_FACTORS = {
    low: 1.25,
    medium: 1.0,
    high: 0.75
  };

  const calculatePlan = () => {
    const crop = CROPS.find(c => c.key === selectedCropKey) || CROPS[0];
    const ha = (parseFloat(landArea) || 0) * (AREA_CONVERSION[areaUnit] || 0.404686);

    if (ha <= 0) return null;

    // Adjusted target nutrient rates (kg/ha)
    const targetN_per_ha = crop.n * BAND_FACTORS[soilN];
    const targetP_per_ha = crop.p * BAND_FACTORS[soilP];
    const targetK_per_ha = crop.k * BAND_FACTORS[soilK];

    // Total farm requirement (kg)
    const totalN_kg = targetN_per_ha * ha;
    const totalP_kg = targetP_per_ha * ha;
    const totalK_kg = targetK_per_ha * ha;

    // 1. DAP Calculation (Supplies 46% P2O5 and 18% N)
    const dapKg = totalP_kg / FERTILIZERS.dap.p;
    const dapBags = Math.ceil(dapKg / FERTILIZERS.dap.bagKg);
    const nFromDap = (dapBags * FERTILIZERS.dap.bagKg) * FERTILIZERS.dap.n;

    // 2. Urea Calculation (Supplies remaining N after DAP)
    const remainingN_kg = Math.max(0, totalN_kg - nFromDap);
    const ureaKg = remainingN_kg / FERTILIZERS.urea.n;
    const ureaBags = Math.ceil(ureaKg / FERTILIZERS.urea.bagKg);

    // 3. MOP Calculation (Supplies 60% K2O)
    const mopKg = totalK_kg / FERTILIZERS.mop.k;
    const mopBags = Math.ceil(mopKg / FERTILIZERS.mop.bagKg);

    // Total Cost
    const totalCost = (ureaBags * FERTILIZERS.urea.price) + 
                      (dapBags * FERTILIZERS.dap.price) + 
                      (mopBags * FERTILIZERS.mop.price);

    // Split Schedule
    const basalUrea = Math.round(ureaBags * 0.3);
    const topDress1Urea = Math.round(ureaBags * 0.35);
    const topDress2Urea = ureaBags - basalUrea - topDress1Urea;

    return {
      crop,
      ha: ha.toFixed(2),
      areaDisplay: `${landArea} ${areaUnit.toUpperCase()}`,
      nutrients: {
        n: Math.round(totalN_kg),
        p: Math.round(totalP_kg),
        k: Math.round(totalK_kg)
      },
      bags: {
        urea: ureaBags,
        dap: dapBags,
        mop: mopBags
      },
      weights: {
        ureaKg: Math.round(ureaBags * FERTILIZERS.urea.bagKg),
        dapKg: Math.round(dapBags * FERTILIZERS.dap.bagKg),
        mopKg: Math.round(mopBags * FERTILIZERS.mop.bagKg)
      },
      costs: {
        urea: Math.round(ureaBags * FERTILIZERS.urea.price),
        dap: Math.round(dapBags * FERTILIZERS.dap.price),
        mop: Math.round(mopBags * FERTILIZERS.mop.price),
        total: Math.round(totalCost)
      },
      splits: {
        basal: { urea: basalUrea, dap: dapBags, mop: mopBags, timing: 'At Sowing / Seed Drill' },
        split1: { urea: topDress1Urea, timing: '1st Top Dressing (21–25 Days / 1st Irrigation)' },
        split2: { urea: topDress2Urea, timing: '2nd Top Dressing (45–55 Days / Flowering Initiation)' }
      }
    };
  };

  return {
    render() {
      const plan = calculatePlan();

      return `
        <div class="view-container">
          <!-- Page Header -->
          <div class="dashboard-header" style="margin-bottom: 20px;">
            <div>
              <h1 class="welcome-title" style="display: flex; align-items: center; gap: 10px;">
                <span>🧪</span>
                <span>NPK Fertilizer Dosage & Bag Calculator</span>
                <span class="badge badge-success" style="font-size: 11px; padding: 4px 10px;">KRISHI VIGYAN KENDRA STANDARDS</span>
              </h1>
              <p class="welcome-subtitle">
                Calculate precise commercial bag quantities (Urea, DAP, MOP), estimated subsidized costs, and split-application schedules tailored to your land and soil fertility.
              </p>
            </div>

            <div class="header-actions">
              <button type="button" class="btn-refresh" id="btn-print-fertilizer" title="Print or save fertilizer prescription card">
                <span>🖨️</span>
                <span>Print Plan</span>
              </button>
              <button type="button" class="btn-primary" id="btn-copy-fertilizer" style="width: auto;">
                <span>📋 Copy Prescription</span>
              </button>
            </div>
          </div>

          <!-- Top Row: Crop & Land Input Controls -->
          <div class="grid grid-3" style="gap: 20px; margin-bottom: 24px;">
            <!-- Step 1: Crop Selection Card -->
            <div class="card" style="padding: 20px;">
              <div style="font-size: 12px; font-weight: 700; color: var(--primary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
                Step 1: Choose Your Crop
              </div>
              <h3 style="margin: 0 0 14px 0; font-size: 16px; color: var(--text-main);">Target Sowing Crop</h3>
              
              <div class="fertilizer-crop-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
                ${CROPS.map(c => `
                  <button 
                    type="button" 
                    class="btn-crop-select ${selectedCropKey === c.key ? 'active' : ''}" 
                    data-crop="${c.key}"
                    style="padding: 10px 6px; text-align: center; border: 1px solid ${selectedCropKey === c.key ? 'var(--primary)' : 'var(--border)'}; background: ${selectedCropKey === c.key ? 'var(--primary-50)' : '#FFFFFF'}; border-radius: 8px; cursor: pointer; transition: all 0.2s;"
                  >
                    <div style="font-size: 20px; margin-bottom: 4px;">${c.icon}</div>
                    <div style="font-size: 11px; font-weight: 600; color: ${selectedCropKey === c.key ? 'var(--primary-hover)' : 'var(--text-main)'}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                      ${c.label.split(' ')[0]}
                    </div>
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Step 2: Land Area Input -->
            <div class="card" style="padding: 20px;">
              <div style="font-size: 12px; font-weight: 700; color: var(--primary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
                Step 2: Field Land Holding
              </div>
              <h3 style="margin: 0 0 14px 0; font-size: 16px; color: var(--text-main);">Area Under Cultivation</h3>

              <div style="margin-bottom: 14px;">
                <label style="display: block; font-size: 12px; font-weight: 600; color: var(--text-muted); margin-bottom: 6px;">
                  Area Quantity:
                </label>
                <div style="display: flex; gap: 8px;">
                  <input 
                    type="number" 
                    id="input-fert-area" 
                    class="input-field" 
                    value="${landArea}" 
                    min="0.1" 
                    step="0.1" 
                    style="flex: 1; font-size: 16px; font-weight: 700; padding: 10px 14px; border: 1px solid var(--border); border-radius: 6px;"
                  />
                  <select id="select-fert-unit" class="select-field" style="width: 110px; font-weight: 600; border: 1px solid var(--border); border-radius: 6px; padding: 0 10px;">
                    <option value="acre" ${areaUnit === 'acre' ? 'selected' : ''}>Acres</option>
                    <option value="bigha" ${areaUnit === 'bigha' ? 'selected' : ''}>Bigha (पक्का)</option>
                    <option value="hectare" ${areaUnit === 'hectare' ? 'selected' : ''}>Hectares</option>
                  </select>
                </div>
              </div>

              <div style="background: var(--bg-card-subtle); padding: 10px 14px; border-radius: 6px; font-size: 12px; color: var(--text-muted); border-left: 3px solid var(--primary);">
                Standard Conversion: <strong>1 Acre = 0.404 Hectares</strong> | <strong>1 Hectare = 2.47 Acres</strong>
              </div>
            </div>

            <!-- Step 3: Soil Test Card (Optional) -->
            <div class="card" style="padding: 20px;">
              <div style="font-size: 12px; font-weight: 700; color: var(--primary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
                Step 3: Soil Test Adjustment
              </div>
              <h3 style="margin: 0 0 14px 0; font-size: 16px; color: var(--text-main);">Soil Health Card Ratings</h3>

              <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px;">
                <div>
                  <label style="display: block; font-size: 11px; font-weight: 600; color: #1E3A8A; margin-bottom: 4px;">Nitrogen (N)</label>
                  <select id="select-soil-n" class="select-field" style="width: 100%; font-size: 12px; padding: 6px 8px; border-radius: 6px; border: 1px solid var(--border);">
                    <option value="low" ${soilN === 'low' ? 'selected' : ''}>Low (+25%)</option>
                    <option value="medium" ${soilN === 'medium' ? 'selected' : ''}>Medium</option>
                    <option value="high" ${soilN === 'high' ? 'selected' : ''}>High (-25%)</option>
                  </select>
                </div>
                <div>
                  <label style="display: block; font-size: 11px; font-weight: 600; color: #047857; margin-bottom: 4px;">Phosphorus (P)</label>
                  <select id="select-soil-p" class="select-field" style="width: 100%; font-size: 12px; padding: 6px 8px; border-radius: 6px; border: 1px solid var(--border);">
                    <option value="low" ${soilP === 'low' ? 'selected' : ''}>Low (+25%)</option>
                    <option value="medium" ${soilP === 'medium' ? 'selected' : ''}>Medium</option>
                    <option value="high" ${soilP === 'high' ? 'selected' : ''}>High (-25%)</option>
                  </select>
                </div>
                <div>
                  <label style="display: block; font-size: 11px; font-weight: 600; color: #B45309; margin-bottom: 4px;">Potash (K)</label>
                  <select id="select-soil-k" class="select-field" style="width: 100%; font-size: 12px; padding: 6px 8px; border-radius: 6px; border: 1px solid var(--border);">
                    <option value="low" ${soilK === 'low' ? 'selected' : ''}>Low (+25%)</option>
                    <option value="medium" ${soilK === 'medium' ? 'selected' : ''}>Medium</option>
                    <option value="high" ${soilK === 'high' ? 'selected' : ''}>High (-25%)</option>
                  </select>
                </div>
              </div>

              <p style="margin: 12px 0 0 0; font-size: 11px; color: var(--text-muted); line-height: 1.4;">
                *Ratings automatically adjust university dose up or down according to Indian Council of Agricultural Research (ICAR) guidelines.
              </p>
            </div>
          </div>

          ${plan ? `
            <!-- Results Section: Printable Prescription Card -->
            <div id="fertilizer-prescription-card">
              <!-- KPI Summary Cards -->
              <div class="kpi-grid" style="margin-bottom: 24px;">
                <div class="kpi-card" style="border-top: 4px solid #2563EB;">
                  <div class="kpi-icon-box blue"><span>🌾</span></div>
                  <div class="kpi-info">
                    <div class="kpi-label">Urea (46% Nitrogen)</div>
                    <div class="kpi-value" style="color: #2563EB;">${plan.bags.urea} <span style="font-size: 14px; font-weight: 600;">Bags</span></div>
                    <div class="kpi-subtext">${plan.weights.ureaKg} kg total (₹${plan.costs.urea.toLocaleString()})</div>
                  </div>
                </div>

                <div class="kpi-card" style="border-top: 4px solid #16A34A;">
                  <div class="kpi-icon-box green"><span>🌱</span></div>
                  <div class="kpi-info">
                    <div class="kpi-label">DAP (18-46-0)</div>
                    <div class="kpi-value" style="color: #16A34A;">${plan.bags.dap} <span style="font-size: 14px; font-weight: 600;">Bags</span></div>
                    <div class="kpi-subtext">${plan.weights.dapKg} kg total (₹${plan.costs.dap.toLocaleString()})</div>
                  </div>
                </div>

                <div class="kpi-card" style="border-top: 4px solid #D97706;">
                  <div class="kpi-icon-box amber"><span>🧪</span></div>
                  <div class="kpi-info">
                    <div class="kpi-label">MOP / Potash (60% K₂O)</div>
                    <div class="kpi-value" style="color: #D97706;">${plan.bags.mop} <span style="font-size: 14px; font-weight: 600;">Bags</span></div>
                    <div class="kpi-subtext">${plan.weights.mopKg} kg total (₹${plan.costs.mop.toLocaleString()})</div>
                  </div>
                </div>

                <div class="kpi-card" style="border-top: 4px solid #7C3AED;">
                  <div class="kpi-icon-box purple"><span>💰</span></div>
                  <div class="kpi-info">
                    <div class="kpi-label">Estimated Input Cost</div>
                    <div class="kpi-value" style="color: #7C3AED;">₹${plan.costs.total.toLocaleString()}</div>
                    <div class="kpi-subtext">At Central Subsidized MRP</div>
                  </div>
                </div>
              </div>

              <!-- Main Detail Card: Split Timing & Application Strategy -->
              <div class="card" style="margin-bottom: 24px; padding: 24px;">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 14px; margin-bottom: 20px; flex-wrap: wrap; gap: 10px;">
                  <div>
                    <h2 style="margin: 0; font-size: 18px; color: var(--text-main); display: flex; align-items: center; gap: 8px;">
                      <span>📅</span>
                      <span>Scientific Split-Application Schedule (${plan.crop.label})</span>
                    </h2>
                    <p style="margin: 4px 0 0; font-size: 13px; color: var(--text-muted);">
                      Prescription for ${plan.areaDisplay} (${plan.ha} Hectares) | Farm Yard Manure (FYM): <strong>${plan.crop.fym}</strong>
                    </p>
                  </div>
                  <span class="badge badge-primary" style="font-size: 12px; padding: 6px 14px;">
                    ${plan.crop.stageNote}
                  </span>
                </div>

                <!-- 3 Stage Timeline Cards -->
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px;">
                  <!-- Stage 1: Basal -->
                  <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-top: 3px solid #16A34A; border-radius: 8px; padding: 18px;">
                    <div style="font-size: 11px; font-weight: 700; color: #16A34A; text-transform: uppercase; margin-bottom: 6px;">
                      Stage 1 • Sowing Time (Basal Dose)
                    </div>
                    <h4 style="margin: 0 0 10px; font-size: 15px; color: var(--text-main);">At Sowing / Seed Drill</h4>
                    <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 14px;">
                      Apply full Phosphorus and Potash at root depth plus a starter dose of Nitrogen.
                    </p>
                    <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 6px; padding: 12px;">
                      <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px;">
                        <span>DAP (50kg bags):</span>
                        <strong style="color: #16A34A;">${plan.splits.basal.dap} Bags</strong>
                      </div>
                      <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px;">
                        <span>MOP (50kg bags):</span>
                        <strong style="color: #D97706;">${plan.splits.basal.mop} Bags</strong>
                      </div>
                      <div style="display: flex; justify-content: space-between; font-size: 13px;">
                        <span>Urea (45kg bags):</span>
                        <strong style="color: #2563EB;">${plan.splits.basal.urea} Bags</strong>
                      </div>
                    </div>
                  </div>

                  <!-- Stage 2: First Top Dressing -->
                  <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-top: 3px solid #2563EB; border-radius: 8px; padding: 18px;">
                    <div style="font-size: 11px; font-weight: 700; color: #2563EB; text-transform: uppercase; margin-bottom: 6px;">
                      Stage 2 • Vegetative / Tillering
                    </div>
                    <h4 style="margin: 0 0 10px; font-size: 15px; color: var(--text-main);">21–25 Days After Sowing</h4>
                    <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 14px;">
                      Broadcast immediately prior to first irrigation (Crown Root Initiation stage).
                    </p>
                    <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 6px; padding: 12px;">
                      <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px;">
                        <span>Urea (45kg bags):</span>
                        <strong style="color: #2563EB;">${plan.splits.split1.urea} Bags</strong>
                      </div>
                      <div style="font-size: 11px; color: var(--text-muted); margin-top: 8px;">
                        *Ensure soil has adequate moisture before broadcasting.
                      </div>
                    </div>
                  </div>

                  <!-- Stage 3: Second Top Dressing -->
                  <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-top: 3px solid #7C3AED; border-radius: 8px; padding: 18px;">
                    <div style="font-size: 11px; font-weight: 700; color: #7C3AED; text-transform: uppercase; margin-bottom: 6px;">
                      Stage 3 • Booting / Peak Growth
                    </div>
                    <h4 style="margin: 0 0 10px; font-size: 15px; color: var(--text-main);">45–55 Days After Sowing</h4>
                    <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 14px;">
                      Final Nitrogen application at panicle / flower initiation before heading.
                    </p>
                    <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 6px; padding: 12px;">
                      <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px;">
                        <span>Urea (45kg bags):</span>
                        <strong style="color: #7C3AED;">${plan.splits.split2.urea} Bags</strong>
                      </div>
                      <div style="font-size: 11px; color: var(--text-muted); margin-top: 8px;">
                        *Do not apply urea after flowering to prevent lodging.
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Agricultural Advisory & Verification Banner -->
                <div style="background: #FEF3C7; border: 1px solid #FCD34D; border-radius: 8px; padding: 14px 18px; display: flex; align-items: center; gap: 14px;">
                  <span style="font-size: 24px;">💡</span>
                  <div style="font-size: 13px; color: #92400E; line-height: 1.5;">
                    <strong>Krishi Vigyan Kendra (KVK) Advisory Note:</strong><br/>
                    DAP is computed first because it delivers 18% Nitrogen alongside 46% Phosphorus. Deducting DAP Nitrogen from the Urea requirement prevents excessive vegetative growth, disease susceptibility, and saves unnecessary input costs.
                  </div>
                </div>
              </div>
            </div>
          ` : ''}
        </div>
      `;
    },

    mount() {
      // Crop Selection Buttons
      document.querySelectorAll('.btn-crop-select').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const cropKey = btn.getAttribute('data-crop');
          selectedCropKey = cropKey;
          App.refreshView();
        });
      });

      // Area Input
      const areaInput = document.getElementById('input-fert-area');
      if (areaInput) {
        areaInput.addEventListener('input', (e) => {
          landArea = parseFloat(e.target.value) || 0;
          App.refreshView();
        });
      }

      // Unit Selector
      const unitSelect = document.getElementById('select-fert-unit');
      if (unitSelect) {
        unitSelect.addEventListener('change', (e) => {
          areaUnit = e.target.value;
          App.refreshView();
        });
      }

      // Soil Test Selectors
      ['n', 'p', 'k'].forEach(nutrient => {
        const sel = document.getElementById(`select-soil-${nutrient}`);
        if (sel) {
          sel.addEventListener('change', (e) => {
            if (nutrient === 'n') soilN = e.target.value;
            if (nutrient === 'p') soilP = e.target.value;
            if (nutrient === 'k') soilK = e.target.value;
            App.refreshView();
          });
        }
      });

      // Print Plan
      const printBtn = document.getElementById('btn-print-fertilizer');
      if (printBtn) {
        printBtn.addEventListener('click', () => {
          window.print();
        });
      }

      // Copy Prescription Text
      const copyBtn = document.getElementById('btn-copy-fertilizer');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          const plan = calculatePlan();
          if (!plan) return;

          const text = `🌱 SmartKisan Fertilizer Prescription (${plan.crop.label})\n` +
            `Land Area: ${plan.areaDisplay} (${plan.ha} Ha)\n` +
            `-----------------------------------\n` +
            `• Urea (45kg): ${plan.bags.urea} Bags (₹${plan.costs.urea})\n` +
            `• DAP (50kg): ${plan.bags.dap} Bags (₹${plan.costs.dap})\n` +
            `• MOP (50kg): ${plan.bags.mop} Bags (₹${plan.costs.mop})\n` +
            `Total Estimated Cost: ₹${plan.costs.total}\n` +
            `-----------------------------------\n` +
            `Application Splits:\n` +
            `1. Basal (At Sowing): ${plan.splits.basal.dap} Bags DAP, ${plan.splits.basal.mop} Bags MOP, ${plan.splits.basal.urea} Bags Urea\n` +
            `2. 1st Top Dressing (21d): ${plan.splits.split1.urea} Bags Urea\n` +
            `3. 2nd Top Dressing (45d): ${plan.splits.split2.urea} Bags Urea\n` +
            `Advisory: Organic FYM: ${plan.crop.fym}`;

          navigator.clipboard.writeText(text).then(() => {
            window.showToast('Fertilizer prescription copied to clipboard!', 'success');
          }).catch(() => {
            window.showToast('Prescription text ready', 'info');
          });
        });
      }
    },

    unmount() {}
  };
})();

window.FertilizerView = FertilizerView;

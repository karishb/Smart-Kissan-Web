/**
 * SmartKisan Web Platform - Government Schemes & Subsidy Directory
 * Route: #/schemes
 * Comprehensive eligibility guides, subsidy calculations, and direct application portals for PM-KUSUM, PMFBY, PM-KISAN, and more.
 */

const SchemesView = (() => {
  const SCHEMES = [
    {
      id: 'pm-kusum',
      category: 'solar',
      name: 'PM-KUSUM',
      fullName: 'Pradhan Mantri Kisan Urja Suraksha evam Utthaan Mahabhiyan (पीएम-कुसुम)',
      badge: '60% SOLAR PUMP SUBSIDY',
      badgeColor: '#16A34A',
      icon: '☀️',
      shortDesc: 'Up to 60% government subsidy to install standalone or grid-connected solar agricultural pumps and solarize existing diesel/electric tubewells.',
      subsidyDetails: '30% Central Govt Subsidy + 30% State Govt Subsidy. Farmer pays only 10% upfront, with remaining 30% financed by bank loan.',
      components: [
        { name: 'Component A', detail: 'Setting up 10,000 MW decentralized ground-mounted solar power plants (up to 2 MW) on barren/cultivable land. Farmers earn regular income by selling power to DISCOMs.' },
        { name: 'Component B', detail: 'Installation of 20 lakh standalone off-grid solar agriculture pumps (3 HP, 5 HP, 7.5 HP) in non-electrified rural zones.' },
        { name: 'Component C', detail: 'Solarisation of 15 lakh grid-connected agriculture pumps. Farmers can sell surplus solar power back to the electricity grid.' }
      ],
      eligibility: [
        'Individual farmers, farmer groups, cooperatives, and Panchayats with cultivable or barren land',
        'Valid land records (Khasra, Khatauni / Jamabandi)',
        'For Component B: Farmer must not have an existing grid electricity connection for the pump'
      ],
      documents: ['Aadhaar Card', 'Land Registry / Jamabandi Records', 'Bank Passbook linked to Aadhaar', 'Passport size photo', 'Electricity board NOC (if applicable)'],
      howToApply: 'Apply online through state nodal agency portals (e.g. Saur Urja Portal / PM-KUSUM State DISCOM) or visit local District Agriculture Office / Renewable Energy Development Agency (CREDA/HAREDA/MEDA).',
      officialUrl: 'https://pmkusum.mnre.gov.in',
      portalLabel: 'pmkusum.mnre.gov.in'
    },
    {
      id: 'pmfby',
      category: 'insurance',
      name: 'PM Fasal Bima (PMFBY)',
      fullName: 'Pradhan Mantri Fasal Bima Yojana (प्रधानमंत्री फसल बीमा योजना)',
      badge: 'LOW PREMIUM CROP INSURANCE',
      badgeColor: '#2563EB',
      icon: '🛡️',
      shortDesc: 'Comprehensive crop insurance coverage against unavoidable natural risks from pre-sowing to post-harvest (drought, flood, unseasonal rain, pest outbreaks, cyclone).',
      subsidyDetails: 'Ultra-low uniform premium rates for farmers: 2.0% for Kharif crops (Paddy, Cotton, Maize), 1.5% for Rabi crops (Wheat, Mustard), 5.0% for Annual Commercial & Horticultural crops. Balance premium paid 100% by Central and State Governments.',
      components: [
        { name: 'Pre-Sowing / Prevented Sowing', detail: 'Claims up to 25% of sum insured if sowing is prevented due to deficient rainfall or adverse weather.' },
        { name: 'Standing Crop Losses', detail: 'Comprehensive yield loss compensation based on Crop Cutting Experiments (CCEs) and satellite indices.' },
        { name: 'Post-Harvest Losses', detail: 'Coverage for up to 14 days after harvest for crops left in cut and spread condition in fields affected by cyclones or unseasonal rain.' }
      ],
      eligibility: [
        'All farmers growing notified crops in notified areas (both loanee and non-loanee farmers)',
        'Sharecroppers and tenant farmers eligible with self-declaration / rental proof',
        'Loss intimation must be submitted within 72 hours of localized calamity'
      ],
      documents: ['Aadhaar Card', 'Land Possession Certificate (LPC) / Sowing Certificate', 'Bank Account details (linked to Aadhaar)', 'Crop Sowing Declaration'],
      howToApply: 'Apply through your loan bank branch, nearest Common Service Center (CSC), or directly on the National Crop Insurance Portal (pmfby.gov.in) or Crop Insurance Mobile App.',
      officialUrl: 'https://pmfby.gov.in',
      portalLabel: 'pmfby.gov.in'
    },
    {
      id: 'pm-kisan',
      category: 'income',
      name: 'PM-KISAN',
      fullName: 'Pradhan Mantri Kisan Samman Nidhi (पीएम-किसान सम्मान निधि)',
      badge: '₹6,000 / YEAR DIRECT BENEFIT',
      badgeColor: '#059669',
      icon: '💵',
      shortDesc: 'Direct income support of ₹6,000 per annum transferred directly into the bank accounts of landholding farmer families across India in three equal 4-monthly installments.',
      subsidyDetails: '100% funded by Government of India. ₹2,000 credited every 4 months (April-July, August-November, December-March) via Direct Benefit Transfer (DBT).',
      components: [
        { name: 'Installment 1', detail: '₹2,000 transferred between April and July' },
        { name: 'Installment 2', detail: '₹2,000 transferred between August and November' },
        { name: 'Installment 3', detail: '₹2,000 transferred between December and March' }
      ],
      eligibility: [
        'All landholding farmer families with cultivable land in their names',
        'Mandatory e-KYC completed (via OTP, biometrics, or facial recognition on PM-KISAN app)',
        'Exclusions: Institutional landholders, constitutional post holders, income tax payees, and serving/retired govt employees'
      ],
      documents: ['Aadhaar Card', 'Land Ownership Records (Khatauni)', 'Aadhaar-seeded Active Bank Account', 'Mobile number linked to Aadhaar'],
      howToApply: 'Self-register on Farmers Corner at pmkisan.gov.in, via PM-KISAN mobile app, or through nearest CSC center or Village Nodal Officer.',
      officialUrl: 'https://pmkisan.gov.in',
      portalLabel: 'pmkisan.gov.in'
    },
    {
      id: 'kcc',
      category: 'credit',
      name: 'Kisan Credit Card (KCC)',
      fullName: 'Kisan Credit Card Agricultural Credit Scheme (किसान क्रेडिट कार्ड)',
      badge: '4% SUBSIDIZED CROP LOAN',
      badgeColor: '#D97706',
      icon: '💳',
      shortDesc: 'Hassle-free agricultural working capital and equipment credit up to ₹3 Lakh at an effective interest rate of only 4% per annum.',
      subsidyDetails: 'Base interest rate is 7%. Central Government provides 3% prompt repayment incentive (Interest Subvention), bringing effective net interest down to 4.0% per annum.',
      components: [
        { name: 'Collateral-Free Limit', detail: 'No collateral or land hypothecation required for loans up to ₹1.60 Lakh.' },
        { name: 'Flexible Revolving Credit', detail: 'Card validity of 5 years with simple annual review. Withdraw and deposit cash anytime via ATM card.' },
        { name: 'Allied Activities', detail: 'Extended coverage for Animal Husbandry, Dairy, Poultry, and Fisheries up to ₹2 Lakh.' }
      ],
      eligibility: [
        'Individual / joint borrowers who are owner cultivators',
        'Tenant farmers, oral lessees, and sharecroppers',
        'Self Help Groups (SHGs) or Joint Liability Groups (JLGs) of farmers'
      ],
      documents: ['Application Form', 'Aadhaar & PAN Card', 'Land records showing crops sown', 'No-Dues Certificate from adjacent bank branches (if loan > ₹1.6L)'],
      howToApply: 'Apply at any public, private, or regional rural bank branch, through Common Service Centers, or download KCC one-page form from pmkisan.gov.in.',
      officialUrl: 'https://pmkisan.gov.in',
      portalLabel: 'State & Commercial Banks'
    },
    {
      id: 'pmksy',
      category: 'irrigation',
      name: 'PMKSY (Per Drop More Crop)',
      fullName: 'Pradhan Mantri Krishi Sinchai Yojana (प्रधानमंत्री कृषि सिंचाई योजना)',
      badge: '55% MICRO-IRRIGATION SUBSIDY',
      badgeColor: '#0284C7',
      icon: '💧',
      shortDesc: 'Financial assistance of up to 55% for installing water-saving micro-irrigation systems (Drip Irrigation and Portable/Mini Sprinkler Systems).',
      subsidyDetails: '55% subsidy for Small and Marginal farmers (< 2 Hectares / 5 Acres), and 45% subsidy for other farmers. Saves up to 40-50% water while boosting crop yields by 20-30%.',
      components: [
        { name: 'Drip Irrigation', detail: 'High-efficiency inline and online dripper laterals for row crops, orchards, vegetables, and polyhouses.' },
        { name: 'Micro & Mini Sprinklers', detail: 'Overhead and ground sprinkler units ideal for Wheat, Pulses, Mustard, Groundnut, and forage crops.' }
      ],
      eligibility: [
        'All categories of farmers having cultivable land with an assured water source (tubewell, open well, pond)',
        'Small and marginal farmers receive priority and higher subsidy allocation'
      ],
      documents: ['Aadhaar Card', 'Land Registry Copy', 'Soil & Water Testing Report', 'Quotation from authorized micro-irrigation manufacturer', 'Bank Passbook'],
      howToApply: 'Apply through State Horticulture / Agriculture Department portal (e.g. e-MIP, Drip Subsidy Portal) or District Horticulture Officer.',
      officialUrl: 'https://pmksy.gov.in',
      portalLabel: 'pmksy.gov.in'
    },
    {
      id: 'soil-health',
      category: 'soil',
      name: 'Soil Health Card Scheme',
      fullName: 'National Soil Health Card Mission (मृदा स्वास्थ्य कार्ड योजना)',
      badge: 'FREE 12-PARAMETER TEST',
      badgeColor: '#78350F',
      icon: '🧪',
      shortDesc: 'Free comprehensive laboratory soil testing every 2 years providing crop-wise fertilizer dosages and organic correction advisories.',
      subsidyDetails: '100% free of charge. Analyzes 12 parameters: Macro-nutrients (N, P, K), Secondary-nutrients (S), Micro-nutrients (Zn, Fe, Cu, Mn, Bo), and Physical parameters (pH, EC, Organic Carbon).',
      components: [
        { name: 'Grid Sampling', detail: 'Soil samples collected in 2.5 ha grid (irrigated) or 10 ha grid (rainfed) by village agriculture coordinators.' },
        { name: 'Custom Dosage', detail: 'Printed prescription card showing exact quantity of urea, DAP, potash, and gypsum/lime required for your crop.' }
      ],
      eligibility: ['All farmers possessing cultivable agricultural land across all states and Union Territories.'],
      documents: ['Aadhaar Card', 'Khasra Number / Field Identification'],
      howToApply: 'Contact local Krishi Vigyan Kendra (KVK), block agriculture office, or track status online at soilhealth.dac.gov.in.',
      officialUrl: 'https://soilhealth.dac.gov.in',
      portalLabel: 'soilhealth.dac.gov.in'
    },
    {
      id: 'smam',
      category: 'machinery',
      name: 'SMAM Farm Mechanization',
      fullName: 'Sub-Mission on Agricultural Mechanization (कृषि यंत्रीकरण उप-मिशन)',
      badge: '40%–50% MACHINERY SUBSIDY',
      badgeColor: '#DC2626',
      icon: '🚜',
      shortDesc: 'Subsidies up to 40% to 50% for purchasing modern agricultural machinery (Tractors, Rotavators, Laser Land Levelers, Seed Drills, Drone Sprayers, Harvesters).',
      subsidyDetails: '50% subsidy (up to ₹5–10 Lakh) for SC, ST, Small/Marginal farmers and Women; 40% subsidy for general category farmers. Custom Hiring Centers (CHCs) receive up to 40% project subsidy (up to ₹10–25 Lakh).',
      components: [
        { name: 'Individual Equipment', detail: 'Subsidized purchase of tractor implements, happy seeders, super seeders, multi-crop threshers, and power tillers.' },
        { name: 'Custom Hiring Centers', detail: 'Grants to set up village equipment rental hubs so small farmers can rent machinery at low rates.' },
        { name: 'Agricultural Drones', detail: 'Up to 50-100% financial assistance for Kisan Drones for precision spray of fertilizers and pesticides.' }
      ],
      eligibility: ['Individual farmers, farmer groups, FPOs, registered farmer societies, and rural youth entrepreneurs.'],
      documents: ['Aadhaar Card', 'Land Registry Documents (7/12, Khasra/Khatauni)', 'Bank Passbook', 'Caste Certificate (if claiming affirmative action subsidy)'],
      howToApply: 'Register and apply on the Central DBT Agricultural Mechanization Portal (agrimachinery.nic.in) during state application windows.',
      officialUrl: 'https://agrimachinery.nic.in',
      portalLabel: 'agrimachinery.nic.in'
    }
  ];

  const CATEGORIES = [
    { id: 'all', label: 'All Schemes (सभी योजनाएं)', icon: '🏛️' },
    { id: 'solar', label: 'Solar Pumps (PM-KUSUM)', icon: '☀️' },
    { id: 'insurance', label: 'Crop Insurance (PMFBY)', icon: '🛡️' },
    { id: 'income', label: 'Direct Income (PM-KISAN)', icon: '💵' },
    { id: 'credit', label: 'Credit & Loans (KCC)', icon: '💳' },
    { id: 'irrigation', label: 'Micro Irrigation (PMKSY)', icon: '💧' },
    { id: 'soil', label: 'Soil Health (SHC)', icon: '🧪' },
    { id: 'machinery', label: 'Machinery (SMAM)', icon: '🚜' }
  ];

  let selectedCategory = 'all';
  let searchQuery = '';

  const getFilteredSchemes = () => {
    return SCHEMES.filter(s => {
      const matchCat = selectedCategory === 'all' || s.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchSearch = !query || 
        s.name.toLowerCase().includes(query) ||
        s.fullName.toLowerCase().includes(query) ||
        s.shortDesc.toLowerCase().includes(query) ||
        s.subsidyDetails.toLowerCase().includes(query);
      return matchCat && matchSearch;
    });
  };

  return {
    render() {
      const filtered = getFilteredSchemes();

      return `
        <div class="view-container">
          <!-- Page Header -->
          <div class="dashboard-header" style="margin-bottom: 20px;">
            <div>
              <h1 class="welcome-title" style="display: flex; align-items: center; gap: 10px;">
                <span>🏛️</span>
                <span>Government Schemes & Subsidies Directory</span>
                <span class="badge badge-success" style="font-size: 11px; padding: 4px 10px;">DIRECT BENEFIT TRANSFER (DBT)</span>
              </h1>
              <p class="welcome-subtitle">
                Official guides for PM-KUSUM Solar Pumps, PM Fasal Bima Yojana, PM-KISAN, and agricultural machinery subsidies with verified eligibility rules and application steps.
              </p>
            </div>

            <div class="header-actions">
              <button type="button" class="btn-primary" id="btn-eligibility-checker" style="width: auto;">
                <span>🎯 Quick Eligibility Checker</span>
              </button>
            </div>
          </div>

          <!-- Featured Highlights Banner: PM-KUSUM & PMFBY Spotlight -->
          <div class="grid grid-2" style="gap: 20px; margin-bottom: 24px;">
            <!-- PM-KUSUM Spotlight Card -->
            <div class="card" style="padding: 24px; border-left: 5px solid #16A34A; background: linear-gradient(135deg, #F0FDF4, #FFFFFF);">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="font-size: 32px;">☀️</span>
                  <div>
                    <span class="badge" style="background: #DCFCE7; color: #16A34A; font-weight: 700; font-size: 11px;">SOLAR AGRICULTURE PUMP</span>
                    <h3 style="margin: 4px 0 0; font-size: 18px; color: #14532D;">PM-KUSUM Scheme 2026</h3>
                  </div>
                </div>
                <span style="font-size: 18px; font-weight: 800; color: #16A34A; background: #FFFFFF; padding: 4px 10px; border-radius: 6px; border: 1px solid #BBF7D0;">60% Subsidy</span>
              </div>
              <p style="font-size: 13px; color: #374151; line-height: 1.5; margin-bottom: 16px;">
                Replace diesel pumps or connect high-capacity off-grid solar pumping systems (3 HP to 7.5 HP). Central & State Govt cover 60% of total system cost.
              </p>
              <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <a href="https://pmkusum.mnre.gov.in" target="_blank" rel="noopener noreferrer" class="btn-primary" style="width: auto; padding: 8px 16px; font-size: 12.5px; text-decoration: none;">
                  Apply on PM-KUSUM Portal ↗
                </a>
                <button type="button" class="btn-refresh" onclick="SchemesView.filterBy('solar')" style="padding: 8px 14px; font-size: 12.5px;">
                  View Full Component Guide →
                </button>
              </div>
            </div>

            <!-- PMFBY Spotlight Card -->
            <div class="card" style="padding: 24px; border-left: 5px solid #2563EB; background: linear-gradient(135deg, #EFF6FF, #FFFFFF);">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="font-size: 32px;">🛡️</span>
                  <div>
                    <span class="badge" style="background: #DBEAFE; color: #2563EB; font-weight: 700; font-size: 11px;">CROP LOSS PROTECTION</span>
                    <h3 style="margin: 4px 0 0; font-size: 18px; color: #1E3A8A;">PM Fasal Bima Yojana (PMFBY)</h3>
                  </div>
                </div>
                <span style="font-size: 18px; font-weight: 800; color: #2563EB; background: #FFFFFF; padding: 4px 10px; border-radius: 6px; border: 1px solid #BFDBFE;">1.5% - 2% Premium</span>
              </div>
              <p style="font-size: 13px; color: #374151; line-height: 1.5; margin-bottom: 16px;">
                Protection against drought, floods, pest attacks, and post-harvest unseasonal rain. Farmers pay only 1.5% (Rabi) or 2% (Kharif) premium.
              </p>
              <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <a href="https://pmfby.gov.in" target="_blank" rel="noopener noreferrer" class="btn-primary" style="width: auto; padding: 8px 16px; font-size: 12.5px; text-decoration: none; background: #2563EB;">
                  Check Policy on PMFBY Portal ↗
                </a>
                <button type="button" class="btn-refresh" onclick="SchemesView.filterBy('insurance')" style="padding: 8px 14px; font-size: 12.5px;">
                  View Claim Process →
                </button>
              </div>
            </div>
          </div>

          <!-- Filter & Search Toolbar -->
          <div class="card" style="padding: 16px; margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 14px; flex-wrap: wrap;">
              <!-- Search Bar -->
              <div class="rms-search-wrap" style="max-width: 420px; flex: 1;">
                <span style="color: var(--text-muted); font-size: 14px;">🔍</span>
                <input 
                  type="text" 
                  id="schemes-search-input" 
                  class="rms-search-field" 
                  placeholder="Search schemes, solar pumps, insurance, KCC, subsidies..." 
                  value="${searchQuery}"
                />
              </div>

              <!-- Category Pills -->
              <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                ${CATEGORIES.map(cat => `
                  <button 
                    type="button" 
                    class="btn-schemes-cat ${selectedCategory === cat.id ? 'active' : ''}" 
                    data-cat="${cat.id}"
                    style="padding: 7px 14px; border-radius: 9999px; font-size: 12px; font-weight: 600; border: 1px solid ${selectedCategory === cat.id ? 'var(--primary)' : 'var(--border)'}; background: ${selectedCategory === cat.id ? 'var(--primary)' : '#FFFFFF'}; color: ${selectedCategory === cat.id ? '#FFFFFF' : 'var(--text-muted)'}; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.2s;"
                  >
                    <span>${cat.icon}</span>
                    <span>${cat.label.split(' ')[0]}</span>
                  </button>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Schemes Grid -->
          <div style="display: flex; flex-direction: column; gap: 20px; margin-bottom: 32px;">
            ${filtered.length > 0 ? filtered.map(s => `
              <div class="card" id="scheme-card-${s.id}" style="padding: 24px; transition: box-shadow 0.2s;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; flex-wrap: wrap; margin-bottom: 14px;">
                  <div style="display: flex; align-items: flex-start; gap: 14px;">
                    <div style="width: 48px; height: 48px; border-radius: 12px; background: var(--bg-card-subtle); display: flex; align-items: center; justify-content: center; font-size: 26px; border: 1px solid var(--border);">
                      ${s.icon}
                    </div>
                    <div>
                      <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                        <h2 style="margin: 0; font-size: 20px; color: var(--text-main); font-weight: 700;">${s.name}</h2>
                        <span class="badge" style="background: ${s.badgeColor}15; color: ${s.badgeColor}; font-weight: 700; font-size: 11px;">
                          ${s.badge}
                        </span>
                      </div>
                      <div style="font-size: 13px; color: var(--text-muted); margin-top: 3px;">
                        ${s.fullName}
                      </div>
                    </div>
                  </div>

                  <a href="${s.officialUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary" style="width: auto; padding: 8px 18px; font-size: 12.5px; text-decoration: none;">
                    <span>Official Portal</span>
                    <span style="font-size: 10px;">↗</span>
                  </a>
                </div>

                <p style="font-size: 14px; color: var(--text-main); line-height: 1.5; margin-bottom: 16px;">
                  ${s.shortDesc}
                </p>

                <!-- Subsidy Benefit Highlight Box -->
                <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px 16px; margin-bottom: 18px; font-size: 13px; color: #1E293B;">
                  <strong style="color: var(--primary);">💰 Subsidy & Benefit Structure:</strong> ${s.subsidyDetails}
                </div>

                <!-- 3 Details Columns (Components, Eligibility, Documents) -->
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 16px;">
                  <!-- Components / Scope -->
                  <div style="background: #FFFFFF; border: 1px solid var(--border); border-radius: 8px; padding: 14px;">
                    <div style="font-size: 11px; font-weight: 700; color: var(--primary); text-transform: uppercase; margin-bottom: 8px;">
                      Key Components
                    </div>
                    <ul style="margin: 0; padding-left: 16px; font-size: 12px; color: var(--text-muted); line-height: 1.5;">
                      ${s.components.map(c => `
                        <li style="margin-bottom: 6px;">
                          <strong>${c.name}:</strong> ${c.detail}
                        </li>
                      `).join('')}
                    </ul>
                  </div>

                  <!-- Eligibility Checklist -->
                  <div style="background: #FFFFFF; border: 1px solid var(--border); border-radius: 8px; padding: 14px;">
                    <div style="font-size: 11px; font-weight: 700; color: #2563EB; text-transform: uppercase; margin-bottom: 8px;">
                      Eligibility Criteria
                    </div>
                    <ul style="margin: 0; padding-left: 16px; font-size: 12px; color: var(--text-muted); line-height: 1.5;">
                      ${s.eligibility.map(e => `
                        <li style="margin-bottom: 6px;">${e}</li>
                      `).join('')}
                    </ul>
                  </div>

                  <!-- Required Documents -->
                  <div style="background: #FFFFFF; border: 1px solid var(--border); border-radius: 8px; padding: 14px;">
                    <div style="font-size: 11px; font-weight: 700; color: #D97706; text-transform: uppercase; margin-bottom: 8px;">
                      Required Documents
                    </div>
                    <ul style="margin: 0; padding-left: 16px; font-size: 12px; color: var(--text-muted); line-height: 1.5;">
                      ${s.documents.map(d => `
                        <li style="margin-bottom: 6px;">📄 ${d}</li>
                      `).join('')}
                    </ul>
                  </div>
                </div>

                <!-- Footer How to Apply -->
                <div style="border-top: 1px solid var(--border); padding-top: 12px; display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: var(--text-muted); flex-wrap: wrap; gap: 8px;">
                  <div>
                    <strong>How to Apply:</strong> ${s.howToApply}
                  </div>
                  <div style="font-family: monospace;">
                    Portal: <a href="${s.officialUrl}" target="_blank" rel="noopener noreferrer" style="color: var(--primary); font-weight: 600;">${s.portalLabel}</a>
                  </div>
                </div>
              </div>
            `).join('') : `
              <div class="card" style="padding: 40px; text-align: center; color: var(--text-muted);">
                <div style="font-size: 36px; margin-bottom: 10px;">🔍</div>
                <h3>No schemes match your search criteria.</h3>
                <p style="font-size: 13px;">Try clearing filters or searching for terms like "solar", "insurance", "pumps", or "subsidies".</p>
              </div>
            `}
          </div>

          <!-- Quick Eligibility Modal Container -->
          <div id="eligibility-modal-backdrop" class="rms-modal-backdrop" style="display: none;">
            <div class="rms-modal-dialog" style="max-width: 600px;">
              <div class="rms-modal-header">
                <div>
                  <div style="font-size: 11px; text-transform: uppercase; color: var(--primary); font-weight: 700;">
                    Interactive Subsidies & Benefits Advisor
                  </div>
                  <h3 style="margin: 2px 0 0; font-size: 18px; color: var(--text-main); font-weight: 700;">
                    Farmer Scheme Eligibility Checker
                  </h3>
                </div>
                <button type="button" class="rms-modal-close" onclick="SchemesView.closeModal()">✕</button>
              </div>

              <div class="rms-modal-body" style="padding: 20px;">
                <div style="margin-bottom: 16px;">
                  <label style="display: block; font-size: 12px; font-weight: 600; margin-bottom: 6px;">1. What is your total agricultural land holding?</label>
                  <select id="modal-elig-land" class="select-field" style="width: 100%; padding: 8px 12px; border: 1px solid var(--border); border-radius: 6px;">
                    <option value="small">Small & Marginal Farmer (Less than 2 Hectares / 5 Acres)</option>
                    <option value="medium">Medium Farmer (2 to 4 Hectares / 5 to 10 Acres)</option>
                    <option value="large">Large Farmer (Above 4 Hectares / 10+ Acres)</option>
                  </select>
                </div>

                <div style="margin-bottom: 16px;">
                  <label style="display: block; font-size: 12px; font-weight: 600; margin-bottom: 6px;">2. What type of water source / pump do you currently use?</label>
                  <select id="modal-elig-pump" class="select-field" style="width: 100%; padding: 8px 12px; border: 1px solid var(--border); border-radius: 6px;">
                    <option value="diesel">Diesel Pump (Want to switch to Solar via PM-KUSUM Component B)</option>
                    <option value="electric">Grid-Connected Tubewell (Want solar feeder subsidy via PM-KUSUM Component C)</option>
                    <option value="none">No Pump Yet (Require complete new Solar Pump unit)</option>
                  </select>
                </div>

                <div style="margin-bottom: 16px;">
                  <label style="display: block; font-size: 12px; font-weight: 600; margin-bottom: 6px;">3. Have you completed Aadhaar e-KYC on PM-KISAN?</label>
                  <select id="modal-elig-kyc" class="select-field" style="width: 100%; padding: 8px 12px; border: 1px solid var(--border); border-radius: 6px;">
                    <option value="yes">Yes, Aadhaar is linked and active</option>
                    <option value="no">Not yet / Pending verification</option>
                  </select>
                </div>

                <!-- Result Advice Box -->
                <div id="modal-elig-result" style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 8px; padding: 14px; font-size: 13px; color: #166534; line-height: 1.5;">
                  <strong>✅ Eligible High-Value Schemes for Your Farm:</strong>
                  <ul style="margin: 6px 0 0; padding-left: 18px;">
                    <li><strong>PM-KUSUM Component B:</strong> You qualify for 60% subsidy on a 3 HP – 7.5 HP standalone solar pump.</li>
                    <li><strong>PM-KISAN:</strong> 100% eligible for ₹6,000/yr direct income transfer.</li>
                    <li><strong>PMKSY Drip Subsidy:</strong> Small/Marginal status unlocks 55% maximum micro-irrigation grant.</li>
                  </ul>
                </div>
              </div>

              <div class="rms-modal-footer">
                <button type="button" class="btn-primary" onclick="SchemesView.closeModal()" style="width: auto; padding: 8px 24px;">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    },

    mount() {
      // Category buttons
      document.querySelectorAll('.btn-schemes-cat').forEach(btn => {
        btn.addEventListener('click', () => {
          selectedCategory = btn.getAttribute('data-cat');
          App.refreshView();
        });
      });

      // Search field
      const searchInput = document.getElementById('schemes-search-input');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          searchQuery = e.target.value;
          App.refreshView();
        });
      }

      // Quick Eligibility Checker Modal
      const eligBtn = document.getElementById('btn-eligibility-checker');
      if (eligBtn) {
        eligBtn.addEventListener('click', () => {
          const modal = document.getElementById('eligibility-modal-backdrop');
          if (modal) modal.style.display = 'flex';
        });
      }

      // Modal Inputs Change
      ['modal-elig-land', 'modal-elig-pump', 'modal-elig-kyc'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.addEventListener('change', updateEligibilityResult);
        }
      });
    },

    filterBy(category) {
      selectedCategory = category;
      App.refreshView();
      const el = document.getElementById('schemes-search-input');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    },

    closeModal() {
      const modal = document.getElementById('eligibility-modal-backdrop');
      if (modal) modal.style.display = 'none';
    },

    unmount() {}
  };

  function updateEligibilityResult() {
    const land = document.getElementById('modal-elig-land')?.value || 'small';
    const pump = document.getElementById('modal-elig-pump')?.value || 'diesel';
    const kyc = document.getElementById('modal-elig-kyc')?.value || 'yes';
    const resBox = document.getElementById('modal-elig-result');
    if (!resBox) return;

    let items = [];
    if (pump === 'diesel' || pump === 'none') {
      items.push(`<strong>PM-KUSUM Component B:</strong> You qualify for up to 60% subsidy on a 3 HP – 7.5 HP standalone solar pump (farmer pays only 10% upfront).`);
    } else {
      items.push(`<strong>PM-KUSUM Component C:</strong> You qualify for 60% subsidy to solarize your existing electric pump and earn revenue by selling surplus units to the grid.`);
    }

    if (land === 'small') {
      items.push(`<strong>PMKSY Micro-Irrigation:</strong> Small/Marginal landholding (< 2 Ha) entitles you to the top-tier 55% subsidy on Drip and Sprinkler systems.`);
      items.push(`<strong>Kisan Credit Card (KCC):</strong> Collateral-free credit up to ₹1.60 Lakh at 4% subsidized interest rate.`);
    } else {
      items.push(`<strong>PMKSY Micro-Irrigation:</strong> You qualify for 45% standard subsidy on Drip and Sprinkler irrigation setups.`);
    }

    if (kyc === 'yes') {
      items.push(`<strong>PM-KISAN:</strong> ₹6,000/year annual support active in your bank account.`);
    } else {
      items.push(`<strong>PM-KISAN Action Needed:</strong> Complete Aadhaar e-KYC on pmkisan.gov.in to unblock your ₹2,000 four-monthly installments.`);
    }

    items.push(`<strong>PM Fasal Bima (PMFBY):</strong> Eligible for full crop loss insurance at nominal 1.5% - 2.0% premium.`);

    resBox.innerHTML = `
      <strong>✅ Tailored Scheme Recommendations:</strong>
      <ul style="margin: 6px 0 0; padding-left: 18px;">
        ${items.map(it => `<li style="margin-bottom: 4px;">${it}</li>`).join('')}
      </ul>
    `;
  }
})();

window.SchemesView = SchemesView;

/**
 * SmartKisan Web Platform - Fields & GIS View
 * Farm Multi-Parcel Mapping, Crop Inventory & Agrarian Agronomy
 */

const FieldsView = {
  mapInstance: null,

  render() {
    return `
      <div class="page-container">
        <!-- View Header -->
        <div class="dashboard-header">
          <div>
            <h1 class="welcome-title">
              <span>🗺️ Farm GIS & Crop Inventory</span>
            </h1>
            <p class="welcome-subtitle">
              Satellite boundaries, agronomic crop tracking, soil properties, and parcel water allocation
            </p>
          </div>

          <div class="header-actions">
            <button type="button" class="btn-primary" id="btn-open-add-field" style="width: auto;">
              <span>+ Add Field Parcel</span>
            </button>
          </div>
        </div>

        <!-- GIS Satellite Map Panel -->
        <div class="dash-panel" style="padding: 16px; margin-bottom: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;">
            <div style="font-size: 15px; font-weight: 700; display: flex; align-items: center; gap: 8px;">
              <span>🛰️</span>
              <span>ArcGIS High-Resolution Satellite Parcel Boundaries</span>
            </div>
            <div class="map-overlay-controls" style="position: static; box-shadow: none; padding: 0;">
              <button type="button" class="map-filter-chip active" data-fview="all">All Parcels</button>
              <button type="button" class="map-filter-chip" data-fview="wheat">Wheat</button>
              <button type="button" class="map-filter-chip" data-fview="polyhouse">Polyhouse</button>
              <button type="button" class="map-filter-chip" data-fview="cotton">Cotton</button>
            </div>
          </div>

          <div class="map-container" style="height: 380px;">
            <div id="fields-gis-map" style="width: 100%; height: 100%;"></div>
          </div>
        </div>

        <!-- Field Parcels Grid -->
        <div class="panel-header" style="margin-bottom: 16px;">
          <h2 style="font-size: 18px; font-weight: 700;">Cultivated Parcels & Crop Profiles</h2>
          <span class="panel-action" id="total-parcels-count">4 Parcels • 18.5 Acres Total</span>
        </div>

        <div class="pumps-grid" id="fields-cards-grid" style="grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));">
          <div style="padding: 40px; text-align: center; color: var(--text-muted); grid-column: 1/-1;">
            Loading field parcels...
          </div>
        </div>
      </div>

      <!-- Add Field Modal -->
      <div id="modal-add-field" class="modal-backdrop" style="display: none;">
        <div class="modal-card">
          <div class="modal-header">
            <h3>Add New Field Parcel</h3>
            <button type="button" class="btn-close-modal" id="btn-close-add-field">✕</button>
          </div>
          <form id="form-add-field" style="padding: 20px;">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Parcel Name *</label>
                <input type="text" id="field-name" class="form-input" placeholder="e.g. West Parcel D" required />
              </div>
              <div class="form-group">
                <label class="form-label">Area (Acres) *</label>
                <input type="number" step="0.5" id="field-area" class="form-input" placeholder="e.g. 4.0" required />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Cultivated Crop *</label>
                <input type="text" id="field-crop" class="form-input" placeholder="e.g. Mustard / Soybean" required />
              </div>
              <div class="form-group">
                <label class="form-label">Seed Variety</label>
                <input type="text" id="field-variety" class="form-input" placeholder="e.g. Pusa Bold / Local Hybrid" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Soil Type</label>
                <select id="field-soil" class="form-input" style="padding: 10px 14px;">
                  <option value="Alluvial Loam">Alluvial Loam</option>
                  <option value="Sandy Loam">Sandy Loam</option>
                  <option value="Black Cotton Clay">Black Cotton Clay</option>
                  <option value="Red Sandy">Red Sandy Loam</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Irrigation Method</label>
                <select id="field-irrigation" class="form-input" style="padding: 10px 14px;">
                  <option value="Drip Fertigation">Drip Fertigation</option>
                  <option value="Sprinkler">Micro Sprinkler</option>
                  <option value="Furrow / Flood">Furrow / Flood</option>
                </select>
              </div>
            </div>

            <button type="submit" class="btn-primary" style="margin-top: 10px;">
              <span>Save & Map Parcel</span>
            </button>
          </form>
        </div>
      </div>
    `;
  },

  async mount() {
    this.initMap();
    await this.loadFields();
    this.bindModals();
  },

  initMap() {
    const mapEl = document.getElementById('fields-gis-map');
    if (!mapEl || typeof L === 'undefined') return;

    try {
      if (this.mapInstance) {
        this.mapInstance.remove();
      }

      const centerCoords = [30.9010, 75.8573];
      const map = L.map('fields-gis-map', {
        zoomControl: true,
        scrollWheelZoom: true
      }).setView(centerCoords, 15);

      // Satellite Imagery
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Esri, Maxar, Earthstar Geographics',
        maxZoom: 18
      }).addTo(map);

      // Field Polygons
      const parcels = [
        {
          name: 'North Parcel A (Wheat)',
          color: '#2E7D32',
          crop: 'Wheat HD-2967 • 6.5 Acres',
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
          crop: 'Bell Pepper • 2.0 Acres',
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
          crop: 'Bt Cotton • 5.5 Acres',
          coords: [
            [30.8985, 75.8560],
            [30.9005, 75.8595],
            [30.8985, 75.8620],
            [30.8965, 75.8580]
          ]
        },
        {
          name: 'East Parcel C (Tomato)',
          color: '#EF4444',
          crop: 'Tomato • 4.5 Acres',
          coords: [
            [30.9015, 75.8615],
            [30.9040, 75.8645],
            [30.9020, 75.8665],
            [30.8995, 75.8635]
          ]
        }
      ];

      parcels.forEach(p => {
        L.polygon(p.coords, {
          color: p.color,
          weight: 2,
          opacity: 0.95,
          fillColor: p.color,
          fillOpacity: 0.4
        }).addTo(map).bindPopup(`
          <div style="font-family: inherit;">
            <strong style="color: ${p.color}; font-size: 14px;">${p.name}</strong><br/>
            <span>${p.crop}</span><br/>
            <span style="font-size: 11px; color: #666;">Soil Moisture: Optimal • Connected to IoT Probes</span>
          </div>
        `);
      });

      this.mapInstance = map;
    } catch (e) {
      console.warn('Fields map init failed:', e);
    }
  },

  async loadFields() {
    const container = document.getElementById('fields-cards-grid');
    if (!container) return;

    try {
      const res = await API.fields.getAll();
      const fields = res.fields || [];

      const totalAcres = fields.reduce((sum, f) => sum + (f.area_acres || 0), 0);
      const countEl = document.getElementById('total-parcels-count');
      if (countEl) countEl.textContent = `${fields.length} Parcels • ${totalAcres.toFixed(1)} Acres Total`;

      container.innerHTML = fields.map(field => {
        const moisture = field.soil_moisture || 60;
        const moistureClass = moisture >= 60 ? 'optimal' : (moisture >= 45 ? 'low' : 'critical');
        const moistureLabel = moisture >= 60 ? 'Optimal' : (moisture >= 45 ? 'Needs Irrigation' : 'Critical');
        const badgeColor = moisture >= 60 ? '#10B981' : (moisture >= 45 ? '#F59E0B' : '#EF4444');

        return `
          <div class="dash-panel" style="margin-bottom: 0; background: #FFFFFF; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); border: 1px solid var(--border); padding: 22px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
              <div>
                <h3 style="font-size: 17px; font-weight: 700; color: var(--text-main);">${field.name}</h3>
                <div style="font-size: 13px; color: var(--primary); font-weight: 600; margin-top: 2px;">
                  🌱 ${field.crop} <span style="color: var(--text-muted); font-weight: 400;">(${field.variety || 'Standard'})</span>
                </div>
              </div>
              <span style="background: var(--primary-50); color: var(--primary); font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: var(--radius-full); border: 1px solid var(--primary-100);">
                ${field.area_acres} Acres
              </span>
            </div>

            <!-- Agronomic specs -->
            <div class="pump-telemetry-row" style="grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 16px; background: var(--bg-card-subtle); padding: 10px;">
              <div class="telemetry-item">
                Soil Type
                <strong>${field.soil_type || 'Loamy'}</strong>
              </div>
              <div class="telemetry-item">
                Irrigation
                <strong>${field.irrigation_type || 'Drip'}</strong>
              </div>
              <div class="telemetry-item">
                Sowing Date
                <strong>${field.sowing_date || 'Winter 2025'}</strong>
              </div>
              <div class="telemetry-item">
                Water Source
                <strong>${field.pump_name || 'Tubewell 1'}</strong>
              </div>
            </div>

            <!-- Growth Progress Bar -->
            <div style="margin-bottom: 14px;">
              <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 5px;">
                <span style="color: var(--text-muted);">Growth Stage: <strong>${field.growth_stage || 'Vegetative (45%)'}</strong></span>
              </div>
              <div class="progress-bar-bg" style="height: 8px;">
                <div class="progress-bar-fill optimal" style="width: 65%;"></div>
              </div>
            </div>

            <!-- Soil Moisture Bar -->
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 5px;">
                <span style="color: var(--text-muted);">Soil Moisture:</span>
                <strong style="color: ${badgeColor};">${moisture}% • ${moistureLabel}</strong>
              </div>
              <div class="progress-bar-bg" style="height: 8px;">
                <div class="progress-bar-fill ${moistureClass}" style="width: ${moisture}%;"></div>
              </div>
            </div>
          </div>
        `;
      }).join('');

    } catch (e) {
      console.error(e);
    }
  },

  bindModals() {
    const openBtn = document.getElementById('btn-open-add-field');
    const closeBtn = document.getElementById('btn-close-add-field');
    const modal = document.getElementById('modal-add-field');
    const form = document.getElementById('form-add-field');

    if (openBtn && modal) {
      openBtn.addEventListener('click', () => { modal.style.display = 'flex'; });
    }
    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });
    }

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('field-name').value.trim();
        const area = document.getElementById('field-area').value;
        const crop = document.getElementById('field-crop').value.trim();
        const variety = document.getElementById('field-variety').value.trim();
        const soil = document.getElementById('field-soil').value;
        const irrigation = document.getElementById('field-irrigation').value;

        try {
          await API.fields.create({
            name,
            area_acres: area,
            crop,
            variety,
            soil_type: soil,
            irrigation_type: irrigation
          });
          window.showToast(`Field parcel "${name}" created!`, 'success');
          modal.style.display = 'none';
          form.reset();
          await this.loadFields();
        } catch (err) {
          window.showToast(`Error: ${err.message}`, 'error');
        }
      });
    }
  },

  unmount() {
    if (this.mapInstance) {
      try { this.mapInstance.remove(); } catch (e) {}
      this.mapInstance = null;
    }
  }
};

window.FieldsView = FieldsView;

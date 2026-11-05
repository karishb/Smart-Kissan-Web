/**
 * SmartKisan Web Platform - Reports & DSR View
 * Agrarian Water Accounting, Irrigation Audit & Excel Export Engine
 */

const ReportsView = {
  render() {
    return `
      <div class="page-container">
        <!-- View Header -->
        <div class="dashboard-header">
          <div>
            <h1 class="welcome-title">
              <span>📊 Agrarian DSR & Water Resource Audit</span>
            </h1>
            <p class="welcome-subtitle">
              Detailed daily irrigation logs, electrical power analytics, parcel distribution, and audit-ready data export
            </p>
          </div>

          <div class="header-actions">
            <button type="button" class="btn-refresh" id="btn-print-dsr" style="border-color: var(--border);">
              <span>🖨️</span>
              <span>Print / PDF</span>
            </button>
            <button type="button" class="btn-primary" id="btn-export-excel" style="width: auto;">
              <span>📥 Export Excel (CSV)</span>
            </button>
          </div>
        </div>

        <!-- Audit Summary Cards -->
        <div class="kpi-grid" style="margin-bottom: 24px;">
          <div class="kpi-card">
            <div class="kpi-icon-box blue"><span>💧</span></div>
            <div class="kpi-info">
              <div class="kpi-label">Cumulative Water Discharged</div>
              <div class="kpi-value">4,850 <span style="font-size: 14px; font-weight: 500;">Litres</span></div>
              <div class="kpi-subtext">Across 4 crop parcels</div>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-icon-box green"><span>⏱️</span></div>
            <div class="kpi-info">
              <div class="kpi-label">Total Pumping Duration</div>
              <div class="kpi-value">5.2 <span style="font-size: 14px; font-weight: 500;">Hours</span></div>
              <div class="kpi-subtext">4 completed irrigation cycles</div>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-icon-box amber"><span>⚡</span></div>
            <div class="kpi-info">
              <div class="kpi-label">Electrical Power Utilized</div>
              <div class="kpi-value">12.4 <span style="font-size: 14px; font-weight: 500;">kWh</span></div>
              <div class="kpi-subtext">Grid & Solar blended</div>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-icon-box earth"><span>🌱</span></div>
            <div class="kpi-info">
              <div class="kpi-label">Irrigation Efficiency</div>
              <div class="kpi-value">94.2%</div>
              <div class="kpi-subtext">Zero runoff detected</div>
            </div>
          </div>
        </div>

        <!-- Filter Bar -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div style="display: flex; gap: 8px;">
            <button type="button" class="map-filter-chip active">Today (05 Nov 2026)</button>
            <button type="button" class="map-filter-chip">Last 7 Days</button>
            <button type="button" class="map-filter-chip">Month-to-Date</button>
          </div>

          <div style="font-size: 13px; color: var(--text-muted);">
            Report generated for: <strong>SmartKisan Farm Portal (Ludhiana Belt)</strong>
          </div>
        </div>

        <!-- Detailed Irrigation Logs Table -->
        <div class="dash-panel" style="padding: 0; overflow: hidden; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); border: 1px solid var(--border);">
          <div style="padding: 18px 24px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; background: #FFFFFF;">
            <h3 style="font-size: 16px; font-weight: 700;">Daily Irrigation Run Audit Trail</h3>
            <span class="badge" style="background: var(--primary-50); color: var(--primary); font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: var(--radius-full);">
              Verified Audit Data
            </span>
          </div>

          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 13px;">
              <thead>
                <tr style="background: var(--bg-card-subtle); color: var(--text-muted); font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid var(--border);">
                  <th style="padding: 12px 20px;">Time Window</th>
                  <th style="padding: 12px 16px;">Pump / Controller</th>
                  <th style="padding: 12px 16px;">Target Parcel & Crop</th>
                  <th style="padding: 12px 16px;">Duration</th>
                  <th style="padding: 12px 16px;">Volume (Litres)</th>
                  <th style="padding: 12px 16px;">Energy (kWh)</th>
                  <th style="padding: 12px 16px;">Trigger Mode</th>
                  <th style="padding: 12px 20px;">Audit Status</th>
                </tr>
              </thead>
              <tbody id="reports-table-body" style="background: #FFFFFF;">
                <tr style="border-bottom: 1px solid var(--border);">
                  <td style="padding: 14px 20px; font-weight: 600;">06:00 - 08:30 IST</td>
                  <td style="padding: 14px 16px;">Tubewell 1 (7.5 HP)</td>
                  <td style="padding: 14px 16px;">North Parcel A (Wheat)</td>
                  <td style="padding: 14px 16px;">150 mins</td>
                  <td style="padding: 14px 16px; font-weight: 700; color: var(--primary);">2,450 L</td>
                  <td style="padding: 14px 16px;">6.2 kWh</td>
                  <td style="padding: 14px 16px;"><span class="mode-badge schedule">SCHEDULE</span></td>
                  <td style="padding: 14px 20px;"><span style="color: var(--success); font-weight: 600;">✓ Completed</span></td>
                </tr>

                <tr style="border-bottom: 1px solid var(--border);">
                  <td style="padding: 14px 20px; font-weight: 600;">09:15 - 10:45 IST</td>
                  <td style="padding: 14px 16px;">Drip System Pump 4 (3.0 HP)</td>
                  <td style="padding: 14px 16px;">East Parcel C (Tomato)</td>
                  <td style="padding: 14px 16px;">90 mins</td>
                  <td style="padding: 14px 16px; font-weight: 700; color: var(--primary);">1,200 L</td>
                  <td style="padding: 14px 16px;">3.1 kWh</td>
                  <td style="padding: 14px 16px;"><span class="mode-badge ai">AI ADAPTIVE</span></td>
                  <td style="padding: 14px 20px;"><span style="color: var(--success); font-weight: 600;">✓ Completed</span></td>
                </tr>

                <tr style="border-bottom: 1px solid var(--border);">
                  <td style="padding: 14px 20px; font-weight: 600;">14:00 - 16:00 IST</td>
                  <td style="padding: 14px 16px;">Solar Pump 2 (5.0 HP)</td>
                  <td style="padding: 14px 16px;">Polyhouse 1 (Bell Pepper)</td>
                  <td style="padding: 14px 16px;">120 mins</td>
                  <td style="padding: 14px 16px; font-weight: 700; color: var(--primary);">1,200 L</td>
                  <td style="padding: 14px 16px;">3.1 kWh (Solar)</td>
                  <td style="padding: 14px 16px;"><span class="mode-badge auto">AUTO SENSOR</span></td>
                  <td style="padding: 14px 20px;"><span style="color: var(--success); font-weight: 600;">✓ Completed</span></td>
                </tr>

                <tr style="border-bottom: 1px solid var(--border);">
                  <td style="padding: 14px 20px; font-weight: 600;">17:00 - 17:30 IST</td>
                  <td style="padding: 14px 16px;">Borewell 3 (10.0 HP)</td>
                  <td style="padding: 14px 16px;">South Parcel B (Cotton)</td>
                  <td style="padding: 14px 16px;">30 mins</td>
                  <td style="padding: 14px 16px; font-weight: 700; color: var(--primary);">0 L (Test)</td>
                  <td style="padding: 14px 16px;">0.0 kWh</td>
                  <td style="padding: 14px 16px;"><span class="mode-badge">MANUAL</span></td>
                  <td style="padding: 14px 20px;"><span style="color: var(--text-muted); font-weight: 600;">System Check</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style="padding: 16px 24px; background: var(--bg-card-subtle); display: flex; justify-content: space-between; align-items: center; font-size: 13px;">
            <span>Showing 4 irrigation runs for today</span>
            <span><strong>Total Water Pumped: 4,850 Litres</strong></span>
          </div>
        </div>
      </div>
    `;
  },

  mount() {
    // Export to Excel / CSV
    const exportBtn = document.getElementById('btn-export-excel');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const csvContent = [
          ['Date', 'Time Window', 'Pump Controller', 'Target Parcel', 'Crop', 'Duration (mins)', 'Volume (L)', 'Energy (kWh)', 'Trigger Mode', 'Status'],
          ['2026-11-05', '06:00 - 08:30 IST', 'Tubewell 1 (7.5 HP)', 'North Parcel A', 'Wheat', '150', '2450', '6.2', 'Schedule', 'Completed'],
          ['2026-11-05', '09:15 - 10:45 IST', 'Drip System Pump 4 (3.0 HP)', 'East Parcel C', 'Tomato', '90', '1200', '3.1', 'AI Adaptive', 'Completed'],
          ['2026-11-05', '14:00 - 16:00 IST', 'Solar Pump 2 (5.0 HP)', 'Polyhouse 1', 'Bell Pepper', '120', '1200', '3.1', 'Auto Sensor', 'Completed'],
          ['2026-11-05', '17:00 - 17:30 IST', 'Borewell 3 (10.0 HP)', 'South Parcel B', 'Cotton', '30', '0', '0.0', 'Manual', 'System Check']
        ].map(e => e.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `SmartKisan_Irrigation_DSR_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.showToast('DSR Excel/CSV report downloaded successfully.', 'success');
      });
    }

    // Print
    const printBtn = document.getElementById('btn-print-dsr');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }
  },

  unmount() {}
};

window.ReportsView = ReportsView;

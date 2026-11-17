/**
 * SmartKisan Web Platform - RMS Hardware Telemetry & Device Heartbeat Logs View
 * Dedicated Web-only live engineering telemetry feed matching rmssystem.in/CNP/log.php
 * Dual-theme support: SmartKisan Agrarian Brand Theme (Default) & Industrial RMS Dark Theme
 * Real-time hardware heartbeat packets, electrical & agrarian telemetry, and GIS mapping.
 */

const RmsLogsView = (() => {
  let streamTimer = null;
  let isStreaming = true;
  let searchQuery = '';
  let statusFilter = 'all';
  let modalMapInstance = null;
  let logsData = [];
  let currentTheme = localStorage.getItem('smartkisan_rms_theme') || 'brand'; // 'brand' (SmartKisan green/white) or 'dark' (industrial navy)

  // Seed initial device master data
  const deviceMaster = [
    {
      rmsNo: '471',
      imei: '864129051614104',
      name: 'Tubewell 1',
      parcel: 'North Parcel A (Wheat)',
      power: 1,
      motor: 1,
      error: '00',
      voltage: 697.20,
      current: 12.20,
      frequency: 46,
      kwh: 1054.385,
      flowRate: 450,
      moisture: 68.2,
      lat: 30.901025,
      lng: 75.857312,
      gsm: 28
    },
    {
      rmsNo: '539',
      imei: '864129051846103',
      name: 'Solar Pump 2',
      parcel: 'Polyhouse 1 (Bell Pepper)',
      power: 1,
      motor: 0,
      error: '9999',
      voltage: 0.00,
      current: 0.00,
      frequency: 0,
      kwh: 652.296,
      flowRate: 0,
      moisture: 72.4,
      lat: 30.902410,
      lng: 75.858920,
      gsm: 28
    },
    {
      rmsNo: '476',
      imei: '864129051616247',
      name: 'Borewell 3',
      parcel: 'South Parcel B (Cotton)',
      power: 1,
      motor: 1,
      error: '04',
      voltage: 600.00,
      current: 5.50,
      frequency: 35,
      kwh: 1053.301,
      flowRate: 310,
      moisture: 42.1,
      lat: 30.898850,
      lng: 75.854210,
      gsm: 25
    },
    {
      rmsNo: '245',
      imei: '868951036953855',
      name: 'Drip System Pump 4',
      parcel: 'East Parcel C (Tomato)',
      power: 1,
      motor: 1,
      error: '00',
      voltage: 897.00,
      current: 11.90,
      frequency: 50,
      kwh: 5898.236,
      flowRate: 220,
      moisture: 60.5,
      lat: 30.903500,
      lng: 75.861200,
      gsm: 17
    },
    {
      rmsNo: '670',
      imei: '865190076938546',
      name: 'Canal Lift Pump 5',
      parcel: 'East Boundary Canal',
      power: 1,
      motor: 0,
      error: '10',
      voltage: 745.90,
      current: 0.00,
      frequency: 0,
      kwh: 4814.714,
      flowRate: 0,
      moisture: 55.0,
      lat: 30.904800,
      lng: 75.863100,
      gsm: 12
    },
    {
      rmsNo: '481',
      imei: '864129051624484',
      name: 'Sprinkler Booster 6',
      parcel: 'Orchard Parcel D (Guava)',
      power: 1,
      motor: 1,
      error: '00',
      voltage: 405.70,
      current: 8.80,
      frequency: 41,
      kwh: 1815.451,
      flowRate: 280,
      moisture: 64.8,
      lat: 30.897200,
      lng: 75.852100,
      gsm: 31
    },
    {
      rmsNo: '423',
      imei: '865190073307064',
      name: 'Deep Tubewell 7',
      parcel: 'West Parcel E (Mustard)',
      power: 1,
      motor: 1,
      error: '00',
      voltage: 547.40,
      current: 17.70,
      frequency: 44,
      kwh: 17061.745,
      flowRate: 520,
      moisture: 58.4,
      lat: 30.905600,
      lng: 75.850500,
      gsm: 29
    },
    {
      rmsNo: '470',
      imei: '864129051630749',
      name: 'Water Reservoir Pump 8',
      parcel: 'Central Farm Tank',
      power: 1,
      motor: 0,
      error: '10',
      voltage: 742.00,
      current: 0.00,
      frequency: 0,
      kwh: 8371.691,
      flowRate: 0,
      moisture: 78.0,
      lat: 30.900800,
      lng: 75.856400,
      gsm: 22
    },
    {
      rmsNo: '567',
      imei: '864129051599587',
      name: 'Submersible Pump 9',
      parcel: 'Sugarcane Plot F',
      power: 1,
      motor: 0,
      error: '00',
      voltage: 583.90,
      current: 0.00,
      frequency: 0,
      kwh: 1896.262,
      flowRate: 0,
      moisture: 62.0,
      lat: 30.896500,
      lng: 75.859000,
      gsm: 26
    },
    {
      rmsNo: '10',
      imei: '868951036980003',
      name: 'Fertigation Injector 10',
      parcel: 'Greenhouse B (Cucumber)',
      power: 1,
      motor: 1,
      error: '10',
      voltage: 578.00,
      current: 5.20,
      frequency: 50,
      kwh: 1357.092,
      flowRate: 150,
      moisture: 74.5,
      lat: 30.902900,
      lng: 75.860100,
      gsm: 19
    },
    {
      rmsNo: '102',
      imei: '868951036913503',
      name: 'Tubewell 11 (Remote)',
      parcel: 'Aligarh District Hub',
      power: 1,
      motor: 1,
      error: '10',
      voltage: 571.30,
      current: 10.80,
      frequency: 35,
      kwh: 5751.829,
      flowRate: 410,
      moisture: 52.0,
      lat: 28.244908,
      lng: 78.549221,
      gsm: 31
    },
    {
      rmsNo: '585',
      imei: '864129051635801',
      name: 'Solar Submersible 12',
      parcel: 'Solar Feeder Zone 3',
      power: 1,
      motor: 1,
      error: '08',
      voltage: 711.40,
      current: 8.50,
      frequency: 50,
      kwh: 8119.455,
      flowRate: 340,
      moisture: 61.3,
      lat: 30.904100,
      lng: 75.855200,
      gsm: 19
    },
    {
      rmsNo: '212',
      imei: '868951036976842',
      name: 'High-Discharge Pump 13',
      parcel: 'Bareilly Grain Belt',
      power: 1,
      motor: 1,
      error: '00',
      voltage: 725.00,
      current: 17.50,
      frequency: 50,
      kwh: 10168.144,
      flowRate: 600,
      moisture: 59.8,
      lat: 27.883124,
      lng: 80.598844,
      gsm: 17
    },
    {
      rmsNo: '228',
      imei: '868951036914171',
      name: 'Secondary Tubewell 14',
      parcel: 'North Parcel A (East Side)',
      power: 1,
      motor: 1,
      error: '00',
      voltage: 527.80,
      current: 8.70,
      frequency: 45,
      kwh: 20220.853,
      flowRate: 380,
      moisture: 67.4,
      lat: 30.901500,
      lng: 75.857900,
      gsm: 20
    },
    {
      rmsNo: '13',
      imei: '860651046932634',
      name: 'Borewell 15',
      parcel: 'South Parcel B (North End)',
      power: 1,
      motor: 0,
      error: '08',
      voltage: 685.00,
      current: 0.00,
      frequency: 0,
      kwh: 18900.407,
      flowRate: 0,
      moisture: 43.8,
      lat: 30.899200,
      lng: 75.854800,
      gsm: 20
    },
    {
      rmsNo: '255',
      imei: '865190076915182',
      name: 'Auxiliary Pump 16',
      parcel: 'East Boundary Channel',
      power: 1,
      motor: 0,
      error: '9999',
      voltage: 0.00,
      current: 0.00,
      frequency: 0,
      kwh: 31023.585,
      flowRate: 0,
      moisture: 56.1,
      lat: 30.904200,
      lng: 75.862500,
      gsm: 21
    },
    {
      rmsNo: '509',
      imei: '864129051847523',
      name: 'Solar Canal Pump 17',
      parcel: 'Canal Lift Siphon',
      power: 1,
      motor: 1,
      error: '09',
      voltage: 783.30,
      current: 8.80,
      frequency: 50,
      kwh: 10965.133,
      flowRate: 290,
      moisture: 63.5,
      lat: 30.905200,
      lng: 75.864000,
      gsm: 27
    },
    {
      rmsNo: '671',
      imei: '864129051873061',
      name: 'Sprinkler Pump 18',
      parcel: 'Fodder Grass Pasture',
      power: 1,
      motor: 1,
      error: '10',
      voltage: 755.50,
      current: 8.80,
      frequency: 44,
      kwh: 1207.963,
      flowRate: 310,
      moisture: 66.0,
      lat: 30.898000,
      lng: 75.851000,
      gsm: 18
    },
    {
      rmsNo: '412',
      imei: '865190073304865',
      name: 'Emergency Standby 19',
      parcel: 'Farm Headquarters Depot',
      power: 1,
      motor: 0,
      error: '9999',
      voltage: 0.00,
      current: 0.00,
      frequency: 0,
      kwh: 4544.477,
      flowRate: 0,
      moisture: 60.0,
      lat: 30.900100,
      lng: 75.856000,
      gsm: 21
    },
    {
      rmsNo: '55',
      imei: '868951036913076',
      name: 'Heavy Tubewell 20',
      parcel: 'Hathras Agro Station',
      power: 1,
      motor: 0,
      error: '10',
      voltage: 0.00,
      current: 0.00,
      frequency: 55,
      kwh: 18533.006,
      flowRate: 0,
      moisture: 49.5,
      lat: 28.164026,
      lng: 78.521861,
      gsm: 31
    }
  ];

  // Format real-time date string matching the screenshot: 'DD-MM-YYYY HH:mm:ss'
  const formatLogTimestamp = (date = new Date()) => {
    const pad = (n) => String(n).padStart(2, '0');
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear();
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  };

  // Seed initial log history with timestamps descending
  const initializeLogs = () => {
    logsData = [];
    const now = new Date();
    
    // Create 45 initial historical heartbeat packets
    for (let i = 0; i < 45; i++) {
      const devIndex = i % deviceMaster.length;
      const baseDev = deviceMaster[devIndex];
      const logTime = new Date(now.getTime() - i * 1800);
      
      const vJitter = baseDev.voltage > 0 ? (Math.random() * 6 - 3) : 0;
      const aJitter = baseDev.current > 0 ? (Math.random() * 0.4 - 0.2) : 0;
      const fJitter = baseDev.flowRate > 0 ? Math.floor(Math.random() * 10 - 5) : 0;
      const mJitter = (Math.random() * 0.4 - 0.2);

      logsData.push({
        id: `pkt-${Date.now()}-${i}`,
        sNo: i + 1,
        rmsNo: baseDev.rmsNo,
        imei: baseDev.imei,
        name: baseDev.name,
        parcel: baseDev.parcel,
        power: baseDev.power,
        motor: baseDev.motor,
        error: baseDev.error,
        voltage: +(baseDev.voltage + vJitter).toFixed(2),
        current: +(baseDev.current + aJitter).toFixed(2),
        frequency: baseDev.frequency,
        kwh: +(baseDev.kwh + (i * 0.042)).toFixed(3),
        flowRate: Math.max(0, baseDev.flowRate + fJitter),
        moisture: +(baseDev.moisture + mJitter).toFixed(1),
        lat: baseDev.lat,
        lng: baseDev.lng,
        gsm: Math.min(31, Math.max(10, baseDev.gsm + Math.floor(Math.random() * 3 - 1))),
        timestamp: formatLogTimestamp(logTime),
        isNew: false
      });
    }
  };

  // Push a live heartbeat packet
  const pushLiveHeartbeat = () => {
    const randomDev = deviceMaster[Math.floor(Math.random() * deviceMaster.length)];
    const now = new Date();
    
    const vJitter = randomDev.voltage > 0 ? (Math.random() * 5 - 2.5) : 0;
    const aJitter = randomDev.current > 0 ? (Math.random() * 0.3 - 0.15) : 0;
    const fJitter = randomDev.flowRate > 0 ? Math.floor(Math.random() * 8 - 4) : 0;
    const mJitter = (Math.random() * 0.3 - 0.15);

    const newLog = {
      id: `pkt-${Date.now()}`,
      sNo: 1,
      rmsNo: randomDev.rmsNo,
      imei: randomDev.imei,
      name: randomDev.name,
      parcel: randomDev.parcel,
      power: randomDev.power,
      motor: randomDev.motor,
      error: randomDev.error,
      voltage: +(randomDev.voltage + vJitter).toFixed(2),
      current: +(randomDev.current + aJitter).toFixed(2),
      frequency: randomDev.frequency,
      kwh: +(randomDev.kwh + (Math.random() * 0.05)).toFixed(3),
      flowRate: Math.max(0, randomDev.flowRate + fJitter),
      moisture: +(randomDev.moisture + mJitter).toFixed(1),
      lat: randomDev.lat,
      lng: randomDev.lng,
      gsm: Math.min(31, Math.max(10, randomDev.gsm + Math.floor(Math.random() * 3 - 1))),
      timestamp: formatLogTimestamp(now),
      isNew: true
    };

    logsData.unshift(newLog);
    if (logsData.length > 100) {
      logsData.pop();
    }

    logsData.forEach((row, idx) => {
      row.sNo = idx + 1;
    });

    renderTableBody();
    updateLiveMetrics();
  };

  // Get filtered logs
  const getFilteredLogs = () => {
    return logsData.filter(item => {
      const matchesSearch = !searchQuery || 
        item.rmsNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.imei.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.parcel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.error.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (statusFilter === 'running') return item.motor === 1;
      if (statusFilter === 'standby') return item.motor === 0;
      if (statusFilter === 'error') return item.error !== '00';
      return true;
    });
  };

  // Render Table Rows
  const renderTableBody = () => {
    const tbody = document.getElementById('rms-logs-tbody');
    if (!tbody) return;

    const filtered = getFilteredLogs();

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="15" style="padding: 30px; text-align: center; color: var(--text-muted); font-size: 14px;">
            🔍 No telemetry packets match the filter criteria.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map((row) => {
      // Motor error styling
      let errorBadge = `<span class="rms-badge-normal">00</span>`;
      let errorTitle = 'Normal Operation';
      if (row.error === '04') {
        errorBadge = `<span class="rms-badge-warn">04</span>`;
        errorTitle = 'Under-Voltage Protection Alert';
      } else if (row.error === '08') {
        errorBadge = `<span class="rms-badge-warn">08</span>`;
        errorTitle = 'Dry Run Borewell Protection';
      } else if (row.error === '09') {
        errorBadge = `<span class="rms-badge-danger">09</span>`;
        errorTitle = 'Over-Current Thermal Alert';
      } else if (row.error === '10') {
        errorBadge = `<span class="rms-badge-danger">10</span>`;
        errorTitle = 'Phase Failure / Unbalance Detected';
      } else if (row.error === '14') {
        errorBadge = `<span class="rms-badge-danger">14</span>`;
        errorTitle = 'Motor Stalled / Mechanical Jam';
      } else if (row.error === '9999') {
        errorBadge = `<span class="rms-badge-offline">9999</span>`;
        errorTitle = 'Node Offline / Standby Sleep';
      }

      // Signal indicator bar
      let gsmClass = 'signal-good';
      if (row.gsm < 15) gsmClass = 'signal-weak';
      else if (row.gsm < 22) gsmClass = 'signal-med';

      const rowClass = row.isNew ? 'rms-row-new' : '';

      return `
        <tr class="${rowClass}" data-rms="${row.rmsNo}">
          <td class="rms-cell-center rms-cell-sno">${row.sNo}</td>
          <td class="rms-cell-bold rms-cell-center rms-cell-unique">${row.rmsNo}</td>
          <td class="rms-cell-mono rms-cell-imei">${row.imei}</td>
          <td class="rms-cell-center">
            <span class="${row.power === 1 ? 'rms-val-on' : 'rms-val-off'}">${row.power}</span>
          </td>
          <td class="rms-cell-center">
            <span class="${row.motor === 1 ? 'rms-val-running' : 'rms-val-off'}">${row.motor}</span>
          </td>
          <td class="rms-cell-center" title="${errorTitle}">
            ${errorBadge}
          </td>
          <td class="rms-cell-right rms-cell-numeric">${row.voltage.toFixed(2)}</td>
          <td class="rms-cell-right rms-cell-numeric">${row.current.toFixed(2)}</td>
          <td class="rms-cell-center rms-cell-numeric">${row.frequency}</td>
          <td class="rms-cell-right rms-cell-numeric rms-cell-kwh">${row.kwh.toFixed(3)}</td>
          <td class="rms-cell-mono rms-cell-small">${row.lat.toFixed(6)}</td>
          <td class="rms-cell-mono rms-cell-small">${row.lng.toFixed(6)}</td>
          <td class="rms-cell-center">
            <span class="rms-gsm-pill ${gsmClass}" title="CSQ: ${row.gsm}/31">
              📶 ${row.gsm}
            </span>
          </td>
          <td class="rms-cell-center rms-cell-mono rms-cell-time">
            ${row.timestamp}
          </td>
          <td class="rms-cell-center">
            <button 
              type="button" 
              class="rms-map-pin-btn" 
              title="Locate ${row.name} on GIS Map" 
              onclick="RmsLogsView.openMapModal('${row.rmsNo}', '${row.name}', '${row.parcel}', ${row.lat}, ${row.lng}, ${row.voltage}, ${row.current}, ${row.flowRate}, ${row.moisture}, ${row.power}, ${row.motor})"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </button>
          </td>
        </tr>
      `;
    }).join('');

    setTimeout(() => {
      logsData.forEach(row => { row.isNew = false; });
    }, 1500);
  };

  // Update live stat bar
  const updateLiveMetrics = () => {
    const totalPacketsEl = document.getElementById('rms-stat-total');
    const runningMotorsEl = document.getElementById('rms-stat-running');
    const avgVoltageEl = document.getElementById('rms-stat-voltage');
    const networkHealthEl = document.getElementById('rms-stat-network');

    const running = logsData.filter(d => d.motor === 1).length;
    const activeVoltages = logsData.filter(d => d.voltage > 0).map(d => d.voltage);
    const avgV = activeVoltages.length ? (activeVoltages.reduce((a, b) => a + b, 0) / activeVoltages.length).toFixed(1) : '415.0';

    if (totalPacketsEl) totalPacketsEl.textContent = logsData.length;
    if (runningMotorsEl) runningMotorsEl.textContent = `${running} Active`;
    if (avgVoltageEl) avgVoltageEl.textContent = `${avgV} V`;
    if (networkHealthEl) networkHealthEl.textContent = '100% ONLINE';
  };

  // Toggle Theme between SmartKisan Brand Colors (Green & White) and Dark RMS Industrial
  const toggleTheme = () => {
    currentTheme = currentTheme === 'brand' ? 'dark' : 'brand';
    localStorage.setItem('smartkisan_rms_theme', currentTheme);

    const rootWrapper = document.getElementById('rms-view-root');
    const themeIcon = document.getElementById('rms-theme-icon');
    const themeLabel = document.getElementById('rms-theme-label');

    if (rootWrapper) {
      rootWrapper.className = `rms-view-container rms-theme-${currentTheme}`;
    }
    if (themeIcon) {
      themeIcon.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
    }
    if (themeLabel) {
      themeLabel.textContent = currentTheme === 'dark' ? 'SmartKisan Colors' : 'Industrial Dark';
    }

    window.showToast(`Switched to ${currentTheme === 'dark' ? 'Industrial RMS Dark Theme' : 'SmartKisan Brand Colors'}`, 'info');
  };

  // Open interactive GIS Map Modal
  const openMapModal = (rmsNo, name, parcel, lat, lng, voltage, current, flowRate, moisture, power, motor) => {
    let modal = document.getElementById('rms-map-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'rms-map-modal';
      modal.className = 'rms-modal-backdrop';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="rms-modal-dialog">
        <div class="rms-modal-header">
          <div>
            <div style="font-size: 11px; text-transform: uppercase; color: var(--primary); font-weight: 700; letter-spacing: 0.5px;">
              IoT Hardware GPS Geolocation
            </div>
            <h3 style="margin: 2px 0 0; color: var(--text-main); font-size: 18px; font-weight: 700;">
              RMS Node #${rmsNo} — ${name}
            </h3>
            <div style="font-size: 12px; color: var(--text-muted);">Field: ${parcel} | Coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}</div>
          </div>
          <button type="button" class="rms-modal-close" onclick="RmsLogsView.closeMapModal()">✕</button>
        </div>

        <div class="rms-modal-body">
          <div id="rms-modal-map" style="width: 100%; height: 320px; border-radius: 8px; background: #0F172A;"></div>
          
          <div class="rms-modal-telemetry-grid">
            <div class="rms-telemetry-item">
              <span class="rms-telemetry-lbl">Power State</span>
              <span class="rms-telemetry-val" style="color: ${power === 1 ? 'var(--primary)' : 'var(--text-muted)'}">${power === 1 ? '● ON (1)' : '○ STANDBY (0)'}</span>
            </div>
            <div class="rms-telemetry-item">
              <span class="rms-telemetry-lbl">Motor Status</span>
              <span class="rms-telemetry-val" style="color: ${motor === 1 ? '#0284C7' : 'var(--text-muted)'}">${motor === 1 ? '⚡ RUNNING (1)' : '⏸ STOPPED (0)'}</span>
            </div>
            <div class="rms-telemetry-item">
              <span class="rms-telemetry-lbl">3-Phase Voltage</span>
              <span class="rms-telemetry-val">${voltage.toFixed(1)} V</span>
            </div>
            <div class="rms-telemetry-item">
              <span class="rms-telemetry-lbl">Line Current</span>
              <span class="rms-telemetry-val">${current.toFixed(1)} A</span>
            </div>
            <div class="rms-telemetry-item">
              <span class="rms-telemetry-lbl">Discharge Rate</span>
              <span class="rms-telemetry-val">${flowRate} L/min</span>
            </div>
            <div class="rms-telemetry-item">
              <span class="rms-telemetry-lbl">Soil Moisture</span>
              <span class="rms-telemetry-val" style="color: var(--primary);">${moisture.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div class="rms-modal-footer">
          <button type="button" class="btn-refresh" onclick="RmsLogsView.closeMapModal()">
            Close
          </button>
          <a href="#/fields" class="btn-primary" style="width: auto; padding: 8px 18px; font-size: 13px; text-decoration: none;" onclick="RmsLogsView.closeMapModal()">
            Open Full Agrarian GIS →
          </a>
        </div>
      </div>
    `;

    modal.style.display = 'flex';

    setTimeout(() => {
      try {
        if (typeof L !== 'undefined') {
          if (modalMapInstance) {
            modalMapInstance.remove();
          }
          modalMapInstance = L.map('rms-modal-map', {
            center: [lat, lng],
            zoom: 16,
            zoomControl: true
          });

          L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Esri Satellite & SmartKisan GIS'
          }).addTo(modalMapInstance);

          const customMarker = L.circleMarker([lat, lng], {
            radius: 10,
            fillColor: motor === 1 ? '#2E7D32' : '#3B82F6',
            color: '#FFFFFF',
            weight: 3,
            opacity: 1,
            fillOpacity: 0.95
          }).addTo(modalMapInstance);

          customMarker.bindPopup(`
            <div style="font-family: sans-serif; font-size: 12px; color: #0F172A;">
              <strong>${name}</strong><br/>
              RMS No: ${rmsNo}<br/>
              Field: ${parcel}<br/>
              Flow: ${flowRate} L/min | Voltage: ${voltage}V
            </div>
          `).openPopup();
        }
      } catch (err) {
        console.warn('Leaflet modal render note:', err);
      }
    }, 120);
  };

  const closeMapModal = () => {
    const modal = document.getElementById('rms-map-modal');
    if (modal) modal.style.display = 'none';
    if (modalMapInstance) {
      try { modalMapInstance.remove(); } catch (e) {}
      modalMapInstance = null;
    }
  };

  // Export full table to CSV
  const exportCsv = () => {
    const rows = getFilteredLogs();
    const headers = [
      'S.No', 'RMS Unique No', 'IMEI No', 'Device Name', 'Farm Parcel',
      'Power Status', 'Motor Status', 'Motor Error Code', 'Voltage (V)',
      'Current (A)', 'Frequency (Hz)', 'kWh (Calculated)', 'Flow Rate (L/min)',
      'Soil Moisture (%)', 'Latitude', 'Longitude', 'GSM Signal (CSQ)', 'Log Date Time'
    ];

    const csvContent = [
      headers.join(','),
      ...rows.map(r => [
        r.sNo,
        `"${r.rmsNo}"`,
        `"${r.imei}"`,
        `"${r.name}"`,
        `"${r.parcel}"`,
        r.power,
        r.motor,
        `"${r.error}"`,
        r.voltage,
        r.current,
        r.frequency,
        r.kwh,
        r.flowRate,
        r.moisture,
        r.lat,
        r.lng,
        r.gsm,
        `"${r.timestamp}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `SmartKisan_RMS_Heartbeat_Logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.showToast('RMS Hardware Telemetry CSV exported successfully.', 'success');
  };

  return {
    render() {
      if (logsData.length === 0) {
        initializeLogs();
      }

      return `
        <div id="rms-view-root" class="rms-view-container rms-theme-${currentTheme}">
          <!-- View Header -->
          <div class="dashboard-header" style="margin-bottom: 20px;">
            <div>
              <h1 class="welcome-title" style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                <span>📶</span>
                <span>RMS Hardware Telemetry & Device Heartbeat Logs</span>
                <span class="rms-live-badge-brand">
                  <span class="rms-live-dot"></span>
                  <span>LIVE HARDWARE STREAM</span>
                </span>
              </h1>
              <p class="welcome-subtitle">
                Real-time raw packet telemetry stream, 3-phase electrical monitoring, fault diagnostics, and spatial GIS mapping
              </p>
            </div>

            <div class="header-actions">
              <button type="button" class="btn-refresh" id="btn-rms-theme-toggle" title="Switch between SmartKisan Brand Colors and Industrial Dark Theme">
                <span id="rms-theme-icon">${currentTheme === 'dark' ? '☀️' : '🌙'}</span>
                <span id="rms-theme-label">${currentTheme === 'dark' ? 'SmartKisan Colors' : 'Industrial Dark'}</span>
              </button>
              <button type="button" class="btn-primary" id="btn-rms-export" style="width: auto;">
                <span>📥 Export CSV</span>
              </button>
            </div>
          </div>

          <!-- KPI Summary Strip matching Dashboard -->
          <div class="kpi-grid" style="margin-bottom: 20px;">
            <div class="kpi-card">
              <div class="kpi-icon-box blue"><span>📡</span></div>
              <div class="kpi-info">
                <div class="kpi-label">Cumulative Heartbeats</div>
                <div class="kpi-value" id="rms-stat-total">${logsData.length}</div>
                <div class="kpi-subtext">Telemetry packets received today</div>
              </div>
            </div>

            <div class="kpi-card">
              <div class="kpi-icon-box green"><span>⚡</span></div>
              <div class="kpi-info">
                <div class="kpi-label">Active Running Motors</div>
                <div class="kpi-value" id="rms-stat-running" style="color: var(--primary);">-- Active</div>
                <div class="kpi-subtext">Discharging field pumps</div>
              </div>
            </div>

            <div class="kpi-card">
              <div class="kpi-icon-box amber"><span>🔌</span></div>
              <div class="kpi-info">
                <div class="kpi-label">Average Line Voltage</div>
                <div class="kpi-value" id="rms-stat-voltage">-- V</div>
                <div class="kpi-subtext">3-Phase electrical grid stability</div>
              </div>
            </div>

            <div class="kpi-card">
              <div class="kpi-icon-box purple"><span>📶</span></div>
              <div class="kpi-info">
                <div class="kpi-label">IoT Gateway Health</div>
                <div class="kpi-value" id="rms-stat-network" style="color: var(--success);">100% ONLINE</div>
                <div class="kpi-subtext">All telemetry nodes reporting</div>
              </div>
            </div>
          </div>

          <!-- Main Table Card -->
          <div class="card rms-card-container" style="padding: 0; overflow: hidden; margin-bottom: 24px;">
            <!-- Toolbar Actions -->
            <div class="rms-card-toolbar">
              <div class="rms-search-wrap">
                <span style="color: var(--text-muted); font-size: 14px;">🔍</span>
                <input 
                  type="text" 
                  id="rms-search-input" 
                  class="rms-search-field" 
                  placeholder="Search IMEI, RMS Unique No, Node Name, or Parcel..." 
                  value="${searchQuery}"
                />
              </div>

              <div class="rms-toolbar-actions">
                <select id="rms-status-filter" class="rms-filter-select">
                  <option value="all" ${statusFilter === 'all' ? 'selected' : ''}>All Telemetry Logs</option>
                  <option value="running" ${statusFilter === 'running' ? 'selected' : ''}>Motor Running (Status 1)</option>
                  <option value="standby" ${statusFilter === 'standby' ? 'selected' : ''}>Motor Standby (Status 0)</option>
                  <option value="error" ${statusFilter === 'error' ? 'selected' : ''}>Faults & Error Alerts</option>
                </select>

                <button type="button" class="rms-btn-action" id="btn-rms-stream-toggle" title="Pause or Resume Live Telemetry Stream">
                  <span id="rms-stream-icon">🔴</span>
                  <span id="rms-stream-text">Live 4.5s</span>
                </button>

                <button type="button" class="rms-btn-action" id="btn-rms-refresh" title="Force Telemetry Sync">
                  <span>🔄</span>
                </button>
              </div>
            </div>

            <!-- RMS Table Outer & Scroll -->
            <div class="rms-table-scroll-wrap">
              <table class="rms-data-table">
                <thead>
                  <tr>
                    <th style="width: 50px;">S No.</th>
                    <th style="width: 95px;">RMS Unique No</th>
                    <th style="width: 140px;">IMEI No</th>
                    <th style="width: 80px;">Power Status</th>
                    <th style="width: 80px;">Motor Status</th>
                    <th style="width: 80px;">Motor Error</th>
                    <th style="width: 95px;">Voltage</th>
                    <th style="width: 85px;">Current</th>
                    <th style="width: 80px;">Frequency</th>
                    <th style="width: 120px;">kWh (Calculated)</th>
                    <th style="width: 105px;">Latitude</th>
                    <th style="width: 105px;">Longitude</th>
                    <th style="width: 95px;">GSM Signal</th>
                    <th style="width: 155px;">Log Date Time</th>
                    <th style="width: 65px;">Map</th>
                  </tr>
                </thead>
                <tbody id="rms-logs-tbody">
                  <!-- Populated by renderTableBody -->
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    },

    mount() {
      renderTableBody();
      updateLiveMetrics();

      const searchInput = document.getElementById('rms-search-input');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          searchQuery = e.target.value.trim();
          renderTableBody();
        });
      }

      const filterSelect = document.getElementById('rms-status-filter');
      if (filterSelect) {
        filterSelect.addEventListener('change', (e) => {
          statusFilter = e.target.value;
          renderTableBody();
        });
      }

      const streamBtn = document.getElementById('btn-rms-stream-toggle');
      if (streamBtn) {
        streamBtn.addEventListener('click', () => {
          isStreaming = !isStreaming;
          const icon = document.getElementById('rms-stream-icon');
          const text = document.getElementById('rms-stream-text');
          if (isStreaming) {
            icon.textContent = '🔴';
            text.textContent = 'Live 4.5s';
            streamBtn.classList.remove('paused');
            startLiveStream();
            window.showToast('RMS Real-Time Heartbeat Stream Resumed', 'info');
          } else {
            icon.textContent = '⏸️';
            text.textContent = 'Paused';
            streamBtn.classList.add('paused');
            if (streamTimer) clearInterval(streamTimer);
            window.showToast('RMS Telemetry Stream Paused', 'warning');
          }
        });
      }

      const themeToggleBtn = document.getElementById('btn-rms-theme-toggle');
      if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
      }

      const exportBtn = document.getElementById('btn-rms-export');
      if (exportBtn) {
        exportBtn.addEventListener('click', exportCsv);
      }

      const refreshBtn = document.getElementById('btn-rms-refresh');
      if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
          pushLiveHeartbeat();
          window.showToast('Synced latest IoT device telemetry packet.', 'success');
        });
      }

      startLiveStream();
    },

    unmount() {
      if (streamTimer) {
        clearInterval(streamTimer);
        streamTimer = null;
      }
      closeMapModal();
    },

    openMapModal,
    closeMapModal,
    toggleTheme
  };

  function startLiveStream() {
    if (streamTimer) clearInterval(streamTimer);
    streamTimer = setInterval(() => {
      if (isStreaming) {
        pushLiveHeartbeat();
      }
    }, 4500);
  }
})();

window.RmsLogsView = RmsLogsView;

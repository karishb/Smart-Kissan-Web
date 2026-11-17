/**
 * SmartKisan Web Platform - RMS Hardware Telemetry & Device Heartbeat Logs View
 * Dedicated Web-only live engineering telemetry feed matching rmssystem.in/CNP/log.php
 * Edge-to-edge full width responsive layout & direct hardware JSON schema parameters.
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
  let headerFormat = localStorage.getItem('smartkisan_rms_hdr_fmt') || 'json'; // 'json' (hardware keys) or 'standard' (labels)

  // Seed initial device master data matching hardware specs
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
      tds: 320,
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
      tds: 280,
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
      tds: 410,
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
      tds: 310,
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
      tds: 290,
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
      tds: 340,
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
      tds: 360,
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
      tds: 220,
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
      tds: 350,
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
      tds: 480,
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
      tds: 390,
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
      tds: 310,
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
      tds: 330,
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
      tds: 300,
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
      tds: 420,
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
      tds: 310,
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
      tds: 295,
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
      tds: 315,
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
      tds: 330,
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
      tds: 380,
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

  // Build exact hardware JSON payload
  const createHardwareJsonPayload = (row) => {
    return {
      device_id: String(row.rmsNo),
      imei: String(row.imei),
      device_name: row.name,
      parcel: row.parcel,
      power_status: row.power,
      motor_status: row.motor,
      fault_code: row.error,
      voltage_v: row.voltage,
      current_a: row.current,
      frequency_hz: row.frequency,
      flow_rate_lpm: row.flowRate,
      kwh_calc: row.kwh,
      soil_moisture_pct: row.moisture,
      water_tds_ppm: row.tds,
      gsm_csq: row.gsm,
      latitude: row.lat,
      longitude: row.lng,
      log_timestamp: row.timestamp
    };
  };

  // Seed initial log history with timestamps descending
  const initializeLogs = () => {
    logsData = [];
    const now = new Date();
    
    for (let i = 0; i < 45; i++) {
      const devIndex = i % deviceMaster.length;
      const baseDev = deviceMaster[devIndex];
      const logTime = new Date(now.getTime() - i * 1800);
      
      const vJitter = baseDev.voltage > 0 ? (Math.random() * 6 - 3) : 0;
      const aJitter = baseDev.current > 0 ? (Math.random() * 0.4 - 0.2) : 0;
      const fJitter = baseDev.flowRate > 0 ? Math.floor(Math.random() * 10 - 5) : 0;
      const mJitter = (Math.random() * 0.4 - 0.2);

      const logRow = {
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
        tds: baseDev.tds,
        lat: baseDev.lat,
        lng: baseDev.lng,
        gsm: Math.min(31, Math.max(10, baseDev.gsm + Math.floor(Math.random() * 3 - 1))),
        timestamp: formatLogTimestamp(logTime),
        isNew: false
      };

      logsData.push(logRow);
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
      tds: randomDev.tds,
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
          <td colspan="18" style="padding: 30px; text-align: center; color: var(--text-muted); font-size: 14px;">
            🔍 No telemetry packets match the filter criteria.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map((row) => {
      let errorBadge = `<span class="rms-badge-normal">00</span>`;
      let errorTitle = 'Normal Operation (00)';
      if (row.error === '04') {
        errorBadge = `<span class="rms-badge-warn">04</span>`;
        errorTitle = 'Under-Voltage Protection Alert (04)';
      } else if (row.error === '08') {
        errorBadge = `<span class="rms-badge-warn">08</span>`;
        errorTitle = 'Dry Run Borewell Protection (08)';
      } else if (row.error === '09') {
        errorBadge = `<span class="rms-badge-danger">09</span>`;
        errorTitle = 'Over-Current Thermal Alert (09)';
      } else if (row.error === '10') {
        errorBadge = `<span class="rms-badge-danger">10</span>`;
        errorTitle = 'Phase Failure / Unbalance Detected (10)';
      } else if (row.error === '14') {
        errorBadge = `<span class="rms-badge-danger">14</span>`;
        errorTitle = 'Motor Stalled / Mechanical Jam (14)';
      } else if (row.error === '9999') {
        errorBadge = `<span class="rms-badge-offline">9999</span>`;
        errorTitle = 'Node Offline / Standby Sleep (9999)';
      }

      let gsmClass = 'signal-good';
      if (row.gsm < 15) gsmClass = 'signal-weak';
      else if (row.gsm < 22) gsmClass = 'signal-med';

      const rowClass = row.isNew ? 'rms-row-new' : '';

      return `
        <tr class="${rowClass}" data-rms="${row.rmsNo}">
          <td class="rms-cell-center rms-cell-sno">${row.sNo}</td>
          <td class="rms-cell-bold rms-cell-center rms-cell-unique" title="${row.name}">${row.rmsNo}</td>
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
          <td class="rms-cell-right rms-cell-numeric" style="color: #0284C7;">${row.flowRate}</td>
          <td class="rms-cell-right rms-cell-numeric rms-cell-kwh">${row.kwh.toFixed(3)}</td>
          <td class="rms-cell-right rms-cell-numeric" style="color: var(--primary);">${row.moisture.toFixed(1)}%</td>
          <td class="rms-cell-right rms-cell-numeric" style="color: #D97706;">${row.tds}</td>
          <td class="rms-cell-center">
            <span class="rms-gsm-pill ${gsmClass}" title="CSQ: ${row.gsm}/31">
              📶 ${row.gsm}
            </span>
          </td>
          <td class="rms-cell-mono rms-cell-small" title="Latitude, Longitude">
            ${row.lat.toFixed(5)}, ${row.lng.toFixed(5)}
          </td>
          <td class="rms-cell-center rms-cell-mono rms-cell-time">
            ${row.timestamp}
          </td>
          <td class="rms-cell-center">
            <button 
              type="button" 
              class="rms-json-btn" 
              title="Inspect raw hardware JSON payload for Node #${row.rmsNo}"
              onclick="RmsLogsView.openJsonModal('${row.id}')"
            >
              { } JSON
            </button>
          </td>
          <td class="rms-cell-center">
            <button 
              type="button" 
              class="rms-map-pin-btn" 
              title="Locate ${row.name} on GIS Map" 
              onclick="RmsLogsView.openMapModal('${row.rmsNo}', '${row.name}', '${row.parcel}', ${row.lat}, ${row.lng}, ${row.voltage}, ${row.current}, ${row.flowRate}, ${row.moisture}, ${row.power}, ${row.motor})"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
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

  // Toggle Table Header Format (Hardware JSON Keys vs Standard Labels)
  const toggleHeaderFormat = () => {
    headerFormat = headerFormat === 'json' ? 'standard' : 'json';
    localStorage.setItem('smartkisan_rms_hdr_fmt', headerFormat);
    updateHeaderLabels();
    const btnText = document.getElementById('rms-hdr-format-text');
    if (btnText) {
      btnText.textContent = headerFormat === 'json' ? 'Schema: JSON Keys' : 'Schema: Standard';
    }
    window.showToast(`Header Schema: ${headerFormat === 'json' ? 'Hardware JSON Keys' : 'Standard Labels'}`, 'info');
  };

  const updateHeaderLabels = () => {
    const thead = document.getElementById('rms-data-thead');
    if (!thead) return;

    if (headerFormat === 'json') {
      thead.innerHTML = `
        <tr>
          <th style="width: 48px;">s_no</th>
          <th style="width: 85px;">device_id<span class="rms-header-key">RMS Node</span></th>
          <th style="width: 135px;">imei<span class="rms-header-key">Modem ID</span></th>
          <th style="width: 85px;">power_status<span class="rms-header-key">1 / 0</span></th>
          <th style="width: 85px;">motor_status<span class="rms-header-key">1 / 0</span></th>
          <th style="width: 80px;">fault_code<span class="rms-header-key">Error</span></th>
          <th style="width: 85px;">voltage_v<span class="rms-header-key">Line V</span></th>
          <th style="width: 80px;">current_a<span class="rms-header-key">Amps</span></th>
          <th style="width: 75px;">frequency_hz<span class="rms-header-key">Hz</span></th>
          <th style="width: 85px;">flow_rate_lpm<span class="rms-header-key">L/min</span></th>
          <th style="width: 105px;">kwh_calc<span class="rms-header-key">Energy</span></th>
          <th style="width: 95px;">soil_moisture_pct<span class="rms-header-key">Moisture</span></th>
          <th style="width: 80px;">water_tds_ppm<span class="rms-header-key">TDS</span></th>
          <th style="width: 85px;">gsm_csq<span class="rms-header-key">Signal</span></th>
          <th style="width: 125px;">latitude, longitude<span class="rms-header-key">WGS-84</span></th>
          <th style="width: 145px;">log_timestamp<span class="rms-header-key">Real-Time IST</span></th>
          <th style="width: 75px;">raw_json<span class="rms-header-key">Inspect</span></th>
          <th style="width: 55px;">map<span class="rms-header-key">Pin</span></th>
        </tr>
      `;
    } else {
      thead.innerHTML = `
        <tr>
          <th style="width: 48px;">S No.</th>
          <th style="width: 85px;">RMS Unique No</th>
          <th style="width: 135px;">IMEI No</th>
          <th style="width: 85px;">Power Status</th>
          <th style="width: 85px;">Motor Status</th>
          <th style="width: 80px;">Motor Error</th>
          <th style="width: 85px;">Voltage (V)</th>
          <th style="width: 80px;">Current (A)</th>
          <th style="width: 75px;">Frequency (Hz)</th>
          <th style="width: 85px;">Discharge (L/min)</th>
          <th style="width: 105px;">kWh (Calculated)</th>
          <th style="width: 95px;">Soil Moisture (%)</th>
          <th style="width: 80px;">Water TDS (ppm)</th>
          <th style="width: 85px;">GSM Signal</th>
          <th style="width: 125px;">Latitude, Longitude</th>
          <th style="width: 145px;">Log Date Time</th>
          <th style="width: 75px;">Payload</th>
          <th style="width: 55px;">Map</th>
        </tr>
      `;
    }
  };

  // Open Raw Hardware JSON Inspector Modal
  const openJsonModal = (rowId) => {
    const row = logsData.find(r => r.id === rowId);
    if (!row) return;

    const payload = createHardwareJsonPayload(row);
    const jsonStr = JSON.stringify(payload, null, 2);

    let modal = document.getElementById('rms-json-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'rms-json-modal';
      modal.className = 'rms-modal-backdrop';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="rms-modal-dialog" style="max-width: 620px;">
        <div class="rms-modal-header">
          <div>
            <div style="font-size: 11px; text-transform: uppercase; color: var(--primary); font-weight: 700; letter-spacing: 0.5px;">
              Raw Hardware Telemetry Payload
            </div>
            <h3 style="margin: 2px 0 0; color: var(--text-main); font-size: 17px; font-weight: 700;">
              Node #${row.rmsNo} (IMEI: ${row.imei})
            </h3>
            <div style="font-size: 12px; color: var(--text-muted);">
              Received: ${row.timestamp} IST | Format: JSON Hardware Spec
            </div>
          </div>
          <button type="button" class="rms-modal-close" onclick="RmsLogsView.closeJsonModal()">✕</button>
        </div>

        <div class="rms-modal-body">
          <pre class="rms-json-pre" id="rms-raw-json-block">${jsonStr}</pre>
        </div>

        <div class="rms-modal-footer">
          <button type="button" class="btn-refresh" onclick="RmsLogsView.closeJsonModal()">
            Close
          </button>
          <button type="button" class="btn-primary" style="width: auto; padding: 8px 18px; font-size: 13px;" onclick="RmsLogsView.copyJsonToClipboard()">
            📋 Copy JSON
          </button>
        </div>
      </div>
    `;

    modal.style.display = 'flex';
  };

  const closeJsonModal = () => {
    const modal = document.getElementById('rms-json-modal');
    if (modal) modal.style.display = 'none';
  };

  const copyJsonToClipboard = () => {
    const block = document.getElementById('rms-raw-json-block');
    if (block) {
      navigator.clipboard.writeText(block.textContent).then(() => {
        window.showToast('Hardware JSON payload copied to clipboard!', 'success');
      }).catch(() => {
        window.showToast('JSON text selected for copying', 'info');
      });
    }
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
      's_no', 'device_id', 'imei', 'device_name', 'farm_parcel',
      'power_status', 'motor_status', 'fault_code', 'voltage_v',
      'current_a', 'frequency_hz', 'flow_rate_lpm', 'kwh_calc',
      'soil_moisture_pct', 'water_tds_ppm', 'gsm_csq', 'latitude', 'longitude', 'log_timestamp'
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
        r.flowRate,
        r.kwh,
        r.moisture,
        r.tds,
        r.gsm,
        r.lat,
        r.lng,
        `"${r.timestamp}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `SmartKisan_RMS_Hardware_Logs_${new Date().toISOString().slice(0, 10)}.csv`);
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
          <div class="dashboard-header" style="margin-bottom: 16px;">
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
              <button type="button" class="btn-refresh" id="btn-rms-hdr-format" title="Toggle column headers between hardware JSON schema keys and standard display labels">
                <span>🔤</span>
                <span id="rms-hdr-format-text">${headerFormat === 'json' ? 'Schema: JSON Keys' : 'Schema: Standard'}</span>
              </button>
              <button type="button" class="btn-refresh" id="btn-rms-theme-toggle" title="Switch between SmartKisan Brand Colors and Industrial Dark Theme">
                <span id="rms-theme-icon">${currentTheme === 'dark' ? '☀️' : '🌙'}</span>
                <span id="rms-theme-label">${currentTheme === 'dark' ? 'SmartKisan Colors' : 'Industrial Dark'}</span>
              </button>
              <button type="button" class="btn-primary" id="btn-rms-export" style="width: auto;">
                <span>📥 Export CSV</span>
              </button>
            </div>
          </div>

          <!-- KPI Summary Strip matching Dashboard (Edge-to-Edge 100% Width) -->
          <div class="kpi-grid" style="margin-bottom: 16px;">
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

          <!-- Main Table Card (100% Full Width Screen Fill) -->
          <div class="card rms-card-container" style="padding: 0; overflow: hidden; margin-bottom: 24px; width: 100%;">
            <!-- Toolbar Actions -->
            <div class="rms-card-toolbar">
              <div class="rms-search-wrap">
                <span style="color: var(--text-muted); font-size: 14px;">🔍</span>
                <input 
                  type="text" 
                  id="rms-search-input" 
                  class="rms-search-field" 
                  placeholder="Search IMEI, Device ID, Node Name, or Parcel..." 
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

            <!-- RMS Table Outer & Full Width Scroll -->
            <div class="rms-table-scroll-wrap" style="width: 100%;">
              <table class="rms-data-table" style="width: 100%;">
                <thead id="rms-data-thead">
                  <!-- Populated by updateHeaderLabels -->
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
      updateHeaderLabels();
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

      const hdrFormatBtn = document.getElementById('btn-rms-hdr-format');
      if (hdrFormatBtn) {
        hdrFormatBtn.addEventListener('click', toggleHeaderFormat);
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
      closeJsonModal();
    },

    openMapModal,
    closeMapModal,
    openJsonModal,
    closeJsonModal,
    copyJsonToClipboard,
    toggleTheme,
    toggleHeaderFormat
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

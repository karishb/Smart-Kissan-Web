/**
 * SmartKisan Web Platform - API Client
 * Robust REST client with automatic authentication headers, state synchronization & demo fallback
 */

const API = (() => {
  // In-memory demo state for seamless testing even if backend is offline
  let mockState = {
    pumps: [
      {
        id: 'pump-01',
        name: 'Tubewell 1 (North Field)',
        type: 'submersible',
        power_rating: '7.5',
        flow_rate: '450',
        location: 'North Parcel A (Wheat)',
        status: 'on',
        mode: 'schedule',
        is_online: true,
        total_run_time_sec: 14400,
        schedule_time: '06:00 - 08:30 IST',
        today_litres: 2450,
        today_kwh: 6.2
      },
      {
        id: 'pump-02',
        name: 'Solar Pump 2 (Polyhouse)',
        type: 'solar',
        power_rating: '5.0',
        flow_rate: '320',
        location: 'Polyhouse 1 (Bell Pepper)',
        status: 'off',
        mode: 'auto',
        is_online: true,
        total_run_time_sec: 7200,
        schedule_time: '14:00 - 16:00 IST',
        today_litres: 1200,
        today_kwh: 3.1
      },
      {
        id: 'pump-03',
        name: 'Borewell 3 (South Field)',
        type: 'monoblock',
        power_rating: '10.0',
        flow_rate: '600',
        location: 'South Parcel B (Cotton)',
        status: 'off',
        mode: 'manual',
        is_online: true,
        total_run_time_sec: 3600,
        schedule_time: null,
        today_litres: 0,
        today_kwh: 0.0
      },
      {
        id: 'pump-04',
        name: 'Drip System Pump 4',
        type: 'centrifugal',
        power_rating: '3.0',
        flow_rate: '220',
        location: 'East Parcel C (Tomato)',
        status: 'on',
        mode: 'ai',
        is_online: true,
        total_run_time_sec: 10800,
        schedule_time: 'AI Dynamic Adaptive',
        today_litres: 1200,
        today_kwh: 3.1
      }
    ],
    schedules: [
      {
        id: 'sch-01',
        pump_id: 'pump-01',
        pump_name: 'Tubewell 1 (North Field)',
        field_name: 'North Parcel A (Wheat)',
        start_time: '06:00',
        stop_time: '08:30',
        duration_mins: 150,
        repeat_days: ['Mon', 'Wed', 'Fri', 'Sun'],
        is_active: true,
        weather_guard: true,
        soil_moisture_threshold: 65
      },
      {
        id: 'sch-02',
        pump_id: 'pump-02',
        pump_name: 'Solar Pump 2 (Polyhouse)',
        field_name: 'Polyhouse 1 (Bell Pepper)',
        start_time: '14:00',
        stop_time: '16:00',
        duration_mins: 120,
        repeat_days: ['Daily'],
        is_active: true,
        weather_guard: false,
        soil_moisture_threshold: 70
      },
      {
        id: 'sch-03',
        pump_id: 'pump-04',
        pump_name: 'Drip System Pump 4',
        field_name: 'East Parcel C (Tomato)',
        start_time: '17:30',
        stop_time: '19:00',
        duration_mins: 90,
        repeat_days: ['Tue', 'Thu', 'Sat'],
        is_active: true,
        weather_guard: true,
        soil_moisture_threshold: 60
      }
    ],
    fields: [
      {
        id: 'f-1',
        name: 'North Parcel A',
        crop: 'Wheat',
        variety: 'HD-2967 (Kundan)',
        area_acres: 6.5,
        soil_type: 'Alluvial Loam',
        soil_moisture: 68,
        growth_stage: 'Tillering (65%)',
        pump_id: 'pump-01',
        pump_name: 'Tubewell 1',
        irrigation_type: 'Flood / Furrow',
        sowing_date: '15 Nov 2025',
        status: 'Optimal'
      },
      {
        id: 'f-2',
        name: 'Polyhouse 1',
        crop: 'Bell Pepper',
        variety: 'Yellow Wonder',
        area_acres: 2.0,
        soil_type: 'Coco-Peat & Sandy Loam',
        soil_moisture: 72,
        growth_stage: 'Flowering & Fruiting (40%)',
        pump_id: 'pump-02',
        pump_name: 'Solar Pump 2',
        irrigation_type: 'Precision Drip Fertigation',
        sowing_date: '02 Dec 2025',
        status: 'Optimal'
      },
      {
        id: 'f-3',
        name: 'South Parcel B',
        crop: 'Bt Cotton',
        variety: 'Bollgard II',
        area_acres: 5.5,
        soil_type: 'Black Cotton Clay',
        soil_moisture: 42,
        growth_stage: 'Boll Maturation (80%)',
        pump_id: 'pump-03',
        pump_name: 'Borewell 3',
        irrigation_type: 'Alternate Furrow',
        sowing_date: '20 May 2025',
        status: 'Needs Irrigation'
      },
      {
        id: 'f-4',
        name: 'East Parcel C',
        crop: 'Tomato',
        variety: 'Pusa Ruby Hybrid',
        area_acres: 4.5,
        soil_type: 'Sandy Loam',
        soil_moisture: 60,
        growth_stage: 'Vegetative Growth (55%)',
        pump_id: 'pump-04',
        pump_name: 'Drip System Pump 4',
        irrigation_type: 'Automated Drip System',
        sowing_date: '10 Jan 2026',
        status: 'Optimal'
      }
    ],
    sensors: [
      {
        id: 'node-01',
        name: 'Soil Probe Alpha (North Wheat)',
        field: 'North Parcel A',
        depth_15cm: 68,
        depth_30cm: 71,
        soil_temp: 22.4,
        ambient_temp: 28.5,
        humidity: 48,
        npk: { n: 135, p: 26, k: 175 },
        battery: 92,
        signal_dbm: -68,
        status: 'online',
        last_sync: '4 mins ago'
      },
      {
        id: 'node-02',
        name: 'Polyhouse Climate Node Beta',
        field: 'Polyhouse 1',
        depth_15cm: 72,
        depth_30cm: 74,
        soil_temp: 24.1,
        ambient_temp: 26.2,
        humidity: 62,
        npk: { n: 180, p: 45, k: 210 },
        battery: 98,
        signal_dbm: -54,
        status: 'online',
        last_sync: '1 min ago'
      },
      {
        id: 'node-03',
        name: 'Soil Moisture Probe Gamma (South Cotton)',
        field: 'South Parcel B',
        depth_15cm: 42,
        depth_30cm: 46,
        soil_temp: 23.8,
        ambient_temp: 29.8,
        humidity: 44,
        npk: { n: 110, p: 20, k: 140 },
        battery: 85,
        signal_dbm: -75,
        status: 'online',
        last_sync: '8 mins ago'
      },
      {
        id: 'node-04',
        name: 'Borewell Telemetry & Water Table Node',
        field: 'Deep Aquifer Well 3',
        depth_15cm: null,
        depth_30cm: null,
        soil_temp: 21.0,
        water_table_ft: 84.5,
        flow_sensor_rate: 600,
        battery: 89,
        signal_dbm: -62,
        status: 'online',
        last_sync: '2 mins ago'
      }
    ]
  };

  const getHeaders = (hasBody = true) => {
    const headers = {};
    if (hasBody) {
      headers['Content-Type'] = 'application/json';
    }
    const token = localStorage.getItem(CONFIG.AUTH_TOKEN_KEY);
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  const request = async (endpoint, options = {}) => {
    const url = `${CONFIG.API_BASE_URL}${endpoint}`;
    const opts = {
      ...options,
      headers: {
        ...getHeaders(Boolean(options.body)),
        ...(options.headers || {})
      }
    };

    try {
      const response = await fetch(url, opts);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `Request failed with status ${response.status}`);
      }
      return data;
    } catch (err) {
      console.warn(`[API] Remote call to ${endpoint} failed or offline. Using demo fallback:`, err.message);
      return handleFallback(endpoint, options, err);
    }
  };

  const handleFallback = (endpoint, options = {}, error) => {
    const method = (options.method || 'GET').toUpperCase();

    // Auth Login
    if (endpoint === '/auth/login' && method === 'POST') {
      const body = JSON.parse(options.body || '{}');
      const name = body.identifier ? body.identifier.split('@')[0] : 'Farmer Ramesh';
      const cleanName = name.charAt(0).toUpperCase() + name.slice(1);
      return {
        token: 'demo-jwt-token-smartkisan-2026',
        user: {
          id: 'user-demo-1',
          name: cleanName.includes('Admin') ? 'Admin Officer' : (cleanName || 'Farmer Ramesh'),
          email: body.identifier || 'farmer@smartkisan.in',
          role: cleanName.toLowerCase().includes('admin') ? 'admin' : 'user'
        }
      };
    }

    // Auth Register
    if (endpoint === '/auth/register' && method === 'POST') {
      const body = JSON.parse(options.body || '{}');
      return {
        token: 'demo-jwt-token-smartkisan-2026',
        user: {
          id: 'user-demo-reg-' + Date.now(),
          name: body.name || 'New Farmer',
          email: body.email || 'farmer@smartkisan.in',
          role: 'user'
        }
      };
    }

    // Pumps List
    if (endpoint === '/pumps' && method === 'GET') {
      return {
        pumps: mockState.pumps,
        count: mockState.pumps.length
      };
    }

    // Add Pump
    if (endpoint === '/pumps' && method === 'POST') {
      const body = JSON.parse(options.body || '{}');
      const newPump = {
        id: 'pump-' + String(Date.now()).slice(-4),
        name: body.name || 'New Farm Pump',
        type: body.type || 'submersible',
        power_rating: String(body.powerRating || '5.0'),
        flow_rate: String(body.flowRate || '350'),
        location: body.location || 'Main Parcel',
        status: 'off',
        mode: body.mode || 'manual',
        is_online: true,
        total_run_time_sec: 0,
        schedule_time: null,
        today_litres: 0,
        today_kwh: 0.0
      };
      mockState.pumps.unshift(newPump);
      return { pump: newPump, message: 'Pump added successfully' };
    }

    // Pumps Run Summary
    if (endpoint === '/pumps/summary/today' && method === 'GET') {
      const activeCount = mockState.pumps.filter(p => p.status === 'on').length;
      const totalLitres = mockState.pumps.reduce((acc, p) => acc + (p.today_litres || 0), 0);
      const totalKwh = mockState.pumps.reduce((acc, p) => acc + (p.today_kwh || 0), 0);
      return {
        summary: {
          runHours: 5.2,
          litres: totalLitres || 4850,
          kwh: Number(totalKwh.toFixed(1)) || 12.4,
          runCount: 4,
          activePumps: activeCount,
          totalPumps: mockState.pumps.length,
          hasData: true
        }
      };
    }

    // Pump Control Toggle
    if (endpoint.startsWith('/pumps/') && endpoint.endsWith('/control') && method === 'POST') {
      const parts = endpoint.split('/');
      const pumpId = parts[2];
      const body = JSON.parse(options.body || '{}');
      const action = body.action || 'off';
      
      const pump = mockState.pumps.find(p => p.id === pumpId);
      if (pump) {
        pump.status = action;
      }
      return {
        message: `Pump turned ${action}`,
        pump: pump || { id: pumpId, status: action }
      };
    }

    // Pump Mode Change
    if (endpoint.startsWith('/pumps/') && endpoint.endsWith('/mode') && method === 'PUT') {
      const parts = endpoint.split('/');
      const pumpId = parts[2];
      const body = JSON.parse(options.body || '{}');
      const mode = body.mode || 'manual';

      const pump = mockState.pumps.find(p => p.id === pumpId);
      if (pump) {
        pump.mode = mode;
      }
      return { message: 'Pump mode updated', pump };
    }

    // Schedules List
    if (endpoint.includes('/schedules') && method === 'GET') {
      return {
        schedules: mockState.schedules,
        count: mockState.schedules.length
      };
    }

    // Add Schedule
    if (endpoint.includes('/schedules') && method === 'POST') {
      const body = JSON.parse(options.body || '{}');
      const targetPump = mockState.pumps.find(p => p.id === body.pump_id) || mockState.pumps[0];
      const newSchedule = {
        id: 'sch-' + Date.now(),
        pump_id: targetPump.id,
        pump_name: targetPump.name,
        field_name: targetPump.location || 'Main Parcel',
        start_time: body.start_time || '06:00',
        stop_time: body.stop_time || '07:30',
        duration_mins: body.duration_mins || 90,
        repeat_days: body.repeat_days || ['Daily'],
        is_active: true,
        weather_guard: body.weather_guard ?? true,
        soil_moisture_threshold: body.soil_moisture_threshold || 65
      };
      mockState.schedules.unshift(newSchedule);
      targetPump.mode = 'schedule';
      targetPump.schedule_time = `${newSchedule.start_time} - ${newSchedule.stop_time} IST`;
      return { schedule: newSchedule, message: 'Schedule created successfully' };
    }

    // Delete Schedule
    if (endpoint.includes('/schedules/') && method === 'DELETE') {
      const parts = endpoint.split('/');
      const schId = parts[parts.length - 1];
      mockState.schedules = mockState.schedules.filter(s => s.id !== schId);
      return { message: 'Schedule removed successfully' };
    }

    // Fields List
    if (endpoint === '/fields' && method === 'GET') {
      return {
        fields: mockState.fields,
        count: mockState.fields.length
      };
    }

    // Add Field
    if (endpoint === '/fields' && method === 'POST') {
      const body = JSON.parse(options.body || '{}');
      const newField = {
        id: 'f-' + Date.now(),
        name: body.name || 'New Field Parcel',
        crop: body.crop || 'Wheat',
        variety: body.variety || 'Local Hybrid',
        area_acres: parseFloat(body.area_acres) || 3.0,
        soil_type: body.soil_type || 'Loamy',
        soil_moisture: 65,
        growth_stage: 'Vegetative (30%)',
        pump_id: body.pump_id || 'pump-01',
        pump_name: 'Tubewell 1',
        irrigation_type: body.irrigation_type || 'Drip',
        sowing_date: '01 Nov 2026',
        status: 'Optimal'
      };
      mockState.fields.push(newField);
      return { field: newField, message: 'Parcel added successfully' };
    }

    // Sensors List
    if (endpoint === '/devices' || endpoint === '/sensors') {
      return {
        sensors: mockState.sensors,
        count: mockState.sensors.length
      };
    }

    throw error;
  };

  return {
    auth: {
      login: (identifier, password) =>
        request('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ identifier, password })
        }),
      register: (userData) =>
        request('/auth/register', {
          method: 'POST',
          body: JSON.stringify(userData)
        }),
      getProfile: () => request('/profile')
    },
    pumps: {
      getAll: () => request('/pumps'),
      getTodaySummary: () => request('/pumps/summary/today'),
      control: (pumpId, action) =>
        request(`/pumps/${pumpId}/control`, {
          method: 'POST',
          body: JSON.stringify({ action })
        }),
      setMode: (pumpId, mode) =>
        request(`/pumps/${pumpId}/mode`, {
          method: 'PUT',
          body: JSON.stringify({ mode })
        }),
      addPump: (pumpData) =>
        request('/pumps', {
          method: 'POST',
          body: JSON.stringify(pumpData)
        }),
      getSchedules: (pumpId) =>
        request(pumpId ? `/pumps/${pumpId}/schedules` : '/pumps/schedules/all'),
      createSchedule: (pumpId, scheduleData) =>
        request(`/pumps/${pumpId}/schedules`, {
          method: 'POST',
          body: JSON.stringify(scheduleData)
        }),
      deleteSchedule: (pumpId, scheduleId) =>
        request(`/pumps/${pumpId}/schedules/${scheduleId}`, {
          method: 'DELETE'
        })
    },
    fields: {
      getAll: () => request('/fields'),
      create: (fieldData) =>
        request('/fields', {
          method: 'POST',
          body: JSON.stringify(fieldData)
        })
    },
    sensors: {
      getAll: () => request('/devices')
    }
  };
})();

window.API = API;
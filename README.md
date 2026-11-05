# SmartKisan Web Platform

> Precision Agrarian GIS & Smart Irrigation Command Portal

SmartKisan Web Platform is a responsive, high-performance Single Page Application (SPA) designed for farmers, agronomists, and farm managers. It delivers real-time farm GIS mapping, IoT telemetry, smart pump control, automated irrigation scheduling, soil analytics, and DSR report generation.

---

## Key Features

1. **Agrarian GIS & Satellite Command Center (`/` & `/fields`)**
   - High-resolution ArcGIS World Imagery base tiles with OpenStreetMap cartography switcher.
   - Interactive crop parcels color-coded by crop type (Wheat, Bell Pepper, Cotton, Tomato, Soybean, Maize, Rice).
   - Glassmorphic telemetry overlays, crop stage badges, and area metrics.

2. **Pumps Command Center (`/pumps`)**
   - Live telemetry and power status for Submersible, Monoblock, and Solar pumps.
   - Multi-mode operational switching: Manual, Automatic, Timer, Schedule, Sensor, and AI modes.
   - Direct MQTT control toggle with instantaneous feedback.

3. **Smart Irrigation Scheduler (`/schedules`)**
   - Weekly recurring schedules, daily automation, and one-time irrigation windows.
   - Live active schedule status badges (**ACTIVE NOW** vs. **Upcoming**).
   - Real-time time-window evaluation based on Indian Standard Time (IST).

4. **IoT Telemetry & Hardware Probes (`/sensors`)**
   - Real-time monitoring of Soil Moisture (%), Soil Temperature (°C), Humidity (%), and Water TDS (ppm).
   - NPK balance metrics, EC, and soil condition status indicators.

5. **DSR & Farm Audits (`/reports`)**
   - Automated Daily Status Report (DSR) generation with key performance indicators.
   - One-click browser export to Excel (`.xlsx`) and CSV.

6. **Bilingual Localization**
   - Instant language switching between English and Hindi with full UI localization.

7. **Authentication & Session Persistence (`/login` & `/register`)**
   - Secure token-based session handling with automatic redirect and authenticated API calls.

---

## Architecture & Tech Stack

- **Frontend**: Vanilla ES6+ Modules, CSS3 Variables with responsive grid/flexbox, Leaflet GIS.
- **Routing**: Client-side History API router with automatic SPA fallback.
- **State Management**: Reactive centralized state store.
- **Backend API**: Connects to the SmartKisan REST & WebSocket backend (`http://66.116.227.217:3001` or production host).
- **Hosting**: Zero-dependency static site or Node.js server, pre-configured for Render.

---

## Local Development

### Option 1: Native Node Server (Included)
```bash
# Clone the repository
git clone <repository-url>
cd Smart-Kissan-Web

# Start the server (runs on port 3000 by default)
npm start
```
Open `http://localhost:3000` in your web browser.

### Option 2: Live Server or Any Static Host
Since the frontend uses standard browser ES Modules, you can serve the directory with any static server:
```bash
npx serve .
# or
python -m http.server 3000
```

---

## Deployment on Render

This repository includes a turnkey `render.yaml` blueprint.

### Automatic Blueprint Deployment
1. Log in to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** → **Blueprint**.
3. Connect your GitHub repository.
4. Render will automatically detect `render.yaml` and configure a free, high-performance static site with global CDN and SPA rewrite rules.

### Manual Static Site Deployment
1. In Render, select **New Static Site**.
2. Build Command: *(leave blank)*
3. Publish Directory: `./`
4. Under **Redirects/Rewrites**:
   - **Type**: Rewrite
   - **Source**: `/*`
   - **Destination**: `/index.html`

---

## License
MIT License - SmartKisan Agritech.

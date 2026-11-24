const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = process.env.PORT || 3000;
const BACKEND_TARGET = process.env.BACKEND_API_URL || 'http://66.116.227.217:3001';

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];

  // Global CORS headers for API calls
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // 1. Live RMS Hardware Telemetry Proxy Endpoint
  if (reqPath === '/api/rms-live') {
    https.get('https://rmssystem.in/CNP/load.php', {
      headers: { 'User-Agent': 'SmartKisan-Web/2.0' }
    }, (remoteRes) => {
      let body = '';
      remoteRes.on('data', chunk => body += chunk);
      remoteRes.on('end', () => {
        try {
          const trMatches = body.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || [];
          const data = [];
          for (let i = 1; i < trMatches.length; i++) {
            const tdMatches = trMatches[i].match(/<td[^>]*>([\s\S]*?)<\/td>/gi) || [];
            const cells = tdMatches.map(c => c.replace(/<[^>]+>/g, '').trim());
            if (cells.length >= 17 && cells[0]) {
              data.push({
                sNo: parseInt(cells[0], 10) || i,
                rmsNo: cells[1],
                imei: cells[2],
                simId: cells[3] || '',
                power: parseInt(cells[4], 10) || 0,
                motor: parseInt(cells[5], 10) || 0,
                error: cells[6] || '00',
                voltage: parseFloat(cells[7]) || 0.0,
                current: parseFloat(cells[8]) || 0.0,
                frequency: parseInt(cells[9], 10) || 0,
                kwh: parseFloat(cells[12]) || 0.0,
                lat: parseFloat(cells[14]) || 0.0,
                lng: parseFloat(cells[15]) || 0.0,
                gsm: parseInt(cells[16], 10) || 0,
                timestamp: cells[17] || ''
              });
            }
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, count: data.length, rows: data }));
        } catch (parseErr) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: parseErr.message }));
        }
      });
    }).on('error', (err) => {
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    });
    return;
  }

  // 2. Reverse Proxy for Backend APIs (forwards to same API as mobile app: 66.116.227.217:3001)
  if (reqPath.startsWith('/api/')) {
    try {
      const targetUrl = new URL(req.url, BACKEND_TARGET);
      const isHttps = targetUrl.protocol === 'https:';
      const transport = isHttps ? https : http;

      const proxyReq = transport.request(targetUrl, {
        method: req.method,
        headers: {
          ...req.headers,
          host: targetUrl.host
        }
      }, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
      });

      proxyReq.on('error', (err) => {
        console.warn(`[Proxy Error] Forwarding to ${targetUrl.href} failed:`, err.message);
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Backend API service offline or unreachable', details: err.message }));
      });

      req.pipe(proxyReq);
      return;
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Proxy request error: ' + e.message }));
      return;
    }
  }

  // 3. Static File Serving
  if (reqPath === '/') reqPath = '/index.html';

  const filePath = path.join(__dirname, reqPath);

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
    } else {
      const indexPath = path.join(__dirname, 'index.html');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      fs.createReadStream(indexPath).pipe(res);
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`SmartKisan Web Portal running on port ${PORT}`);
  console.log(`Backend API Proxy target: ${BACKEND_TARGET}`);
  console.log(`Access at: http://localhost:${PORT}`);
});

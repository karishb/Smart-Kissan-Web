/**
 * SmartKisan Web Platform - Farmer WhatsApp & SMS Advisory Broadcast Engine
 * Generates and dispatches bilingual agro-meteorological advisories,
 * water budget alerts, and precision spray window recommendations.
 */

const BroadcastService = (() => {
  const STORAGE_KEY_LOGS = 'smartkisan_broadcast_logs';

  const defaultContacts = [
    { id: 'c-1', name: 'Ramesh Kumar', role: 'Farm Manager', phone: '+919876543210', group: 'all' },
    { id: 'c-2', name: 'Gurpreet Singh', role: 'Tubewell & Pump Operator', phone: '+919812345678', group: 'pumps' },
    { id: 'c-3', name: 'Harpreet Kaur', role: 'Agronomist & Scout', phone: '+919845678901', group: 'spray' },
    { id: 'c-4', name: 'Punjab Kisan Cooperative Group #4', role: 'Farmer Cooperative (28 members)', phone: '', group: 'all' }
  ];

  const getContacts = () => defaultContacts;

  const getBroadcastLogs = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_LOGS);
      if (raw) return JSON.parse(raw);
    } catch (e) {}

    return [
      {
        id: 'log-1',
        timestamp: 'Today, 06:15 AM IST',
        channel: 'WhatsApp',
        recipient: 'Punjab Kisan Cooperative Group #4',
        status: 'Delivered',
        snippet: '🌾 SmartKisan दैनिक कृषि सलाह: South Parcel B में बोरवेल 3 चलाएं...'
      },
      {
        id: 'log-2',
        timestamp: 'Yesterday, 07:00 AM IST',
        channel: 'SMS',
        recipient: 'Gurpreet Singh (+91 98123 45678)',
        status: 'Delivered',
        snippet: 'SmartKisan: Tubewell 1 schedule active at 06:00 AM. 4,850L pumped.'
      }
    ];
  };

  const saveLog = (logItem) => {
    try {
      const logs = getBroadcastLogs();
      logs.unshift(logItem);
      localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs.slice(0, 20)));
    } catch (e) {}
  };

  const generateWhatsAppText = (lang = 'en', metrics = {}, parcels = [], sprayWindow = '') => {
    const todayStr = new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(new Date());

    const temp = metrics.tempC || 28.5;
    const rh = metrics.humidityPct || 42;
    const wind = metrics.windKmh || 7.2;
    const et0 = metrics.et0 || 4.85;

    if (lang === 'hi') {
      return (
`🌾 *स्मार्ट किसान दैनिक कृषि एवं सिंचाई सलाह*
📍 स्थान: लुधियाना, पंजाब | दिनांक: ${todayStr}

☀️ *मौसम एवं वाष्पोत्सर्जन (ET₀):*
• तापमान: ${temp}°C | हवा में नमी: ${rh}% | हवा की गति: ${wind} km/h
• दैनिक जल आवश्यकता (ET₀): ${et0} mm/दिन

🚰 *सिंचाई सलाह:*
• दक्षिण खेत B (कपास): मिट्टी की नमी 42% (अति आवश्यक)। फूल-फल झड़ने से बचाने के लिए बोरवेल 3 को सुबह 10:00 से पहले 55 मिनट चलाएं।
• उत्तर खेत A (गेहूं): नमी 68% अनुकूल (कल सुबह चक्र निर्धारित)।
• पॉलीहाउस 1 (शिमला मिर्च): शाम की सिंचाई छोड़ें (फफूंद का खतरा कम करें)।

🚜 *7-दिवसीय छिड़काव सलाह:*
• आज की खिड़की: 🟢 सुरक्षित समय (सुबह 06:00 - 09:30 बजे)।
• हवा शांत है, दवा उड़ने या बहने का कोई जोखिम नहीं।

🌐 *लाइव पोर्टल देखें:* https://smartkisan-web-xvqu.onrender.com/#/ai-advisory
📞 किसान हेल्पलाइन: 1800-SMART-KISAN`
      );
    }

    return (
`🌾 *SmartKisan Daily Agronomic & Irrigation Advisory*
📍 Location: Ludhiana, PB | Date: ${todayStr}

☀️ *Weather & Evapotranspiration (ET₀):*
• Temp: ${temp}°C | Humidity: ${rh}% | Wind: ${wind} km/h
• Reference ET₀: ${et0} mm/day

🚰 *Irrigation Advisory:*
• South Parcel B (Cotton): 42% moisture (Critical Deficit). Run Borewell 3 for 55 min before 10:00 AM to prevent flower boll shedding.
• North Parcel A (Wheat): 68% moisture (Optimal). Next automated cycle due tomorrow morning.
• Polyhouse 1 (Bell Pepper): Skip evening cycle to mitigate fungal mildew risk.

🚜 *Precision Spraying Window:*
• Today's Window: 🟢 SAFE (06:00 AM - 09:30 AM). Calm atmospheric boundary layer, zero drift hazard.

🌐 *Open Live Portal:* https://smartkisan-web-xvqu.onrender.com/#/ai-advisory
📞 Helpline: 1800-SMART-KISAN`
    );
  };

  const generateSmsText = (lang = 'en', metrics = {}) => {
    const temp = Math.round(metrics.tempC || 28);
    const et0 = metrics.et0 || 4.8;

    if (lang === 'hi') {
      return `SmartKisan: लुधियाना ${temp}C. दक्षिण खेत कपास 42% नमी: सुबह 10 बजे से पहले बोरवेल 3 को 55 मिनट चलाएं। छिड़काव: सुरक्षित (6-9:30AM)। पोर्टल: smartkisan.in`;
    }

    return `SmartKisan: Ludhiana ${temp}C, ET0 ${et0}mm. South Cotton 42% moisture: Run Borewell 3 for 55m before 10AM. Spray window: SAFE (6-9:30AM). Link: smartkisan.in`;
  };

  const openWhatsApp = (text, phone = '') => {
    const cleanPhone = phone.replace(/[^\d]/g, '');
    let url = '';
    if (cleanPhone) {
      url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    } else {
      url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const dispatchSimulatedSms = async (recipientName, phone, messageText) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        saveLog({
          id: `log-${Date.now()}`,
          timestamp: 'Just now',
          channel: 'SMS Gateway',
          recipient: `${recipientName} (${phone || 'All'})`,
          status: 'Delivered',
          snippet: messageText.substring(0, 60) + '...'
        });
        resolve({ success: true, messageId: `MSG-${Math.floor(Math.random() * 900000 + 100000)}` });
      }, 700);
    });
  };

  return {
    getContacts,
    getBroadcastLogs,
    saveLog,
    generateWhatsAppText,
    generateSmsText,
    openWhatsApp,
    dispatchSimulatedSms
  };
})();

window.BroadcastService = BroadcastService;

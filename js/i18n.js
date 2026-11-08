/**
 * SmartKisan Web Platform - Bilingual Localization (EN / HI)
 */

const I18N = (() => {
  const STORAGE_KEY = 'smartkisan_web_lang';

  const translations = {
    en: {
      appName: 'SmartKisan',
      tagline: 'Precision Agrarian GIS & Smart Irrigation',
      dashboard: 'Dashboard',
      pumps: 'Pumps & IoT',
      fields: 'Farm GIS & Crops',
      schedules: 'Irrigation Schedules',
      sensors: 'IoT Probes',
      aiAdvisory: 'AI Advisory',
      reports: 'DSR & Reports',
      login: 'Sign In',
      register: 'Register Farm',
      logout: 'Logout',
      syncTelemetry: 'Sync Telemetry',
      namaste: 'Namaste',
      totalLand: 'Total Land Area',
      activePumps: 'Active Pumps',
      avgMoisture: 'Avg Soil Moisture',
      waterPumped: 'Water Pumped Today',
      acres: 'Acres',
      litres: 'Litres',
      running: 'Running',
      standby: 'Standby',
      turnOn: 'Turn On',
      turnOff: 'Turn Off',
      schedulePump: 'Schedule',
      optimal: 'Optimal',
      needsWater: 'Needs Water',
      critical: 'Critical',
      allLayers: 'All Layers',
      parcels: 'Parcels',
      recentActivity: 'Recent Farm Activity',
      newSchedule: 'Create Schedule',
      addField: 'Add Parcel',
      addPump: 'Add Pump',
      exportExcel: 'Export Excel Report',
      printReport: 'Print Report',
      evapotranspiration: 'Evapotranspiration (ET)',
      waterBudget: 'Water Budget',
      sprayPlanner: '7-Day Spraying Planner',
      overrides: 'AI Overrides',
      safe: 'Safe Window',
      marginal: 'Marginal',
      unsafe: 'Unsafe'
    },
    hi: {
      appName: 'स्मार्ट किसान',
      tagline: 'सटीक कृषि जीआईएस एवं स्मार्ट सिंचाई प्रणाली',
      dashboard: 'डैशबोर्ड',
      pumps: 'पंप एवं मोटर',
      fields: 'खेत और फसलें',
      schedules: 'सिंचाई समय-सारणी',
      sensors: 'सेंसर एवं जांच',
      aiAdvisory: 'एआई कृषि सलाह',
      reports: 'रिपोर्ट एवं डीएसआर',
      login: 'लॉग इन करें',
      register: 'फार्म पंजीकृत करें',
      logout: 'लॉग आउट',
      syncTelemetry: 'डेटा सिंक करें',
      namaste: 'नमस्ते',
      totalLand: 'कुल कृषि भूमि',
      activePumps: 'सक्रिय पंप',
      avgMoisture: 'औसत मिट्टी की नमी',
      waterPumped: 'आज उपयोग हुआ पानी',
      acres: 'एकड़',
      litres: 'लीटर',
      running: 'चालू है',
      standby: 'स्टैंडबाय',
      turnOn: 'पंप चालू करें',
      turnOff: 'पंप बंद करें',
      schedulePump: 'शेड्यूल करें',
      optimal: 'अनुकूल',
      needsWater: 'पानी चाहिए',
      critical: 'अति आवश्यक',
      allLayers: 'सभी परतें',
      parcels: 'खेत के भाग',
      recentActivity: 'हालिया कृषि गतिविधियाँ',
      newSchedule: 'नया शेड्यूल बनाएं',
      addField: 'नया खेत जोड़ें',
      addPump: 'नया पंप जोड़ें',
      exportExcel: 'एक्सेल रिपोर्ट डाउनलोड करें',
      printReport: 'प्रिंट रिपोर्ट',
      evapotranspiration: 'वाष्पोत्सर्जन (ET)',
      waterBudget: 'जल बजट',
      sprayPlanner: '7-दिवसीय छिड़काव योजना',
      overrides: 'एआई नियंत्रण',
      safe: 'सुरक्षित समय',
      marginal: 'सावधानीपूर्वक',
      unsafe: 'असुरक्षित'
    }
  };

  let currentLang = localStorage.getItem(STORAGE_KEY) || 'en';

  const getLang = () => currentLang;

  const setLang = (lang) => {
    if (translations[lang]) {
      currentLang = lang;
      localStorage.setItem(STORAGE_KEY, lang);
      window.dispatchEvent(new CustomEvent('language-changed', { detail: { lang } }));
      if (window.Router) {
        window.Router.navigate();
      }
      if (window.App) {
        window.App.updateNavbar();
      }
    }
  };

  const t = (key) => {
    const dict = translations[currentLang] || translations.en;
    return dict[key] || translations.en[key] || key;
  };

  return {
    getLang,
    setLang,
    t
  };
})();

window.I18N = I18N;

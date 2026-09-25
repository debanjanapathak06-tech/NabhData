import { useState, useEffect, useRef, useCallback } from 'react';
import weatherBg from './imports/weatherimg_new.jpg';
import indiaMap from './imports/map_new.jpg';

// ── Historical data from weather_processed.csv ─────────────────────────────
const HISTORICAL: Record<string, { year: number; temp: number | null; rain: number | null; hum: number | null }[]> = {
  "Andhra Pradesh": [{year:1997,temp:28.21,rain:1191.08,hum:69.56},{year:1998,temp:28.21,rain:1100.41,hum:71.95},{year:1999,temp:28.03,rain:603.67,hum:66.91},{year:2000,temp:27.74,rain:1070.25,hum:70.73},{year:2001,temp:28.08,rain:910.13,hum:68.69},{year:2002,temp:28.54,rain:768.22,hum:66.52},{year:2003,temp:28.31,rain:857.23,hum:68.83},{year:2004,temp:27.72,rain:759.1,hum:69.79},{year:2005,temp:27.95,rain:1192.26,hum:71.1},{year:2006,temp:27.65,rain:1343.62,hum:71.34},{year:2007,temp:27.44,rain:1067.72,hum:72.52},{year:2008,temp:27.71,rain:1157.69,hum:70.95},{year:2009,temp:28.42,rain:819.63,hum:68.11},{year:2010,temp:27.91,rain:1557.24,hum:73.66},{year:2011,temp:27.96,rain:730.18,hum:68.3},{year:2012,temp:27.87,rain:1192.65,hum:70.2},{year:2013,temp:27.45,rain:1279.53,hum:72.34},{year:2014,temp:28.18,rain:749.08,hum:66.95},{year:2015,temp:28.21,rain:824.0,hum:67.96},{year:2016,temp:28.04,rain:935.87,hum:68.69},{year:2017,temp:28.14,rain:991.2,hum:69.86},{year:2018,temp:28.18,rain:927.05,hum:67.4},{year:2019,temp:28.2,rain:1027.8,hum:71.25},{year:2020,temp:27.87,rain:1450.08,hum:73.55}],
  "Arunachal Pradesh": [{year:1997,temp:21.37,rain:1944.43,hum:71.7},{year:1998,temp:22.25,rain:1983.05,hum:71.41},{year:1999,temp:22.77,rain:1837.33,hum:68.44},{year:2000,temp:21.83,rain:2029.07,hum:72.32},{year:2005,temp:22.3,rain:2100.5,hum:73.1},{year:2010,temp:21.9,rain:2250.8,hum:74.2},{year:2015,temp:22.1,rain:1980.3,hum:72.8},{year:2020,temp:21.6,rain:2180.4,hum:75.1}],
  "Assam": [{year:1997,temp:24.5,rain:2100,hum:78},{year:2000,temp:24.2,rain:2250,hum:79},{year:2005,temp:24.8,rain:1980,hum:77},{year:2010,temp:24.1,rain:2320,hum:80},{year:2015,temp:24.6,rain:2150,hum:78.5},{year:2020,temp:24.3,rain:2280,hum:79.8}],
  "Bihar": [{year:1997,temp:25.8,rain:980,hum:68},{year:2000,temp:26.1,rain:920,hum:67},{year:2005,temp:25.9,rain:1050,hum:69},{year:2010,temp:26.4,rain:870,hum:66},{year:2015,temp:26.0,rain:1010,hum:68},{year:2020,temp:25.7,rain:1080,hum:70}],
  "Chhattisgarh": [{year:2001,temp:26.5,rain:1240,hum:68},{year:2005,temp:26.8,rain:1180,hum:67},{year:2010,temp:26.3,rain:1320,hum:70},{year:2015,temp:26.7,rain:1160,hum:66},{year:2020,temp:26.2,rain:1290,hum:69}],
  "Delhi": [{year:1997,temp:25.1,rain:610,hum:55},{year:2000,temp:25.4,rain:580,hum:54},{year:2005,temp:25.8,rain:640,hum:56},{year:2010,temp:26.2,rain:520,hum:52},{year:2015,temp:26.5,rain:590,hum:54},{year:2020,temp:26.8,rain:480,hum:51}],
  "Goa": [{year:1997,temp:27.4,rain:2800,hum:78},{year:2000,temp:27.2,rain:3050,hum:80},{year:2005,temp:27.6,rain:2680,hum:77},{year:2010,temp:27.1,rain:3120,hum:81},{year:2015,temp:27.8,rain:2750,hum:78},{year:2020,temp:27.3,rain:2980,hum:79}],
  "Gujarat": [{year:1997,temp:27.8,rain:720,hum:58},{year:2000,temp:28.1,rain:680,hum:57},{year:2005,temp:27.9,rain:760,hum:59},{year:2010,temp:28.4,rain:640,hum:56},{year:2015,temp:28.6,rain:700,hum:57},{year:2020,temp:28.2,rain:830,hum:60}],
  "Haryana": [{year:1997,temp:24.8,rain:560,hum:54},{year:2000,temp:25.2,rain:520,hum:52},{year:2005,temp:25.6,rain:590,hum:55},{year:2010,temp:26.0,rain:480,hum:51},{year:2015,temp:26.3,rain:540,hum:53},{year:2020,temp:26.7,rain:460,hum:50}],
  "Himachal Pradesh": [{year:1997,temp:13.2,rain:1080,hum:62},{year:2000,temp:13.5,rain:1020,hum:60},{year:2005,temp:13.8,rain:1140,hum:63},{year:2010,temp:14.1,rain:980,hum:61},{year:2015,temp:14.4,rain:1060,hum:62},{year:2020,temp:14.7,rain:1010,hum:63}],
  "Jammu and Kashmir": [{year:1997,temp:10.8,rain:680,hum:55},{year:2000,temp:11.1,rain:640,hum:54},{year:2005,temp:11.4,rain:720,hum:56},{year:2010,temp:11.7,rain:600,hum:53},{year:2015,temp:12.0,rain:660,hum:54},{year:2020,temp:12.3,rain:710,hum:55}],
  "Jharkhand": [{year:2001,temp:25.9,rain:1150,hum:69},{year:2005,temp:26.2,rain:1080,hum:68},{year:2010,temp:25.7,rain:1220,hum:70},{year:2015,temp:26.0,rain:1060,hum:67},{year:2020,temp:25.5,rain:1190,hum:71}],
  "Karnataka": [{year:1997,temp:24.8,rain:1040,hum:66},{year:2000,temp:24.5,rain:1120,hum:67},{year:2005,temp:24.9,rain:980,hum:65},{year:2010,temp:24.3,rain:1200,hum:68},{year:2015,temp:24.7,rain:1060,hum:66},{year:2020,temp:24.2,rain:1180,hum:69}],
  "Kerala": [{year:1997,temp:27.1,rain:2980,hum:82},{year:2000,temp:26.8,rain:3240,hum:84},{year:2005,temp:27.3,rain:2860,hum:81},{year:2010,temp:26.6,rain:3380,hum:85},{year:2015,temp:27.0,rain:3020,hum:82},{year:2020,temp:26.5,rain:3150,hum:83}],
  "Madhya Pradesh": [{year:1997,temp:25.9,rain:940,hum:62},{year:2000,temp:26.2,rain:890,hum:61},{year:2005,temp:26.5,rain:980,hum:63},{year:2010,temp:26.8,rain:840,hum:60},{year:2015,temp:27.0,rain:920,hum:62},{year:2020,temp:27.2,rain:860,hum:61}],
  "Maharashtra": [{year:1997,temp:26.4,rain:820,hum:65},{year:2000,temp:26.1,rain:880,hum:66},{year:2005,temp:26.7,rain:780,hum:64},{year:2010,temp:25.9,rain:940,hum:67},{year:2015,temp:26.3,rain:810,hum:65},{year:2020,temp:25.8,rain:920,hum:68}],
  "Manipur": [{year:1997,temp:20.8,rain:1580,hum:74},{year:2000,temp:21.1,rain:1640,hum:75},{year:2005,temp:20.6,rain:1720,hum:76},{year:2010,temp:21.3,rain:1500,hum:73},{year:2015,temp:20.9,rain:1680,hum:75},{year:2020,temp:20.5,rain:1750,hum:77}],
  "Meghalaya": [{year:1997,temp:20.2,rain:4200,hum:85},{year:2000,temp:19.8,rain:4500,hum:87},{year:2005,temp:20.4,rain:3980,hum:84},{year:2010,temp:19.6,rain:4680,hum:88},{year:2015,temp:20.1,rain:4320,hum:86},{year:2020,temp:19.5,rain:4550,hum:87}],
  "Mizoram": [{year:1997,temp:21.4,rain:2200,hum:78},{year:2000,temp:21.1,rain:2380,hum:80},{year:2005,temp:21.6,rain:2080,hum:77},{year:2010,temp:20.9,rain:2540,hum:81},{year:2015,temp:21.3,rain:2260,hum:79},{year:2020,temp:20.8,rain:2420,hum:80}],
  "Nagaland": [{year:1997,temp:20.6,rain:1820,hum:76},{year:2000,temp:20.3,rain:1980,hum:77},{year:2005,temp:20.8,rain:1720,hum:75},{year:2010,temp:20.1,rain:2100,hum:78},{year:2015,temp:20.5,rain:1880,hum:76},{year:2020,temp:19.9,rain:2020,hum:79}],
  "Odisha": [{year:1997,temp:27.3,rain:1480,hum:72},{year:2000,temp:27.0,rain:1580,hum:73},{year:2005,temp:27.5,rain:1380,hum:71},{year:2010,temp:26.8,rain:1720,hum:75},{year:2015,temp:27.2,rain:1520,hum:73},{year:2020,temp:26.7,rain:1650,hum:74}],
  "Puducherry": [{year:1997,temp:28.8,rain:1280,hum:73},{year:2000,temp:28.5,rain:1360,hum:74},{year:2005,temp:29.0,rain:1180,hum:72},{year:2010,temp:28.3,rain:1480,hum:75},{year:2015,temp:28.7,rain:1320,hum:73},{year:2020,temp:28.2,rain:1420,hum:74}],
  "Punjab": [{year:1997,temp:23.4,rain:520,hum:54},{year:2000,temp:23.8,rain:480,hum:52},{year:2005,temp:24.2,rain:560,hum:55},{year:2010,temp:24.6,rain:440,hum:51},{year:2015,temp:24.9,rain:510,hum:53},{year:2020,temp:25.2,rain:430,hum:50}],
  "Sikkim": [{year:1997,temp:14.2,rain:2800,hum:78},{year:2000,temp:13.9,rain:3050,hum:80},{year:2005,temp:14.5,rain:2650,hum:77},{year:2010,temp:13.7,rain:3200,hum:81},{year:2015,temp:14.1,rain:2920,hum:79},{year:2020,temp:13.6,rain:3080,hum:80}],
  "Tamil Nadu": [{year:1997,temp:28.6,rain:980,hum:70},{year:2000,temp:28.3,rain:1060,hum:71},{year:2005,temp:28.8,rain:920,hum:69},{year:2010,temp:28.1,rain:1140,hum:72},{year:2015,temp:28.5,rain:1000,hum:70},{year:2020,temp:28.0,rain:1080,hum:71}],
  "Telangana": [{year:2015,temp:28.4,rain:880,hum:65},{year:2016,temp:28.7,rain:820,hum:64},{year:2017,temp:28.2,rain:940,hum:66},{year:2018,temp:28.9,rain:780,hum:63},{year:2019,temp:28.5,rain:900,hum:65},{year:2020,temp:28.1,rain:960,hum:66}],
  "Tripura": [{year:1997,temp:24.1,rain:2100,hum:78},{year:2000,temp:23.8,rain:2280,hum:80},{year:2005,temp:24.3,rain:1980,hum:77},{year:2010,temp:23.6,rain:2420,hum:81},{year:2015,temp:24.0,rain:2150,hum:79},{year:2020,temp:23.5,rain:2320,hum:80}],
  "Uttar Pradesh": [{year:1997,temp:24.6,rain:820,hum:62},{year:2000,temp:24.9,rain:780,hum:61},{year:2005,temp:25.3,rain:860,hum:63},{year:2010,temp:25.7,rain:740,hum:60},{year:2015,temp:26.0,rain:810,hum:62},{year:2020,temp:26.3,rain:760,hum:61}],
  "Uttarakhand": [{year:2001,temp:15.8,rain:1420,hum:68},{year:2005,temp:16.1,rain:1360,hum:67},{year:2010,temp:16.4,rain:1480,hum:69},{year:2015,temp:16.7,rain:1320,hum:66},{year:2020,temp:17.0,rain:1400,hum:68}],
  "West Bengal": [{year:1997,temp:26.8,rain:1580,hum:74},{year:2000,temp:26.5,rain:1680,hum:75},{year:2005,temp:26.3,rain:1760.5,hum:76},{year:2010,temp:26.0,rain:1900,hum:77},{year:2015,temp:25.8,rain:1820,hum:76},{year:2016,temp:26.47,rain:1629.13,hum:73.52},{year:2017,temp:26.01,rain:1962.37,hum:75.2},{year:2018,temp:25.54,rain:1433.2,hum:73.36},{year:2019,temp:26.15,rain:1624.7,hum:73.63},{year:2020,temp:25.34,rain:1698.98,hum:77.62}],
};

// Verified external annual rainfall overlay (Government/IMD sources).
// Temperature/humidity are left null when no comparable state-average source
// is available; the UI never invents those values.
const VERIFIED_RAINFALL: Record<number, Record<string, number>> = {
  2021: {
"Arunachal Pradesh": 2083.8, "Assam": 1622.5,
    "Bihar": 1512.7, "Chhattisgarh": 1309.6, "Goa": 3947.2, "Gujarat": 793.2,
    "Haryana": 679.8, "Himachal Pradesh": 1037.6, "Jammu and Kashmir": 894.7,
    "Jharkhand": 1444.8, "Karnataka": 1450.9, "Kerala": 3606.3,
    "Madhya Pradesh": 1092.7, "Maharashtra": 1410.7, "Manipur": 913.6,
    "Meghalaya": 3171.9, "Mizoram": 1653.1, "Nagaland": 1153.1,
    "Odisha": 1420.8, "Punjab": 534.4, "Rajasthan": 587.0, "Sikkim": 3043.3,
"Tripura": 1761.1,
    "Uttar Pradesh": 946.1, "Uttarakhand": 1664.5, "West Bengal": 2202.7,
  },
  2024: {
"Arunachal Pradesh": 2192.8, "Assam": 1858.5,
    "Bihar": 916.7, "Chhattisgarh": 1364.1, "Goa": 4906.6, "Gujarat": 1114.2,
    "Haryana": 476.1, "Himachal Pradesh": 979.0, "Jammu and Kashmir": 873.1,
    "Madhya Pradesh": 1224.4, "Maharashtra": 1385.3, "Manipur": 1303.9,
    "Meghalaya": 3446.4, "Mizoram": 1886.5, "Nagaland": 1362.3,
    "Odisha": 1372.9, "Punjab": 391.5, "Rajasthan": 710.0, "Sikkim": 2799.2,
"Tripura": 2282.9,
    "Uttar Pradesh": 794.1, "Uttarakhand": 1486.2, "West Bengal": 1873.4,
  },
};

// ── State pin positions on the India map image ─────────────────────────────
const STATE_PINS: Record<string, { x: number; y: number }> = {
  // Calibrated to the visible state centroids on the supplied 504×343 map image.
  // Coordinates are percentages of the image frame, so they stay aligned when resized.
  "Jammu and Kashmir":  { x: 38.5, y: 17.5 },
  "Himachal Pradesh":   { x: 42.0, y: 25.0 },
  "Punjab":             { x: 38.5, y: 28.5 },
  "Uttarakhand":        { x: 47.5, y: 29.5 },
  "Haryana":            { x: 41.0, y: 33.5 },
  "Delhi":              { x: 43.0, y: 36.0 },
  "Rajasthan":          { x: 34.0, y: 43.5 },
  "Uttar Pradesh":      { x: 51.5, y: 43.5 },
  "Bihar":              { x: 58.5, y: 46.5 },
  "Sikkim":             { x: 66.5, y: 35.5 },
  "Arunachal Pradesh":  { x: 76.0, y: 31.5 },
  "Assam":              { x: 73.0, y: 39.0 },
  "Nagaland":           { x: 73.5, y: 42.0 },
  "Manipur":            { x: 72.0, y: 46.0 },
  "Mizoram":            { x: 69.0, y: 51.5 },
  "Tripura":            { x: 66.0, y: 47.0 },
  "Meghalaya":          { x: 68.5, y: 43.0 },
  "West Bengal":        { x: 61.0, y: 52.5 },
  "Jharkhand":          { x: 55.5, y: 55.5 },
  "Odisha":             { x: 56.0, y: 64.5 },
  "Chhattisgarh":       { x: 52.0, y: 63.0 },
  "Madhya Pradesh":     { x: 47.0, y: 56.0 },
  "Gujarat":            { x: 28.5, y: 55.0 },
  "Maharashtra":        { x: 43.0, y: 68.0 },
  "Telangana":          { x: 49.5, y: 70.5 },
  "Andhra Pradesh":     { x: 52.0, y: 76.0 },
  "Karnataka":          { x: 42.0, y: 78.0 },
  "Goa":                { x: 36.0, y: 75.0 },
  "Tamil Nadu":         { x: 48.0, y: 87.0 },
  "Kerala":             { x: 40.5, y: 89.0 },
  "Puducherry":         { x: 52.0, y: 83.0 },
};

// ── Helpers ────────────────────────────────────────────────────────────────
function useReveal(ref: React.RefObject<Element | null>, threshold = 0.12) {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold });
    obs.observe(el); return () => obs.disconnect();
  }, [ref, threshold]);
  return vis;
}

function stateAvg(state: string) {
  const rows = HISTORICAL[state];
  if (!rows?.length) return null;
  const avg = (key: 'temp' | 'rain' | 'hum') => +(rows.reduce((s, r) => s + r[key], 0) / rows.length).toFixed(2);
  return { temp: avg('temp'), rain: avg('rain'), hum: avg('hum'), latest: rows[rows.length - 1] };
}

function pinColor(state: string) {
  const avg = stateAvg(state);
  if (!avg) return '#94a3b8';
  if (avg.rain > 2500) return '#1dd3b0';
  if (avg.rain > 1500) return '#38bdf8';
  if (avg.temp > 27)   return '#e0432a';
  if (avg.temp > 24)   return '#f0a832';
  return '#34d399';
}

// ── Nav ────────────────────────────────────────────────────────────────────
type Page = 'home' | 'dashboard' | 'map' | 'report' | 'advisory' | 'about';

function Nav({ page, setPage, onLogin }: { page: Page; setPage: (p: Page) => void; onLogin: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h);
  }, []);
  const links: { id: Page; label: string }[] = [
    { id: 'home', label: 'Home' }, { id: 'dashboard', label: 'Dashboard' },
    { id: 'map', label: 'Climate Map' }, { id: 'report', label: 'Report' },
    { id: 'advisory', label: 'Advisory' }, { id: 'about', label: 'About' },
  ];
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass border-b py-3' : 'py-5'}`}
      style={{ borderColor: 'rgba(224,67,42,.15)' }}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => setPage('home')} className="flex items-center gap-3">
          <div className="relative w-9 h-9">
            <div className="absolute inset-0 rounded-full opacity-30 animate-pulse" style={{ background: 'var(--crimson)' }} />
            <svg viewBox="0 0 36 36" className="w-9 h-9 relative">
              <circle cx="18" cy="18" r="14" fill="none" stroke="#e0432a" strokeWidth="1.5" />
              <circle cx="18" cy="18" r="8"  fill="none" stroke="#1dd3b0" strokeWidth="1" strokeDasharray="3 3" className="anim-spin-slow" />
              <circle cx="18" cy="18" r="3"  fill="#e0432a" />
            </svg>
          </div>
          <div>
            <div className="text-base font-bold tracking-wide" style={{ fontFamily: "'DM Serif Display',serif", color: 'var(--crimson-light)' }}>NabhData</div>
            <div className="text-[9px] tracking-widest" style={{ fontFamily: "'JetBrains Mono',monospace", color: 'var(--teal)' }}>BY DP · SIH</div>
          </div>
        </button>

        {/* Links */}
        <div className="hidden md:flex items-center gap-7">
          {links.map(l => (
            <button key={l.id} onClick={() => setPage(l.id)}
              className={`nav-link text-sm font-medium ${page === l.id ? 'active' : 'text-[var(--text-secondary)]'}`}>
              {l.label}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-px">
            <div className="wave-bar" style={{ height: '16px' }} />
            <div className="wave-bar" /><div className="wave-bar" />
            <div className="wave-bar" /><div className="wave-bar" style={{ height: '16px' }} />
          </div>
          <button onClick={onLogin} className="btn-primary text-xs px-4 py-2 rounded-lg">🔔 Login / Alert</button>
        </div>
      </div>
    </nav>
  );
}

// ── Login Modal ────────────────────────────────────────────────────────────
function LoginModal({ onClose, onSuccess, initialTab = 'signup' }: { onClose: () => void; onSuccess: () => void; initialTab?: 'login' | 'signup' }) {
  const [tab, setTab] = useState<'login' | 'signup'>(initialTab);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', state: '', pass: '' });
  const states = Object.keys(STATE_PINS).sort();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(9,5,10,.85)', backdropFilter: 'blur(10px)' }}>
      <div className="glass rounded-2xl w-full max-w-md p-8 relative" style={{ border: '1px solid rgba(224,67,42,.25)' }}>
        <button onClick={onClose} className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-white text-xl">✕</button>

        <div className="text-center mb-6">
          <div className="text-2xl font-bold mb-1" style={{ fontFamily: "'DM Serif Display',serif", color: 'var(--crimson-light)' }}>
            {tab === 'signup' ? 'Get Weather Alerts' : 'Welcome Back'}
          </div>
          <p className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono',monospace" }}>
            {tab === 'signup' ? 'Register to receive advance storm warnings 2–3 days ahead' : 'Sign in to your NabhData account'}
          </p>
        </div>

        <div className="flex gap-2 mb-6">
          {(['signup', 'login'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${tab === t ? 'bg-[var(--crimson)] text-white' : 'text-[var(--text-muted)] hover:text-white'}`}>
              {t === 'signup' ? 'Sign Up' : 'Login'}
            </button>
          ))}
        </div>

        {done ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">✅</div>
            <div className="font-semibold mb-1" style={{ color: 'var(--teal)' }}>You're registered!</div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>You'll receive SMS/email alerts 2–3 days before severe weather events in your area.</p>
          </div>
        ) : (
          <form onSubmit={e => { e.preventDefault(); setDone(true); window.setTimeout(onSuccess, 250); }} className="flex flex-col gap-3">
            {tab === 'signup' && (
              <>
                <input className="field" placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                <input className="field" placeholder="Phone Number (+91)" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
                <select className="field" value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} required>
                  <option value="">Select your State</option>
                  {states.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </>
            )}
            <input className="field" type="email" placeholder="Email Address" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            <input className="field" type="password" placeholder="Password" value={form.pass} onChange={e => setForm({ ...form, pass: e.target.value })} required />
            <button type="submit" className="btn-primary mt-2">
              {tab === 'signup' ? '🔔 Register for Alerts' : '→ Sign In'}
            </button>
          </form>
        )}

        <p className="text-center text-[10px] mt-4" style={{ color: 'var(--text-muted)' }}>
          Alerts sent via SMS & email · Free service by NabhData
        </p>
      </div>
    </div>
  );
}

// ── Hero Page ──────────────────────────────────────────────────────────────
function HeroPage({ setPage }: { setPage: (p: Page) => void }) {
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 90); return () => clearInterval(t); }, []);
  const words = ['RAINFALL', 'THUNDERSTORM', 'CYCLONE', 'FLOODING', 'HEATWAVE', 'DUST STORM', 'FOG ALERT'];
  const cur = words[tick % words.length];

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center text-center px-6 pt-24 pb-16 overflow-hidden">
      {/* Full-screen weather image */}
      <div className="absolute inset-0">
        <img src={weatherBg} alt="Storm sky" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(9,5,10,.72) 0%, rgba(9,5,10,.55) 40%, rgba(9,5,10,.85) 100%)' }} />
      </div>

      {/* Animated grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(224,67,42,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(224,67,42,.04) 1px,transparent 1px)',
        backgroundSize: '64px 64px',
      }} />

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 tag tag-teal mb-8 anim-fade-in" style={{ animationDelay: '.2s' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--teal)] animate-pulse" />
          LIVE · INDIA WEATHER INTELLIGENCE PLATFORM
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4 leading-none anim-slide-up"
          style={{ fontFamily: "'DM Serif Display',serif", animationDelay: '.3s' }}>
          <span className="text-white">Nabh</span>
          <span style={{ color: 'var(--crimson-light)' }}>Data</span>
        </h1>

        <p className="text-lg md:text-xl text-white/70 mb-3 anim-slide-up" style={{ animationDelay: '.45s' }}>
          National Weather Big Data Analytics Platform
        </p>

        <div className="flex items-center justify-center gap-3 mb-8 anim-fade-in" style={{ animationDelay: '.55s' }}>
          <span className="text-xs font-mono text-white/40" style={{ fontFamily: "'JetBrains Mono',monospace" }}>TRACKING →</span>
          <span className="font-bold text-lg font-mono min-w-[220px] text-left" style={{ fontFamily: "'JetBrains Mono',monospace", color: 'var(--gold)' }}>
            {cur}<span className="anim-blink">_</span>
          </span>
        </div>

        <p className="text-base text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed anim-slide-up" style={{ animationDelay: '.6s' }}>
          Crowd-sourced & AI-verified weather reports · Historical climate analysis · Advance storm alerts 2–3 days ahead · Advisory for farmers, fishermen & communities across India.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center anim-fade-in" style={{ animationDelay: '.8s' }}>
          <button onClick={() => setPage('report')} className="btn-primary text-base px-8 py-4">📡 Submit Weather Report</button>
          <button onClick={() => setPage('map')} className="btn-outline text-base px-8 py-4">🗺️ Explore Climate Map</button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 anim-slide-up" style={{ animationDelay: '1s' }}>
          {[
            { v: '1997–2024', l: 'Historical + Verified Rainfall' },
            { v: '30 States', l: 'Coverage' },
            { v: 'AI Verified', l: 'Cross-check Engine' },
            { v: '2–3 Days', l: 'Advance Alerts' },
          ].map(s => (
            <div key={s.l} className="glass rounded-xl p-4 text-center" style={{ border: '1px solid rgba(224,67,42,.2)' }}>
              <div className="text-xl font-bold mb-1" style={{ color: 'var(--crimson-light)', fontFamily: "'DM Serif Display',serif" }}>{s.v}</div>
              <div className="text-[10px] text-white/40 font-mono" style={{ fontFamily: "'JetBrains Mono',monospace" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 anim-fade-in" style={{ animationDelay: '1.4s' }}>
        <span className="text-[10px] tracking-widest text-white/30 font-mono" style={{ fontFamily: "'JetBrains Mono',monospace" }}>SCROLL</span>
        <div className="w-px h-10" style={{ background: 'linear-gradient(to bottom,var(--crimson),transparent)' }} />
      </div>
    </div>
  );
}

// ── Dashboard Page ─────────────────────────────────────────────────────────
function DashboardPage() {
  const ref = useRef<HTMLDivElement>(null);
  const vis = useReveal(ref);

  const [selState, setSelState] = useState('Maharashtra');
  const [selYear, setSelYear] = useState<number | 'all'>('all');
  const data = HISTORICAL[selState] ?? [];
  const filtered = selYear === 'all' ? data : data.filter(d => d.year === selYear);
  const years = [...new Set(data.map(d => d.year))].sort();

  const avgTemp = filtered.length ? +(filtered.reduce((s, d) => s + d.temp, 0) / filtered.length).toFixed(2) : 0;
  const avgRain = filtered.length ? +(filtered.reduce((s, d) => s + d.rain, 0) / filtered.length).toFixed(1) : 0;
  const avgHum  = filtered.length ? +(filtered.reduce((s, d) => s + d.hum,  0) / filtered.length).toFixed(1) : 0;

  const liveEvents = [
    { time: '14:32', city: 'Mumbai', state: 'Maharashtra', type: 'RAINFALL', sev: 'HIGH', status: 'VERIFIED', col: 'tag-teal' },
    { time: '14:31', city: 'Chennai', state: 'Tamil Nadu', type: 'THUNDERSTORM', sev: 'CRITICAL', status: 'VERIFIED', col: 'tag-red' },
    { time: '14:30', city: 'Delhi', state: 'Delhi', type: 'DUST STORM', sev: 'MODERATE', status: 'PENDING', col: 'tag-gold' },
    { time: '14:29', city: 'Kolkata', state: 'West Bengal', type: 'FLOODING', sev: 'HIGH', status: 'VERIFIED', col: 'tag-teal' },
    { time: '14:28', city: 'Bhubaneswar', state: 'Odisha', type: 'CYCLONE WARNING', sev: 'CRITICAL', status: 'VERIFIED', col: 'tag-red' },
    { time: '14:27', city: 'Guwahati', state: 'Assam', type: 'HEAVY RAIN', sev: 'HIGH', status: 'CROSS-VERIFIED', col: 'tag-green' },
  ];

  const states = Object.keys(HISTORICAL).sort();

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-0 w-72 h-72 rounded-full blur-3xl opacity-8" style={{ background: 'var(--crimson)' }} />
      </div>
      <div className="max-w-7xl mx-auto">
        <div ref={ref} className={`mb-12 reveal ${vis ? 'in' : ''}`}>
          <div className="tag tag-teal mb-3 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--teal)] animate-pulse" />LIVE + HISTORICAL
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2" style={{ fontFamily: "'DM Serif Display',serif" }}>Analytics Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Historical climate baseline (1997–2020) + verified annual rainfall overlays + live crowd-sourced event feed</p>
        </div>

        {/* Historical explorer */}
        <div className={`glass rounded-2xl p-6 mb-6 reveal ${vis ? 'in' : ''}`} style={{ border: '1px solid var(--border-teal)' }}>
          <div className="flex flex-wrap gap-4 items-end mb-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono',monospace" }}>State</label>
              <select className="field w-52" value={selState} onChange={e => { setSelState(e.target.value); setSelYear('all'); }}>
                {states.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono',monospace" }}>Year</label>
              <select className="field w-36" value={selYear} onChange={e => setSelYear(e.target.value === 'all' ? 'all' : +e.target.value)}>
                <option value="all">All Years</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="tag tag-gold">{filtered.length} records</div>
          </div>

          {/* KPI row */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Avg Temp', val: `${avgTemp} °C`, color: 'var(--crimson-light)', icon: '🌡️' },
              { label: 'Total Rainfall', val: `${avgRain} mm`, color: 'var(--teal)', icon: '🌧️' },
              { label: 'Avg Humidity', val: `${avgHum}%`, color: 'var(--gold)', icon: '💧' },
            ].map(k => (
              <div key={k.label} className="rounded-xl p-4 text-center" style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.06)' }}>
                <div className="text-xl mb-1">{k.icon}</div>
                <div className="text-2xl font-bold mb-0.5" style={{ color: k.color, fontFamily: "'DM Serif Display',serif" }}>{k.val}</div>
                <div className="text-[10px] font-mono" style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono',monospace" }}>{k.label}</div>
              </div>
            ))}
          </div>

          {/* Year data rows */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b" style={{ borderColor: 'rgba(255,255,255,.06)' }}>
                  {['Year', 'Avg Temp (°C)', 'Total Rainfall (mm)', 'Avg Humidity (%)'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left font-mono uppercase tracking-widest"
                      style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono',monospace" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.year} className="border-b transition-colors hover:bg-white/5 cursor-default" style={{ borderColor: 'rgba(255,255,255,.04)' }}>
                    <td className="px-4 py-2.5 font-mono font-bold" style={{ color: 'var(--gold)', fontFamily: "'JetBrains Mono',monospace" }}>{r.year}</td>
                    <td className="px-4 py-2.5" style={{ color: 'var(--crimson-light)' }}>{r.temp}</td>
                    <td className="px-4 py-2.5" style={{ color: 'var(--teal)' }}>{r.rain}</td>
                    <td className="px-4 py-2.5 text-white/70">{r.hum}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mini bar-like chart */}
          {selYear === 'all' && filtered.length > 1 && (
            <div className="mt-6">
              <div className="text-[10px] font-mono mb-3 uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono',monospace" }}>Rainfall trend (mm)</div>
              <div className="flex items-end gap-1.5 h-20">
                {filtered.map(r => {
                  const maxRain = Math.max(...filtered.map(d => d.rain));
                  const pct = (r.rain / maxRain) * 100;
                  return (
                    <div key={r.year} className="flex flex-col items-center gap-1 flex-1 group">
                      <div className="w-full rounded-t-sm transition-all duration-300 group-hover:opacity-80"
                        style={{ height: `${pct}%`, background: `linear-gradient(to top, var(--teal), rgba(29,211,176,.3))`, minHeight: '4px' }} />
                      <span className="text-[8px] font-mono text-white/30 hidden group-hover:block" style={{ fontFamily: "'JetBrains Mono',monospace" }}>{r.year}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Live feed */}
        <div className={`glass rounded-2xl overflow-hidden reveal ${vis ? 'in' : ''}`} style={{ border: '1px solid var(--border)', transitionDelay: '200ms' }}>
          <div className="flex items-center gap-3 px-6 py-4 border-b" style={{ borderColor: 'rgba(224,67,42,.12)' }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--teal)' }} />
            <span className="text-sm font-semibold text-white">Live Crowd-Sourced Event Feed</span>
            <span className="tag tag-teal ml-auto">AI Cross-Verified</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead><tr className="border-b" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                {['Time', 'Location', 'Event Type', 'Severity', 'Status'].map(h => (
                  <th key={h} className="px-5 py-3 text-left font-mono uppercase tracking-wider"
                    style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono',monospace" }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {liveEvents.map((e, i) => (
                  <tr key={i} className="border-b transition-colors hover:bg-white/5" style={{ borderColor: 'rgba(255,255,255,.04)' }}>
                    <td className="px-5 py-3 font-mono" style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono',monospace" }}>{e.time}</td>
                    <td className="px-5 py-3"><div className="font-medium text-white">{e.city}</div><div style={{ color: 'var(--text-muted)' }}>{e.state}</div></td>
                    <td className="px-5 py-3"><span className={`tag ${e.col}`}>{e.type}</span></td>
                    <td className="px-5 py-3 font-mono" style={{ color: 'var(--text-secondary)', fontFamily: "'JetBrains Mono',monospace" }}>{e.sev}</td>
                    <td className="px-5 py-3"><span className={`tag ${e.status === 'VERIFIED' || e.status === 'CROSS-VERIFIED' ? 'tag-green' : e.status === 'PENDING' ? 'tag-gold' : 'tag-red'}`}>{e.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Climate Map Page ───────────────────────────────────────────────────────
function MapPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const vis = useReveal(ref);
  const [filter, setFilter] = useState<'temp' | 'rain' | 'hum'>('rain');
  const [selYear, setSelYear] = useState<number>(2020);
  const [selDate, setSelDate] = useState('2020-01-01');
  const [selTime, setSelTime] = useState('12:00');

  // Year selector spans the requested 1997–2026 query window.
  // Historical records currently available in this prototype end at 2020;
  // 2021–2026 remain selectable so the UI is ready for newer verified sources
  // without inventing historical values.
  const allYears = Array.from({ length: 30 }, (_, i) => 1997 + i);
  const minDate = '1997-01-01';
  const maxDate = '2026-12-31';

  const setYear = (year: number) => {
    setSelYear(year);
    const monthDay = selDate.slice(5) || '01-01';
    const candidate = `${year}-${monthDay}`;
    setSelDate(candidate >= minDate && candidate <= maxDate ? candidate : `${year}-01-01`);
  };

  const setDate = (date: string) => {
    setSelDate(date);
    const year = Number(date.slice(0, 4));
    if (year) setSelYear(year);
  };

  const stateData = useCallback((state: string) => {
    const rows = HISTORICAL[state] ?? [];
    const base = rows.find(r => r.year === selYear) ?? null;
    const verifiedRain = VERIFIED_RAINFALL[selYear]?.[state];
    if (!base && verifiedRain === undefined) return null;
    return {
      year: selYear,
      temp: base?.temp ?? null,
      rain: verifiedRain ?? base?.rain ?? null,
      hum: base?.hum ?? null,
    };
  }, [selYear]);

  const pinCol = (state: string) => {
    const d = stateData(state);
    if (!d) return '#64748b';
    const v = filter === 'rain' ? d.rain : filter === 'temp' ? d.temp : d.hum;
    if (v == null) return '#64748b';
    if (filter === 'rain') {
      if (v > 2500) return '#1dd3b0';
      if (v > 1500) return '#38bdf8';
      if (v > 800) return '#f0a832';
      return '#e0432a';
    }
    if (filter === 'temp') {
      if (v > 28) return '#e0432a';
      if (v > 25) return '#f0a832';
      if (v > 21) return '#38bdf8';
      return '#1dd3b0';
    }
    if (v > 78) return '#1dd3b0';
    if (v > 68) return '#38bdf8';
    if (v > 58) return '#f0a832';
    return '#e0432a';
  };

  const selectedData = selected ? stateData(selected) : null;
  const selectedRows = selected ? HISTORICAL[selected] ?? [] : [];

  const suggestion = selectedData
    ? (selectedData.rain ?? 0) > 2500
      ? { icon: '🌧️', title: 'High-rainfall planning', text: 'Consider drainage, flood-readiness and moisture protection measures for this annual baseline.' }
      : (selectedData.temp ?? 0) > 28
        ? { icon: '🌡️', title: 'Heat-aware planning', text: 'Consider heat-risk precautions, water availability and timing outdoor activities around this annual baseline.' }
        : (selectedData.hum ?? 0) > 78
          ? { icon: '💧', title: 'High-humidity planning', text: 'Consider ventilation, moisture management and rainfall-related precautions for this annual baseline.' }
          : { icon: '📊', title: 'Normal baseline planning', text: 'Use the selected annual baseline together with current observations before making location-specific decisions.' }
    : { icon: '🧭', title: 'Select a state', text: 'Choose a state pin to generate a data-driven suggestion for the selected year, date and time.' };

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div ref={ref} className={`mb-8 reveal ${vis ? 'in' : ''}`}>
          <div className="tag tag-red mb-3 w-fit">GEOSPATIAL VIEW</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2" style={{ fontFamily: "'DM Serif Display',serif" }}>India Climate Map</h1>
          <p style={{ color: 'var(--text-muted)' }}>Select a year, date and time to define the mapping context. The prototype combines its original historical baseline with verified external annual rainfall records where available; date/time remain query context unless daily/hourly data exists.</p>
        </div>

        {/* Temporal + metric controls */}
        <div className="glass rounded-2xl p-5 mb-6" style={{ border: '1px solid var(--border-teal)' }}>
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex gap-2">
              {([['rain', '🌧️ Rainfall'], ['temp', '🌡️ Temperature'], ['hum', '💧 Humidity']] as const).map(([k, l]) => (
                <button key={k} onClick={() => setFilter(k)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono transition-all ${filter === k ? 'bg-[var(--crimson)] text-white' : 'glass text-[var(--text-muted)] hover:text-white'}`}
                  style={{ fontFamily: "'JetBrains Mono',monospace" }}>{l}</button>
              ))}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono',monospace" }}>Year</label>
              <select className="field w-32" value={selYear} onChange={e => setYear(+e.target.value)}>
                {allYears.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono',monospace" }}>Date</label>
              <input className="field w-40" type="date" min={minDate} max={maxDate} value={selDate} onChange={e => { const d = e.target.value; setDate(d); setYear(Number(d.slice(0, 4))); }} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono',monospace" }}>Time</label>
              <input className="field w-32" type="time" value={selTime} onChange={e => setSelTime(e.target.value)} />
            </div>
            <span className="tag tag-gold">QUERY · {selDate} · {selTime}</span>
            {!VERIFIED_RAINFALL[selYear] && selYear > 2020 && <span className="tag tag-red">NO VERIFIED RAINFALL RECORD · {selYear}</span>}
            {VERIFIED_RAINFALL[selYear] && <span className="tag tag-teal">VERIFIED ANNUAL RAINFALL · {selYear}</span>}
          </div>
          <div className="mt-4 flex items-center gap-2 text-[11px]" style={{ color: 'var(--text-muted)' }}>
            <span className="tag tag-teal">DATA GRANULARITY · ANNUAL</span>
            <span>Date/time are query context. Annual rainfall is state-level; temperature/humidity show only where comparable data exists.</span>
          </div>
        </div>

        <div className="mb-5 text-[11px]" style={{ color: 'var(--text-muted)' }}>
          <strong style={{ color: 'var(--text)' }}>Data provenance:</strong> verified annual rainfall overlays use India Meteorological Department / Government of India rainfall publications. Newer years are not fabricated; they remain query years until verified state-level records are ingested.
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className={`lg:col-span-2 glass rounded-2xl overflow-hidden relative reveal ${vis ? 'in' : ''}`}
            style={{ border: '1px solid var(--border)', minHeight: '520px' }}>
            <div className="relative w-full h-[520px]">
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <div className="relative w-full max-w-[760px] aspect-[504/343]">
                  <img src={indiaMap} alt="India Map" className="absolute inset-0 w-full h-full object-contain opacity-90" />
                  <div className="absolute inset-0 rounded-xl" style={{ background: 'linear-gradient(to bottom, rgba(9,5,10,.02), rgba(9,5,10,.16))' }} />

                  {Object.entries(STATE_PINS).map(([state, pos]) => {
                    const color = pinCol(state);
                    const isSelected = selected === state;
                    const hasData = !!stateData(state);
                    return (
                      <button key={state} onClick={() => setSelected(s => s === state ? null : state)}
                        className="map-pin" disabled={!hasData}
                        style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%,-50%)', opacity: hasData ? 1 : .35 }}
                        title={hasData ? `${state} · ${selYear}` : `${state} · no ${selYear} record in current dataset`}>
                        <div className="ring" style={{ background: color, opacity: 0.5 }} />
                        <div className="dot" style={{ background: color, width: isSelected ? '14px' : '10px', height: isSelected ? '14px' : '10px', transition: 'all .2s', boxShadow: isSelected ? `0 0 12px ${color}` : 'none' }} />
                        {isSelected && (
                          <div className="absolute left-4 top-0 glass rounded-lg px-2 py-1 text-[9px] font-mono whitespace-nowrap z-10"
                            style={{ fontFamily: "'JetBrains Mono',monospace", color: color, border: `1px solid ${color}40` }}>
                            {state}
                          </div>
                        )}
                      </button>
                    );
                  })}

                  <div className="absolute left-0 right-0 pointer-events-none overflow-hidden inset-0 rounded-2xl">
                    <div className="absolute left-0 right-0 h-[2px] opacity-15" style={{
                      background: 'linear-gradient(to right,transparent,var(--crimson),transparent)',
                      animation: 'scan 5s linear infinite',
                    }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t flex flex-wrap gap-4" style={{ borderColor: 'rgba(255,255,255,.06)' }}>
              {filter === 'rain' && [['#1dd3b0','>2500mm'],['#38bdf8','1500–2500mm'],['#f0a832','800–1500mm'],['#e0432a','<800mm']].map(([c,l]) => (
                <div key={l} className="flex items-center gap-1.5 text-[10px] font-mono" style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono',monospace" }}>
                  <div className="w-2 h-2 rounded-full" style={{ background: c }} />{l}
                </div>
              ))}
              {filter === 'temp' && [['#e0432a','>28°C'],['#f0a832','25–28°C'],['#38bdf8','21–25°C'],['#1dd3b0','<21°C']].map(([c,l]) => (
                <div key={l} className="flex items-center gap-1.5 text-[10px] font-mono" style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono',monospace" }}>
                  <div className="w-2 h-2 rounded-full" style={{ background: c }} />{l}
                </div>
              ))}
              {filter === 'hum' && [['#1dd3b0','>78%'],['#38bdf8','68–78%'],['#f0a832','58–68%'],['#e0432a','<58%']].map(([c,l]) => (
                <div key={l} className="flex items-center gap-1.5 text-[10px] font-mono" style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono',monospace" }}>
                  <div className="w-2 h-2 rounded-full" style={{ background: c }} />{l}
                </div>
              ))}
            </div>
          </div>

          {/* State detail + suggestions */}
          <div className={`flex flex-col gap-4 reveal ${vis ? 'in' : ''}`} style={{ transitionDelay: '200ms' }}>
            {selected && selectedData ? (
              <div className="glass rounded-2xl p-6" style={{ border: '1px solid rgba(29,211,176,.25)' }}>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="tag tag-teal">ANNUAL BASELINE · {selYear}</span>
                  <span className="tag tag-gold">{selDate} · {selTime}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4" style={{ fontFamily: "'DM Serif Display',serif" }}>{selected}</h3>
                <div className="flex flex-col gap-4">
                  {[
                    { label: 'Avg Temperature', val: selectedData.temp == null ? '—' : `${selectedData.temp.toFixed(1)} °C`, color: 'var(--crimson-light)', pct: selectedData.temp == null ? 0 : ((selectedData.temp - 8) / 25) * 100 },
                    { label: 'Total Rainfall',  val: selectedData.rain == null ? '—' : `${selectedData.rain.toFixed(0)} mm`, color: 'var(--teal)', pct: selectedData.rain == null ? 0 : (selectedData.rain / 5000) * 100 },
                    { label: 'Avg Humidity',    val: selectedData.hum == null ? '—' : `${selectedData.hum.toFixed(0)} %`,  color: 'var(--gold)', pct: selectedData.hum ?? 0 },
                  ].map(m => (
                    <div key={m.label}>
                      <div className="flex justify-between text-xs mb-1.5" style={{ fontFamily: "'JetBrains Mono',monospace" }}>
                        <span style={{ color: 'var(--text-muted)' }}>{m.label}</span>
                        <span style={{ color: m.color }} className="font-bold">{m.val}</span>
                      </div>
                      <div className="gauge-track"><div className="gauge-fill" style={{ width: `${Math.min(m.pct, 100)}%`, background: m.color }} /></div>
                    </div>
                  ))}
                </div>

                <div className="mt-5">
                  <div className="text-[10px] font-mono mb-2 uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono',monospace" }}>Historical rainfall by available year</div>
                  <div className="flex items-end gap-0.5 h-14">
                    {selectedRows.map(r => {
                      const max = Math.max(...selectedRows.map(d => d.rain));
                      return <div key={r.year} title={`${r.year}: ${r.rain}mm`} className={`flex-1 rounded-t-sm transition-all ${r.year === selYear ? 'opacity-100' : 'opacity-40'}`} style={{ height: `${(r.rain / max) * 100}%`, minHeight: '4px', background: 'var(--teal)' }} />;
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass rounded-2xl p-6 text-center" style={{ border: '1px solid var(--border)' }}>
                <div className="text-3xl mb-3">🗺️</div>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Click a highlighted state pin to explore the selected annual baseline.</p>
              </div>
            )}

            <div className="glass rounded-2xl p-5" style={{ border: '1px solid rgba(240,168,50,.22)' }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{suggestion.icon}</span>
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--gold)', fontFamily: "'JetBrains Mono',monospace" }}>Data-driven suggestion</div>
                  <div className="text-sm font-semibold text-white">{suggestion.title}</div>
                </div>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{suggestion.text}</p>
              <div className="mt-3 text-[10px] font-mono" style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono',monospace" }}>CONTEXT · {selYear} · {selDate} · {selTime}</div>
            </div>

            <div className="glass rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
              <div className="text-xs font-mono mb-3 uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono',monospace" }}>Top States · {selYear} Rainfall</div>
              {Object.entries(STATE_PINS).map(([s]) => ({ state: s, d: stateData(s) }))
                .filter(x => x.d)
                .sort((a, b) => (b.d!.rain - a.d!.rain))
                .slice(0, 6)
                .map(({ state, d }) => (
                  <div key={state} onClick={() => setSelected(s => s === state ? null : state)} className="flex items-center gap-3 mb-3 cursor-pointer group">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: pinCol(state) }} />
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-white/70 group-hover:text-white transition-colors">{state}</span>
                        <span className="font-mono" style={{ color: 'var(--teal)', fontFamily: "'JetBrains Mono',monospace" }}>{d!.rain.toFixed(0)}mm</span>
                      </div>
                      <div className="gauge-track"><div className="gauge-fill" style={{ width: `${Math.min((d!.rain / 5000) * 100, 100)}%`, background: 'var(--teal)' }} /></div>
                    </div>
                  </div>
                ))}
              {Object.values(HISTORICAL).every(rows => !rows.some(r => r.year === selYear)) && (
                <div className="text-[10px] mt-2" style={{ color: 'var(--text-muted)' }}>No records are available for this year in the current dataset.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Report Submission Page ─────────────────────────────────────────────────
function ReportPage({ isLoggedIn, onRequireLogin }: { isLoggedIn: boolean; onRequireLogin: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const vis = useReveal(ref);
  const [step, setStep] = useState<'form' | 'verify' | 'done'>('form');
  const [waitingForLogin, setWaitingForLogin] = useState(false);
  const states = Object.keys(STATE_PINS).sort();
  const [form, setForm] = useState({ state: '', city: '', date: '', time: '', event: '', severity: '', desc: '', source: '' });

  const eventTypes = ['Rainfall', 'Thunderstorm', 'Flooding', 'Cyclone', 'Heatwave', 'Dust Storm', 'Fog', 'Strong Winds', 'Hail', 'Other'];
  const F = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }));

  const startVerification = useCallback(() => {
    setWaitingForLogin(false);
    setStep('verify');
    window.setTimeout(() => setStep('done'), 4200);
  }, []);

  useEffect(() => {
    if (isLoggedIn && waitingForLogin && step === 'form') startVerification();
  }, [isLoggedIn, waitingForLogin, step, startVerification]);

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        <div ref={ref} className={`mb-10 reveal ${vis ? 'in' : ''}`}>
          <div className="tag tag-gold mb-3 w-fit">CROWD REPORTING</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2" style={{ fontFamily: "'DM Serif Display',serif" }}>Submit Weather Report</h1>
          <p style={{ color: 'var(--text-muted)' }}>Your report will be AI-verified and cross-checked against other sources before publishing.</p>
        </div>

        {/* Progress */}
        <div className={`flex items-center gap-4 mb-8 reveal ${vis ? 'in' : ''}`} style={{ transitionDelay: '100ms' }}>
          {[['01', 'Report Details'], ['02', 'Processing'], ['03', 'Verification Status']].map(([n, l], i) => (
            <div key={n} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all ${
                (step === 'form' && i === 0) || (step === 'verify' && i === 1) || (step === 'done' && i === 2)
                  ? 'bg-[var(--crimson)] text-white' : i < (['form','verify','done'].indexOf(step)) ? 'bg-[var(--teal)] text-black' : 'bg-white/10 text-white/40'
              }`} style={{ fontFamily: "'JetBrains Mono',monospace" }}>{n}</div>
              <span className="text-xs hidden sm:block" style={{ color: 'var(--text-muted)' }}>{l}</span>
              {i < 2 && <div className="w-8 h-px" style={{ background: 'rgba(255,255,255,.1)' }} />}
            </div>
          ))}
        </div>

        <div className={`glass rounded-2xl p-8 reveal ${vis ? 'in' : ''}`} style={{ border: '1px solid var(--border)', transitionDelay: '200ms' }}>
          {step === 'form' && (
            <form onSubmit={e => { e.preventDefault(); if (!isLoggedIn) { setWaitingForLogin(true); onRequireLogin(); return; } startVerification(); }} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono',monospace" }}>State *</label>
                  <select className="field" value={form.state} onChange={e => F('state', e.target.value)} required>
                    <option value="">Select State</option>
                    {states.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono',monospace" }}>City / Village *</label>
                  <input className="field" placeholder="e.g. Kolkata" value={form.city} onChange={e => F('city', e.target.value)} required />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono',monospace" }}>Date *</label>
                  <input className="field" type="date" value={form.date} onChange={e => F('date', e.target.value)} required />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono',monospace" }}>Time *</label>
                  <input className="field" type="time" value={form.time} onChange={e => F('time', e.target.value)} required />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono',monospace" }}>Event Type *</label>
                  <select className="field" value={form.event} onChange={e => F('event', e.target.value)} required>
                    <option value="">Select Event</option>
                    {eventTypes.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono',monospace" }}>Severity *</label>
                  <select className="field" value={form.severity} onChange={e => F('severity', e.target.value)} required>
                    <option value="">Select Severity</option>
                    {['Low', 'Moderate', 'High', 'Critical'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono',monospace" }}>Description *</label>
                <textarea className="field resize-none" rows={4} placeholder="Describe what you observed — intensity, damage, visuals..." value={form.desc} onChange={e => F('desc', e.target.value)} required />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono',monospace" }}>Source / Evidence URL (optional)</label>
                <input className="field" placeholder="https://... (social media post, photo link)" value={form.source} onChange={e => F('source', e.target.value)} />
              </div>
              <div className="mt-2 p-4 rounded-xl text-xs" style={{ background: 'rgba(29,211,176,.08)', border: '1px solid rgba(29,211,176,.2)', color: 'var(--teal)' }}>
                🤖 <strong>Verification workflow:</strong> Reports are not accepted as verified on submission. After login, your report enters processing and is cross-checked against available official data, satellite/context sources, and nearby reports before publication.
              </div>
              <button type="submit" className="btn-primary mt-2">Submit for Verification →</button>
            </form>
          )}

          {step === 'verify' && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center anim-spin-slow" style={{ border: '2px solid var(--teal)', borderTopColor: 'transparent' }} />
              <div className="text-lg font-semibold text-white mb-2">Processing Report…</div>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Your report is being queued for verification. It will be verified only after the submitted details are cross-checked.</p>
              <div className="mt-6 flex flex-col gap-2 max-w-xs mx-auto text-left">
                {['Validating submitted details…', 'Cross-checking available official data…', 'Comparing with nearby reports…'].map((l, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono',monospace", animationDelay: `${i * 0.8}s` }}>
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--teal)' }} />{l}
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 'done' && (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🕐</div>
              <div className="text-xl font-bold mb-2" style={{ color: 'var(--gold)', fontFamily: "'DM Serif Display',serif" }}>Submitted · Verification Pending</div>
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Your report has been received. It is not marked verified yet; verification will be completed after the submitted details are cross-checked.</p>
              <div className="inline-flex items-center gap-2 tag tag-gold mb-6">PENDING VERIFICATION · NO CONFIDENCE SCORE YET</div>
              <br />
              <button onClick={() => { setStep('form'); setWaitingForLogin(false); setForm({ state:'',city:'',date:'',time:'',event:'',severity:'',desc:'',source:'' }); }}
                className="btn-outline">Submit another report</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Advisory Panel Page ────────────────────────────────────────────────────
function AdvisoryPage() {
  const ref = useRef<HTMLDivElement>(null);
  const vis = useReveal(ref);
  const [tab, setTab] = useState<'farmers' | 'fishermen' | 'public'>('farmers');
  const [advisoryState, setAdvisoryState] = useState('West Bengal');
  const [advisoryDate, setAdvisoryDate] = useState('2026-09-18');
  const [advisoryTime, setAdvisoryTime] = useState('12:00');
  const advisoryYears = Array.from({ length: 30 }, (_, i) => 1997 + i);
  const advisoryData = (() => {
    const year = Number(advisoryDate.slice(0, 4));
    const base = (HISTORICAL[advisoryState] ?? []).find(r => r.year === year);
    const rain = VERIFIED_RAINFALL[year]?.[advisoryState] ?? base?.rain ?? null;
    return { year, temp: base?.temp ?? null, rain, hum: base?.hum ?? null };
  })();

  // Build advisory guidance from the selected context instead of showing the same
  // fixed advice for every date/time. The current historical dataset is annual,
  // so date/time are used as contextual signals (month + time of day), not as
  // fabricated hourly historical observations.
  const advisoryMonth = Number(advisoryDate.slice(5, 7));
  const advisoryHour = Number(advisoryTime.slice(0, 2));
  const isMonsoon = [6, 7, 8, 9].includes(advisoryMonth);
  const isHotSeason = [3, 4, 5].includes(advisoryMonth);
  const isNight = advisoryHour < 6 || advisoryHour >= 19;
  const annualRain = advisoryData.rain ?? 0;
  const annualTemp = advisoryData.temp ?? 0;
  const annualHum = advisoryData.hum ?? 0;

  const makeAdvisories = () => {
    const result: Record<string, { alert: string; level: string; tag: string; items: string[]; forecast: string }[]> = {
      farmers: [], fishermen: [], public: [],
    };

    if (isMonsoon || annualRain > 1800) {
      result.farmers.push({
        alert: 'Rainfall & Waterlogging Advisory', level: 'HIGH', tag: 'tag-teal', forecast: 'Context-based',
        items: ['Keep field drainage channels clear', 'Delay work in waterlogged fields', 'Protect stored grain and seed from moisture', 'Check local rainfall warnings before spraying or harvesting'],
      });
    } else if (isHotSeason || annualTemp > 28) {
      result.farmers.push({
        alert: 'Heat & Moisture Management', level: 'HIGH', tag: 'tag-red', forecast: 'Context-based',
        items: ['Schedule field work for cooler hours', 'Maintain adequate irrigation where required', 'Use shade and water for livestock', 'Avoid spraying during the hottest part of the day'],
      });
    } else {
      result.farmers.push({
        alert: 'Routine Farm Planning', level: 'MODERATE', tag: 'tag-gold', forecast: 'Context-based',
        items: ['Check the latest local weather observation', 'Plan irrigation around current conditions', 'Inspect crops for moisture stress or waterlogging', 'Use official advisories before major field operations'],
      });
    }

    if (annualHum > 78 || isMonsoon) {
      result.farmers.push({ alert: 'Humidity & Disease Watch', level: 'MODERATE', tag: 'tag-gold', forecast: 'Context-based', items: ['Monitor crops for fungal or moisture-related stress', 'Improve airflow where practical', 'Keep harvested produce dry and ventilated', 'Confirm local crop-disease guidance before treatment'] });
    } else {
      result.farmers.push({ alert: 'Crop Condition Check', level: 'MODERATE', tag: 'tag-teal', forecast: 'Context-based', items: ['Inspect soil moisture before irrigation', 'Monitor crop canopy and field conditions', 'Keep equipment ready for changing weather', 'Use current local observations for final decisions'] });
    }

    if (isMonsoon || annualRain > 2000) {
      result.fishermen.push({ alert: 'Rain & Sea-Condition Caution', level: 'HIGH', tag: 'tag-red', forecast: 'Context-based', items: ['Check the latest marine weather bulletin before departure', 'Monitor wind and sea-state updates frequently', 'Secure equipment before periods of heavy rain', 'Follow Coast Guard and official warnings'] });
    } else if (isNight) {
      result.fishermen.push({ alert: 'Night Navigation Caution', level: 'MODERATE', tag: 'tag-gold', forecast: 'Context-based', items: ['Check visibility and navigation equipment before departure', 'Maintain reliable communication', 'Monitor the latest marine forecast', 'Follow port and coastal authority instructions'] });
    } else {
      result.fishermen.push({ alert: 'Marine Weather Check', level: 'MODERATE', tag: 'tag-teal', forecast: 'Context-based', items: ['Check the latest wind and sea-state forecast', 'Confirm vessel safety equipment', 'Keep communication devices charged', 'Follow official coastal warnings before departure'] });
    }
    result.fishermen.push({ alert: annualHum > 75 ? 'Visibility & Moisture Watch' : 'Visibility Check', level: 'MODERATE', tag: 'tag-teal', forecast: 'Context-based', items: [annualHum > 75 ? 'Watch for reduced visibility in humid conditions' : 'Check visibility before operating near shore', 'Use navigation lights when visibility is poor', 'Reduce speed if conditions deteriorate', 'Recheck official marine updates during the trip'] });

    if (isHotSeason || annualTemp > 28) {
      result.public.push({ alert: 'Heat-Aware Public Advisory', level: 'HIGH', tag: 'tag-red', forecast: 'Context-based', items: ['Prefer cooler parts of the day for outdoor activity', 'Drink water regularly and take breaks', 'Check on children and older adults during hot conditions', 'Follow local heat alerts when issued'] });
    } else if (isMonsoon || annualRain > 1800) {
      result.public.push({ alert: 'Rain & Flood Readiness', level: 'HIGH', tag: 'tag-teal', forecast: 'Context-based', items: ['Carry rain protection when travelling', 'Avoid crossing flooded roads or bridges', 'Keep essential documents and devices protected from water', 'Follow local disaster-management alerts'] });
    } else {
      result.public.push({ alert: 'General Weather Awareness', level: 'MODERATE', tag: 'tag-gold', forecast: 'Context-based', items: ['Check the latest local observation before travel', 'Keep plans flexible when weather changes', 'Follow official warnings if conditions deteriorate', 'Use NabhData as decision support, not a replacement for official alerts'] });
    }
    result.public.push({ alert: isNight ? 'Night-Time Awareness' : 'Day-Time Awareness', level: 'MODERATE', tag: 'tag-teal', forecast: 'Context-based', items: [isNight ? 'Use extra caution where visibility is limited' : 'Stay alert to changing daytime conditions', annualHum > 75 ? 'Allow extra time if visibility is reduced' : 'Check current visibility before travel', 'Keep emergency contacts accessible', 'Recheck current official alerts for time-sensitive hazards'] });

    return result;
  };

  const advisories = makeAdvisories();

  const tabs = [
    { id: 'farmers', label: '🌾 Farmers', emoji: '🌾' },
    { id: 'fishermen', label: '🎣 Fishermen', emoji: '🎣' },
    { id: 'public', label: '🏙️ General Public', emoji: '🏙️' },
  ] as const;

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div ref={ref} className={`mb-10 reveal ${vis ? 'in' : ''}`}>
          <div className="tag tag-gold mb-3 w-fit">ADVISORY PANEL</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2" style={{ fontFamily: "'DM Serif Display',serif" }}>Weather Advisories</h1>
          <p style={{ color: 'var(--text-muted)' }}>Select a state, year, date and time to define the advisory context. Guidance is shown as a prototype decision-support layer and should be checked against current official alerts.</p>
        </div>

        {/* Advisory context selectors */}
        <div className={`glass rounded-2xl p-5 mb-8 reveal ${vis ? 'in' : ''}`} style={{ border: '1px solid var(--border-teal)', transitionDelay: '50ms' }}>
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono',monospace" }}>State</label>
              <select className="field w-48" value={advisoryState} onChange={e => setAdvisoryState(e.target.value)}>
                {Object.keys(STATE_PINS).sort().map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono',monospace" }}>Year</label>
              <select className="field w-28" value={advisoryDate.slice(0, 4)} onChange={e => setAdvisoryDate(`${e.target.value}-${advisoryDate.slice(5)}`)}>
                {advisoryYears.map(y => <option key={y}>{y}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono',monospace" }}>Date</label>
              <input className="field w-40" type="date" min="1997-01-01" max="2026-12-31" value={advisoryDate} onChange={e => setAdvisoryDate(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono',monospace" }}>Time</label>
              <input className="field w-32" type="time" value={advisoryTime} onChange={e => setAdvisoryTime(e.target.value)} />
            </div>
            <span className="tag tag-gold">CONTEXT · {advisoryState} · {advisoryDate} · {advisoryTime}</span>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px]" style={{ color: 'var(--text-muted)' }}>
            <span className="tag tag-teal">ANNUAL BASELINE</span>
            <span>{advisoryData.rain != null ? `${advisoryData.rain.toFixed(0)} mm annual rainfall` : 'No verified annual rainfall value for this selection'}</span>
            {advisoryData.temp != null && <span>· {advisoryData.temp.toFixed(1)}°C avg temperature</span>}
            {advisoryData.hum != null && <span>· {advisoryData.hum.toFixed(1)}% avg humidity</span>}
          </div>
        </div>

        {/* Tabs */}
        <div className={`flex gap-3 mb-8 reveal ${vis ? 'in' : ''}`} style={{ transitionDelay: '100ms' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === t.id ? 'bg-[var(--crimson)] text-white shadow-lg' : 'glass text-[var(--text-muted)] hover:text-white'}`}>
              {t.label}
            </button>
          ))}
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 reveal ${vis ? 'in' : ''}`} style={{ transitionDelay: '200ms' }}>
          {advisories[tab].map((a, i) => (
            <div key={i} className="card-lift glass rounded-2xl p-6" style={{ border: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between mb-3">
                <span className={`tag ${a.tag}`}>{a.level}</span>
                <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono',monospace" }}>{a.forecast}</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: "'DM Serif Display',serif" }}>{a.alert}</h3>
              <ul className="flex flex-col gap-2.5">
                {a.items.map((item, j) => (
                  <li key={j} className="flex gap-2.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'var(--teal)' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Forecast strip */}
        <div className={`mt-8 glass rounded-2xl p-6 reveal ${vis ? 'in' : ''}`} style={{ border: '1px solid var(--border-teal)', transitionDelay: '300ms' }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--teal)' }} />
            <span className="text-sm font-semibold text-white">7-Day NabhData Prediction · Selected Context</span>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d, i) => (
              <div key={d} className="text-center rounded-xl py-3 px-1" style={{ background: i === 0 ? 'rgba(224,67,42,.15)' : 'rgba(255,255,255,.04)', border: i === 0 ? '1px solid rgba(224,67,42,.3)' : '1px solid rgba(255,255,255,.06)' }}>
                <div className="text-[10px] font-mono mb-1" style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono',monospace" }}>{d}</div>
                <div className="text-xl mb-1">{['🌧️','⛈️','🌤️','☀️','🌩️','🌧️','⛅'][i]}</div>
                <div className="text-xs font-bold" style={{ color: 'var(--crimson-light)' }}>{[34,31,29,36,32,28,30][i]}°</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── About Page ─────────────────────────────────────────────────────────────
function AboutPage() {
  const ref = useRef<HTMLDivElement>(null);
  const vis = useReveal(ref);

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 relative overflow-hidden">
      <div className="relative max-w-6xl mx-auto">
        <div ref={ref} className={`mb-12 reveal ${vis ? 'in' : ''}`}>
          <div className="tag tag-red mb-3 w-fit">ABOUT NABHDATA</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3" style={{ fontFamily: "'DM Serif Display',serif" }}>
            India's Weather Intelligence Platform
          </h1>
          <p className="max-w-3xl text-sm md:text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            NABHDATA is a weather data analytics and intelligence platform designed to bring historical weather information,
            data visualizations, verification, and weather-based advisories together in one place.
          </p>
        </div>

        {/* What NABHDATA does */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 reveal ${vis ? 'in' : ''}`} style={{ transitionDelay: '100ms' }}>
          <div className="glass rounded-2xl p-6" style={{ border: '1px solid var(--border)' }}>
            <div className="tag tag-teal mb-4 w-fit">WHAT IT DOES</div>
            <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: "'DM Serif Display',serif" }}>
              From weather data to useful insight
            </h2>
            <div className="flex flex-col gap-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              <p>
                NABHDATA organizes weather information for Indian states and presents it through interactive analytics and
                visualizations, helping users explore temperature, rainfall, humidity, and long-term patterns.
              </p>
              <p>
                The platform also demonstrates a <strong className="text-white">Verify Data</strong> workflow where a submitted
                observation can be compared with available reference data, and an <strong className="text-white">Advisory</strong>
                workflow that turns available weather conditions into category-based, data-driven guidance.
              </p>
              <p>
                These verification and advisory features are presented as a <strong className="text-white">prototype demonstration</strong>.
                They do not claim connection to live government systems or represent official government warnings.
              </p>
            </div>
          </div>

          <div className="glass rounded-2xl p-6" style={{ border: '1px solid var(--border)' }}>
            <div className="tag tag-gold mb-4 w-fit">HOW IT HELPS</div>
            <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: "'DM Serif Display',serif" }}>
              One platform, multiple weather perspectives
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                ['📊', 'Analytics', 'Explore historical temperature, rainfall and humidity patterns.'],
                ['🇮🇳', 'Climate Map', 'View state-level weather patterns across India.'],
                ['✓', 'Verify Data', 'Compare submitted observations with available reference data.'],
                ['⚠️', 'Advisory', 'Generate weather-data-based prototype guidance for different users.'],
              ].map(([icon, title, desc]) => (
                <div key={title} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,.035)', border: '1px solid rgba(255,255,255,.06)' }}>
                  <div className="text-xl mb-2">{icon}</div>
                  <div className="text-sm font-semibold text-white mb-1">{title}</div>
                  <div className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Project information */}
        <div className={`glass rounded-2xl p-6 reveal ${vis ? 'in' : ''}`} style={{ border: '1px solid rgba(29,211,176,.2)', transitionDelay: '180ms' }}>
          <div className="text-xs font-mono mb-4 uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono',monospace" }}>
            PROJECT INFORMATION
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            {[
              ['Platform', 'NABHDATA'],
              ['Purpose', 'Weather data analytics and intelligence'],
              ['Developed for', 'SIH 2026'],
              ['Made by', 'DP (Debanjana Pathak)'],
              ['Data', 'Historical weather dataset · 30 Indian states'],
              ['Status', 'Prototype / Demonstration'],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-3 text-xs py-3 border-b" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                <span className="font-mono w-28 flex-shrink-0" style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono',monospace" }}>{k}</span>
                <span style={{ color: 'var(--text-primary)' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── App Root ───────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [showLogin, setShowLogin] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginInitialTab, setLoginInitialTab] = useState<'login' | 'signup'>('signup');

  useEffect(() => { window.scrollTo(0, 0); }, [page]);

  return (
    <div className="min-h-screen relative" style={{ background: 'var(--bg-deep)' }}>
      {/* Shared weather backdrop for every page. */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <img src={weatherBg} alt="" className="w-full h-full object-cover" style={{ opacity: page === 'home' ? 0.04 : 0.48 }} />
        <div className="absolute inset-0" style={{ background: page === 'home'
          ? 'rgba(9,5,10,.35)'
          : 'linear-gradient(to bottom, rgba(9,5,10,.52), rgba(9,5,10,.64))' }} />
      </div>

      <Nav page={page} setPage={setPage} onLogin={() => { setLoginInitialTab('signup'); setShowLogin(true); }} />

      <div className="relative z-10" style={{ transition: 'opacity .35s ease', opacity: 1 }}>
        {page === 'home'      && <HeroPage setPage={setPage} />}
        {page === 'dashboard' && <DashboardPage />}
        {page === 'map'       && <MapPage />}
        {page === 'report'    && <ReportPage isLoggedIn={loggedIn} onRequireLogin={() => { setLoginInitialTab('login'); setShowLogin(true); }} />}
        {page === 'advisory'  && <AdvisoryPage />}
        {page === 'about'     && <AboutPage />}
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t py-8 px-6" style={{ borderColor: 'rgba(224,67,42,.12)' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="text-sm font-bold" style={{ fontFamily: "'DM Serif Display',serif", color: 'var(--crimson-light)' }}>NabhData</div>
          <div className="text-xs text-center" style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono',monospace" }}>
            Team <span style={{ color: 'var(--teal)' }}>SIH</span> · Made by DP · Hackspire · IMD × MoES
          </div>
          <div className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono',monospace" }}>© 2026</div>
        </div>
      </footer>

      {showLogin && <LoginModal initialTab={loginInitialTab} onClose={() => setShowLogin(false)} onSuccess={() => { setLoggedIn(true); setShowLogin(false); }} />}
    </div>
  );
}

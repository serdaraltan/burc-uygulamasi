import { useState, useEffect, useCallback } from 'react';
import './styles.css';

// Reusable Circle bileşeni
const Circle = ({ percent, type, label, circleProps }) => (
  <div className={`circle ${type}`}>
    <svg>
      <circle {...circleProps}></circle>
      <circle {...circleProps} style={{ '--percent': percent }}></circle>
    </svg>
    <div className="label">{label}</div>
  </div>
);

// Kart bileşeni, memo ile optimize edildi
const HoroscopeCard = React.memo(({ h, circleProps }) => (
  <div className="card">
    <h2 className="card-title">{h.sign}</h2>
    <div className="circular-stats">
      <Circle percent={h.love} type="love" label={`❤️ ${h.love}%`} circleProps={circleProps} />
      <Circle percent={h.money} type="money" label={`💰 ${h.money}%`} circleProps={circleProps} />
      <Circle percent={h.health} type="health" label={`💪 ${h.health}%`} circleProps={circleProps} />
    </div>
    <p>{h.text}</p>
  </div>
));

function App() {
  const [sign, setSign] = useState('');
  const [horoscope, setHoroscope] = useState(null);
  const [error, setError] = useState(null);
  const [allHoroscopes, setAllHoroscopes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // State kontrolü için log
  console.log('State:', { sign, horoscope, allHoroscopes, loading, error });

  const signs = [
    { value: 'koc', label: 'Koç', icon: '♈' },
    { value: 'boga', label: 'Boğa', icon: '♉' },
    { value: 'ikizler', label: 'İkizler', icon: '♊' },
    { value: 'yengec', label: 'Yengeç', icon: '♋' },
    { value: 'aslan', label: 'Aslan', icon: '♌' },
    { value: 'basak', label: 'Başak', icon: '♍' },
    { value: 'terazi', label: 'Terazi', icon: '♎' },
    { value: 'akrep', label: 'Akrep', icon: '♏' },
    { value: 'yay', label: 'Yay', icon: '♐' },
    { value: 'oglak', label: 'Oğlak', icon: '♑' },
    { value: 'kova', label: 'Kova', icon: '♒' },
    { value: 'balik', label: 'Balık', icon: '♓' }
  ];

  // Mobil kontrol için useEffect
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Hata mesajını 3 saniye sonra temizle
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Tarih formatlama fonksiyonu
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Geçersiz tarih';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const dayName = date.toLocaleDateString('tr-TR', { weekday: 'long' });
    return `${day}.${month}.${year} (${dayName})`;
  };

  // Debounce fonksiyonu
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // API çağrıları
  const fetchHoroscope = useCallback(
    debounce(async () => {
      setError(null);
      setHoroscope(null);
      if (!sign) {
        setError('Önce Burcunuzu Seçiniz');
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/horoscope?sign=${sign}`);
        console.log('Fetch Horoscope Response:', res.status, res.statusText);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || `API hatası: ${res.status}`);
        }
        const data = await res.json();
        console.log('Horoscope Data:', data);
        setHoroscope(data);
      } catch (err) {
        setError('Horoskop alınırken hata oluştu: ' + err.message);
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    }, 300),
    [sign]
  );

  const getAllHoroscopes = useCallback(
    debounce(async () => {
      setError(null);
      setLoading(true);
      try {
        const res = await fetch(`/api/all`);
        console.log('Fetch All Horoscopes Response:', res.status, res.statusText);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || `API hatası: ${res.status}`);
        }
        const data = await res.json();
        console.log('All Horoscopes Data:', data);
        if (!data.horoscopes || !Array.isArray(data.horoscopes)) {
          throw new Error('Geçersiz veri formatı');
        }
        setAllHoroscopes(data.horoscopes);
      } catch (err) {
        console.error('Tüm burçlar alınırken hata:', err.message);
        setError('Tüm burçlar alınırken hata oluştu: ' + err.message);
        setAllHoroscopes([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  // SVG boyutları
  const circleProps = {
    cx: isMobile ? '40' : '45',
    cy: isMobile ? '40' : '45',
    r: isMobile ? '34' : '38'
  };

  // Bugünün tarihi
  const today = formatDate(new Date());

  return (
    <div className="container">
      <div className="header-block">
        <h1>
          <span className="star-icon">✨</span>
          Günlük Burç Yorumları
          <span className="star-icon">✨</span>
        </h1>
        <div className="header-date">{today}</div>
      </div>
      <div className="form-row">
        <select
          value={sign}
          onChange={(e) => setSign(e.target.value)}
          aria-label="Burcunuzu seçin"
        >
          <option value="">Burcunuzu seçin</option>
          {signs.map(s => (
            <option key={s.value} value={s.value}>
              {s.icon} {s.label}
            </option>
          ))}
        </select>
        <button
          onClick={fetchHoroscope}
          disabled={loading}
          aria-disabled={loading}
        >
          {loading ? 'Yükleniyor...' : 'Yorumu Getir'}
        </button>
        <button
          onClick={getAllHoroscopes}
          disabled={loading}
          aria-disabled={loading}
        >
          {loading ? 'Yükleniyor...' : 'Tüm Burçları Göster'}
        </button>
      </div>
      {loading && <div className="spinner">Yükleniyor...</div>}
      {error && <div className="toast">{error}</div>}
      {horoscope && (
        <div className="result">
          <h2 className="card-title">{horoscope.sign} - {formatDate(horoscope.date)}</h2>
          <p>{horoscope.text}</p>
          <div className="stats">
            ❤️ Aşk: {horoscope.love}%
            <br />
            💰 Para: {horoscope.money}%
            <br />
            💪 Sağlık: {horoscope.health}%
          </div>
        </div>
      )}
      {allHoroscopes.length > 0 && (
        <div className="grid">
          {allHoroscopes.map(h => (
            <HoroscopeCard key={h.sign} h={h} circleProps={circleProps} />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
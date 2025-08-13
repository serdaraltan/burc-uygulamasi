import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './styles.css';
import './i18n'; // src/i18n.js dosyasını import et

function App() {
  const { t, i18n } = useTranslation();
  const [sign, setSign] = useState('');
  const [horoscope, setHoroscope] = useState(null);
  const [error, setError] = useState(null);
  const [allHoroscopes, setAllHoroscopes] = useState([]);
  const [loading, setLoading] = useState(false);

  // State kontrolü için log
  console.log('State:', { sign, horoscope, allHoroscopes, loading, error });

  // Dil bazlı burç listesi
  const signs = i18n.language === 'tr' ? [
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
  ] : [
    { value: 'aries', label: 'Aries', icon: '♈' },
    { value: 'taurus', label: 'Taurus', icon: '♉' },
    { value: 'gemini', label: 'Gemini', icon: '♊' },
    { value: 'cancer', label: 'Cancer', icon: '♋' },
    { value: 'leo', label: 'Leo', icon: '♌' },
    { value: 'virgo', label: 'Virgo', icon: '♍' },
    { value: 'libra', label: 'Libra', icon: '♎' },
    { value: 'scorpio', label: 'Scorpio', icon: '♏' },
    { value: 'sagittarius', label: 'Sagittarius', icon: '♐' },
    { value: 'capricorn', label: 'Capricorn', icon: '♑' },
    { value: 'aquarius', label: 'Aquarius', icon: '♒' },
    { value: 'pisces', label: 'Pisces', icon: '♓' }
  ];

  // Hata mesajını 3 saniye sonra temizle
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Tarih formatlama fonksiyonu: Dil bazlı
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return t('invalidDate'); // Çevrilmiş hata
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const dayName = date.toLocaleDateString(i18n.language, { weekday: 'long' });
    return `${day}.${month}.${year} (${dayName})`;
  };

  // Dil bazlı API URL seçimi
  const getApiUrl = (sign, isAll = false) => {
    if (i18n.language === 'tr') {
      return isAll 
        ? 'https://burc-api.onrender.com/api/tum/gunluk' 
        : `https://burc-api.onrender.com/api/${sign}/gunluk`;
    } else {
      return isAll 
        ? 'https://horoscope-free-api.herokuapp.com/?time=today&sign=all' 
        : `https://horoscope-free-api.herokuapp.com/?time=today&sign=${sign}`;
    }
  };

  const fetchHoroscope = async () => {
    setError(null);
    setHoroscope(null);
    if (!sign) {
      setError(t('errorSelectSign'));
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(getApiUrl(sign));
      console.log('Fetch Horoscope Response:', res.status, res.statusText);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `API hatası: ${res.status}`);
      }
      const data = await res.json();
      console.log('Horoscope Data:', data);
      // Varsayılan: API response'unun {sign, date, text, love, money, health} formatında olduğunu varsayıyorum
      setHoroscope(data);
    } catch (err) {
      setError(t('errorFetch') + ': ' + err.message);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getAllHoroscopes = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(getApiUrl(null, true));
      console.log('Fetch All Horoscopes Response:', res.status, res.statusText);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `API hatası: ${res.status}`);
      }
      const data = await res.json();
      console.log('All Horoscopes Data:', data);
      if (!data.horoscopes || !Array.isArray(data.horoscopes)) {
        throw new Error(t('invalidDataFormat'));
      }
      setAllHoroscopes(data.horoscopes);
    } catch (err) {
      console.error('Tüm burçlar alınırken hata:', err.message);
      setError(t('errorFetchAll') + ': ' + err.message);
      setAllHoroscopes([]);
    } finally {
      setLoading(false);
    }
  };

  // Mobil için SVG boyutları
  const isMobile = window.innerWidth < 768;
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
          {t('headerTitle')}
          <span className="star-icon">✨</span>
        </h1>
        <div className="header-date">{today}</div>
      </div>
      <div className="form-row">
        <select 
          value={sign} 
          onChange={(e) => setSign(e.target.value)} 
          aria-label={t('selectSign')}
        >
          <option value="">{t('selectSign')}</option>
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
          {loading ? t('loading') : t('getHoroscope')}
        </button>
        <button 
          onClick={getAllHoroscopes} 
          disabled={loading} 
          aria-disabled={loading}
        >
          {loading ? t('loading') : t('getAll')}
        </button>
      </div>
      {loading && <div className="spinner">{t('loading')}</div>}
      {error && <div className="toast">{error}</div>}
      {horoscope && (
        <div
          className="result"
          style={{
            background: 'linear-gradient(135deg, #4A3267, #C6BADE), #1f2937',
            padding: '15px',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
            marginTop: '15px'
          }}
        >
          <h2 className="card-title">{horoscope.sign} - {formatDate(horoscope.date)}</h2>
          <p>{horoscope.text}</p>
          <div className="stats">
            ❤️ {t('love')}: {horoscope.love}%
            <br />
            💰 {t('money')}: {horoscope.money}%
            <br />
            💪 {t('health')}: {horoscope.health}%
          </div>
        </div>
      )}
      {allHoroscopes.length > 0 && (
        <div className="grid" style={{ marginTop: '20px' }}>
          {allHoroscopes.map(h => (
            <div
              key={h.sign}
              className="card"
              style={{
                background: 'linear-gradient(135deg, #4A3267, #000000), #1f2937',
                padding: '15px',
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
              }}
            >
              <h2 className="card-title">{h.sign}</h2>
              <div className="circular-stats">
                <div className="circle love">
                  <svg>
                    <circle {...circleProps}></circle>
                    <circle
                      {...circleProps}
                      style={{ '--percent': h.love }}
                    ></circle>
                  </svg>
                  <div className="label">❤️ {h.love}% ({t('love')})</div>
                </div>
                <div className="circle money">
                  <svg>
                    <circle {...circleProps}></circle>
                    <circle
                      {...circleProps}
                      style={{ '--percent': h.money }}
                    ></circle>
                  </svg>
                  <div className="label">💰 {h.money}% ({t('money')})</div>
                </div>
                <div className="circle health">
                  <svg>
                    <circle {...circleProps}></circle>
                    <circle
                      {...circleProps}
                      style={{ '--percent': h.health }}
                    ></circle>
                  </svg>
                  <div className="label">💪 {h.health}% ({t('health')})</div>
                </div>
              </div>
              <p>{h.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
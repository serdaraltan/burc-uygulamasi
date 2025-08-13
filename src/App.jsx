import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './styles.css';
import './i18n';

function App() {
  const { t, i18n } = useTranslation();
  const [sign, setSign] = useState('');
  const [horoscope, setHoroscope] = useState(null);
  const [error, setError] = useState(null);
  const [allHoroscopes, setAllHoroscopes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Debug için dil bilgisi
  console.log('Tarayıcı Dili:', navigator.language);
  console.log('i18next Dili:', i18n.resolvedLanguage);

  // Dil bazlı burç listesi
  const isTurkish = i18n.resolvedLanguage?.startsWith('tr');
  const signs = isTurkish ? [
    { value: 'koc', label: 'Koç', icon: '♈', en: 'aries' },
    { value: 'boga', label: 'Boğa', icon: '♉', en: 'taurus' },
    { value: 'ikizler', label: 'İkizler', icon: '♊', en: 'gemini' },
    { value: 'yengec', label: 'Yengeç', icon: '♋', en: 'cancer' },
    { value: 'aslan', label: 'Aslan', icon: '♌', en: 'leo' },
    { value: 'basak', label: 'Başak', icon: '♍', en: 'virgo' },
    { value: 'terazi', label: 'Terazi', icon: '♎', en: 'libra' },
    { value: 'akrep', label: 'Akrep', icon: '♏', en: 'scorpio' },
    { value: 'yay', label: 'Yay', icon: '♐', en: 'sagittarius' },
    { value: 'oglak', label: 'Oğlak', icon: '♑', en: 'capricorn' },
    { value: 'kova', label: 'Kova', icon: '♒', en: 'aquarius' },
    { value: 'balik', label: 'Balık', icon: '♓', en: 'pisces' }
  ] : [
    { value: 'aries', label: 'Aries', icon: '♈', en: 'aries' },
    { value: 'taurus', label: 'Taurus', icon: '♉', en: 'taurus' },
    { value: 'gemini', label: 'Gemini', icon: '♊', en: 'gemini' },
    { value: 'cancer', label: 'Cancer', icon: '♋', en: 'cancer' },
    { value: 'leo', label: 'Leo', icon: '♌', en: 'leo' },
    { value: 'virgo', label: 'Virgo', icon: '♍', en: 'virgo' },
    { value: 'libra', label: 'Libra', icon: '♎', en: 'libra' },
    { value: 'scorpio', label: 'Scorpio', icon: '♏', en: 'scorpio' },
    { value: 'sagittarius', label: 'Sagittarius', icon: '♐', en: 'sagittarius' },
    { value: 'capricorn', label: 'Capricorn', icon: '♑', en: 'capricorn' },
    { value: 'aquarius', label: 'Aquarius', icon: '♒', en: 'aquarius' },
    { value: 'pisces', label: 'Pisces', icon: '♓', en: 'pisces' }
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

  // Dil değişimini dinle ve UI'yi güncelle
  useEffect(() => {
    setSign(''); // Dil değiştiğinde seçili burcu sıfırla
  }, [i18n.resolvedLanguage]);

  // Tarih formatlama fonksiyonu
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return t('invalidDate');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const dayName = date.toLocaleDateString(i18n.resolvedLanguage || 'tr', { weekday: 'long' });
    return `${day}.${month}.${year} (${dayName})`;
  };

  // Dil bazlı API URL seçimi
  const getApiUrl = (sign, isAll = false) => {
    const enSign = signs.find(s => s.value === sign)?.en || sign;
    if (isAll) {
      return 'https://aztro.sameerkumar.website/?sign=aquarius,aries,taurus,gemini,cancer,leo,virgo,libra,scorpio,sagittarius,capricorn,pisces&day=today';
    }
    return `https://aztro.sameerkumar.website/?sign=${enSign}&day=today`;
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
      console.log('Fetch Horoscope Response:', res.status, res.statusText, res.url);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error(t('errorFetch') + ': Endpoint bulunamadı (404).');
        }
        const errorData = await res.json();
        throw new Error(errorData.message || `API hatası: ${res.status}`);
      }
      const data = await res.json();
      console.log('Horoscope Data:', data);
      setHoroscope({
        sign: data.sign || sign,
        date: data.current_date || new Date().toISOString(),
        text: isTurkish ? t(`${data.sign}_description`, { defaultValue: data.description }) : data.description,
        mood: data.mood || 'Unknown',
        color: data.color || 'Unknown',
        lucky_number: data.lucky_number || 'Unknown'
      });
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
      console.log('Fetch All Horoscopes Response:', res.status, res.statusText, res.url);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error(t('errorFetchAll') + ': Endpoint bulunamadı (404).');
        }
        const errorData = await res.json();
        throw new Error(errorData.message || `API hatası: ${res.status}`);
      }
      const data = await res.json();
      console.log('All Horoscopes Data:', data);
      if (!Array.isArray(data)) {
        throw new Error(t('invalidDataFormat'));
      }
      setAllHoroscopes(data.map(h => ({
        sign: h.sign || '',
        text: isTurkish ? t(`${h.sign}_description`, { defaultValue: h.description }) : h.description,
        mood: h.mood || 'Unknown',
        color: h.color || 'Unknown',
        lucky_number: h.lucky_number || 'Unknown'
      })));
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
            😊 {t('mood')}: {horoscope.mood}
            <br />
            🎨 {t('color')}: {horoscope.color}
            <br />
            🔢 {t('lucky_number')}: {horoscope.lucky_number}
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
                <div className="circle mood">
                  <svg>
                    <circle {...circleProps}></circle>
                    <circle {...circleProps}></circle>
                  </svg>
                  <div className="label">😊 {h.mood} ({t('mood')})</div>
                </div>
                <div className="circle color">
                  <svg>
                    <circle {...circleProps}></circle>
                    <circle {...circleProps}></circle>
                  </svg>
                  <div className="label">🎨 {h.color} ({t('color')})</div>
                </div>
                <div className="circle lucky_number">
                  <svg>
                    <circle {...circleProps}></circle>
                    <circle {...circleProps}></circle>
                  </svg>
                  <div className="label">🔢 {h.lucky_number} ({t('lucky_number')})</div>
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
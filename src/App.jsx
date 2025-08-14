import { useState, useEffect, useCallback } from 'react';
import './styles.css';
import HoroscopeCard from './components/HoroscopeCard';

function App() {
  const [sign, setSign] = useState('');
  const [horoscope, setHoroscope] = useState(null);
  const [error, setError] = useState(null);
  const [allHoroscopes, setAllHoroscopes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Burç eşleme tablosu (Türkçe -> İngilizce)
  const signMap = {
    koc: "aries",
    boga: "taurus",
    ikizler: "gemini",
    yengec: "cancer",
    aslan: "leo",
    basak: "virgo",
    terazi: "libra",
    akrep: "scorpio",
    yay: "sagittarius",
    oglak: "capricorn",
    kova: "aquarius",
    balik: "pisces"
  };

  // Ekran boyutunu dinle
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // Hata mesajını 3 saniye sonra temizle
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Tarih formatlama fonksiyonu
  const formatDate = (date) => {
    if (date instanceof Date) {
      return date.toLocaleDateString('tr-TR', { 
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      });
    }
    
    const dateObj = date ? new Date(date) : new Date();
    return dateObj.toLocaleDateString('tr-TR', { 
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  // Circle props'ları
  const circleProps = {
    cx: isMobile ? '40' : '45',
    cy: isMobile ? '40' : '45',
    r: isMobile ? '34' : '38'
  };

  // Tek bir burç yorumu getir
  const fetchHoroscope = async () => {
    setError(null);
    setHoroscope(null);
    
    if (!sign) {
      setError('Önce Burcunuzu Seçiniz');
      return;
    }
    
    setLoading(true);
    
    try {
      // Aztro API'ye POST isteği
      const response = await fetch('/api/aztro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sign: signMap[sign],
          day: 'today'
        })
      });

      if (!response.ok) {
        throw new Error(`API hatası: ${response.status}`);
      }

      const data = await response.json();
      
      // API'den gelen veriyi işle
      setHoroscope({
        sign: signs.find(s => s.value === sign)?.label || signMap[sign],
        date: formatDate(data.current_date),
        text: data.description,
        love: data.compatibility ? parseInt(data.compatibility) : Math.floor(Math.random() * 101),
        money: data.lucky_number ? parseInt(data.lucky_number) * 10 : Math.floor(Math.random() * 101),
        health: data.mood ? (data.mood.length * 15) : Math.floor(Math.random() * 101)
      });
      
    } catch (err) {
      setError('Horoskop alınırken hata oluştu: ' + err.message);
      console.error('API Hatası:', err);
    } finally {
      setLoading(false);
    }
  };

  // Tüm burçları getir
  const getAllHoroscopes = useCallback(async () => {
    if (allHoroscopes.length > 0) return;
    
    setError(null);
    setHoroscope(null);
    setLoading(true);
    
    try {
      const results = await Promise.all(
        signs.map(async (signItem) => {
          try {
            const response = await fetch('/api/aztro', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                sign: signMap[signItem.value],
                day: 'today'
              })
            });

            if (!response.ok) {
              throw new Error(`${signItem.label} için hata: ${response.status}`);
            }

            const data = await response.json();
            
            return {
              sign: signItem.label,
              date: formatDate(data.current_date),
              text: data.description,
              love: data.compatibility ? parseInt(data.compatibility) : Math.floor(Math.random() * 101),
              money: data.lucky_number ? parseInt(data.lucky_number) * 10 : Math.floor(Math.random() * 101),
              health: data.mood ? (data.mood.length * 15) : Math.floor(Math.random() * 101)
            };
          } catch (err) {
            console.error(`${signItem.label} için hata:`, err);
            return {
              sign: signItem.label,
              date: formatDate(new Date()),
              text: "Bu burç için şu an yorum alınamadı. Lütfen daha sonra tekrar deneyin.",
              love: Math.floor(Math.random() * 101),
              money: Math.floor(Math.random() * 101),
              health: Math.floor(Math.random() * 101)
            };
          }
        })
      );
      
      setAllHoroscopes(results);
      
    } catch (err) {
      setError('Tüm burçlar alınırken hata: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [allHoroscopes]);

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
        
        {/* Burç ikonları */}
        <div className="zodiac-icons">
          {signs.map(s => (
            <span key={s.value} style={{ fontSize: '1.8em' }}>
              {s.icon}
            </span>
          ))}
        </div>
      </div>
      
      <div className="form-row">
        <select value={sign} onChange={(e) => setSign(e.target.value)}>
          <option value="">Burcunuzu seçin</option>
          {signs.map(s => (
            <option key={s.value} value={s.value}>
              {s.icon} {s.label}
            </option>
          ))}
        </select>
        <button onClick={fetchHoroscope} disabled={loading}>
          {loading ? 'Yükleniyor...' : 'Yorumu Getir'}
        </button>
        <button onClick={getAllHoroscopes} disabled={loading}>
          {loading ? 'Yükleniyor...' : 'Tüm Burçları Göster'}
        </button>
      </div>
      
      {loading && <div className="spinner"></div>}
      {error && <div className="toast">{error}</div>}
      
      {horoscope && (
        <HoroscopeCard 
          horoscope={horoscope} 
          isSingle={true} 
          circleProps={circleProps}
        />
      )}
      
      {allHoroscopes.length > 0 && (
        <div className="grid" style={{ marginTop: '20px' }}>
          {allHoroscopes.map(h => (
            <HoroscopeCard 
              key={h.sign}
              horoscope={h}
              isSingle={false}
              circleProps={circleProps}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
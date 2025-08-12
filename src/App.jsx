import { useState, useEffect } from 'react';
import './styles.css';

function App() {
  const [sign, setSign] = useState('');
  const [horoscope, setHoroscope] = useState(null);
  const [error, setError] = useState(null);
  const [allHoroscopes, setAllHoroscopes] = useState([]);
  const [loading, setLoading] = useState(false);

  const signs = [
    { value: 'koc', label: 'Koç' },
    { value: 'boga', label: 'Boğa' },
    { value: 'ikizler', label: 'İkizler' },
    { value: 'yengec', label: 'Yengeç' },
    { value: 'aslan', label: 'Aslan' },
    { value: 'basak', label: 'Başak' },
    { value: 'terazi', label: 'Terazi' },
    { value: 'akrep', label: 'Akrep' },
    { value: 'yay', label: 'Yay' },
    { value: 'oglak', label: 'Oğlak' },
    { value: 'kova', label: 'Kova' },
    { value: 'balik', label: 'Balık' }
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

  // Tarih formatlama fonksiyonu: Gün.Ay.Yıl (Gün Adı)
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const dayName = date.toLocaleDateString('tr-TR', { weekday: 'long' });
    return `${day}.${month}.${year} (${dayName})`;
  };

  const fetchHoroscope = async () => {
    setError(null);
    setHoroscope(null);
    if (!sign) {
      setError('Önce Burcunuzu Seçiniz');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/horoscope?sign=${sign}`);
      if (!res.ok) throw new Error('API hatası');
      const data = await res.json();
      setHoroscope(data);
    } catch (err) {
      setError('Horoskop alınırken hata oluştu: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getAllHoroscopes = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/all`);
      if (!res.ok) throw new Error('API hatası');
      const data = await res.json();
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
  };

  // Mobil için SVG boyutları
  const isMobile = window.innerWidth < 768;
  const circleProps = {
    cx: isMobile ? '40' : '45',
    cy: isMobile ? '40' : '45',
    r: isMobile ? '34' : '38'
  };

  return (
    <div className="container">
      <h1>Günlük Burç Yorumları</h1>
      <div className="form-row">
        <select value={sign} onChange={(e) => setSign(e.target.value)}>
          <option value="">Burcunuzu seçin</option>
          {signs.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <button onClick={fetchHoroscope} disabled={loading}>
          {loading ? 'Yükleniyor...' : 'Yorumu Getir'}
        </button>
        <button onClick={getAllHoroscopes} disabled={loading}>
          {loading ? 'Yükleniyor...' : 'Tüm Burçları Göster'}
        </button>
      </div>
      {loading && <div className="spinner">Yükleniyor...</div>}
      {error && <div className="toast">{error}</div>}
      {horoscope && (
        <div
          className="result"
          style={{
            background: `linear-gradient(135deg, ${horoscope.color} 0%, ${horoscope.color}33 100%)`,
            padding: "15px",
            borderRadius: "12px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            marginTop: "15px"
          }}
        >
          <h2 className="card-title" style={{ color: horoscope.color }}>
            {horoscope.sign} - {formatDate(horoscope.date)}
          </h2>
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
        <div className="grid" style={{ marginTop: "20px" }}>
          {allHoroscopes.map(h => (
            <div
              key={h.sign}
              className="card"
              style={{
                background: `linear-gradient(135deg, ${h.color} 0%, ${h.color}33 100%)`
              }}
            >
              <h2 className="card-title" style={{ color: h.color }}>
                {h.sign}
              </h2>
              <div className="circular-stats">
                <div className="circle love">
                  <svg>
                    <circle {...circleProps}></circle>
                    <circle
                      {...circleProps}
                      style={{ '--percent': h.love }}
                    ></circle>
                  </svg>
                  <div className="label">❤️ {h.love}%</div>
                </div>
                <div className="circle money">
                  <svg>
                    <circle {...circleProps}></circle>
                    <circle
                      {...circleProps}
                      style={{ '--percent': h.money }}
                    ></circle>
                  </svg>
                  <div className="label">💰 {h.money}%</div>
                </div>
                <div className="circle health">
                  <svg>
                    <circle {...circleProps}></circle>
                    <circle
                      {...circleProps}
                      style={{ '--percent': h.health }}
                    ></circle>
                  </svg>
                  <div className="label">💪 {h.health}%</div>
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
import { useState, useEffect } from 'react';
import './styles.css';

function App() {
  const [sign, setSign] = useState('');
  const [horoscope, setHoroscope] = useState(null);
  const [error, setError] = useState(null);
  const [allHoroscopes, setAllHoroscopes] = useState([]);
  const [loading, setLoading] = useState(false);

  // State kontrolü için log
  console.log('State:', { sign, horoscope, allHoroscopes, loading, error });

  const signs = [
    { value: 'koc', label: 'Koç', icon: '♈', gradient: { start: '#9333ea', end: '#f43f5e' } }, // Mor-kırmızı
    { value: 'boga', label: 'Boğa', icon: '♉', gradient: { start: '#9333ea', end: '#4ade80' } }, // Mor-yeşil
    { value: 'ikizler', label: 'İkizler', icon: '♊', gradient: { start: '#9333ea', end: '#60a5fa' } }, // Mor-mavi
    { value: 'yengec', label: 'Yengeç', icon: '♋', gradient: { start: '#9333ea', end: '#22d3ee' } }, // Mor-camgöbeği
    { value: 'aslan', label: 'Aslan', icon: '♌', gradient: { start: '#9333ea', end: '#f97316' } }, // Mor-turuncu
    { value: 'basak', label: 'Başak', icon: '♍', gradient: { start: '#9333ea', end: '#a3e635' } }, // Mor-sarımsı
    { value: 'terazi', label: 'Terazi', icon: '♎', gradient: { start: '#9333ea', end: '#ec4899' } }, // Mor-pembe
    { value: 'akrep', label: 'Akrep', icon: '♏', gradient: { start: '#9333ea', end: '#06b6d4' } }, // Mor-turkuaz
    { value: 'yay', label: 'Yay', icon: '♐', gradient: { start: '#9333ea', end: '#f59e0b' } }, // Mor-sarı
    { value: 'oglak', label: 'Oğlak', icon: '♑', gradient: { start: '#9333ea', end: '#10b981' } }, // Mor-zümrüt
    { value: 'kova', label: 'Kova', icon: '♒', gradient: { start: '#9333ea', end: '#8b5cf6' } }, // Mor-açık mor
    { value: 'balik', label: 'Balık', icon: '♓', gradient: { start: '#9333ea', end: '#3b82f6' } } // Mor-koyu mavi
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
      console.log('Fetch Horoscope Response:', res.status, res.statusText);
      if (!res.ok) throw new Error(`API hatası: ${res.status}`);
      const data = await res.json();
      console.log('Horoscope Data:', data);
      setHoroscope(data);
    } catch (err) {
      setError('Horoskop alınırken hata oluştu: ' + err.message);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getAllHoroscopes = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/all`);
      console.log('Fetch All Horoscopes Response:', res.status, res.statusText);
      if (!res.ok) throw new Error(`API hatası: ${res.status}`);
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
          Günlük Burç Yorumları
          <span className="star-icon">✨</span>
        </h1>
        <div className="header-date">{today}</div>
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
      {loading && <div className="spinner">Yükleniyor...</div>}
      {error && <div className="toast">{error}</div>}
      {horoscope && (
        <div
          className="result"
          style={{
            background: `linear-gradient(135deg, ${signs.find(s => s.value === sign)?.gradient.start || '#9333ea'}, ${signs.find(s => s.value === sign)?.gradient.end || '#f43f5e'}), #2a2a2a`,
            padding: "15px",
            borderRadius: "12px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
            marginTop: "15px"
          }}
        >
          <h2 className="card-title" style={{ color: '#e0e0e0' }}>
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
          {allHoroscopes.map(h => {
            const signGradient = signs.find(s => s.value === h.sign.toLowerCase())?.gradient || { start: '#9333ea', end: '#f43f5e' };
            return (
              <div
                key={h.sign}
                className="card"
                style={{
                  background: `linear-gradient(135deg, ${signGradient.start}, ${signGradient.end}), #2a2a2a`,
                  padding: "15px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.5)"
                }}
              >
                <h2 className="card-title" style={{ color: '#e0e0e0' }}>
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
            );
          })}
        </div>
      )}
    </div>
  );
}

export default App;
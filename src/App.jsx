import { useState } from 'react';
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

  const fetchHoroscope = async () => {
    setError(null);
    setHoroscope(null);
    if (!sign) {
      setError('Lütfen bir burç seçin.');
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
      console.log('API Verisi:', data); // Test için, kart sorunları API'den mi kontrol et
      setAllHoroscopes(data.horoscopes || []);
    } catch (err) {
      setError('Tüm burçlar alınırken hata oluştu: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Günlük Burç Yorumları</h1>
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
      {loading && <div className="spinner">Yükleniyor...</div>}
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
            {horoscope.sign} - {horoscope.date}
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
                    <circle cx="40" cy="40" r="35"></circle>
                    <circle
                      cx="40"
                      cy="40"
                      r="35"
                      style={{ '--percent': h.love }}
                    ></circle>
                  </svg>
                  <div className="label">❤️ {h.love}%</div>
                </div>
                <div className="circle money">
                  <svg>
                    <circle cx="40" cy="40" r="35"></circle>
                    <circle
                      cx="40"
                      cy="40"
                      r="35"
                      style={{ '--percent': h.money }}
                    ></circle>
                  </svg>
                  <div className="label">💰 {h.money}%</div>
                </div>
                <div className="circle health">
                  <svg>
                    <circle cx="40" cy="40" r="35"></circle>
                    <circle
                      cx="40"
                      cy="40"
                      r="35"
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
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default App;
import { useState } from 'react';
import './styles.css';

function App() {
  const [sign, setSign] = useState('');
  const [horoscope, setHoroscope] = useState(null);
  const [error, setError] = useState(null);
  const [allHoroscopes, setAllHoroscopes] = useState([]);
  const [flippedCards, setFlippedCards] = useState({}); // Flip durumlarını tutar

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
    try {
      const res = await fetch(`/api/horoscope?sign=${sign}`);
      if (!res.ok) throw new Error('API hatası');
      const data = await res.json();
      setHoroscope(data);
    } catch (err) {
      setError('Horoskop alınırken hata oluştu.');
    }
  };

  const getAllHoroscopes = async () => {
    setError(null);
    try {
      const res = await fetch(`/api/all`);
      if (!res.ok) throw new Error('API hatası');
      const data = await res.json();
      setAllHoroscopes(data.horoscopes || []);
    } catch (err) {
      setError('Tüm burçlar alınırken hata oluştu.');
    }
  };

  const toggleFlip = (sign) => {
    setFlippedCards((prev) => ({
      ...prev,
      [sign]: !prev[sign]
    }));
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
      <button onClick={fetchHoroscope}>Yorumu Getir</button>
      <button onClick={getAllHoroscopes}>Tüm Burçları Göster</button>

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
              className={`flip-card ${flippedCards[h.sign] ? 'flipped' : ''}`}
              onClick={() => toggleFlip(h.sign)}
            >
              <div className="flip-card-inner">
                {/* Ön yüz */}
                <div
                  className="flip-card-front"
                  style={{
                    background: `linear-gradient(135deg, ${h.color} 0%, ${h.color}33 100%)`
                  }}
                >
                  <h2 className="card-title" style={{ color: h.color }}>
                    {h.sign}
                  </h2>
                  <p>{h.text}</p>
                </div>
                {/* Arka yüz */}
                <div
                  className="flip-card-back"
                  style={{
                    background: `linear-gradient(135deg, ${h.color} 0%, ${h.color}33 100%)`
                  }}
                >
                  <h3>Şans Yüzdeleri</h3>
                  <div className="stats circular-stats">
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
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default App;
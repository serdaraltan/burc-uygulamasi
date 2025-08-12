import { useState } from 'react';
import './styles.css';

function App() {
  const [sign, setSign] = useState('');
  const [horoscope, setHoroscope] = useState(null);
  const [error, setError] = useState(null);
  const [allHoroscopes, setAllHoroscopes] = useState([]);

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
      if (!res.ok) {
        throw new Error('API hatası');
      }
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
      <button onClick={getAllHoroscopes} style={{ marginLeft: '10px' }}>Tüm Burçları Göster</button>

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
              className="result"
              style={{
                background: `linear-gradient(135deg, ${h.color} 0%, ${h.color}33 100%)`,
                padding: "15px",
                borderRadius: "12px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
              }}
            >
              <h2 className="card-title" style={{ color: h.color }}>
                {h.sign}
              </h2>
              <p>{h.text}</p>
              <div className="stats">
                ❤️ {h.love}%<br />
                💰 {h.money}%<br />
                💪 {h.health}%
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
import { useState } from 'react';
import './styles.css';

function App() {
  const [sign, setSign] = useState('');
  const [horoscope, setHoroscope] = useState(null);
  const [error, setError] = useState(null);

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

      {horoscope && (
        <div className="result">
          <h2>{horoscope.sign} - {horoscope.date}</h2>
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

      {error && <p className="error">{error}</p>}
      {horoscope && (
        <div className="result">
          <h2>{horoscope.sign} - {horoscope.date}</h2>
          <p>{horoscope.text}</p>
        </div>
      )}
    </div>
  );
}

export default App;

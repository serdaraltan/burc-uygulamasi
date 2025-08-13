import { useState, useEffect } from 'react';
import './styles.css';

function HoroscopeCard({ title, text, love, money, health, color, circleProps }) {
  return (
    <div
      className="horoscope-card"
      style={{
        background: `linear-gradient(135deg, ${color} 0%, ${color}33 100%)`
      }}
    >
      <h2>{title}</h2>
      <div className="circular-stats">
        <div className="circle love">
          <svg>
            <circle {...circleProps}></circle>
            <circle {...circleProps} style={{ '--percent': love }}></circle>
          </svg>
          <div className="label">❤️ {love}%</div>
        </div>
        <div className="circle money">
          <svg>
            <circle {...circleProps}></circle>
            <circle {...circleProps} style={{ '--percent': money }}></circle>
          </svg>
          <div className="label">💰 {money}%</div>
        </div>
        <div className="circle health">
          <svg>
            <circle {...circleProps}></circle>
            <circle {...circleProps} style={{ '--percent': health }}></circle>
          </svg>
          <div className="label">💪 {health}%</div>
        </div>
      </div>
      <p>{text}</p>
    </div>
  );
}

function App() {
  const [sign, setSign] = useState('');
  const [horoscope, setHoroscope] = useState(null);
  const [allHoroscopes, setAllHoroscopes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [circleProps, setCircleProps] = useState({ cx: '45', cy: '45', r: '38' });

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

  useEffect(() => {
    const resizeHandler = () => {
      if (window.innerWidth < 768) {
        setCircleProps({ cx: '32.5', cy: '32.5', r: '28' });
      } else {
        setCircleProps({ cx: '45', cy: '45', r: '38' });
      }
    };
    resizeHandler();
    window.addEventListener('resize', resizeHandler);
    return () => window.removeEventListener('resize', resizeHandler);
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const dayName = date.toLocaleDateString('tr-TR', { weekday: 'long' });
    return `${day}.${month}.${year} (${dayName})`;
  };

  const fetchHoroscope = async () => {
    if (!sign) {
      setError('Önce burcunuzu seçin');
      return;
    }
    setLoading(true);
    setHoroscope(null);
    try {
      const res = await fetch(`/api/horoscope?sign=${sign}`);
      if (!res.ok) throw new Error('API hatası');
      const data = await res.json();
      setHoroscope(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getAllHoroscopes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/all`);
      if (!res.ok) throw new Error('API hatası');
      const data = await res.json();
      setAllHoroscopes(data.horoscopes || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>✨ Günlük Burç Yorumları ✨</h1>
      <div>
        <select value={sign} onChange={(e) => setSign(e.target.value)}>
          <option value="">Burcunuzu seçin</option>
          {signs.map(s => (
            <option key={s.value} value={s.value}>{s.icon} {s.label}</option>
          ))}
        </select>
        <button onClick={fetchHoroscope} disabled={loading}>
          {loading ? 'Yükleniyor...' : 'Yorumu Getir'}
        </button>
        <button onClick={getAllHoroscopes} disabled={loading}>
          {loading ? 'Yükleniyor...' : 'Tüm Burçları Göster'}
        </button>
      </div>

      {error && <div className="toast">{error}</div>}

      {horoscope && (
        <HoroscopeCard
          title={`${horoscope.sign} - ${formatDate(horoscope.date)}`}
          text={horoscope.text}
          love={horoscope.love}
          money={horoscope.money}
          health={horoscope.health}
          color={horoscope.color}
          circleProps={circleProps}
        />
      )}

      {allHoroscopes.length > 0 && (
        <div className="grid">
          {allHoroscopes.map(h => (
            <HoroscopeCard
              key={h.sign}
              title={h.sign}
              text={h.text}
              love={h.love}
              money={h.money}
              health={h.health}
              color={h.color}
              circleProps={circleProps}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;

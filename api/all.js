import { generateHoroscope } from './horoscope.js';

const SIGNS = [
  "koc","boga","ikizler","yengec","aslan","basak",
  "terazi","akrep","yay","oglak","kova","balik"
];

export default function handler(req, res) {
  try {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    
    const allHoroscopes = SIGNS.map(key => 
      generateHoroscope(key, dateStr)
    );

    res.status(200).json(allHoroscopes);
  } catch (error) {
    console.error('Tüm burçlar alınırken hata:', error);
    res.status(500).json({ 
      error: 'Sunucu hatası: ' + error.message 
    });
  }
}
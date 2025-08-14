import crypto from 'crypto';

const SIGNS = [
  "koc","boga","ikizler","yengec","aslan","basak",
  "terazi","akrep","yay","oglak","kova","balik"
];

const DISPLAY = {
  koc: "♈ Koç", boga: "♉ Boğa", ikizler: "♊ İkizler", yengec: "♋ Yengeç",
  aslan: "♌ Aslan", basak: "♍ Başak", terazi: "♎ Terazi", akrep: "♏ Akrep",
  yay: "♐ Yay", oglak: "♑ Oğlak", kova: "♒ Kova", balik: "♓ Balık"
};

const TEMPLATES = [
  "Bugün enerji seviyen yüksek. {focus} üzerinde yoğunlaş.",
  "İlişkilerde beklenmedik fırsatlar var. {advice}",
  "Kariyer alanında küçük ama önemli bir adım atabilirsin. {focus}",
  "Bugün sakin kalmaya çalış; acele kararlar seni yormasın. {advice}",
  "Yeni bir fikir ilham verebilir. Yaratıcı projelere zaman ayır.",
  "Finansal açıdan beklenmedik bir durumla karşılaşabilirsin. {advice}",
  "Sağlığını ihmal etme, kendine zaman ayırmayı unutma.",
  "Sosyal ilişkilerin ön planda. Eski dostlarla bağlantı kur.",
  "Yaratıcılığın zirvede. Sanatsal aktivitelere yönel.",
  "Duygusal dalgalanmalar yaşayabilirsin. Dengeyi korumaya çalış."
];

const focuses = ["iş", "ilişkiler", "sağlık", "finans", "kişisel gelişim", "aile"];
const advices = [
  "bir konuda sorumluluk al",
  "dinlemeye daha çok vakit ayır",
  "küçük bir yatırım düşün",
  "yürüyüşe çık ve zihnini temizle",
  "eski bir bağlantıyı canlandır",
  "kendine zaman ayır",
  "riskli kararlardan kaçın",
  "yaratıcı yönünü ortaya çıkar"
];

function seededRandom(seed) {
  const hash = crypto.createHash("sha256").update(seed).digest();
  const num = hash.readUInt32BE(0);
  return num / 0xffffffff;
}

function generateHoroscope(key, dateStr) {
  const seed = `${dateStr}|${key}`;
  const r = seededRandom(seed);
  const template = TEMPLATES[Math.floor(r * TEMPLATES.length)];
  const focus = focuses[Math.floor(seededRandom(seed + "|f") * focuses.length)];
  const advice = advices[Math.floor(seededRandom(seed + "|a") * advices.length)];

  let text = template.replace("{focus}", focus).replace("{advice}", advice);

  // Şans yüzdeleri
  const love = Math.floor(seededRandom(seed + "|love") * 101);
  const money = Math.floor(seededRandom(seed + "|money") * 101);
  const health = Math.floor(seededRandom(seed + "|health") * 101);

  return { 
    sign: DISPLAY[key] || key,
    date: dateStr, // Tarih bilgisini ekliyoruz
    text,
    love,
    money,
    health
  };
}

export default function handler(req, res) {
  try {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD formatında tarih
    
    // Tüm burçlar için yorum oluştur
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
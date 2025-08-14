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

const COLORS = {
  koc: "#FF6B6B",     // kırmızı
  boga: "#6BCB77",    // yeşil
  ikizler: "#4D96FF", // mavi
  yengec: "#FFD93D",  // sarı
  aslan: "#FF914D",   // turuncu
  basak: "#9D84B7",   // mor
  terazi: "#FFB4B4",  // pembe
  akrep: "#8E44AD",   // koyu mor
  yay: "#F39C12",     // altın sarısı
  oglak: "#95A5A6",   // gri
  kova: "#00CEC9",    // turkuaz
  balik: "#74B9FF"    // açık mavi
};

function normalizeSign(s){
  return s.toLowerCase()
    .replace(/ç/g,'c').replace(/ğ/g,'g').replace(/ş/g,'s')
    .replace(/ı/g,'i').replace(/ö/g,'o').replace(/ü/g,'u')
    .replace(/[^a-z]/g,'');
}

const TEMPLATES = [
  "Bugün enerji seviyen yüksek. {focus} üzerinde yoğunlaş.",
  "İlişkilerde beklenmedik fırsatlar var. {advice}",
  "Kariyer alanında küçük ama önemli bir adım atabilirsin. {focus}",
  "Bugün sakin kalmaya çalış; acele kararlar seni yormasın. {advice}",
  "Yeni bir fikir ilham verebilir. Yaratıcı projelere zaman ayır."
];

function seededRandom(seed) {
  const hash = crypto.createHash("sha256").update(seed).digest();
  const num = hash.readUInt32BE(0);
  return num / 0xffffffff;
}

export function generateHoroscope(key, dateStr) {
  const seed = `${dateStr}|${key}`;
  const r = seededRandom(seed);
  const template = TEMPLATES[Math.floor(r * TEMPLATES.length)];

  const focuses = ["iş", "ilişkiler", "sağlık", "finans", "kişisel gelişim"];
  const advices = [
    "bir konuda sorumluluk al",
    "dinlemeye daha çok vakit ayır",
    "küçük bir yatırım düşün",
    "yürüyüşe çık ve zihnini temizle",
    "eski bir bağlantıyı canlandır"
  ];
  const focus = focuses[Math.floor(seededRandom(seed + "|f") * focuses.length)];
  const advice = advices[Math.floor(seededRandom(seed + "|a") * advices.length)];

  let text = template.replace("{focus}", focus).replace("{advice}", advice);

  // Şans yüzdeleri
  const love = Math.floor(seededRandom(seed + "|love") * 101);
  const money = Math.floor(seededRandom(seed + "|money") * 101);
  const health = Math.floor(seededRandom(seed + "|health") * 101);

  return { 
    text, 
    love, 
    money, 
    health 
  };
}

export default function handler(req, res) {
  const { sign } = req.query;
  const key = normalizeSign(sign || "");

  if (!SIGNS.includes(key)) {
    return res.status(400).json({ error: "Geçersiz burç. Örnek: ?sign=koc veya ?sign=koç" });
  }

  const now = new Date();
  const dateStr = now.toISOString().slice(0,10);
  const { text, love, money, health } = generateHoroscope(key, dateStr);

  res.status(200).json({
    sign: DISPLAY[key] || key,
    date: dateStr,
    text,
    love,
    money,
    health,
    color: COLORS[key]
  });
}
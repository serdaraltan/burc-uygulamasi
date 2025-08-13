import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      headerTitle: 'Daily Horoscope',
      selectSign: 'Select your sign',
      getHoroscope: 'Get Comment',
      getAll: 'Show All Signs',
      loading: 'Loading...',
      errorSelectSign: 'Please select your sign first',
      errorFetch: 'Error fetching horoscope',
      errorFetchAll: 'Error fetching all horoscopes',
      invalidDate: 'Invalid date',
      invalidDataFormat: 'Invalid data format',
      love: 'Love',
      money: 'Money',
      health: 'Health'
    }
  },
  tr: {
    translation: {
      headerTitle: 'Günlük Burç Yorumları',
      selectSign: 'Burcunuzu seçin',
      getHoroscope: 'Yorumu Getir',
      getAll: 'Tüm Burçları Göster',
      loading: 'Yükleniyor...',
      errorSelectSign: 'Önce Burcunuzu Seçiniz',
      errorFetch: 'Horoskop alınırken hata oluştu',
      errorFetchAll: 'Tüm burçlar alınırken hata oluştu',
      invalidDate: 'Geçersiz tarih',
      invalidDataFormat: 'Geçersiz veri formatı',
      love: 'Aşk',
      money: 'Para',
      health: 'Sağlık'
    }
  }
};

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    fallbackLng: 'tr',
    detection: {
      order: ['navigator', 'querystring'], // Cookie ve localStorage devre dışı
      lookupQuerystring: 'lng',
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
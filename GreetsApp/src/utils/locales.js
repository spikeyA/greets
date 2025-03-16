import i18n from 'i18n-js';

i18n.translations = {
  en: {
    welcome: 'Welcome to GreetsApp!',
    record: 'Record a Greeting',
    share: 'Share via WhatsApp or Instagram',
  },
  hi: {
    welcome: 'GreetsApp में आपका स्वागत है!',
    record: 'एक ग्रीटिंग रिकॉर्ड करें',
    share: 'WhatsApp या Instagram के माध्यम से साझा करें',
  },
  es: {
    welcome: '¡Bienvenido a GreetsApp!',
    record: 'Graba un saludo',
    share: 'Compartir a través de WhatsApp o Instagram',
  },
};

i18n.locale = 'en'; // Default language
export default i18n;
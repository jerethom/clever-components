// Setup langs and configure english
import { addTranslations, setLanguage } from '../src/lib/i18n.js';
import { lang, translations } from '../src/translations/translations.fr.js';

addTranslations(lang, translations);
setLanguage(lang);

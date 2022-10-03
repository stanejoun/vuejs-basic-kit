export class I18n {

  static KEY = 'buybox_locale';
  static INSTANCE;
  static CURRENT = 'en';
  static PRIMARY = 'en';

  static init (i18nInstance) {
    I18n.INSTANCE = i18nInstance;
    const locale = localStorage.getItem(I18n.KEY);
    if (locale) {
      I18n.INSTANCE.locale = locale;
    }
  }

  static getAvailableLocales () {
    return ['de', 'el', 'en', 'es', 'fr', 'hu', 'it', 'ja', 'nl', 'pl', 'ru', 'th', 'tr', 'zh'];
  }

  static getIsoLocaleForFlag(locale) {
    if (locale === 'en') {
      return 'gb';
    }
    return locale;
  }

  static initLocale (routeLocation) {
    let locale = null;
    if (routeLocation.query.lang) {
      locale = String(routeLocation.query.lang);
      localStorage.setItem(I18n.KEY, locale);
    } else {
      locale = localStorage.getItem(I18n.KEY);
    }
    if (!locale) {
      locale = navigator.language;
      locale = locale.replace('_', '-');
      if (I18n.getAvailableLocales().indexOf(locale) === -1) {
        locale = locale.substring(0, 2);
      }
    }
    if (I18n.getAvailableLocales().indexOf(locale) === -1) {
      locale = process.env.VUE_APP_LOCALE_DEFAULT;
    }
    I18n.setLocale(locale);
  }

  static setLocale (locale) {
    localStorage.setItem(I18n.KEY, locale);
    I18n.PRIMARY = locale.substring(0, 2);
    I18n.CURRENT = locale;
    if (I18n.INSTANCE) {
      I18n.INSTANCE.locale = locale;
    }
  }

  static getLocale () {
    return I18n.CURRENT;
  }
}
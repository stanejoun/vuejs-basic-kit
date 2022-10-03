export class AppService {

  static APP_INSTANCE;
  static CHANGE_CONTROL;
  static CURRENT_ITEM;

  static init (app) {
    AppService.APP_INSTANCE = app;
    AppService.initGlobalEvents();
  }

  static getInstance () {
    return AppService.APP_INSTANCE;
  }

  static $t (key) {
    if (AppService.APP_INSTANCE) {
      return AppService.APP_INSTANCE.$t(key);
    }
    return key;
  }

  static initGlobalEvents () {
    const on = (element, type, selector, handler) => {
      element.addEventListener(type, (event) => {
        if (event.target.closest(selector)) {
          handler(event);
        }
      });
    };
    on(document, 'show.bs.modal', '.modal', (event) => {
      document.querySelector('body').appendChild(event.target);
    });
    window.addEventListener('beforeunload',  (event) => {
      if (AppService.hasChanges()) {
        event.returnValue = AppService.APP_INSTANCE.$t('The changes you have made may not be saved. Do you want to continue?');
      }
    });
  }

  static addChange () {
    AppService.CHANGE_CONTROL = true;
  }

  static clearChanges () {
    AppService.CHANGE_CONTROL = false;
  }

  static hasChanges () {
    return AppService.CHANGE_CONTROL;
  }

  static getCurrentItemId (context = 'integrations') {
    let currentItemId = 0;
    const currentUrl = document.location.href;
    if (context === 'integration') {
      context = 'integrations';
    }
    const indexOfContext = currentUrl.indexOf('/' + context + '/');
    if (indexOfContext !== -1) {
      const urlParts = currentUrl.substring(indexOfContext + context.length + 2);
      const urlEntries = urlParts.split('/');
      currentItemId = urlEntries[0] | 0;
    }
    return currentItemId;
  }

  static setCurrentItem (item) {
    AppService.CURRENT_ITEM = item;
  }

  static getCurrentItem () {
    return AppService.CURRENT_ITEM;
  }
}
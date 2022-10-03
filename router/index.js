// import Vue from 'vue';
// import VueRouter from 'vue-router';
// import auth from './routes/auth';
// import admin from './routes/admin';
// import integration from './routes/integration';
// import faq from './routes/faq';
// import error from './routes/error';
// import { AuthenticationService } from '../services/AuthenticationService';
// import store from '@/store';
// import { I18n } from '../services/I18n';
// import { AppService } from '../services/AppService';
//
// Vue.use(VueRouter);
//
// const router = new VueRouter({
//   mode: 'history',
//   base: process.env.BASE_URL,
//   scrollBehavior () {
//     return { x: 0, y: 0 };
//   },
//   routes: [...auth, ...integration, ...faq, ...admin, ...error,
//     {
//       path: '/:pathMatch(.*)*',
//       redirect: '/error/page-not-found'
//     }
//   ]
// });
//
// router.beforeEach((to, from, next) => {
//
//   I18n.initLocale(to);
//   if (AppService.hasChanges() && !from.hash) {
//     const result = confirm(AppService.APP_INSTANCE.$t('The changes you have made may not be saved. Do you want to continue?'));
//     if (result === false) {
//       return null;
//     }
//     AppService.clearChanges();
//   }
//
//   if (!AuthenticationService.canNavigate(to)) {
//     // If not authenticated => Not authorized
//     if (!AuthenticationService.isAuthenticated()) {
//       return next({
//         name: 'auth-login',
//         query: { redirect: to.fullPath }
//       });
//     }
//     // If authenticated => Forbidden
//     return next({ name: 'forbiddenError' });
//   }
//   let title = 'BuyBox Network - Self Serve';
//   if (to.matched.some(record => record.meta.title)) {
//     title = title + ' - ' + to.meta.title;
//   }
//   document.title = title;
//   if (to.path.indexOf('/integrations/') !== -1) {
//     store.commit('app/UPDATE_NAVBAR_TO_DISPLAY', 'integration');
//   } else if (to.path.indexOf('/admin/') !== -1) {
//     store.commit('app/UPDATE_NAVBAR_TO_DISPLAY', 'admin');
//   } else {
//     store.commit('app/UPDATE_NAVBAR_TO_DISPLAY', '');
//   }
//   return next();
// });
//
// // ? For splash screen
// // Remove afterEach hook if you are not using splash screen
// router.afterEach((to, from) => {
//   // Remove initial loading
//   const appLoading = document.getElementById('loading-bg');
//   if (appLoading) {
//     appLoading.style.display = 'none';
//   }
//   if (to.path.indexOf('/integrations/') !== -1) {
//     store.dispatch('app/getCurrentIntegration');
//   }
//   else {
//     store.commit('app/UPDATE_INTEGRATION_CONTEXT', {});
//   }
// });
//
// export default router;
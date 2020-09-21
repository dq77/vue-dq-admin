import Vue from 'vue';

import Cookies from 'js-cookie';

import 'normalize.css/normalize.css'; // A modern alternative to CSS resets

import Element from 'element-ui';

import 'element-ui/lib/theme-chalk/index.css';

import '@/styles/index.scss'; // global css

import * as VueGoogleMaps from 'vue2-google-maps';

import App from './App';
import router from './router/index';
import store from './store';

import i18n from './lang'; // Internationalization
import './icons'; // icon
import './errorLog'; // error log
import './permission'; // permission control

import * as filters from './filters'; // global filters

Vue.use(Element, {
  size: Cookies.get('size') || 'mini', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
});

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyALQPdG0XsngXsUOzlQSKONxG-S7rJz1KY',
    libraries: 'places',
    region: 'US',
    language: 'en' //  || Cookies.get('language')
  },
  installComponents: true
});

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

Vue.config.productionTip = false;

// 只能输入正整数
Vue.directive('enterNumber', {
  inserted: function(el) {
    el.addEventListener('keypress', function(e) {
      e = e || window.event;
      const charcode = typeof e.charCode === 'number' ? e.charCode : e.keyCode;
      const re = /\d/;
      if (
        !re.test(String.fromCharCode(charcode)) &&
        charcode > 9 &&
        !e.ctrlKey
      ) {
        if (e.preventDefault) {
          e.preventDefault();
        } else {
          e.returnValue = false;
        }
      }
    });
  }
});

// 只能输入正数(包含小数)
Vue.directive('enterNumber2', {
  inserted: function(el) {
    el.addEventListener('keypress', function(e) {
      e = e || window.event;
      const charcode = typeof e.charCode === 'number' ? e.charCode : e.keyCode;
      const re = /\d/;
      if (charcode === 46) {
        if (el.value.includes('.')) {
          e.preventDefault();
        }
        return;
      } else if (
        !re.test(String.fromCharCode(charcode)) &&
        charcode > 9 &&
        !e.ctrlKey
      ) {
        if (e.preventDefault) {
          e.preventDefault();
        } else {
          e.returnValue = false;
        }
      }
    });
  }
});

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
});

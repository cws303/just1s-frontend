// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import VueYoutube from "vue-youtube";
const moment = require("moment");
require("moment/locale/ko");
import axios from "axios";

const baseURLs = {
  // local: "/api",
  development: "/api",
  production: "http://www.kimjbstar.com"
};

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(VueYoutube);
Vue.use(require("vue-moment"), {
  moment
});
Vue.config.productionTip = false;
Vue.use({
  install(Vue) {
    Vue.prototype.$http = axios.create({
      baseURL: baseURLs[process.env.NODE_ENV]
    });
  }
});

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  components: { App },
  template: "<App/>"
});

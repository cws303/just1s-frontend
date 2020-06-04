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
import httpService from "@/utils/httpService";
import { store } from "@/stores/index";

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(VueYoutube);
Vue.use(require("vue-moment"), {
  moment
});
Vue.config.productionTip = false;

Object.defineProperty(Vue.prototype, "$httpService", {
  get() {
    return httpService;
  }
});

/* eslint-disable no-new */
new Vue({
  el: "#app",
  store,
  router,
  components: { App },
  template: "<App/>",
  async beforeCreate() {
    await this.$httpService.checkToken();
  }
});
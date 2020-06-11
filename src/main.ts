import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import VueHttpService from "@/plugins/vueHttpServicePlugin";
import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

import { store } from "./store";

const moment = require("moment");
require("moment/locale/ko");

Vue.use(require("vue-moment"), {
  moment
});

import YoutubePlayerPlugin from "@/plugins/youtubePlayerPlugin";
Vue.use(YoutubePlayerPlugin);

import VueCookies from "vue-cookies";
Vue.use(VueCookies);

Vue.config.productionTip = false;

declare module "vue/types/vue" {
  // 3. Declare augmentation for Vue
  interface Vue {
    $httpService: any;
    $youtube: any;
  }

  interface VueConstructure {
    $httpService: any;
    $youtube: any;
  }
}

Vue.use(VueHttpService);

new Vue({
  router,
  store,
  vuetify,
  async beforeCreate() {
    await this.$httpService.checkToken();
  },
  render: h => h(App)
}).$mount("#app");

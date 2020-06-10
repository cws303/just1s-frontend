import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { store } from "./store";
import vuetify from "./plugins/vuetify";
// import VueYoutube from "vue-youtube";

// import httpService from "@/utils/httpService";
import httpServicePlugin from "@/utils/httpServicePlugin";
import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

const moment = require("moment");
// import { store } from "@/stores/index";
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
  }

  interface VueConstructure {
    $httpService: any;
  }
}

Vue.use(httpServicePlugin);

new Vue({
  router,
  store,
  vuetify,
  async beforeCreate() {
    const existToken = this.$cookies.get("accessToken");
    await this.$httpService.checkToken(existToken);
  },
  render: h => h(App)
}).$mount("#app");

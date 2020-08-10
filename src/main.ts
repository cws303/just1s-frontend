import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { VueMasonryPlugin } from "@/plugins/vueMasonryPlugin";
import vueHttpService from "@/plugins/vueHttpServicePlugin";

// service
import "@mdi/font/css/materialdesignicons.css";

// admin
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

import { store } from "./store";

import moment from "moment-timezone";
Vue.use(require("vue-moment"), {
  moment
});

import YoutubePlayerPlugin from "@/plugins/youtubePlayerPlugin";
Vue.use(YoutubePlayerPlugin);

import DeviceTypEnum from "@/utils/DeviceTypeEnum";
import DeviceDetector from "@/plugins/deviceDetector";
Vue.use(DeviceDetector, { breaker: DeviceTypEnum.desktop });

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

Vue.use(VueMasonryPlugin);
Vue.use(vueHttpService);
new Vue({
  router,
  store,
  async beforeCreate() {
    await this.$httpService.checkToken();
  },
  render: h => h(App)
}).$mount("#app");

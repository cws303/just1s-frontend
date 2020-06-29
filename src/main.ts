import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
<<<<<<< HEAD
import vueHttpService from "@/plugins/vueHttpServicePlugin";
import $ from "jquery";

// import vueMasonry from "@/plugins/vueMasonryPlugin"
=======
import VueHttpService from "@/plugins/vueHttpServicePlugin";
>>>>>>> eb96412184536f3dbcfec9cababb34cb2ac7ab48
import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";

import '@mdi/font/css/materialdesignicons.css' 
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

import { store } from "./store";

// const moment = require("moment");
import moment from "moment-timezone";
// require("moment/locale/ko");

Vue.use(require("vue-moment"), {
  moment
});

import YoutubePlayerPlugin from "@/plugins/youtubePlayerPlugin";
Vue.use(YoutubePlayerPlugin);

import DeviceDetector from "@/plugins/deviceDetector";
Vue.use(DeviceDetector);


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

<<<<<<< HEAD
// Vue.use(vueMasonry);
Vue.use(vueHttpService);
Vue.use(vuetify, {
  icons: {
    iconfont: 'fa', // default - only for display purposes
  },
})
=======
Vue.use(VueHttpService);
>>>>>>> eb96412184536f3dbcfec9cababb34cb2ac7ab48

new Vue({
  router,
  store,
  vuetify,
  async beforeCreate() {
    await this.$httpService.checkToken();
  },
  render: h => h(App)
}).$mount("#app");

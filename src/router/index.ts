import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Admin from "./admin/index";
import Web from "./web/routes";
import PageNotFound from "@/components/PageNotFound.vue";
import { store } from "@/store/index";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  Web,
  Admin,
  { path: "*", component: PageNotFound }
];
const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});
const DEFAULT_TITLE = "단1초";

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.accessibleTo)) {
    await router.app.$httpService.checkToken();
    // You can use store variable here to access globalError or commit mutation
    const currentUser = store.getters.currentUser;

    if (currentUser === undefined || currentUser === null) {
      alert("로그인되어있지 않습니다.");
      next("/login-index");
      return;
    }
    if (to.meta.accessibleTo.includes(currentUser.role) === false) {
      alert("접근 권한이 없습니다.");
      next(false);
      return;
    }
    next();
  } else {
    next();
  }
});

router.afterEach((to, from) => {
  Vue.nextTick(() => {
    let title = to.meta.title || DEFAULT_TITLE;
    if (process.env.NODE_ENV != "production") {
      title += " - " + process.env.NODE_ENV;
    }
    document.title = title;
  });
});

export default router;

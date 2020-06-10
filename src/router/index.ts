import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Admin from "./admin/index";
import Web from "./web/routes";
import PageNotFound from "@/components/PageNotFound.vue";
import { store } from "@/store/index";
// import httpService from "@/utils/httpService";
// import httpServicePlugin from "@/utils/httpServicePlugin";

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

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.accessibleTo)) {
    const existToken = router.app.$cookies.get("accessToken");
    await router.app.$httpService.checkToken(existToken);
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

export default router;

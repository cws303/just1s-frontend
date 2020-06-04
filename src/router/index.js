import Vue from "vue";
import Router from "vue-router";
import AdminRoutes from "./admin";
import Web from "./web/routes";
import PageNotFound from "@/components/PageNotFound.vue";
import { store } from "@/stores/index";
import httpService from "@/utils/httpService";

Vue.use(Router);
const routes = [AdminRoutes, Web, { path: "*", component: PageNotFound }];

const router = new Router({
  mode: "history",
  routes
});

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.accessibleTo)) {
    await httpService.checkToken();
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

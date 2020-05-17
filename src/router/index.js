import Vue from "vue";
import Router from "vue-router";
import AdminRoutes from "./admin";
import Web from "./web/routes";
import PageNotFound from "@/components/PageNotFound.vue";
import { store } from "@/stores/index";

Vue.use(Router);
const routes = [AdminRoutes, Web, { path: "*", component: PageNotFound }];

const router = new Router({
  mode: "history",
  // base: process.env.BASE_URL,
  routes
  // scrollBehavior: () => ({ y: 0 })
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.accessibleTo)) {
    // You can use store variable here to access globalError or commit mutation
    const currentUser = store.getters.currentUser;

    if (currentUser === undefined) {
      alert("로그인되어있지 않습니다.");
      next(false);
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

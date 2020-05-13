import Vue from "vue";
import Router from "vue-router";
import Admin from "./admin/routes";
import Common from "./common/routes";
import PageNotFound from "../views/Common/PageNotFound";

Vue.use(Router);

const routes = [Admin, Common, { path: "*", component: PageNotFound }];

const router = new Router({
  mode: "history",
  // base: process.env.BASE_URL,
  routes
});

export default router;

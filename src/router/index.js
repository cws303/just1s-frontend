import Vue from "vue";
import Router from "vue-router";
import Admin from "./admin/routes";
import Web from "./web/routes";
import PageNotFound from "../components/PageNotFound.vue";

Vue.use(Router);

const routes = [Admin, Web, { path: "*", component: PageNotFound }];

const router = new Router({
  mode: "history",
  // base: process.env.BASE_URL,
  routes
});

export default router;

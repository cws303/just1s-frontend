import Admin from "@/views/Admin/Admin.vue";
import AdminHome from "@/views/Admin/AdminHome/AdminHome.vue";
import AdminLoginForm from "@/views/Admin/AdminLoginForm/AdminLoginForm.vue";
import AdminAccessMaster from "@/views/Admin/AdminAccessMaster/AdminAccessMaster.vue";
import AdminAccessStaff from "@/views/Admin/AdminAccessStaff/AdminAccessStaff.vue";
import AdminAccessUser from "@/views/Admin/AdminAccessUser/AdminAccessUser.vue";
import AdminUITest from "@/views/Admin/AdminUITest/AdminUITest.vue";
import { AdminUsersRoutes } from "@/router/admin/users";
import { AdminDecksRoutes } from "@/router/admin/decks";
import { AdminMusicsRoutes } from "@/router/admin/musics";
import { AdminPerformsRoutes } from "@/router/admin/performs";
import { RouteConfig } from "vue-router";

const routes: RouteConfig = {
  path: "/admin",
  // name: "admin",
  component: Admin,
  children: [
    {
      path: "",
      name: "admin",
      component: AdminHome
    },
    {
      path: "home",
      name: "AdminHome",
      component: AdminHome
    },
    {
      path: "login",
      name: "AdminLoginForm",
      component: AdminLoginForm
    },
    {
      path: "access_user",
      name: "AdminAccessUser",
      component: AdminAccessUser,
      meta: { accessibleTo: ["NORMAL", "STAFF", "MASTER"] }
    },
    {
      path: "access_staff",
      name: "AdminAccessStaff",
      component: AdminAccessStaff,
      meta: { accessibleTo: ["STAFF", "MASTER"] }
    },
    {
      path: "access_master",
      name: "AdminAccessMaster",
      component: AdminAccessMaster,
      meta: { accessibleTo: ["MASTER"] }
    },
    {
      path: "ui_test",
      name: "AdminUITest",
      component: AdminUITest
    }
  ]
};

const childrenRoutes = [
  AdminDecksRoutes,
  AdminUsersRoutes,
  AdminMusicsRoutes,
  AdminPerformsRoutes
];
childrenRoutes.forEach(childrenRoute => {
  childrenRoute.forEach((route: any) => {
    if (routes.children) {
      routes.children.push(route);
    }
  });
});

export default routes;

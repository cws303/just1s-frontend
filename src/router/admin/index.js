import Admin from "@/views/Admin/Admin";
import AdminHome from "@/views/Admin/AdminHome/AdminHome";
import AdminLoginForm from "@/views/Admin/AdminLoginForm/AdminLoginForm";
import AdminAccessMaster from "@/views/Admin/AdminAccessMaster/AdminAccessMaster";
import AdminAccessStaff from "@/views/Admin/AdminAccessStaff/AdminAccessStaff";
import AdminAccessUser from "@/views/Admin/AdminAccessUser/AdminAccessUser";
import { AdminUsersRoutes } from "@/router/admin/users";
import { AdminDecksRoutes } from "@/router/admin/decks";

const routes = {
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
    ,
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
    }
  ]
};

const childrenRoutes = [AdminDecksRoutes, AdminUsersRoutes];
childrenRoutes.forEach(childrenRoute => {
  childrenRoute.forEach(route => {
    routes.children.push(route);
  });
});

export default routes;

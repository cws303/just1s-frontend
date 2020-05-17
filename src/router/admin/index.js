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
  name: "admin",
  component: Admin,
  children: [
    {
      component: AdminHome,
      name: "AdminHome",
      path: ""
    },
    {
      component: AdminLoginForm,
      name: "AdminLoginForm",
      path: "login"
    },
    {
      component: AdminAccessUser,
      name: "AdminAccessUser",
      path: "access_user",
      meta: { accessibleTo: ["NORMAL", "STAFF", "MASTER"] }
    },
    ,
    {
      component: AdminAccessStaff,
      name: "AdminAccessStaff",
      path: "access_staff",
      meta: { accessibleTo: ["STAFF", "MASTER"] }
    },
    {
      component: AdminAccessMaster,
      name: "AdminAccessMaster",
      path: "access_master",
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

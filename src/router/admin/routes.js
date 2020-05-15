import { AdminUsersRoutes } from "@/router/admin/modules/users";
import { AdminDecksRoutes } from "@/router/admin/modules/decks";
import Admin from "@/views/Admin/Admin";
import AdminHome from "@/views/Admin/AdminHome/AdminHome";

const routes = {
  path: "/admin",
  name: "admin",
  component: Admin,
  children: [
    {
      component: AdminHome,
      path: ""
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

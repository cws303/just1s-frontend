import AdminUserList from "@/views/Admin/AdminUserList/AdminUserList";
import AdminUserDetail from "@/views/Admin/AdminUserDetail/AdminUserDetail";

const AdminUsersRoutes = [
  {
    path: "users",
    alias: ["/users/", "users/index"],
    name: "AdminUserList",
    component: AdminUserList
  },
  {
    path: "users/add",
    name: "AdminUserAdd",
    component: AdminUserDetail
  },
  {
    path: "users/edit/:id(\\d+)",
    name: "AdminUserEdit",
    component: AdminUserDetail,
    meta: { tagview: "user" }
  }
];

export { AdminUsersRoutes };

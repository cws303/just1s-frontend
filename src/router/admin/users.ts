import AdminUserList from "@/views/Admin/AdminUserList/AdminUserList.vue";
import AdminUserForm from "@/views/Admin/AdminUserForm/AdminUserForm.vue";

const AdminUsersRoutes = [
  {
    path: "users",
    // alias: ["/users/", "users/index"],
    name: "AdminUserList",
    component: AdminUserList
  },
  {
    path: "users/add",
    name: "AdminUserAdd",
    component: AdminUserForm
  },
  {
    path: "users/edit/:id(\\d+)",
    name: "AdminUserEdit",
    component: AdminUserForm,
  }
];

export { AdminUsersRoutes };

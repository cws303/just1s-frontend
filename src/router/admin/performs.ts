import AdminPerformList from "@/views/Admin/AdminPerformList/AdminPerformList.vue";
import AdminPerformForm from "@/views/Admin/AdminPerformForm/AdminPerformForm.vue";

const AdminPerformsRoutes = [
  {
    path: "performs",
    name: "AdminPerformList",
    component: AdminPerformList
  },
  {
    path: "performs/add",
    name: "AdminPerformAdd",
    component: AdminPerformForm
  },
  {
    path: "performs/edit/:id(\\d+)",
    name: "AdminPerformEdit",
    component: AdminPerformForm
  }
];

export { AdminPerformsRoutes };

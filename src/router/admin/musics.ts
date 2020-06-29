import AdminMusicList from "@/views/Admin/AdminMusicList/AdminMusicList.vue";
import AdminMusicForm from "@/views/Admin/AdminMusicForm/AdminMusicForm.vue";

const AdminMusicsRoutes = [
  {
    path: "musics",
    name: "AdminMusicList",
    component: AdminMusicList
  },
  {
    path: "musics/add",
    name: "AdminMusicAdd",
    component: AdminMusicForm
  },
  {
    path: "musics/edit/:id(\\d+)",
    name: "AdminMusicEdit",
    component: AdminMusicForm
  }
];

export { AdminMusicsRoutes };

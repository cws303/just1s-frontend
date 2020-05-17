import AdminDeckList from "@/views/Admin/AdminDeckList/AdminDeckList";
import AdminDeckDetail from "@/views/Admin/AdminDeckDetail/AdminDeckDetail";
import AdminDeckHashtagInlineForm from "@/views/Admin/AdminDeckHashtagInlineForm/AdminDeckHashtagInlineForm";
import AdminDeckMusicInlineForm from "@/views/Admin/AdminDeckMusicInlineForm/AdminDeckMusicInlineForm";

const AdminDecksRoutes = [
  {
    path: "decks",
    alias: ["/decks/", "decks/index"],
    name: "AdminDeckList",
    component: AdminDeckList
  },
  {
    path: "decks/add",
    name: "AdminDeckAdd",
    component: AdminDeckDetail
  },
  {
    path: "decks/edit/:id(\\d+)",
    name: "AdminDeckEdit",
    component: AdminDeckDetail,
    meta: { tagview: "deck" }
  },
  {
    path: "decks/:deckId(\\d+)/hashtags",
    name: "AdminDeckHashtagInlineForm",
    component: AdminDeckHashtagInlineForm
  },
  {
    path: "decks/:deckId(\\d+)/musics",
    name: "AdminDeckMusicInlineForm",
    component: AdminDeckMusicInlineForm
  }
];

export { AdminDecksRoutes };

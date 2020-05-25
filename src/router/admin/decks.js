import AdminDeckList from "@/views/Admin/AdminDeckList/AdminDeckList";
import AdminDeckForm from "@/views/Admin/AdminDeckForm/AdminDeckForm";
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
    component: AdminDeckForm
  },
  {
    path: "decks/edit/:id(\\d+)",
    name: "AdminDeckEdit",
    component: AdminDeckForm,
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

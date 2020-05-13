import deckHome from "@/views/Web/Decks/Decks";
import deckList from "@/views/Web/Decks/components/List";
import deckDetail from "@/views/Web/Decks/components/Detail";

export default {
  path: "decks",
  component: deckHome,
  children: [
    {
      path: "",
      alias: "list",
      name: "DeckList",
      component: deckList
    },
    {
      path: ":id",
      name: "DeckDetail",
      component: deckDetail,
      meta: { tagview: "deck" }
    }
  ]
};

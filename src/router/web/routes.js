import Web from "../../views/Web/Web";
import Decks from "./modules/decks";
import Practice from "./modules/practice";
import PageNotFound from "../../components/PageNotFound.vue";

export default {
  path: "/",
  name: "web",
  component: Web,
  children: [Decks, Practice, { path: "*", component: PageNotFound }]
};

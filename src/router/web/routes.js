import Decks from "@/router/web/modules/decks";
import Practice from "@/router/web/modules/practice";
import Web from "@/views/Web/Web";

export default {
  path: "/",
  name: "web",
  component: Web,
  children: [Decks, Practice]
};

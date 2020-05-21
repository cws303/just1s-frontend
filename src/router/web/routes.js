import Decks from "@/router/web/modules/decks";
import Practice from "@/router/web/modules/practice";
import Web from "@/views/Web/Web";
import AuthInstagram from "@/views/Web/AuthInstagram/AuthInstagram";

export default {
  path: "/",
  name: "web",
  component: Web,
  children: [
    Decks,
    Practice,
    {
      path: "auth/instagram",
      name: "AuthInstagram",
      component: AuthInstagram
    }
  ]
};

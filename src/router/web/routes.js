import Decks from "@/router/web/modules/decks";
import Practice from "@/router/web/modules/practice";
import Web from "@/views/Web/Web";
import AuthInstagram from "@/views/Web/AuthInstagram/AuthInstagram";
import AuthKakao from "@/views/Web/AuthKakao/AuthKakao";
import Home from "@/views/Web/Home/Home";

export default {
  path: "/",
  // name: "web",
  component: Web,
  children: [
    {
      path: "",
      name: "web",
      component: Home
    },
    {
      path: "home",
      name: "Home",
      component: Home
    },
    Decks,
    Practice,
    {
      path: "auth/instagram",
      name: "AuthInstagram",
      component: AuthInstagram
    },
    {
      path: "auth/kakao",
      name: "AuthKakao",
      component: AuthKakao
    }
  ]
};

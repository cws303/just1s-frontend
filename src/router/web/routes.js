import Web from "@/views/Web/Web";
import LoginIndex from "@/views/Web/LoginIndex/LoginIndex";
import DeckDetail from "@/views/Web/DeckDetail/DeckDetail";
import PerformForm from "@/views/Web/PerformForm/PerformForm";
import AnswerIndex from "@/views/Web/AnswerIndex/AnswerIndex";
import PerformDetail from "@/views/Web/PerformDetail/PerformDetail";
import DeckForm from "@/views/Web/DeckForm/DeckForm";
import UserIndex from "@/views/Web/UserIndex/UserIndex";
import Practice from "@/views/Web/Practice/Practice";
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
    {
      path: "practice",
      name: "Practice",
      component: Practice
    },
    {
      path: "login-index",
      name: "LoginIndex",
      component: LoginIndex
    },
    {
      path: "deck-detail/:id(\\d+)",
      name: "DeckDetail",
      component: DeckDetail
    },
    {
      path: "perform-form/:id(\\d+)",
      name: "PerformForm",
      component: PerformForm
    },
    {
      path: "answer-index",
      name: "AnswerIndex",
      component: AnswerIndex
    },
    {
      path: "perform-detail/:id(\\d+)",
      name: "PerformDetail",
      component: PerformDetail
    },
    {
      path: "deck-add",
      name: "DeckAdd",
      component: DeckForm,
      meta: { accessibleTo: ["NORMAL"] }
    },
    {
      path: "deck-edit/:id(\\d+)",
      name: "DeckEdit",
      component: DeckForm,
      meta: { accessibleTo: ["NORMAL"] }
    },

    {
      path: "user-index",
      name: "UserIndex",
      component: UserIndex,
      meta: { accessibleTo: ["NORMAL"] }
    }
  ]
};

// {
//   path: "auth/instagram",
//   name: "AuthInstagram",
//   component: AuthInstagram
// },
// Decks

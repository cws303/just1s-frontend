import Web from "@/views/Web/Web.vue";
import LoginIndex from "@/views/Web/LoginIndex/LoginIndex.vue";
import PerformForm from "@/views/Web/PerformForm/PerformForm.vue";
import PerformDetail from "@/views/Web/PerformDetail/PerformDetail.vue";
import AnswerIndex from "@/views/Web/AnswerIndex/AnswerIndex.vue";
import DeckForm from "@/views/Web/DeckForm/DeckForm.vue";
import UserIndex from "@/views/Web/UserIndex/UserIndex.vue";
import Practice from "@/views/Web/Practice/Practice.vue";
import Home from "@/views/Web/Home/Home.vue";
import { RouteConfig } from "vue-router";

const routes: RouteConfig = {
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
      path: "perform-form/:id",
      name: "PerformForm",
      component: PerformForm
    },
    {
      path: "perform-detail/:id",
      name: "PerformDetail",
      component: PerformDetail
    },
    {
      path: "answer-index",
      name: "AnswerIndex",
      component: AnswerIndex
    },
    {
      path: "user-index",
      name: "UserIndex",
      component: UserIndex,
      meta: { accessibleTo: ["NORMAL"] }
    }
  ]
};

export default routes;

// {
//   path: "auth/instagram",
//   name: "AuthInstagram",
//   component: AuthInstagram
// },
// Decks

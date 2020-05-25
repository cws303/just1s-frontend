import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
export const store = new Vuex.Store({
  state: {
    accessToken: "",
    currentUser: undefined,
    isInitLoading: false
  },
  mutations: {
    setAccessToken(state, token) {
      state.accessToken = token;
    },
    setCurrentUser(state, user) {
      state.currentUser = user;
    },
    setIsInitLoading(state, boolean) {
      state.isInitLoading = boolean;
    }
  },
  getters: {
    accessToken: state => state.accessToken,
    currentUser: state => state.currentUser,
    isInitLoading: state => state.isInitLoading
  },
  actions: {
    getTokenFromUser({ commit }, existToken) {
      if (existToken) {
        this.$httpService
          .get("/auth/whoami", {
            headers: {
              Authorization: `Bearer ${existToken}`
            }
          })
          .then(res => {
            const user = res.data;
            if (user.id === undefined) {
              localStorage.removeItem("accessToken");
              return;
            }
            commit("setAccessToken", existToken);
            commit("setCurrentUser", user);
          });
      } else {
        commit("setAccessToken", null);
        commit("setCurrentUser", null);
      }
    }
  }
});

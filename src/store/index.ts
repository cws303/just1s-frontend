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
      console.debug("[vuex:setAccessToken]", token);
      state.accessToken = token;
    },
    setCurrentUser(state, user) {
      state.currentUser = user;
    },
    setIsInitLoading(state, boolean) {
      console.debug("[vuex:setIsInitLoading]", boolean);
      state.isInitLoading = boolean;
    }
  },
  getters: {
    accessToken: state => state.accessToken,
    currentUser: state => state.currentUser,
    isInitLoading: state => state.isInitLoading
  },
  modules: {}
});

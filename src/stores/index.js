import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
export const store = new Vuex.Store({
  state: {
    count: 0,
    accessToken: "",
    currentUser: undefined
  },
  mutations: {
    increment(state) {
      state.count++;
    },
    setAccessToken(state, token) {
      state.accessToken = token;
    },
    setCurrentUser(state, user) {
      state.currentUser = user;
    }
  },
  getters: {
    accessToken: state => state.accessToken,
    currentUser: state => state.currentUser
  }
});

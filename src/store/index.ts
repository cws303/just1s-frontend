import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const baseURLs:any = {
  // local: "/api",
  local: "http://localhost:3000",
  development: "https://api.just1s.xyz",
  production: "https://api.just1s.xyz"
};


// export default new Vuex.Store({
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
  actions: {
    getTokenFromUser({ commit }, existToken) {
      if (existToken) {
        const options = {
          baseURL: baseURLs[process.env.NODE_ENV],
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        };
        let http = axios.create(options);

        // this.$httpService
        http
          .get("/auth/whoami", {
            headers: {
              Authorization: `Bearer ${existToken}`
            }
          })
          .then((res:any)=> {
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
  },
  getters: {
    accessToken: state => state.accessToken,
    currentUser: state => state.currentUser,
    isInitLoading: state => state.isInitLoading
  },
  modules: {
  }
})

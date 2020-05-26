import axios from "axios";
import { store } from "@/stores/index";
import * as qs from "qs";

const baseURLs = {
  // local: "/api",
  development: "/api",
  // development: "https://api.just1s.xyz",
  production: "https://api.just1s.xyz"
};

let http = null; // not possible to create a private property in JavaScript, so we move it outside of the class, so that it's only accessible within this module

class APIProvider {
  constructor() {
    const options = {
      baseURL: baseURLs[process.env.NODE_ENV],
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    };

    http = axios.create(options);
    this.loadAuthorizationTokenToHeader();
  }

  loadAuthorizationTokenToHeader() {
    const accessToken = store.getters["accessToken"];
    if (accessToken != "") {
      // http.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    }
  }

  async checkToken(token) {
    if (store.getters["isInitLoading"] === true) {
      return Promise.resolve(null);
    }

    if (store.getters["currentUser"]) {
      return Promise.resolve(true);
    }
    if (!token) {
      store.commit("setAccessToken", null);
      store.commit("setCurrentUser", null);
      return Promise.resolve(false);
    }
    store.commit("setIsInitLoading", true);
    let res;
    try {
      res = await this.get("/auth/whoami", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } finally {
      store.commit("setIsInitLoading", false);
    }

    const user = res.data;
    if (user.id === undefined) {
      localStorage.removeItem("accessToken");
      // wrong token
      return Promise.resolve(false);
    }
    store.commit("setAccessToken", token);
    store.commit("setCurrentUser", user);
    return Promise.resolve(true);
  }

  async login(email, password) {
    try {
      const res = await this.post("auth/login", {
        email: email,
        password: password
      });
      store.commit("setAccessToken", res.data.access_token);
      store.commit("setCurrentUser", res.data.user);
      localStorage.setItem("accessToken", res.data.access_token);
      this.loadAuthorizationTokenToHeader();
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async snsLogin(profile) {
    try {
      console.log(qs.stringify(profile));
      const res = await this.post("auth/sns_login", profile);
      store.commit("setAccessToken", res.data.access_token);
      store.commit("setCurrentUser", res.data.user);
      localStorage.setItem("accessToken", res.data.access_token);
      this.loadAuthorizationTokenToHeader();
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  logout() {
    store.commit("setAccessToken", null);
    store.commit("setCurrentUser", null);
    localStorage.setItem("accessToken", undefined);
    delete http.defaults.headers.common.Authorization;
  }

  get(url, params) {
    return http.get(url, params);
  }

  post(url, params) {
    return http.post(url, qs.stringify(params), {
      headers: {
        "Content-type": "application/x-www-form-urlencoded"
      }
    });
  }

  put(url, params) {
    return http.put(url, qs.stringify(params), {
      "Content-type": "application/x-www-form-urlencoded"
    });
  }

  delete(url, params) {
    return http.delete(url, params);
  }
}

export default new APIProvider({});

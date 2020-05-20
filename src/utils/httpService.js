import axios from "axios";
import { store } from "@/stores/index";

const baseURLs = {
  // local: "/api",
  development: "/api",
  production: "https://api.just1s.xyz"
};

let http = null; // not possible to create a private property in JavaScript, so we move it outside of the class, so that it's only accessible within this module

class APIProvider {
  constructor() {
    const options = {
      baseURL: baseURLs[process.env.NODE_ENV],
      headers: {}
    };

    http = axios.create(options);
    this.loadAuthorizationTokenToHeader();
  }

  loadAuthorizationTokenToHeader() {
    const accessToken = store.getters["accessToken"];
    if (accessToken != "") {
      http.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    }
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

  logout() {
    store.commit("setAccessToken", "");
    store.commit("setCurrentUser", undefined);
    localStorage.setItem("accessToken", undefined);
    delete http.defaults.headers.common.Authorization;
  }

  get(url, params) {
    return http.get(url, params);
  }

  post(url, params) {
    return http.post(url, params);
  }

  put(url, params) {
    return http.put(url, params);
  }

  delete(url, params) {
    return http.delete(url, params);
  }
}

export default new APIProvider({});

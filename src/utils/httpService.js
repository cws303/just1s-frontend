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
  headers = {
    "Content-Type": "application/x-www-form-urlencoded"
  };
  constructor() {
    http = axios.create({
      baseURL: baseURLs[process.env.NODE_ENV],
      headers: this.headers
    });
  }

  loadAuthorizationTokenToHeader() {
    const accessToken = store.getters["accessToken"];
    if (accessToken != "") {
      this.headers["Authorization"] = `Bearer ${accessToken}`;
    }
  }

  async checkToken() {
    if (store.getters["isInitLoading"] === true) {
      while (true) {
        if (store.getters["isInitLoading"] === false) {
          return Promise.resolve(null);
        }
        console.debug("이미 진행 중인 checkToken이 있습니다. 대기 ...");
        await new Promise(r => setTimeout(r, 500));
      }
    }

    if (store.getters["currentUser"]) {
      return Promise.resolve(true);
    }
    const token = localStorage.getItem("accessToken");
    if (!token) {
      store.commit("setAccessToken", null);
      store.commit("setCurrentUser", null);
      return Promise.resolve(false);
    }
    store.commit("setIsInitLoading", true);
    let res;
    try {
      res = await http.get("/auth/whoami", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const user = res.data;
      if (user.id === undefined) {
        localStorage.removeItem("accessToken");
        // wrong token
        return Promise.resolve(false);
      }
      store.commit("setAccessToken", token);
      store.commit("setCurrentUser", user);
      this.loadAuthorizationTokenToHeader();
    } catch (e) {
      // TODO : handle catch
      // 토큰 체크 중 서버 에러 -> 기존 토큰 유지, 로그인처리X, 무시
      throw e;
    } finally {
      store.commit("setIsInitLoading", false);
    }

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
    delete this.headers["Authorization"];
  }

  async get(url, params) {
    await this.checkToken();
    return http.get(url, {
      params: params,
      headers: this.headers
    });
  }

  async post(url, params) {
    await this.checkToken();
    return http.post(url, qs.stringify(params), {
      headers: this.headers
    });
  }

  async put(url, params) {
    await this.checkToken();
    return http.put(url, qs.stringify(params), {
      headers: this.headers
    });
  }

  async delete(url, params) {
    await this.checkToken();
    return http.delete(url, params);
  }

  async imageUpload(file) {
    const formData = new FormData();
    formData.append("image", file);
    return http.post("files/image?type=fake", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  }
}

export default new APIProvider({});

import axios from "axios";
import * as qs from "qs";
import _Vue from "vue";
import { store } from "@/store";

// let http: AxiosInstance; // not possible to create a private property in JavaScript, so we move it outside of the class, so that it's only accessible within this module
const baseURLs: any = {
  // local: "/api",
  local: "/api",
  development: "https://api.just1s.xyz",
  production: "https://api.just1s.xyz"
};

class VueHttpService {
  static installed: boolean = false;

  static install(Vue: typeof _Vue) {
    if (VueHttpService.installed && _Vue === Vue) {
      return;
    }
    VueHttpService.installed = true;

    Vue.prototype.$httpService = {
      app: Vue,
      options: {
        baseURL: baseURLs[process.env.NODE_ENV],
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      },
      async checkToken() {
        console.log("checkToken START");
        // CRITICAL SECTION
        if (store.getters["isInitLoading"] === true) {
          while (true) {
            await new Promise(resolve => setTimeout(resolve, 100));
            if (store.getters["isInitLoading"] === false) {
              break;
            }
          }
          return Promise.resolve(null);
        }
        if (store.getters["currentUser"]) {
          return Promise.resolve(true);
        }

        let token = "";
        const tokenFromLocalStorage = localStorage.getItem("accessToken");
        if (
          store.getters["accessToken"] &&
          store.getters["accessToken"] !== ""
        ) {
          token = store.getters["accessToken"];
        } else if (tokenFromLocalStorage && tokenFromLocalStorage !== "") {
          token = tokenFromLocalStorage;
        }

        if (!token) {
          store.commit("setAccessToken", null);
          store.commit("setCurrentUser", null);
          return Promise.resolve(false);
        }

        store.commit("setIsInitLoading", true);
        let res;
        try {
          res = await axios.get("/auth/whoami", {
            baseURL: baseURLs[process.env.NODE_ENV],
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        } catch (error) {
          if (error.response?.status == 401) {
            const refreshToken = localStorage.getItem("refreshToken");
            if (refreshToken && refreshToken !== "") {
              res = await axios.post(
                "/auth/refresh",
                {
                  token: refreshToken
                },
                {
                  baseURL: baseURLs[process.env.NODE_ENV]
                }
              );
            }
          } else {
            console.log("Error", error.message);

            return Promise.resolve(false);
          }
        } finally {
          store.commit("setIsInitLoading", false);
        }

        if (res === undefined) {
          console.error("기존 유저 조회 실패");
          return Promise.resolve(false);
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
      },

      async login(email: any, password: any) {
        try {
          const res = await this.post("auth/login", {
            email: email,
            password: password
          });
          store.commit("setAccessToken", res.data.accessToken);
          store.commit("setCurrentUser", res.data.user);
          localStorage.setItem("accessToken", res.data.accessToken);
          localStorage.setItem("refreshToken", res.data.refreshToken);
          this.loadAuthorizationTokenToHeader();
          return true;
        } catch (e) {
          console.log(e);
          return false;
        }
      },

      async snsLogin(profile: any) {
        try {
          const res = await this.post("auth/sns_login", profile);
          store.commit("setAccessToken", res.data.accessToken);
          store.commit("setCurrentUser", res.data.user);
          localStorage.setItem("accessToken", res.data.accessToken);
          localStorage.setItem("refreshToken", res.data.refreshToken);
          this.loadAuthorizationTokenToHeader();
          return true;
        } catch (e) {
          console.log(e);
          return false;
        }
      },

      async logout() {
        await this.post("auth/logout");
        store.commit("setAccessToken", null);
        store.commit("setCurrentUser", null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      },

      async get(url: any, params: any) {
        await this.checkToken();
        const options = { ...this.options };

        const accessToken = store.getters["accessToken"];
        console.log("accessToken in GET", accessToken);
        if (accessToken && accessToken != "") {
          options.headers["Authorization"] = `Bearer ${accessToken}`;
        }

        const http = axios.create(options);
        return http.get(url, { params: params });
      },

      async post(url: any, params: any) {
        const options = { ...this.options };
        const accessToken = store.getters["accessToken"];

        if (accessToken && accessToken != "") {
          options.headers["Authorization"] = `Bearer ${accessToken}`;
        }

        const http = axios.create(options);
        return http.post(url, qs.stringify(params), {
          headers: {
            "Content-type": "application/x-www-form-urlencoded"
          }
        });
      },

      async put(url: any, params: any) {
        const options = { ...this.options };
        const accessToken = store.getters["accessToken"];
        if (accessToken && accessToken != "") {
          options.headers["Authorization"] = `Bearer ${accessToken}`;
        }

        const http = axios.create(options);
        return http.put(url, qs.stringify(params), {
          headers: {
            "Content-type": "application/x-www-form-urlencoded"
          }
        });
      },

      async delete(url: any, params: any) {
        const options = { ...this.options };
        const accessToken = store.getters["accessToken"];
        if (accessToken && accessToken != "") {
          options.headers["Authorization"] = `Bearer ${accessToken}`;
        }

        const http = axios.create(options);
        return http.delete(url, params);
      },

      imageUpload(file: any) {
        const formData = new FormData();
        formData.append("image", file);
        const options = {
          baseURL: baseURLs[process.env.NODE_ENV],
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        };
        const http = axios.create(options);
        return http.post("files/image?type=fake", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
      },
      loadAuthorizationTokenToHeader() {
        const accessToken = store.getters["accessToken"];
        if (accessToken != "") {
          // http.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        }
      }
    };
  }
}

if (typeof window !== "undefined" && window.Vue) {
  window.Vue.use(VueHttpService);
}

export default VueHttpService;

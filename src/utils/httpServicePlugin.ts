import axios from "axios";
import {AxiosInstance} from "axios";
import { store } from "@/store";
import * as qs from "qs";
import _Vue from "vue";


const baseURLs:any = {
  // local: "/api",
  local: "/api",
  development: "https://api.just1s.xyz",
  production: "https://api.just1s.xyz"
};

let http:AxiosInstance; // not possible to create a private property in JavaScript, so we move it outside of the class, so that it's only accessible within this module

const httpService = {
  // The install method is all that needs to exist on the plugin object.
  // It takes the global Vue object as well as user-defined options.
  install(Vue: typeof _Vue, options?: any) {
    // We call Vue.mixin() here to inject functionality into all components.
      Vue.mixin({
      // Anything added to a mixin will be injected into all components.
      // In this case, the mounted() method runs when the component is added to the DOM.
        mounted: function() {
          // console.log('Mounted!');
          const options = {
            baseURL: baseURLs[process.env.NODE_ENV],
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          };      
          http = axios.create(options);
          // this.loadAuthorizationTokenToHeader();
          const accessToken = store.getters["accessToken"];
        },

        // methods: () => {
        //   loadAuthorizationTokenToHeader() {
        //     const accessToken = store.getters["accessToken"];
        //     if (accessToken != "") {
        //       // http.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        //     }
        //   }
        // }
    });

    Vue.prototype.$httpService = {
      async checkToken(token:any) {
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
      },
    
      async login(email:any, password:any) {
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
      },
    
      async snsLogin(profile:any) {
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
      },
    
      logout() {
        store.commit("setAccessToken", null);
        store.commit("setCurrentUser", null);
        localStorage.setItem("accessToken", '');
        delete http.defaults.headers.common.Authorization;
      },
    
      get(url:any, params:any) {
        const options = {
          baseURL: baseURLs[process.env.NODE_ENV],
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        };
        http = axios.create(options);
        return http.get(url, params);
      },
    
      post(url:any, params:any) {
        const options = {
          baseURL: baseURLs[process.env.NODE_ENV],
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        };
        http = axios.create(options);
        return http.post(url, qs.stringify(params), {
          headers: {
            "Content-type": "application/x-www-form-urlencoded"
          }
        });
      },
    
      put(url:any, params:any) {
        const options = {
          baseURL: baseURLs[process.env.NODE_ENV],
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        };
        http = axios.create(options);
        return http.put(url, qs.stringify(params), {
          headers: {
            "Content-type": "application/x-www-form-urlencoded"
          }
        });
      },
    
      delete(url:any, params:any) {
        const options = {
          baseURL: baseURLs[process.env.NODE_ENV],
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        };
        http = axios.create(options);
        return http.delete(url, params);
      },
    
      imageUpload(file:any) {
        const formData = new FormData();
        formData.append("image", file);
        const options = {
          baseURL: baseURLs[process.env.NODE_ENV],
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        };
        http = axios.create(options);
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
  },
};

export default httpService;



// import axios from "axios";
// import { store } from "@/store";
// import * as qs from "qs";

// const baseURLs: any = {
//   // local: "/api",
//   local: "/api",
//   development: "https://api.just1s.xyz",
//   production: "https://api.just1s.xyz"
// };

// let http: any = null; // not possible to create a private property in JavaScript, so we move it outside of the class, so that it's only accessible within this module

// class APIProvider {
//   constructor() {
//     const options = {
//       baseURL: baseURLs[process.env.NODE_ENV],
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded"
//       }
//     };

//     http = axios.create(options);
//     this.loadAuthorizationTokenToHeader();
//   }

//   loadAuthorizationTokenToHeader() {
//     const accessToken = store.getters["accessToken"];
//     if (accessToken != "") {
//       // http.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
//     }
//   }

//   async checkToken(token: any) {
//     if (store.getters["isInitLoading"] === true) {
//       return Promise.resolve(null);
//     }

//     if (store.getters["currentUser"]) {
//       return Promise.resolve(true);
//     }
//     if (!token) {
//       store.commit("setAccessToken", null);
//       store.commit("setCurrentUser", null);
//       return Promise.resolve(false);
//     }
//     store.commit("setIsInitLoading", true);
//     let res;
//     try {
//       res = await axios.get("/auth/whoami", {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//     } catch (error) {
//       if (error.response?.status == 401) {
//         console.log("ref", this._vm.$cookies.get("refreshToken"));
//         if (
//           this.$cookies.get("refreshToken") &&
//           this.$cookies.get("refreshToken") !== ""
//         ) {
//           res = await axios.post("/auth/refresh", {
//             params: {
//               token: localStorage.getItem("refreshToken")
//             }
//           });
//         }
//       } else {
//         console.log("Error", error.message);
//       }
//     } finally {
//       store.commit("setIsInitLoading", false);
//     }

//     // const user = res.data;
//     // if (user.id === undefined) {
//     //   localStorage.removeItem("accessToken");
//     //   // wrong token
//     //   return Promise.resolve(false);
//     // }
//     // store.commit("setAccessToken", token);
//     // store.commit("setCurrentUser", user);
//     return Promise.resolve(true);
//   }

//   async login(email: any, password: any) {
//     try {
//       const res = await this.post("auth/login", {
//         email: email,
//         password: password
//       });
//       store.commit("setAccessToken", res.data.access_token);
//       store.commit("setCurrentUser", res.data.user);
//       localStorage.setItem("accessToken", res.data.access_token);
//       this.loadAuthorizationTokenToHeader();
//       return true;
//     } catch (e) {
//       console.log(e);
//       return false;
//     }
//   }

//   async snsLogin(profile: any) {
//     try {
//       console.log(qs.stringify(profile));
//       const res = await this.post("auth/sns_login", profile);
//       store.commit("setAccessToken", res.data.access_token);
//       store.commit("setCurrentUser", res.data.user);
//       localStorage.setItem("accessToken", res.data.access_token);
//       this.loadAuthorizationTokenToHeader();
//       return true;
//     } catch (e) {
//       console.log(e);
//       return false;
//     }
//   }

//   logout() {
//     store.commit("setAccessToken", null);
//     store.commit("setCurrentUser", null);
//     localStorage.setItem("accessToken", "");
//     delete http.defaults.headers.common.Authorization;
//   }

//   get(url: any, params: any) {
//     return http.get(url, params);
//   }

//   post(url: any, params: any) {
//     return http.post(url, qs.stringify(params), {
//       headers: {
//         "Content-type": "application/x-www-form-urlencoded"
//       }
//     });
//   }

//   put(url: any, params: any) {
//     return http.put(url, qs.stringify(params), {
//       "Content-type": "application/x-www-form-urlencoded"
//     });
//   }

//   delete(url: any, params: any) {
//     return http.delete(url, params);
//   }

//   imageUpload(file: any) {
//     const formData = new FormData();
//     formData.append("image", file);
//     return http.post("files/image?type=fake", formData, {
//       headers: {
//         "Content-Type": "multipart/form-data"
//       }
//     });
//   }
// }

// export default new APIProvider();

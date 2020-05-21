<template>
  <div id="view-auth-instagram">..</div>
</template>

<script>
import * as axios from "axios";
export default {
  name: "AuthInstagram",
  data() {
    return {
      msg: "AuthInstagram",
      code: ""
    };
  },
  methods: {
    async getAccessTokenFromCode(code) {
      if (!code) {
        throw Error("코드없음");
      }
      const url = "https://api.instagram.com/oauth/access_token";
      return axios.post(url, {
        client_id: "1146076062397676",
        grant_type: "authorization_code",
        redirect_uri: "https://www.just1s.xyz/auth/instagram",
        code: code.replace("#_", "")
      });
    },
    async getUser(accessToken, userId) {
      const url = "https://graph.instagram.com";
      return axios.get(url, {
        fields: "id,username,profile_pic",
        access_token: accessToken
      });
    },
    async init() {
      const res = await this.getAccessTokenFromCode(this.$route.query.code);
      const user = await this.getUser(res.access_token, res.user_id);
      console.log(user);
      return user;
    }
  },
  created() {
    try {
      this.init().then(res => {
        console.log("드디어");
        window.postMessage(user, window.opener);
      });
    } catch (error) {
      console.log("try catch");
      console.log(error);
    }
  }
};
function receiveMessage(event) {
  console.log("received !!!!!");
  console.log(event);
  if (event.origin !== "https://www.just1s.xyz") return;

  // event.source is popup
  // event.data is "hi there yourself!  the secret response is: rheeeeet!"
}
window.addEventListener("message", receiveMessage, false);
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped></style>

{ "id": "17841403488332647", "username": "kimjbstar" }

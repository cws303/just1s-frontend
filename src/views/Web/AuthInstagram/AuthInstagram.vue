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
      step: 0
    };
  },
  methods: {
    async getAccessTokenFromCode(code) {
      if (!code) {
        throw Error("코드없음");
      }
      const url = "https://api.instagram.com/oauth/access_token";
      const fields = {
        client_id: "1146076062397676",
        client_secret: "d4234fc4daf1b46c9d622b6c975a9779",
        grant_type: "authorization_code",
        redirect_uri: "https://www.just1s.xyz/auth/instagram",
        code: code.replace("#_", "")
      };

      const res = await axios.post(url, fields, {
        "Content-Type": "application/x-www-form-urlencoded"
      });
      const getUserURL = `https://graph.instagram.com/me/media?fields=id,media_type,media_url,username,timestamp&access_token=${res.data.access_token}`;

      const res2 = await axios.get(getUserURL);
      console.log("인스타그램 앱 검수 필요 !!", res2);
    }
  },
  created() {
    if (this.$route.query.code === undefined) {
      alert("잘못된 접근입니다.");
      this.$router.push("/");
    }
    this.getAccessTokenFromCode(this.$route.query.code)
      .then(() => {})
      .catch(e => {
        console.log(e);
      })
      .finally(() => {
        this.$router.push("/");
      });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped></style>

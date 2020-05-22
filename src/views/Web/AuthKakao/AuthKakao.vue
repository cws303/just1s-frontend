<template>
  <div id="view-auth-kakao">..</div>
</template>

<script>
import * as axios from "axios";
export default {
  name: "AuthKakao",
  data() {
    return {
      msg: "AuthKakao",
      step: 0
    };
  },
  methods: {
    async getAccessTokenFromCode(code) {
      if (!code) {
        throw Error("코드없음");
      }

      const url = "https://kauth.kakao.com/oauth/token";
      const fields = {
        grant_type: "authorization_code",
        client_id: "69339eb8ca5e4e95fa9040ee4c8fea1a",
        // client_secret: "",
        redirect_uri: "https://www.just1s.xyz/auth/kakao",
        code: code
      };

      let form = new FormData();
      for (let [key, value] of Object.entries(fields)) {
        form.append(key, value);
      }

      const res = await axios.post(url, form);
      // access_token	사용자 액세스 토큰 값
      // token_type	토큰 타입, "bearer"로 고정
      // refresh_token	사용자 리프레시 토큰 값
      // expires_in	토큰 만료 시간(초)
      // scope	인증된 사용자의 정보 조회 권한 범위

      const res2 = await axios.get("https://kapi.kakao.com/v2/user/me", {
        headers: {
          Authorization: `Bearer ${res.data.access_token}`,
          "Content-type": "application/x-www-form-urlencoded;charset=utf-8"
        }
      });
      console.log("res2", res2);
      alert(JSON.stringify(res2.data));
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

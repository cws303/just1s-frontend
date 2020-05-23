<template>
  <div id="view-login-index">
    <b-row>
      <b-col cols="12" align="center">
        <h1>10초만에 가입하세요.</h1>
      </b-col>
    </b-row>
    <b-row class="mt-5">
      <b-col cols="12" align="center">
        <b-button @click="logInWithFacebook">페이스북 로그인</b-button>
      </b-col>
    </b-row>
    <b-row class="mt-5">
      <b-col cols="12" align="center">
        <b-button @click="loginWithKakao">카카오 로그인</b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import * as axios from "axios";
export default {
  name: "LoginIndex",
  data() {
    return {
      msg: "LoginIndex"
    };
  },
  methods: {
    initKakao() {
      const clientID = "868ec1f6f25e37a7723addd94d4ef6b2";
      const scriptId = "kakao_login";
      const isExist = !!document.getElementById(scriptId);
      if (!isExist) {
        const script = document.createElement("script");
        script.src = "https://developers.kakao.com/sdk/js/kakao.min.js";
        script.onload = () => {
          Kakao.init(clientID);
        };
        script.onerror = error => {
          console.log("카카오 로드중 에러 발생");
        };
        script.id = scriptId;
        document.body.appendChild(script);
      } else {
        if (Kakao.isInitialized() === false) {
          Kakao.init(clientID);
        }
      }
    },
    loginWithKakao() {
      if (Kakao.isInitialized() === false) {
        console.log("카카오 모듈이 로드되지 않았습니다.");
        return;
      }
      const httpService = this.$httpService;
      const router = this.$router;
      Kakao.Auth.login({
        success: authObj => {
          console.log(authObj);
          Kakao.API.request({
            url: "/v2/user/me",
            success: function(response) {
              console.log(response.id);
              console.log(response.properties.nickname);
              console.log(response.properties.profile_image);

              const isSucceed = httpService
                .snsLogin({
                  type: "KAKAO",
                  id: response.id,
                  name: response.properties.nickname,
                  imgUrl: response.properties.profile_image
                })
                .then(isSucceed => {
                  if (isSucceed === false) {
                    alert("로그인에 실패하였습니다.");
                    return;
                  }
                  router.push({ name: "Home" });
                });
            },
            fail: function(error) {
              console.log(error);
              alert("카카오 로그인에 실패했습니다.");
            }
          });
        },
        fail: err => {
          console.log(err);
          alert("카카오 로그인에 실패했습니다.");
        }
      });
    },
    loginWithInstagram() {
      const clientID = "1146076062397676";
      const redirectURI = "https://www.just1s.xyz/auth/instagram";
      const url = `https://api.instagram.com/oauth/authorize/?client_id=${clientID}&redirect_uri=${redirectURI}&scope=user_profile,user_media&response_type=code`;
      location.href = url;
    },
    async logInWithFacebook() {
      const httpService = this.$httpService;
      const router = this.$router;
      window.FB.login(function(response) {
        console.log(response);
        if (response.authResponse) {
          window.FB.api(
            "/me",
            {
              fields: "id,name,picture",
              access_token: response.authResponse.accessToken
            },
            function(profile) {
              if (profile.id) {
                httpService
                  .snsLogin({
                    type: "FACEBOOK",
                    id: profile.id,
                    name: profile.name,
                    imgUrl: profile.picture.data.url
                  })
                  .then(isSucceed => {
                    if (isSucceed === false) {
                      alert("로그인에 실패하였습니다.");
                      return;
                    }
                    router.push({ name: "Home" });
                  });

                console.log(profile.id);
                console.log(profile.name);
                console.log(profile.picture.data.url);
                // /auth/facebook
                // param = {
                //   accessToken : response.authResponse.accessToken
                //   profile: profile
                // }
              }
            }
          );
        } else {
          alert("페이스북 로그인에 실패했습니다.");
        }
      });
      return false;
    }
  },
  created() {},
  mounted() {
    (function(d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
    window.fbAsyncInit = function() {
      window.FB.init({
        appId: "587072722189448", //You will need to change this
        cookie: true, // This is important, it's not enabled by default
        version: "v7.0"
      });
    };
    this.initKakao();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped></style>

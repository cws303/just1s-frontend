<template>
  <div id="view-login-index">
    <div class="text-desc">10초만에 가입하세요</div>
    <div class="btn-facebook" @click="logInWithFacebook">Facebook</div>
    <div class="btn-kakao" @click="loginWithKakao">Kakao</div>
  </div>
</template>

<script>
import * as axios from "axios";
export default {
  name: "LoginIndex",
  data() {
    return {
      msg: "LoginIndex",
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
        script.onerror = (error) => {
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
        success: (authObj) => {
          Kakao.API.request({
            url: "/v2/user/me",
            success: function (response) {
              const isSucceed = httpService
                .snsLogin({
                  type: "KAKAO",
                  id: response.id,
                  name: response.properties.nickname,
                  imgUrl: response.properties.profile_image,
                })
                .then((isSucceed) => {
                  if (isSucceed === false) {
                    alert("로그인에 실패하였습니다.");
                    return;
                  }
                  router.push({ name: "Home" });
                });
            },
            fail: function (error) {
              console.log(error);
              alert("카카오 로그인에 실패했습니다.");
            },
          });
        },
        fail: (err) => {
          console.log(err);
          alert("카카오 로그인에 실패했습니다.");
        },
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
      window.FB.login(function (response) {
        console.log(response);
        if (response.authResponse) {
          window.FB.api(
            "/me",
            {
              fields: "id,name,picture",
              access_token: response.authResponse.accessToken,
            },
            function (profile) {
              if (profile.id) {
                httpService
                  .snsLogin({
                    type: "FACEBOOK",
                    id: profile.id,
                    name: profile.name,
                    imgUrl: profile.picture.data.url,
                  })
                  .then((isSucceed) => {
                    if (isSucceed === false) {
                      alert("로그인에 실패하였습니다.");
                      return;
                    }
                    router.push({ name: "Home" });
                  });
              }
            }
          );
        } else {
          alert("페이스북 로그인에 실패했습니다.");
        }
      });
      return false;
    },
  },
  created() {},
  mounted() {
    (function (d, s, id) {
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
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: "587072722189448", //You will need to change this
        cookie: true, // This is important, it's not enabled by default
        version: "v7.0",
      });
    };
    this.initKakao();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
#view-login-index {
  @include content-row;
  display: flex;
  flex-direction: column;
  align-items: center;

  @include desktop {
    padding-top: 20px;
  }

  @include mobile {
    padding-top: vw-base(30px);
  }

  .text-desc {
    @include desktop {
      font-size: 30px;
    }
    @include mobile {
      font-size: vw-base(60px);
    }
  }
  .btn-facebook {
    @include btn-primary;
    background-color: #1877f2;

    @include desktop {
      margin-top: 20px;
    }

    @include mobile {
      margin-top: vw-base(30px);
    }
  }
  .btn-kakao {
    @include btn-primary;
    background-color: #ffe812;
    color: $color-black;

    @include desktop {
      margin-top: 20px;
    }

    @include mobile {
      margin-top: vw-base(30px);
    }
  }
}
</style>

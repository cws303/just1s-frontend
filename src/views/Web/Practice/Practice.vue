<template>
  <div class="practice">
    <p>youtube player test.</p>
    <youtube
      :video-id="videoId"
      width="0"
      height="0"
      ref="youtube"
      @playing="playing"
      @paused="paused"
      @ended="ended"
      @buffering="buffering"
    ></youtube>
    <div class="btn-play" v-if="currentState != 'playing'" @click="playVideo">
      play
    </div>
    <div>현재 : {{ currentState }}</div>
    <hr />
    <b-button @click="logInWithFacebook">페이스북 로그인</b-button>
    <b-button @click="loginWithKakao">카카오 로그인</b-button>
  </div>
</template>

<script>
import * as axios from "axios";
export default {
  name: "Practice",
  data() {
    return {
      videoId: "kxk8MOEmLEk",
      currentState: "",
      second: 0
    };
  },
  created() {},
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
      Kakao.Auth.login({
        success: authObj => {
          console.log(authObj);
          Kakao.API.request({
            url: "/v2/user/me",
            success: function(response) {
              console.log(response.id);
              console.log(response.properties.nickname);
              console.log(response.properties.profile_image);
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
    },
    async playVideo() {
      this.player.loadVideoById({
        videoId: this.videoId,
        startSeconds: this.second,
        endSeconds: this.second + 1,
        suggestedQuality: "small"
      });
      await this.player.unMute();
      await this.player.setVolume(100);
      await this.player.playVideo();
    },
    playing() {
      console.log("playing", +new Date());
      this.currentState = "playing";
    },
    paused() {
      console.log("paused", +new Date());
      this.currentState = "paused";
    },
    ended() {
      console.log("ended", +new Date());
      this.currentState = "ended";
    },
    buffering() {
      console.log("buffering", +new Date());
      this.currentState = "buffering";
    }
  },
  computed: {
    player() {
      return this.$refs.youtube.player;
    }
  },
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
<style lang="scss" scoped>
.btn-play {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: red;
  color: white;
  width: 60px;
  height: 40px;
}
</style>

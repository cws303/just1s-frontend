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
    <div class="btn-play" v-if="currentState != 'playing'" @click="playVideo">play</div>
    <div>현재 : {{ currentState }}</div>
    <hr />
    <b-button @click="logInWithFacebook">Login with Facebook</b-button>
    <b-button>Instagram으로 로그인</b-button>
    <b-button>Kakao으로 로그인</b-button>
    <b-button>Naver으로 로그인</b-button>
    <b-button>Google으로 로그인</b-button>
    <b-button>Apple으로 로그인</b-button>
  </div>
</template>

<script>
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
              console.log(profile);
              if (profile.id) {
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
  beforeCreate() {
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

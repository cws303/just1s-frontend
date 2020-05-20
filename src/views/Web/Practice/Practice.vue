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
    <button class="button" @click="logInWithFacebook">Login with Facebook</button>
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
  methods: {
    async logInWithFacebook() {
      await this.loadFacebookSDK(document, "script", "facebook-jssdk");
      await this.initFacebook();
      console.log(111);
      window.FB.login(function(response) {
        if (response.authResponse) {
          alert("You are logged in &amp; cookie set!");
          // Now you can redirect the user or do an AJAX request to
          // a PHP script that grabs the signed request from the cookie.
        } else {
          alert("User cancelled login or did not fully authorize.");
        }
      });
      return false;
    },
    async initFacebook() {
      window.fbAsyncInit = function() {
        console.log(22);
        window.FB.init({
          appId: "587072722189448", //You will need to change this
          cookie: true, // This is important, it's not enabled by default
          version: "v13.0"
        });
      };
    },
    async loadFacebookSDK(d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
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

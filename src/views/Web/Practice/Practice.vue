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

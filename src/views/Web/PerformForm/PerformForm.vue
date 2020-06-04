<template>
  <div id="view-perform-form">
    <b-row class="mt-3">
      <b-col cols="12" align="center">
        <h1>맞춰보세요ㅎ ({{currentIndex+1}} / {{deck.deckMusics.length}})</h1>
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col cols="12" align="center">
        <b-avatar src="https://placekitten.com/300/300" size="12rem"></b-avatar>
      </b-col>
    </b-row>
    <b-row class="mt-3" v-if="deck.deckMusics && deck.deckMusics[currentIndex]">
      <b-col cols="12" align="center">
        정답 : {{deck.deckMusics[currentIndex].music.title}}
        <br />
        <youtube
          :video-id="deck.deckMusics[currentIndex].music.key"
          width="0"
          height="0"
          ref="youtube"
          @playing="playing"
          @paused="paused"
          @ended="ended"
          @buffering="buffering"
        ></youtube>

        <div style="height:30px">
          <b-button variant="danger" v-show="currentMediaState != 'playing'" @click="playVideo">
            <b-icon
              class="icon-delete align-middle text-center"
              :icon="currentMediaState == 'buffering' ? 'three-dots' : 'play-fill'"
              variant="light"
              @click:stop="goForm(deck.id)"
            ></b-icon>
          </b-button>
        </div>

        <!-- <div>현재 : {{ currentMediaState }}</div> -->
        <br />
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="12" align="center" align-self="end" v-if="state == 'ONGOING'">
        <b-form-input v-model="currentAnswer" placeholder="Enter your name"></b-form-input>
        <b-button variant="primary" @click="submitOne">제출!</b-button>
        <b-button @click="passOne">모르겠음..</b-button>
      </b-col>
      <b-col cols="12" align="center" align-self="end" v-if="state == 'RESULT'">
        {{currentAnswerIsCorrect? '맞음': "틀림ㅠ"}}
        <br />

        <b-button v-if="currentIndex+1 < deck.deckMusics.length" @click="goNextStep">다음</b-button>
        <b-button v-if="currentIndex+1 >= deck.deckMusics.length" @click="goResultIndex">결과보기</b-button>
      </b-col>
    </b-row>
    {{ performDto }}
  </div>
</template>

<script>
import { mapState } from "vuex";
import * as axios from "axios";
export default {
  name: "PerformForm",
  data() {
    return {
      videoId: "kxk8MOEmLEk",
      currentMediaState: "",
      msg: "PerformForm",
      state: "ONGOING",
      // currentUser: {},
      deck: {
        deckMusics: []
      },
      currentIndex: 0,
      currentAnswer: "",
      currentAnswerIsCorrect: null,
      performDto: {
        deckId: null,
        userId: null,
        answers: [] //deckMusicId, answer
      }
    };
  },
  methods: {
    async playVideo() {
      const deckMusic = this.deck.deckMusics[this.currentIndex];
      console.log(deckMusic);
      console.log(this.$refs.youtube.videoId);
      console.log(this.$refs.youtube.player);
      const player = this.$refs.youtube.player;

      // TODO : second duration 비교 체크 후 이상하면 0으로
      player.loadVideoById({
        videoId: deckMusic.music.key,
        startSeconds: deckMusic.second,
        endSeconds: deckMusic.second + 1,
        suggestedQuality: "small"
      });
      await player.unMute();
      await player.setVolume(100);
      await player.playVideo();
    },
    playing() {
      console.log("playing", +new Date());
      this.currentMediaState = "playing";
    },
    paused() {
      console.log("paused", +new Date());
      this.currentMediaState = "paused";
    },
    ended() {
      console.log("ended", +new Date());
      this.currentMediaState = "ended";
    },
    buffering() {
      console.log("buffering", +new Date());
      this.currentMediaState = "buffering";
    },
    goResultIndex() {
      this.$router.push({ name: "ResultIndex" });
    },
    submitAll() {
      console.log("submitAll");
      this.performDto.userId = this.currentUser.id;
      this.performDto.deckId = this.deck.id;
    },
    passOne() {
      this._submitOne("");
    },
    async submitOne() {
      if (this.currentAnswer === "") {
        alert("정답을 입력해주세요.");
        return;
      }
      await this._submitOne(this.currentAnswer);
    },
    async _submitOne(answerText) {
      if (this.currentIndex >= this.deck.deckMusics.length) {
        this.submitAll();
        return;
      }
      this.performDto.answers.push({
        deckMusicId: this.deck.deckMusics[this.currentIndex].id,
        answer: answerText
      });

      const isCorrect = await this.checkCorrect(this.currentAnswer);
      this.currentAnswerIsCorrect = isCorrect;
      this.currentAnswer = "";
      this.state = "RESULT";
    },
    goNextStep() {
      if (this.currentIndex + 1 >= this.deck.deckMusics.length) {
        this.submitAll();
        return;
      }
      this.state = "ONGOING";
      this.currentIndex++;
    },
    async checkCorrect(answer) {
      const musicId = this.deck.deckMusics[this.currentIndex].music.id;
      const res = await this.$httpService.post(
        `/musics/${musicId}/check_correct`,
        {
          answer: this.currentAnswer
        }
      );
      console.log(res);
      return res.data.isCorrect;
    },
    async getOldOne(id) {
      const res = await this.$httpService.get("/decks/" + id);
      if (!res.data) {
        throw Error("데이터 가져오는데 실패");
      }
      this.deck = res.data;
      if (this.deck.deckMusics.length < 1) {
        throw Error("문제가 없음");
      }
      console.log(this.deck);
    }
  },
  created() {
    const deckId = this.$route.params.id;
    if (deckId) {
      this.getOldOne(deckId).catch(e => {
        alert("데이터를 가져오는데 실패했습니다");
        this.$router.push({ name: "Home" });
      });
    }
  },
  computed: mapState(["currentUser"])
};
</script>

<style lang="scss" scoped></style>

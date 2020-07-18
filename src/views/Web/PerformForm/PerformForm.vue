<template>
  <div id="view-perform-form">
    <v-row class="mt-3">
      <v-col cols="12" align="center">
        <h1>{{ deck.title }}</h1>
        ({{ currentIndex + 1 }} / {{ deck.deckMusics.length }})
      </v-col>
    </v-row>
    <v-row class="mt-3">
      <v-col cols="12" align="center">
        <div style="position:relative; width:200px">
          <v-avatar
            :size="200"
            class="deck-music-player"
            v-bind:class="{ 'is-playing': currentMediaState === 'playing' }"
          >
            <v-img :src="deck.repImgUrl" lazy-src="/static/assets/images/placeholder.png" />
          </v-avatar>
          <div
            style="position:absolute; height:100%; width:100%; top:0; left:0; display:flex; justify-content:center; align-items:center"
          >
            <v-btn
              variant="danger"
              v-show="currentMediaState != 'playing'"
              @click="playVideo"
              :ripple="false"
            >재생</v-btn>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row class="mt-3" v-if="deck.deckMusics && deck.deckMusics[currentIndex]">
      <v-col cols="12" align="center" style="height:0">
        <youtube-player
          :video-id="deck.deckMusics[currentIndex].music.key"
          width="1"
          height="1"
          ref="youtube"
          @playing="playing"
          @paused="paused"
          @ended="ended"
          @buffering="buffering"
        ></youtube-player>
        <br />
      </v-col>
    </v-row>
    <v-progress-linear indeterminate color="yellow darken-2"></v-progress-linear>
    <v-row>
      <v-col cols="12" align="center" align-self="end" v-if="state == 'ONGOING'">
        <v-text-field v-model="currentAnswer" placeholder="정답 입력" style="max-width:300px"></v-text-field>
        <v-btn class="mr-3" @click="submitOne">정답!</v-btn>
        <v-btn @click="passOne">PASS</v-btn>
      </v-col>

      <v-col cols="12" align="center" align-self="end" v-if="state == 'RESULT'">
        {{ currentAnswerIsCorrect ? "맞음" : "틀림ㅠ" }}
        <br />

        <v-btn v-if="currentIndex + 1 < deck.deckMusics.length" @click="goNextStep">다음</v-btn>
        <v-btn v-if="currentIndex + 1 >= deck.deckMusics.length" @click="submitAll">결과보기</v-btn>
      </v-col>
    </v-row>
    <div
      class="debug-modal"
      style="border:1px dashed red; position:absolute; bottom:0; right:0; font-size:9px"
    >
      <div
        v-if="deck.deckMusics && deck.deckMusics[currentIndex]"
      >정답 : {{ deck.deckMusics[currentIndex].music.title }}</div>
      <pre>{{ performDto }}</pre>
    </div>
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
      this.currentMediaState = "playing";
    },
    paused() {
      this.currentMediaState = "paused";
    },
    ended() {
      this.currentMediaState = "ended";
    },
    buffering() {
      this.currentMediaState = "buffering";
    },
    async submitAll() {
      console.log("submitAll");
      if (this.currentUser) {
        this.performDto.userId = this.currentUser.id;
      }

      this.performDto.deckId = this.deck.id;
      const res = await this.$httpService.post(
        "decks/perform",
        this.performDto
      );
      console.log(res);
      if (res.status != 201) {
        alert("제출 과정에 문제가 있습니다.");
        reutrn;
      }

      // perform's id
      console.log({ id: res.data.id });
      this.$router.push({ name: "PerformDetail", params: { id: res.data.id } });
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

      if (this.currentAnswer !== "") {
        this.currentAnswer = "";
        this.state = "RESULT";
      } else {
        this.goNextStep();
      }
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
      if (!answer || answer === "") {
        return Promise.resolve(false);
      }
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

<style lang="scss" scoped>
.deck-music-player {
  border: 4px solid gray;
}
.deck-music-player.is-playing {
  border-color: rgb(25, 192, 44);
}
</style>

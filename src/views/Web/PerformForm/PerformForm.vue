<template>
  <div id="view-perform-form">
    <div class="col-title">
      <div class="text-title">{{ deck.title }}</div>
      <div class="text-count">({{ currentIndex + 1 }} / {{ deck.deckMusics.length }})</div>
    </div>

    <div class="container-player">
      <v-img
        class="deck-music-player"
        v-bind:class="{ 'is-playing': currentMediaState === 'playing' }"
        :src="deck.repImgUrl"
        lazy-src="/static/assets/images/placeholder.png"
      />
      <div class="btn-play-wrapper">
        <div class="btn-play" v-show="currentMediaState != 'playing'" @click="playVideo">▶</div>
      </div>
    </div>

    <div v-if="deck.deckMusics && deck.deckMusics[currentIndex]">
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
    </div>

    <div class="container-answer">
      <div class="col-ongoing" v-if="state == 'ONGOING'">
        <input class="input-answer" v-model="currentAnswer" placeholder="정답 입력" />
        <div class="row-btn">
          <div class="btn-submit" @click="submitOne">정답!</div>
          <div class="btn-pass" @click="passOne">PASS</div>
        </div>
      </div>

      <div class="col-result" v-if="state == 'RESULT'">
        <div class="text-result">{{ currentAnswerIsCorrect ? "정답입니다😆" : "틀렸어요😭" }}</div>
        <div class="row-btn">
          <div
            class="btn-next"
            v-if="currentIndex + 1 < deck.deckMusics.length"
            @click="goNextStep"
          >다음</div>
          <div
            class="btn-result"
            v-if="currentIndex + 1 >= deck.deckMusics.length"
            @click="submitAll"
          >결과보기</div>
        </div>
      </div>
    </div>
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
        deckMusics: [],
      },
      currentIndex: 0,
      currentAnswer: "",
      currentAnswerIsCorrect: null,
      performDto: {
        deckId: null,
        userId: null,
        answers: [], //deckMusicId, answer
      },
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
        suggestedQuality: "small",
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
        answer: answerText,
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
          answer: this.currentAnswer,
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
    },
  },
  created() {
    const deckId = this.$route.params.id;
    if (deckId) {
      this.getOldOne(deckId).catch((e) => {
        alert("데이터를 가져오는데 실패했습니다");
        this.$router.push({ name: "Home" });
      });
    }
  },
  computed: mapState(["currentUser"]),
};
</script>

<style lang="scss" scoped>
#view-perform-form {
  @include view-root;
  display: flex;
  flex-direction: column;
  align-items: center;

  .col-title {
    @include content-row;
    display: flex;
    flex-direction: column;
    align-items: center;

    .text-title {
      font-weight: bold;
      @include desktop {
        font-size: 30px;
      }
      @include mobile {
        font-size: vw-base(50px);
      }
    }
    .text-count {
      @include desktop {
        margin-top: 5px;
        font-size: 15px;
      }
      @include mobile {
        margin-top: vw-base(10px);
        font-size: vw-base(25px);
      }
    }
  }
}
.container-player {
  position: relative;

  @include desktop {
    margin-top: 10px;
  }

  @include mobile {
    margin-top: vw-base(20px);
  }

  .deck-music-player {
    border: 4px solid $color-gray;
    border-radius: 50%;

    @include desktop {
      width: 200px;
      height: 200px;
    }
    @include mobile {
      width: vw-base(300px);
      height: vw-base(300px);
    }

    &.is-playing {
      // border-color: rgb(25, 192, 44);
      border-color: $color-primary;
    }
  }

  .btn-play-wrapper {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    .btn-play {
      @include btn-white;
      background-color: transparent;
      @include desktop {
        font-size: 40px;
      }
      @include mobile {
        font-size: vw-base(80px);
      }
    }
  }
}
.container-answer {
  @include content-row;
  display: flex;
  flex-direction: column;

  .col-ongoing {
    display: flex;
    flex-direction: column;

    .input-answer {
      border-bottom: 1px solid $color-gray;

      @include desktop {
        padding: 5px;
        max-width: 300px;
      }
      @include mobile {
        padding: vw-base(10px);
        max-width: vw-base(600px);
      }
    }

    .row-btn {
      display: flex;
      flex-direction: row;

      @include desktop {
        margin-top: 10px;
      }
      @include mobile {
        margin-top: vw-base(20px);
      }

      .btn-submit {
        @include btn-primary;
      }
      .btn-pass {
        margin-left: 10px;
        @include btn-primary;
      }
    }
  }

  .col-result {
    display: flex;
    flex-direction: column;
    .text-result {
      text-align: center;
      @include desktop {
        font-size: 16px;
      }
      @include mobile {
        font-size: vw-base(30px);
      }
    }
    .row-btn {
      display: flex;
      flex-direction: row;

      @include desktop {
        margin-top: 10px;
      }
      @include mobile {
        margin-top: vw-base(20px);
      }

      .btn-next {
        @include btn-primary;
      }
      .btn-result {
        @include btn-primary;
      }
    }
  }
}
</style>

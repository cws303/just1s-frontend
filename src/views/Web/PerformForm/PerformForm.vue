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
        {{deck.deckMusics[currentIndex].music.link}}
        <br />
        {{deck.deckMusics[currentIndex].second}}초
        {{deck.deckMusics[currentIndex].music.title}}/{{deck.deckMusics[currentIndex].music.artist}}
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="12" align="center" align-self="end">
        <b-form-input v-model="currentAnswer" placeholder="Enter your name"></b-form-input>
        <b-button variant="primary" @click="goNext">제출!</b-button>
        <b-button @click="pass">모르겠음..</b-button>
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
      msg: "PerformForm",
      // currentUser: {},
      deck: {
        deckMusics: []
      },
      currentIndex: 0,
      currentAnswer: "",
      performDto: {
        deckId: null,
        userId: null,
        answers: [] //deckMusicId, answer
      }
    };
  },
  methods: {
    submit() {
      console.log("submit");
      this.performDto.userId = this.currentUser.id;
      this.performDto.deckId = this.deck.id;
    },
    pass() {
      this._goNext("");
    },
    goNext() {
      if (this.currentAnswer === "") {
        alert("정답을 입력해주세요.");
      }
      this._goNext(this.currentAnswer);
    },
    _goNext(answerText) {
      if (this.currentIndex >= this.deck.deckMusics.length) {
        this.submit();
        return;
      }
      this.performDto.answers.push({
        deckMusicId: this.deck.deckMusics[this.currentIndex].id,
        answer: answerText
      });
      this.currentIndex++;
      this.currentAnswer = "";
    },
    async getOldOne(id) {
      const res = await this.$httpService.get("/decks/" + id);
      if (!res.data) {
        throw Error();
      }
      this.deck = res.data;
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped></style>

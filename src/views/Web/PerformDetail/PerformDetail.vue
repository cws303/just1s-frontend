<template>
  <div id="view-perform-detail">
    <v-row class="mt-3" v-if="perform">
      <v-col cols="12" align="center">
        <div v-if="perform.user">
          <h2>{{perform.user.name}}</h2>님의
        </div>
        <h4>점수는</h4>
        <h1>{{perform.score}}점</h1>
      </v-col>
    </v-row>
    <!-- <v-row class="mt-3">
      <v-col cols="12" align="center">
        <v-btn>페이스북으로 공유</v-btn>
        <v-btn>카카오로 공유</v-btn>
      </v-col>
    </v-row>-->

    <div v-if="perform.deck">
      <h3>{{perform.deck.title}}</h3>
      ({{perform.createdAt | moment("YYYY년 MMMM Do H:mm:ss") }})
    </div>
    <v-row v-for="(answer, index) in perform.answers" :key="index" style="border:1px solid gray">
      <v-col cols="8" style="border:1px solid gray">
        <v-responsive aspect-ratio="4:3">
          <youtube-player
            :video-id="answer.deckMusic.music.key"
            width="320"
            height="180"
            ref="youtube"
          ></youtube-player>
        </v-responsive>
      </v-col>
      <v-col cols="4" style="border:1px solid gray">
        <div v-if="answer.isCorrect">{{answer.answer}}</div>
        <div v-if="!answer.isCorrect">
          <h1 style="color:red">{{answer.deckMusic.music.title}}</h1>
          <span style="color:red;text-decoration:line-through">
            <h3 style="color:#333">{{answer.answer}}</h3>
          </span>
        </div>
      </v-col>
    </v-row>
    <v-row class="mt-3">
      <v-col cols="12" align="center">
        <v-btn to="/">다른 문제 풀기</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import * as axios from "axios";
import { mapState } from "vuex";
export default {
  name: "PerformDetail",
  data() {
    return {
      msg: "PerformDetail",
      perform: {
        user: {}
      }
    };
  },
  methods: {
    async getOldOne(id) {
      const res = await this.$httpService.get("/performs/" + id);
      if (!res.data) {
        throw Error();
      }
      this.perform = res.data;

      this.perform.score =
        (this.perform.answers.filter(answer => answer.isCorrect === true)
          .length /
          this.perform.answers.length) *
        100;
    }
  },
  created() {
    const performId = this.$route.params.id;
    if (performId) {
      this.getOldOne(performId).catch(e => {
        console.log(e);
        alert("데이터를 가져오는데 실패했습니다");
        // this.$router.push({ name: "Home" });
      });
    }
  },
  computed: mapState(["currentUser"])
};
</script>

<style lang="scss" scoped></style>

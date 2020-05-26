<template>
  <div id="view-deck-detail">
    <b-row class="mt-3">
      <b-col cols="12" align="center">
        <h1>{{deck.title}}</h1>
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col cols="12" align="center">
        <b-img
          :blank="deck.repImgUrl == ''"
          height="200"
          width="auto"
          :center="true"
          :src="deck.repImgUrl"
          blank-color="gray"
          alt="Image"
          top
        ></b-img>
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col cols="12" align="center">
        <b-badge
          v-for="(hashtag, _index) in deck.hashtags"
          :key="_index"
          class="mr-2"
        >#{{hashtag.hashtag}}</b-badge>
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col cols="12" align="center">
        <b-button
          v-if="deck.deckMusics && deck.deckMusics.length > 0"
          variant="primary"
          @click="goPerformForm"
        >시작!</b-button>
        <span v-if="!deck.deckMusics || deck.deckMusics.length == 0">준비된 문제가 없습니다.</span>
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col cols="12" align="center">
        <b-button to="/">다른 문제</b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import * as axios from "axios";
export default {
  name: "DeckDetail",
  data() {
    return {
      msg: "DeckDetail",
      deck: {}
    };
  },
  methods: {
    goPerformForm() {
      this.$router.push({ name: "PerformForm", params: { id: this.deck.id } });
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
  }
};
</script>

<style lang="scss" scoped></style>

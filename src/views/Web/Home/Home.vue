<template>
  <div id="view-home">
    <b-card-group columns v-if="decks.length > 0">
      <b-card
        :title="deck.title"
        img-src="https://placekitten.com/g/400/450"
        img-alt="Image"
        img-top
        v-for="(deck, index) in decks"
        :key="index"
        @click="goDetail(deck.id)"
      >
        <b-card-text>
          <b-badge
            v-for="(hashtag, _index) in deck.hashtags"
            :key="_index"
            class="mr-2"
          >{{hashtag.hashtag}}</b-badge>
        </b-card-text>
        <b-card-footer>
          조회수 : {{ deck.hitsCount }}
          <div v-if="deck.user">출제자 : {{deck.user.name}}</div>
          <b-button @click="goDeckEdit($event, deck.id)">edit_test</b-button>
        </b-card-footer>
      </b-card>
      <b-button to="/deck-add">test</b-button>
    </b-card-group>
    <div v-if="decks.length == 0">
      덱이 없습니다. :(
      <br />
      <b-button to="/deck-add">나만의 덱 만들기</b-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      msg: "Home",
      decks: []
    };
  },
  created() {
    this.query = Object.assign(
      {
        orderby: "ID__DESC",
        take: 5,
        has_hashtag: 1
      },
      this.$route.query
    );
    this.getDeckList(this.query);
  },
  methods: {
    goDeckEdit(e, deckId) {
      e.stopPropagation();
      this.$router.push({ name: "DeckEdit", params: { id: deckId } });
    },
    getDeckList(query) {
      Object.keys(query).forEach(key =>
        query[key] === undefined || query[key] === "" ? delete query[key] : {}
      );

      return this.$httpService
        .get("/decks", {
          params: query
        })
        .then(res => {
          this.decks = res.data.decks;
          this.totalCount = res.data.totalCount;
        });
    },
    goDetail(id) {
      this.$router.push({ name: "DeckDetail", params: { id: id } });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

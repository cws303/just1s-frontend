<template>
  <div id="view-home">
    <!-- <b-card-group columns v-if="decks.length > 0">
      <b-card
        :title="deck.title"
        v-for="(deck, index) in decks"
        :key="index"
        @click="goDetail(deck.id)"
      >
        <b-img
          :blank="deck.repImgUrl == ''"
          height="200"
          width="auto"
          center="true"
          :src="deck.repImgUrl"
          blank-color="gray"
          alt="Image"
          top
        ></b-img>
        <b-card-text style="height:20px" class="mt-1">
          <b-badge
            v-for="(hashtag, _index) in deck.hashtags"
            :key="_index"
            class="mr-2"
          >#{{hashtag.hashtag}}</b-badge>
        </b-card-text>
        <b-card-footer>
          조회수 : {{ deck.hitsCount }}
          <div v-if="deck.user">출제자 : {{deck.user.name}}</div>
          <b-button @click="goDeckEdit($event, deck.id)">수정</b-button>
        </b-card-footer>
      </b-card>
    </b-card-group> -->
    <v-sheet
      class="deck-list"
      v-if="decks.length > 0"
    >
      <v-slide-group
        v-model="decks"
        class="deck-slide-group"
      >
        <v-slide-item
          v-for="(deck,index) in decks"
          :key="index"
          class="deck-slide"
        >
          <v-card
            class="ma-4"
            height="450"
            width="250"
            elevation="8"
            @click="goDetail(deck.id)"
          >
          <v-img
            class="white--text align-end"
            height="200px"
            :src="deck.repImgUrl"
          >
          </v-img>
          <v-card-subtitle class="pb-0">{{deck.title}}</v-card-subtitle>

          <v-card-text class="text--primary">
            <!-- <div>출제자 : {{ deck.user.name }}</div> -->
            <div>조회수 : {{ deck.hitsCount }}</div>
            <br><br>
            <div>
              <v-chip
                v-for="(hashtag, _index) in deck.hashtags"
                :key="_index"
                x-small
              > #{{hashtag.hashtag}} </v-chip>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="goDeckEdit($event, deck.id)">수정</v-btn>
          </v-card-actions>
            <!-- <v-row
              class="fill-height"
              align="center"
              justify="center"
            >
              <v-scale-transition>
                <v-icon
                  v-if="active"
                  color="white"
                  size="48"
                  v-text="'mdi-close-circle-outline'"
                ></v-icon>
              </v-scale-transition>
            </v-row> -->
          </v-card>
        </v-slide-item>
      </v-slide-group>
    </v-sheet>
    <div v-if="decks.length == 0">덱이 없습니다. :(</div>
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
        with_hashtag: 1
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
  #view-home {
    width: 100%;
    height: 100%;
    .deck-list {
      margin-top: 150px;
      background-color:rgba( 255, 255, 255, 0 ) !important;
      
      .deck-slide {
        margin-right: 20px;
      }
    }
  }
</style>

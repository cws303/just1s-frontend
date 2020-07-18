<template>
  <div id="view-home">
    <v-text-field
      v-model="searchText"
      label="검색"
      class="search"
    ></v-text-field>

    <v-sheet class="best-deck-list" v-if="bestDecks.length > 0">
      <v-slide-group v-model="bestDecks" class="deck-slide-group">
        <v-slide-item
          v-for="(deck, index) in bestDecks"
          :key="index"
          class="deck-slide"
        >
          <v-card
            class="ma-4"
            height="450"
            width="250"
            elevation="8"
            @click="goPerformForm(deck.id)"
          >
            <v-img
              class="white--text align-end"
              :src="deck.repImgUrl"
              lazy-src="/static/assets/images/placeholder.png"
              height="300"
            ></v-img>
            <v-card-subtitle class="pb-0">{{ deck.title }}</v-card-subtitle>

            <v-card-text class="text--primary">
              <div>조회수 : {{ deck.hitsCount }}</div>
            </v-card-text>
            <div class="hashtags">
              <v-chip
                v-for="(hashtag, _index) in deck.hashtags"
                :key="_index"
                x-small
                >#{{ hashtag.hashtag }}</v-chip
              >
            </div>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                v-if="currentUser !== null && currentUser.id == deck.user.id"
                @click="goDeckEdit($event, deck.id)"
                >수정</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-slide-item>
      </v-slide-group>
    </v-sheet>
    <div v-if="decks.length == 0">덱이 없습니다. :(</div>

    <div class="masonry-wrapper">
      <div
        v-masonry
        transition-duration="0.2s"
        item-selector=".grid-item"
        class="grid deck-list"
        :column-width="80"
        :fit-width="true"
      >
        <div
          v-masonry-tile
          class="grid-item"
          v-for="(deck, index) in decks"
          :key="index"
        >
          <v-hover v-slot:default="{ hover }">
            <div class="section-hover">
              <div class="row-deck-btns" v-if="hover">
                <v-btn
                  v-if="currentUser !== null && currentUser.id == deck.user.id"
                  icon
                  @click="goDeckEdit($event, deck.id)"
                >
                  <v-icon class="deck-btn" large>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon @click="goPerformForm(deck.id)">
                  <v-icon class="deck-btn" large
                    >mdi-play-box-multiple-outline</v-icon
                  >
                </v-btn>
                <v-btn icon>
                  <v-icon large class="deck-btn">mdi-share-variant</v-icon>
                </v-btn>
              </div>
              <v-card
                class="deck"
                :elevation="hover ? 12 : 2"
                :class="{ 'on-hover': hover }"
              >
                <v-img
                  class="deck-img"
                  :src="deck.repImgUrl"
                  lazy-src="/static/assets/images/placeholder.png"
                >
                  <template v-slot:placeholder>
                    <p class="deck-title">{{ deck.title }}</p>
                  </template>
                </v-img>
                <div class="hashtags">
                  <v-chip
                    v-for="(hashtag, _index) in deck.hashtags"
                    :key="_index"
                    x-small
                    >#{{ hashtag.hashtag }}</v-chip
                  >
                </div>
              </v-card>
            </div>
          </v-hover>
        </div>
      </div>
    </div>

    <v-pagination
      v-model="page"
      :length="totalPage"
      next-icon="mdi-chevron-right"
      prev-icon="mdi-chevron-left"
      :page="page"
      total-visible="10"
    ></v-pagination>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Home",
  data() {
    return {
      msg: "Home",
      searchText: "",
      decks: [],
      bestDecks: [],
      transparent: "rgba(255, 255, 255, 0)",
      page: 1,
      totalPage: 0,
      icons: [
        "mdi-pencil",
        "mdi-play-box-multiple-outline",
        "mdi-share-variant"
      ]
    };
  },
  computed: mapState(["currentUser"]),
  created() {},

  watch: {
    page: function(newPage) {
      this.query.offset = newPage - 1;
      this.getDeckList(this.query);
    }
  },
  mounted() {
    this.query = Object.assign(
      {
        orderby: "ID__DESC",
        with_hashtag: 1,
        offset: this.page - 1,
        take: 12
      },
      this.$route.query
    );
    this.getDeckList(this.query);

    this.getBestDeckList();
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

      this.$httpService.get("/decks", query).then(res => {
        this.decks = res.data.decks;
        console.log(res.data);
        // this.decks = res.data.decks.concat(res.data.decks);
        this.totalCount = res.data.totalCount;
        this.totalPage = Math.ceil(
          parseFloat(res.data.totalCount / this.query.take)
        );
      });
    },

    getBestDeckList() {
      if (this.$isDesktop()) {
        console.log("desktop");
      }
      if (this.$isMobile()) {
        console.log("mobile");
      }
      let query = Object.assign({
        orderby: "ID__DESC",
        with_hashtag: 1,
        has_music: 1,
        take: 5
      });
      Object.keys(query).forEach(key =>
        query[key] === undefined || query[key] === "" ? delete query[key] : {}
      );

      this.$httpService.get("/decks", query).then(res => {
        this.bestDecks = res.data.decks;
        console.log(res.data.decks);
      });
    },
    goPerformForm(id) {
      this.$router.push({ name: "PerformForm", params: { id: id } });
    }
  }
};
</script>

<style lang="scss" scoped>
#view-home {
  width: 100%;
  height: 100%;

  .best-deck-list {
    background-color: rgba(255, 255, 255, 0) !important;
    margin-bottom: 30px;

    .deck-slide {
      margin-right: 20px;
    }
  }

  .search {
    @include desktop {
      min-width: 1100px;
      color: $main-orange;
    }
  }

  .deck-list {
    display: block;
    margin: 0 auto;

    .grid-item {
      @include desktop {
        width: 300px;
        margin-right: 1%;
        margin-bottom: 20px;
        height: auto;
        &:nth-child(3n) {
          margin-right: 0;
        }
      }

      @include tablet {
        width: 300px;
        margin-right: 1%;
        margin-bottom: 20px;
        height: auto;
        &:nth-child(3n) {
          margin-right: 0;
        }
      }

      @include mobile {
        width: 100%;
        margin-bottom: 20px;
        height: auto;

        &:nth-child(2n-1) {
          margin-right: 1%;
        }
      }

      .deck:not(.on-hover) {
        opacity: 1;
      }

      .show-btns {
        color: $main-orange-dark;
      }

      .section-hover {
        position: relative;
      }

      .row-deck-btns {
        position: absolute;
        width: 150px;
        display: flex;
        justify-content: space-between;
        z-index: 100;
        top: 35%;
        left: 30%;

        .deck-btn {
          color: $main-orange-dark;
        }
      }

      .deck {
        border-radius: 12%;
        background-color: rgba(255, 255, 255, 0.7) !important;
        opacity: 0.6;
        transition: opacity 0.4s ease-in-out;

        .deck-img {
          height: 200px;
          .deck-title {
            color: white;
            height: 100%;
            align-items: flex-end;
            text-align: right;
          }
        }

        .hashtags {
          padding: 0 7%;
        }
      }
    }
  }
}
</style>

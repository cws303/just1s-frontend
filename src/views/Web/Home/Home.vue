<template>
  <div id="view-home">
    <div class="row-search">
      <form class="form-search" @submit.prevent="onSearchFormSubmit" ref="searchForm">
        <span class="text-search">#검색</span>
        <input v-model="searchText" label="검색" class="input-search" />
      </form>
    </div>

    <div class="best-deck-list" v-if="bestDecks.length > 0">
      <div class="first" v-bg="bestDecks[0].repImgUrl" @click="goPerformForm(bestDecks[0].id)">
        <div class="deck-summary">
          <div class="row-header">
            <div class="header">{{bestDecks[0].title}}</div>
          </div>
          <div class="row-hashtags" v-if="bestDecks[0].hashtags.length > 0">
            <span
              v-for="(hashtag, _index) in bestDecks[0].hashtags"
              :key="_index"
              class="hashtag"
            >#{{hashtag.hashtag}}</span>
          </div>
        </div>
      </div>
      <div class="second-third-wrapper" v-if="bestDecks.length > 1">
        <div class="second" v-bg="bestDecks[1].repImgUrl" @click="goPerformForm(bestDecks[1].id)">
          <div class="deck-summary">
            <div class="row-header">
              <div class="header">{{bestDecks[1].title}}</div>
            </div>
            <div class="row-hashtags" v-if="bestDecks[1].hashtags.length > 0">
              <span
                v-for="(hashtag, _index) in bestDecks[1].hashtags"
                :key="_index"
                class="hashtag"
              >#{{hashtag.hashtag}}</span>
            </div>
          </div>
        </div>
        <div class="third" v-bg="bestDecks[2].repImgUrl" @click="goPerformForm(bestDecks[2].id)">
          <div class="deck-summary">
            <div class="row-header">
              <div class="header">{{bestDecks[2].title}}</div>
            </div>
            <div class="row-hashtags" v-if="bestDecks[2].hashtags.length > 0">
              <span
                v-for="(hashtag, _index) in bestDecks[2].hashtags"
                :key="_index"
                class="hashtag"
              >#{{hashtag.hashtag}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="decks.length == 0">덱이 없습니다. :(</div>

    <div class="masonry-wrapper">
      <h3>#최근추가</h3>
      <div
        v-masonry
        transition-duration="0.2s"
        item-selector=".grid-item"
        class="grid deck-list"
        :column-width="80"
        :fit-width="true"
      >
        <div v-masonry-tile class="grid-item" v-for="(deck, index) in decks" :key="index">
          <v-hover v-slot:default="{ hover }">
            <div class="section-hover">
              <div class="row-deck-btns" v-if="hover">
                <div class="hashtags" v-if="deck.hashtags.length > 0">
                  <span
                    v-for="(hashtag, _index) in deck.hashtags"
                    :key="_index"
                  >#{{hashtag.hashtag}}</span>
                </div>
                <v-btn icon @click="goPerformForm(deck.id)">
                  <v-icon class="deck-btn" large>mdi-play-box-multiple-outline</v-icon>
                </v-btn>
                <v-btn icon>
                  <v-icon large class="deck-btn">mdi-share-variant</v-icon>
                </v-btn>
              </div>
              <v-card
                class="deck"
                :tile="true"
                :class="{ 'on-hover': hover }"
                :outlined="false"
                flat
                style="margin-bottom:5px"
              >
                <v-img
                  class="deck-img"
                  :src="deck.repImgUrl"
                  lazy-src="/static/assets/images/placeholder.png"
                >
                  <template v-slot:placeholder>
                    <div style="padding:10px" class="deck-title">
                      <p>{{ deck.title }}</p>
                    </div>
                  </template>
                </v-img>
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
        "mdi-share-variant",
      ],
    };
  },
  computed: mapState(["currentUser"]),
  created() {},
  directives: {
    bg: {
      bind: function (el, binding, vnode) {
        const imgUrl = binding.value || "/static/assets/images/placeholder.png";
        const backgroundImage = `url(${imgUrl})`;
        if (el.style.backgroundImage !== backgroundImage) {
          el.style.backgroundImage = backgroundImage;
          el.style.backgroundSize = "cover";
          el.style.backgroundPosition = "center";
        }
      },
      update: function (el, binding, vnode) {
        const imgUrl = binding.value || "/static/assets/images/placeholder.png";
        const backgroundImage = `url(${imgUrl})`;
        if (el.style.backgroundImage !== backgroundImage) {
          el.style.backgroundImage = backgroundImage;
          el.style.backgroundSize = "cover";
          el.style.backgroundPosition = "center";
        }
      },
    },
  },

  watch: {
    page: function (newPage) {
      this.query.offset = newPage - 1;
      this.getDeckList(this.query);
    },
  },
  mounted() {
    this.query = Object.assign(
      {
        orderby: "ID__DESC",
        with_hashtag: 1,
        offset: this.page - 1,
        has_music: 1,
        take: 12,
      },
      this.$route.query
    );
    this.getDeckList(this.query);

    this.getBestDeckList();
  },
  methods: {
    onSearchFormSubmit() {
      console.log(this.searchText);
    },
    getDeckList(query) {
      Object.keys(query).forEach((key) =>
        query[key] === undefined || query[key] === "" ? delete query[key] : {}
      );

      this.$httpService.get("/decks", query).then((res) => {
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
        take: 3,
      });
      Object.keys(query).forEach((key) =>
        query[key] === undefined || query[key] === "" ? delete query[key] : {}
      );

      this.$httpService.get("/decks", query).then((res) => {
        this.bestDecks = res.data.decks;
        console.log(res.data.decks);
      });
    },
    goPerformForm(id) {
      this.$router.push({ name: "PerformForm", params: { id: id } });
    },
  },
};
</script>

<style lang="scss" scoped>
#view-home {
  @include view-root;

  @mixin deck-card {
    cursor: pointer;
    position: relative;

    &:hover {
      .deck-summary {
        display: flex;
        background-color: $color-black-trans;
      }
    }
    .deck-summary {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: none;
      flex-direction: column;

      .row-header {
        display: flex;
        justify-content: flex-end;

        @include desktop {
          padding: 15px;
          font-size: 30px;
        }

        @include mobile {
          padding: vw-base(25px);
          font-size: vw-base(40px);
        }

        .header {
          color: $color-white;
        }
      }

      .row-hashtags {
        display: flex;
        flex-wrap: wrap;

        @include desktop {
          padding: 15px;
        }

        @include mobile {
          padding: vw-base(20px);
        }

        .hashtag {
          color: $color-white;

          @include desktop {
            font-size: 20px;
            margin-right: 10px;
          }

          @include mobile {
            font-size: vw-base(40px);
            margin-right: vw-base(20px);
          }
        }
      }
    }
  }

  .row-search {
    @include content-row;
    display: flex;
    justify-content: flex-end;

    .form-search {
      @include desktop {
        height: 30px;
        margin: 10px 0px;
      }
      @include mobile {
        height: vw-base(60px);
        margin: vw-base(20px) 0px;
      }

      .text-search {
        @include desktop {
          font-size: 16px;
        }

        @include mobile {
          font-size: vw-base(34px);
        }
      }

      .input-search {
        border-bottom: 1px solid black;
        @include desktop {
          margin-left: 5px;
        }
        @include mobile {
          margin-left: vw-base(10px);
        }
      }
    }
  }

  .best-deck-list {
    background-color: rgba(255, 255, 255, 0) !important;
    margin-bottom: 30px;
    display: flex;

    @include desktop {
      max-width: 1130px;
      margin: auto;
      flex-direction: row;
      margin-bottom: 10px;
    }

    @include mobile {
      width: 100%;
      flex-direction: column;
    }

    .first {
      @include deck-card();

      @include desktop {
        flex: 3;
        height: 400px;
      }

      @include mobile {
        height: vw-base(500px);
      }
    }
    .second-third-wrapper {
      display: flex;

      @include desktop {
        flex: 2;
        flex-direction: column;
        justify-content: space-between;
      }

      @include mobile {
        flex-direction: row;
      }
      .second {
        @include deck-card();

        @include desktop {
          height: 200px;
        }

        @include mobile {
          height: vw-base(300px);
          flex: 1;
        }
      }
      .third {
        @include deck-card();

        @include desktop {
          height: 200px;
        }

        @include mobile {
          height: vw-base(300px);
          flex: 1;
        }
      }
    }

    .deck-slide {
      margin-right: 20px;
    }

    .deck {
      .hashtags {
        padding: 10px;
      }
    }
  }

  .masonry-wrapper {
    @include desktop {
      margin-top: 30px;
    }

    .deck-list {
      display: block;
      margin: 0 auto;

      .grid-item {
        @include desktop {
          width: 250px;
          margin-right: 1%;
          margin-bottom: 20px;
          height: auto;
          &:nth-child(3n) {
            margin-right: 0;
          }
        }

        @include tablet {
          width: 250px;
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
          color: $color-primary-dark;
        }

        .section-hover {
          position: relative;
        }

        .row-deck-btns {
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: space-between;
          z-index: 100;
          top: 0;
          left: 0;

          .hashtags {
            margin-top: 40px;
            padding: 10px;
            color: $color-white;
          }

          .deck-btn {
            color: $color-primary-dark;
          }
        }

        .deck {
          background-color: rgba(255, 255, 255, 0.9) !important;
          opacity: 0.6;
          transition: opacity 0.4s ease-in-out;

          .deck-img {
            height: 200px;
            .deck-title {
              color: $color-white;
              height: 100%;
              align-items: flex-end;
              text-align: right;
            }
          }
        }
      }
    }
  }
}
</style>

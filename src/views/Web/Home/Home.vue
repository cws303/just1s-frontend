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
            <div class="header">{{ bestDecks[0].title }}</div>
          </div>
          <div class="row-hashtags" v-if="bestDecks[0].hashtags.length > 0">
            <span
              v-for="(hashtag, _index) in bestDecks[0].hashtags"
              :key="_index"
              class="hashtag"
            >#{{ hashtag.hashtag }}</span>
          </div>
        </div>
      </div>
      <div class="second-third-wrapper" v-if="bestDecks.length > 1">
        <div class="second" v-bg="bestDecks[1].repImgUrl" @click="goPerformForm(bestDecks[1].id)">
          <div class="deck-summary">
            <div class="row-header">
              <div class="header">{{ bestDecks[1].title }}</div>
            </div>
            <div class="row-hashtags" v-if="bestDecks[1].hashtags.length > 0">
              <span
                v-for="(hashtag, _index) in bestDecks[1].hashtags"
                :key="_index"
                class="hashtag"
              >#{{ hashtag.hashtag }}</span>
            </div>
          </div>
        </div>
        <div class="third" v-bg="bestDecks[2].repImgUrl" @click="goPerformForm(bestDecks[2].id)">
          <div class="deck-summary">
            <div class="row-header">
              <div class="header">{{ bestDecks[2].title }}</div>
            </div>
            <div class="row-hashtags" v-if="bestDecks[2].hashtags.length > 0">
              <span
                v-for="(hashtag, _index) in bestDecks[2].hashtags"
                :key="_index"
                class="hashtag"
              >#{{ hashtag.hashtag }}</span>
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
        id="masonry-container"
        transition-duration="0.2s"
        item-selector=".deck-card"
        class="grid deck-list"
        :fit-width="true"
      >
        <img
          v-masonry-tile
          v-for="(deck, index) in decks"
          :key="index"
          :src="
            deck.repImgUrl !== ''
              ? deck.repImgUrl
              : '/static/assets/images/placeholder.png'
          "
          class="deck-card"
          @click="goPerformForm(deck.id)"
        />
      </div>
    </div>

    <div class="row-btn-more" v-show="hasNext">
      <div class="btn-more" @click="getMore()">더 보기</div>
    </div>

    <div class="deck-bottom-sheet"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
const ImageLoaded = require("imagesloaded");

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
      lastCursor: 0,
      hasNext: false,
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
        has_music: 1,
        take: 6,
      },
      this.$route.query
    );
    this.getDeckList(this.query);
    this.getBestDeckList();
  },
  methods: {
    getMore() {
      if (this.hasNext === false) {
        return;
      }
      this.query.after = this.lastCursor;
      this.getDeckList(this.query);
    },
    onSearchFormSubmit() {
      console.log(this.searchText);
      this.query.hashtag = this.searchText;
      this.query.with_hashtag = this.searchText !== "" ? "" : 1;
      this.decks = [];
      this.getDeckList(this.query);
    },
    getDeckList(query) {
      Object.keys(query).forEach(function (key) {
        if (query[key] === undefined || query[key] === "") {
          delete query[key];
        }
      });

      this.$httpService.get("/decks", query).then((res) => {
        this.decks = this.decks.concat(res.data.decks);
        this.hasNext = res.data.hasNext;
        this.lastCursor = res.data.decks[res.data.decks.length - 1].cursor;
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
      Object.keys(query).forEach(function (key) {
        if (query[key] === undefined || query[key] === "") {
          delete query[key];
        }
      });

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

      .deck-card {
        @include desktop {
          border-radius: 10px;
          width: 250px;
          margin-right: 20px;
          margin-bottom: 20px;
          height: auto;
        }

        @include mobile {
          border-radius: vw-base(20px);
          width: 80vw;
          margin: 20px;
          height: auto;
        }
      }
    }
  }

  .row-btn-more {
    width: 100%;
    @include flex-center;
    .btn-more {
      @include btn-primary;
    }
  }
}
</style>

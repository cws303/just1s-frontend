<template>
  <div id="view-deck-form">
    <h1>덱 {{ deck.id ? `#${deck.id} 수정` : '추가'}}</h1>
    <h6>* 출제 후에는 문제를 수정할수 없어요. :(</h6>
    <b-form @submit="onSubmit" class="detail" v-cloak>
      <b-form-group label="제목" label-for="input-title">
        <b-form-input id="input-title" v-model="deck.title" required placeholder="Enter"></b-form-input>
      </b-form-group>

      <b-form-group label="이미지 링크" label-for="input-img-url">
        <b-form-input id="input-img-url" v-model="deck.imgUrl" placeholder="Enter"></b-form-input>
      </b-form-group>

      <b-form-group label="문항 수" label-for="input-music-count">
        <b-button-group size="sm">
          <b-button>5</b-button>
          <b-button>10</b-button>
        </b-button-group>
      </b-form-group>

      <!-- <b-button @click="addMusic">음악 추가</b-button>
      <b-card v-for="(music, index) in deck.musics" :key="index">
        <b-form-group label="링크" label-for="input-music-link">
          <b-form-input id="input-music-link" v-model="music.link" required placeholder="Enter"></b-form-input>
        </b-form-group>

        <b-form-group label="아티스트" label-for="input-music-artist">
          <b-form-input id="input-music-artist" v-model="music.artist" required placeholder="Enter"></b-form-input>
        </b-form-group>

        <b-form-group label="제목(정답)" label-for="input-music-title">
          <b-form-input id="input-music-title" v-model="music.title" required placeholder="Enter"></b-form-input>
        </b-form-group>

        <b-form-group label="시작(초)" label-for="input-music-second">
          <b-form-input id="input-music-second" v-model="music.second" required placeholder="Enter"></b-form-input>
        </b-form-group>
      </b-card>-->

      <b-card title="해시태그">
        <b-card-text>클릭 시 삭제됩니다. 기존 해시태그는 저장해야 완전히 삭제됩니다.</b-card-text>
        <b-badge
          class="ml-2"
          pill
          v-for="(hashtag, index) in deck.hashtags"
          :key="index"
          :variant="`${hashtag.id ? 'primary' : ''}`"
          @click="onClickHashtag(index)"
          v-bind:style="{ opacity: hashtag.toDelete ? '0.3' : '' }"
        >{{hashtag.hashtag}}</b-badge>
        <br />
        <hr />
        <b-row>
          <b-col cols="3">
            <b-form-input v-model="newHashtag"></b-form-input>
          </b-col>
          <b-col cols="3">
            <b-button variant="primary" @click="addNewHashtag()">추가</b-button>
          </b-col>
        </b-row>
      </b-card>
      <b-card v-if="!deck.id || (deck.id && deck.deckMusics.length === 0)">새 음악 추가</b-card>

      <b-card-group title="a">
        <b-card v-for="(deckMusic, index) in deck.deckMusics" :key="index">
          {{ deckMusic.music.link }}
          <br />
          {{ deckMusic.music.artist }}
          <br />
          {{ deckMusic.music.title }}
          <br />
          {{ deckMusic.second }}
        </b-card>
      </b-card-group>
      {{deck}}
      <b-row class="mt-3">
        <b-col cols="12">
          <b-button type="submit" variant="primary">저장</b-button>
        </b-col>
      </b-row>
    </b-form>
  </div>
</template>

<script>
import * as axios from "axios";
import { mapState } from "vuex";
export default {
  name: "DeckForm",
  data() {
    return {
      msg: "DeckForm",
      newHashtag: "",
      deck: {
        // hashtags: [],
        musics: []
      }
    };
  },
  methods: {
    onClickHashtag(index) {
      const hashtag = this.deck.hashtags[index];

      if (hashtag.id) {
        this.$set(this.deck.hashtags, index, {
          id: this.deck.hashtags[index].id,
          hashtag: this.deck.hashtags[index].hashtag,
          toDelete: !this.deck.hashtags[index].toDelete
        });
      } else {
        this.deleteHashtag(index);
      }
    },
    addNewHashtag() {
      const newHashtag = this.newHashtag;
      if (!newHashtag) {
        return;
      }
      if (
        this.deck.hashtags.map(hashtag => hashtag.hashtag).includes(newHashtag)
      ) {
        alert("이미 존재합니다.");
        this.newHashtag = "";
        return;
      }
      this.deck.hashtags.push({
        hashtag: newHashtag
      });
      this.newHashtag = "";
    },
    deleteHashtag(index) {
      this.deck.hashtags.splice(index, 1);
    },
    async getOldOne(id) {
      const res = await this.$httpService.get("/decks/" + id);
      console.log(res);
      if (!res.data) {
        throw Error();
      }
      this.deck = res.data;

      this.deck.userId = this.deck.user ? this.deck.user.id : undefined;

      this.deck.hashtags = this.deck.hashtags.map(hashtag => {
        hashtag.toDelete = false;
        return hashtag;
      });

      console.log(this.deck);
    },
    addMusic() {
      this.deck.musics.push({
        link: "",
        artist: "",
        title: "",
        second: 0
      });
    },
    async add() {
      this.deck.userId = this.currentUser.id;

      const fieldsToAdd = ["title", "imgUrl", "hashtags", "musics"];
      const formData = Object.keys(this.deck).reduce((result, key) => {
        if (fieldsToAdd.includes(key)) {
          result[key] = this.deck[key];
        }
        return result;
      }, {});
      console.log("add");
      console.log(formData);
      // const res = await this.$httpService.post("/decks", formData);
      // alert("추가되었습니다.");
      // this.$router.push({ name: "Home" });
    },
    async edit() {
      const fieldsToEdit = ["id", "title", "imgUrl", "hashtags", "musics"];
      const formData = Object.keys(this.deck).reduce((result, key) => {
        if (fieldsToEdit.includes(key)) {
          result[key] = this.deck[key];
        }
        return result;
      }, {});
      console.log("edit");
      console.log(formData);
      // const res = await this.$httpService.put(
      //   "/decks/" + formData.id,
      //   formData
      // );
      // alert("수정되었습니다.");
      // this.$router.push({ name: "Home" });
    },
    onSubmit(e) {
      e.preventDefault();
      if (this.deck.id) {
        this.edit();
      } else {
        this.add();
      }
    }
  },

  created() {
    const deckId = this.$route.params.id;
    if (deckId) {
      this.getOldOne(deckId).catch(e => {
        console.log(e);
        alert("데이터를 가져오는데 실패했습니다. 추가 페이지로 이동합니다.");
        // this.$router.push({ name: "DeckAdd" });
      });
    } else {
      this.addMusic();
    }
  },
  computed: mapState(["currentUser"])
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped></style>

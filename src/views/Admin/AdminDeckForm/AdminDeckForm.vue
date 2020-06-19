<template>
  <div id="view-admin-deck-detail">
    <h1>덱 {{ deck.id ? `#${deck.id} 수정` : '추가'}}</h1>
    <b-form @submit="onSubmit" class="detail" v-cloak>
      <b-form-group label="제목" label-for="input-title">
        <b-form-input id="input-title" v-model="deck.title" required placeholder="Enter"></b-form-input>
      </b-form-group>

      <b-form-group label="유저ID" label-for="input-user-id">
        <b-form-input id="input-user-id" v-model="deck.userId" required placeholder="Enter"></b-form-input>
      </b-form-group>

      <nbase-file-input v-model="deck.repImgUrl"></nbase-file-input>
      [{{deck.repImgUrl}}]
      <b-card class="mt-3" border-variant="dark">
        <div slot="header">
          <span>해시태그 관리</span>
        </div>

        <b-row>
          <b-col cols="3" v-for="(hashtag, index) in deck.hashtags" :key="index">
            <b-card>
              <b-card-sub-title align="right">
                <div style="color:red" @click="deleteHashtag(index)" v-if="!hashtag.id">X</div>
              </b-card-sub-title>

              <b-form-group label="해시태그문자" label-for="input-hashtag">
                <b-form-input
                  id="input-hashtag"
                  v-model="hashtag.hashtag"
                  required
                  placeholder="해시태그문자를 입력해주세요."
                ></b-form-input>
              </b-form-group>

              <b-form-group v-if="hashtag.id">
                <b-form-checkbox v-model="hashtag.toDelete" name="input-is-delete" switch>
                  <b>삭제</b>
                </b-form-checkbox>
              </b-form-group>
            </b-card>
          </b-col>
          <b-col cols="3">
            <b-card>
              <b-button variant="primary" @click="addHashtag()">추가</b-button>
            </b-card>
          </b-col>
        </b-row>
      </b-card>

      <b-row>
        <b-col cols="12" class="mt-3">
          <b-button type="submit" variant="primary">저장</b-button>
        </b-col>
      </b-row>
    </b-form>

    <b-card class="mt-3" border-variant="dark">
      <div slot="header">
        <span>음악</span>
        <b-button @click="goMusicInlineForm()" variant="danger" size="sm">관리</b-button>
      </div>
      <b-badge class="mr-2" v-for="(deckMusic, index) in deck.deckMusics" :key="index">
        {{ deckMusic.music.title }} / {{ deckMusic.music.artist }} /
        {{ deckMusic.second + "s" }}
      </b-badge>
    </b-card>

    <b-card class="mt-3" header="debug">
      <pre style="font-size:9px" class="m-0">{{ deck }}</pre>
    </b-card>
  </div>
</template>
<script>
import NbaseFileInput from "../components/NbaseFileInput";
export default {
  name: "AdminDeckForm",
  components: { NbaseFileInput },
  data() {
    return {
      foo: "bar!!!",
      deck: {}
    };
  },
  methods: {
    async getOldOne(id) {
      const res = await this.$httpService.get("/decks/" + id);
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
    async add() {
      // TODO : common method로 빼기
      const fieldsToAdd = ["title", "repImgUrl", "userId"];
      const formData = Object.keys(this.deck).reduce((result, key) => {
        if (fieldsToAdd.includes(key)) {
          result[key] = this.deck[key];
        }
        return result;
      }, {});
      const res = await this.$httpService.post("/decks", formData);
      alert("추가되었습니다.");
      this.$router.push({ name: "AdminDeckList" });
    },
    async edit() {
      const fieldsToEdit = ["id", "title", "userId", "hashtags"];
      const formData = Object.keys(this.deck).reduce((result, key) => {
        if (fieldsToEdit.includes(key)) {
          result[key] = this.deck[key];
        }
        return result;
      }, {});
      const res = await this.$httpService.put(
        "/decks/" + formData.id,
        formData
      );
      alert("수정되었습니다.");
      this.$router.push({ name: "AdminDeckList" });
    },
    addHashtag() {
      this.deck.hashtags.push({
        toDelete: false
      });
    },
    deleteHashtag(index) {
      this.deck.hashtags.splice(index, 1);
    },
    addDeckMusic() {
      this.deck.deckMusics.push({
        toDelete: false
      });
    },
    deleteDeckMusic(index) {
      this.deck.deckMusics.splice(index, 1);
    },
    goMusicInlineForm() {
      this.$router.push({
        name: "AdminDeckMusicInlineForm",
        params: { deckId: this.deck.id }
      });
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
        alert("데이터를 가져오는데 실패했습니다. 추가 페이지로 이동합니다.");
        this.$router.push({ name: "AdminDeckAdd" });
      });
    }
  },
  watch: {
    // async tempFile(file) {
    //   const url = "www.google.com";
    //   const result = await this.$httpService.imageUpload(file);
    //   this.$set(this.deck, "repImgUrl", result.data.url);
    // }
    // tempImage(link) {
    //   this.deck.repImgUrl = link;
    // }
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
.detail {
  margin-top: 20px;
  padding: 0 40px;
}
</style>

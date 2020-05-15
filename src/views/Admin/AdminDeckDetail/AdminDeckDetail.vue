<template>
  <div>
    <b-form @submit="onSubmit" @reset="onReset" class="detail" v-cloak>
      <b-form-group label="Id" label-for="input-id">
        <b-form-input id="input-id" v-model="deck.id" disabled placeholder="Id"></b-form-input>
      </b-form-group>

      <b-form-group label="title" label-for="input-title">
        <b-form-input id="input-title" v-model="deck.title" required placeholder="Enter"></b-form-input>
      </b-form-group>

      <b-button type="submit" variant="primary">Submit</b-button>
      <b-button type="reset" variant="danger">Reset</b-button>
    </b-form>
    <b-card class="mt-3" header="Form Data Result">
      <pre style="font-size:9px" class="m-0">{{ deck }}</pre>
    </b-card>
    <div v-if="deck.id">
      <b-card class="mt-3" border-variant="dark">
        <div slot="header">
          <span>해시태그</span>
          <b-button @click="goHashtagInlineForm()" variant="danger" size="sm">관리</b-button>
        </div>
        <b-badge
          class="mr-2"
          v-for="(hashtag, index) in deck.hashtags"
          :key="index"
        >{{hashtag.hashtag}}</b-badge>
      </b-card>
      <b-card class="mt-3" border-variant="dark">
        <div slot="header">
          <span>음악</span>
          <b-button @click="goMusicInlineForm()" variant="danger" size="sm">관리</b-button>
        </div>
        <b-badge
          class="mr-2"
          v-for="(deckMusic, index) in deck.deckMusics"
          :key="index"
        >{{deckMusic.music.title}} / {{deckMusic.music.artist}} / {{deckMusic.second+"s"}}</b-badge>
      </b-card>
    </div>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "AdminDeckDetail",
  data() {
    return {
      deck: {}
    };
  },
  methods: {
    async getOldOne(id) {
      const res = await axios.get("/api/decks/" + id);
      if (!res.data) {
        throw Error();
      }
      this.deck = res.data;
      console.log(this.deck);
    },
    async add() {
      // TODO : common method로 빼기
      const fieldsToAdd = ["title"];
      const formData = Object.keys(this.deck).reduce((result, key) => {
        if (fieldsToAdd.includes(key)) {
          result[key] = this.deck[key];
        }
        return result;
      }, {});
      const res = await axios.post("/api/decks", formData);
      alert("추가되었습니다.");
      this.$router.push({ name: "AdminDeckList" });
    },
    async edit() {
      const fieldsToEdit = ["id", "title"];
      const formData = Object.keys(this.deck).reduce((result, key) => {
        if (fieldsToEdit.includes(key)) {
          result[key] = this.deck[key];
        }
        return result;
      }, {});
      const res = await axios.put("/api/decks/" + formData.id, formData);
      alert("수정되었습니다.");
      this.$router.push({ name: "AdminDeckList" });
    },
    goHashtagInlineForm() {
      this.$router.push({
        name: "AdminDeckHashtagInlineForm",
        params: { deckId: this.deck.id }
      });
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
    },
    onReset(e) {
      e.preventDefault();
      this.$nextTick(() => {
        this.show = true;
      });
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
  mounted() {}
};
</script>
<style lang="scss" scoped>
.detail {
  margin-top: 20px;
  padding: 0 40px;
}
</style>

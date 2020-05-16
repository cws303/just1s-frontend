<template>
  <div>
    AdminDeckHashtagInlineForm2
    <div>{{deck}}</div>
    <b-form @submit="onSubmit" class="inine-form" v-cloak>
      <b-row>
        <b-col cols="3" v-for="(hashtag, index) in hashtags" :key="index">
          <b-card>
            <b-card-sub-title align="right">
              <div style="color:red" @click="deleteForm(index)" v-if="!hashtag.id">X</div>
            </b-card-sub-title>
            <b-form-group label="Id" label-for="input-id">
              <b-form-input id="input-id" v-model="hashtag.id" disabled placeholder="Id"></b-form-input>
            </b-form-group>

            <b-form-group label="hashtag" label-for="input-hashtag">
              <b-form-input
                id="input-hashtag"
                v-model="hashtag.hashtag"
                required
                placeholder="hashtag를 입력해주세요."
              ></b-form-input>
            </b-form-group>

            <b-form-group v-if="hashtag.id">
              <b-form-checkbox v-model="hashtag.toDelete" name="input-is-delete" switch>
                <b>(Checked: {{ hashtag.toDelete }})</b>
              </b-form-checkbox>
            </b-form-group>
          </b-card>
        </b-col>
        <b-col cols="3">
          <b-card>
            <b-button variant="primary" @click="addForm()">추가</b-button>
          </b-card>
        </b-col>
      </b-row>
      <b-button type="submit" variant="primary">Submit</b-button>
      <b-button type="reset" variant="danger">Reset</b-button>
    </b-form>
  </div>
</template>
<script>
export default {
  name: "AdminDeckHashtagInlineForm",
  data() {
    return {
      deck: {},
      hashtags: []
    };
  },
  methods: {
    async getDeck(id) {
      const res = await this.$http.get("http://localhost:3000/decks/" + id);
      if (!res.data) {
        throw Error();
      }
      this.deck = res.data;
      this.hashtags = [...this.deck.hashtags];
      this.hashtags = this.hashtags.map(hashtag => {
        hashtag.toDelete = false;
        return hashtag;
      });
    },
    async onSubmit(e) {
      e.preventDefault();
      console.log(this.hashtags);
      const formData = [...this.hashtags];
      console.log(formData);
      const res = await this.$http.post(
        "/api/decks/" + this.deck.id + "/hashtags",
        formData
      );
      if (!res.data) {
        throw Error();
      }
      this.$router.push({
        name: "AdminDeckEdit",
        params: { id: this.deck.id }
      });
    },
    addForm() {
      this.hashtags.push({
        toDelete: false
      });
    },
    deleteForm(index) {
      this.hashtags.splice(index, 1);
    }
  },
  created() {
    const deckId = this.$route.params.deckId;
    if (deckId) {
      this.getDeck(deckId).catch(e => {
        alert("데이터를 가져오는데 실패했습니다.");
        // this.$router.push({ name: "AdminDeckAdd" });
      });
    }
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
</style>

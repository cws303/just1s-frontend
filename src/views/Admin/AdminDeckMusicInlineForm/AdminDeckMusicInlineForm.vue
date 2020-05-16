<template>
  <div>
    AdminDeckMusicInlineForm2
    <div>{{deck}}</div>
    <b-form @submit="onSubmit" class="inine-form" v-cloak>
      <b-row>
        <b-col cols="3" v-for="(deckMusic, index) in deckMusics" :key="index">
          <b-card>
            <b-card-sub-title align="right">
              <div style="color:red" @click="deleteForm(index)" v-if="!deckMusic.id">X</div>
            </b-card-sub-title>
            <b-form-group label="Id" label-for="input-id">
              <b-form-input id="input-id" v-model="deckMusic.id" disabled placeholder="Id"></b-form-input>
            </b-form-group>

            <!-- 기존 music 있으면 표시 -->
            <b-card v-if="deckMusic.music">
              <youtube :video-id="deckMusic.music.key" width="100%" height="120" ref="youtube"></youtube>
              <br />
              <p>{{deckMusic.music.title}}</p>
              <p>{{deckMusic.music.artist}}</p>
            </b-card>

            <!-- TODO : 수정 불가능 -->
            <b-form-group label="title" label-for="input-title" v-if="!deckMusic.id">
              <b-form-input
                id="input-title"
                v-model="deckMusic.title"
                required
                :disabled="deckMusic.id"
                placeholder="title를 입력해주세요."
              ></b-form-input>
            </b-form-group>

            <!-- TODO : 수정 불가능 -->
            <b-form-group label="artist" label-for="input-artist" v-if="!deckMusic.id">
              <b-form-input
                id="input-artist"
                v-model="deckMusic.artist"
                required
                placeholder="artist를 입력해주세요."
              ></b-form-input>
            </b-form-group>

            <!-- TODO : 수정 불가능 -->
            <b-form-group label="link" label-for="input-link" v-if="!deckMusic.id">
              <b-form-input
                id="input-link"
                v-model="deckMusic.link"
                required
                placeholder="link를 입력해주세요."
              ></b-form-input>
            </b-form-group>

            <b-form-group label="second" label-for="input-second">
              <b-form-input
                id="input-second"
                v-model="deckMusic.second"
                required
                placeholder="second를 입력해주세요."
              ></b-form-input>
            </b-form-group>

            <b-form-group v-if="deckMusic.id">
              <b-form-checkbox v-model="deckMusic.toDelete" name="input-is-delete" switch>
                <b>(Checked: {{ deckMusic.toDelete }})</b>
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
  name: "AdminDeckMusicInlineForm",
  data() {
    return {
      deck: {},
      deckMusics: []
    };
  },
  methods: {
    async getDeck(id) {
      const res = await this.$http.get("http://localhost:3000/decks/" + id);
      if (!res.data) {
        throw Error();
      }
      this.deck = res.data;
      this.deckMusics = [...this.deck.deckMusics];
      this.deckMusics = this.deckMusics.map(deckMusic => {
        deckMusic.toDelete = false;
        return deckMusic;
        ``;
      });
    },
    async onSubmit(e) {
      e.preventDefault();
      console.log(this.deckMusics);
      const formData = [...this.deckMusics];
      console.log(formData);
      const res = await this.$http.post(
        "/api/decks/" + this.deck.id + "/musics",
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
      this.deckMusics.push({
        toDelete: false
      });
    },
    deleteForm(index) {
      this.deckMusics.splice(index, 1);
    }
  },
  created() {
    const deckId = this.$route.params.deckId;
    if (deckId) {
      this.getDeck(deckId).catch(e => {
        console.log(e);
        alert("데이터를 가져오는데 실패했습니다.");
        // this.$router.push({ name: "AdminDeckAdd" });
      });
    }
  },
  computed: {
    player() {
      return this.$refs.youtube.player;
    }
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
</style>

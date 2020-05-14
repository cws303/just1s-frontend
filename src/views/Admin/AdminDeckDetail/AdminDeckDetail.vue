<template>
  <div>
    <b-form @submit="onSubmit" @reset="onReset" class="detail" v-cloak>
      <b-form-group
        label="Id"
        label-for="input-id"
        description="We'll never share your email with anyone else."
      >
        <b-form-input id="input-id" v-model="form.id" disabled placeholder="Id"></b-form-input>
      </b-form-group>

      <b-form-group label="title" label-for="input-title">
        <b-form-input id="input-title" v-model="form.title" required placeholder="Enter"></b-form-input>
      </b-form-group>hashtags musics
      <!-- <b-form-group label="status" label-for="input-status">
        <b-form-select id="input-status" v-model="form.status" :options="statuses" required></b-form-select>
      </b-form-group>

      <b-form-group
        label="Email"
        label-for="input-email"
        description="We'll never share your email with anyone else."
      >
        <b-form-input
          id="input-email"
          v-model="form.email"
          type="email"
          required
          placeholder="Enter email"
        ></b-form-input>
      </b-form-group>

      <b-form-group label="img url" label-for="input-imgUrl">
        <b-form-input id="input-imgUrl" v-model="form.imgUrl" required placeholder="Enter"></b-form-input>
      </b-form-group>

      <b-form-group label="name" label-for="input-name">
        <b-form-input id="input-name" v-model="form.name" required placeholder="Enter name"></b-form-input>
      </b-form-group>-->

      <b-button type="submit" variant="primary">Submit</b-button>
      <b-button type="reset" variant="danger">Reset</b-button>
    </b-form>
    <b-card class="mt-3" header="Form Data Result">
      <pre class="m-0">{{ form }}</pre>
    </b-card>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "AdminDeckDetail",
  data() {
    return {
      form: {
        id: "",
        createdAt: "",
        updatedAt: "",
        snsType: "",
        status: "",
        snsKey: "",
        email: "",
        imgUrl: "",
        name: "",
        createdDecksCount: "",
        performedMusicsCount: "",
        performedDecksCount: "",
        averageScore: ""
      },
      snsTypes: [
        { text: "Select One", value: "" },
        "EMAIL",
        "INSTAGRAM",
        "FACEBOOK",
        "NAVER"
      ],
      statuses: [{ text: "Select One", value: "" }, "NORMAL", "WITHDRAWN"],
      show: true
    };
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      // alert(JSON.stringify(this.form))
      this.form.id ? this.updateDeck(this.form) : this.addDeck(this.form);
    },
    onReset(evt) {
      evt.preventDefault();
      this.$nextTick(() => {
        this.show = true;
      });
    },
    getDeck(id) {
      return axios.get("/api/decks/" + id).then(res => {
        this.form = res.data;
      });
    },
    addDeck(data) {
      return axios.post("/api/decks", data).then(res => {
        console.log(res);
        alert("ok");
      });
    },
    updateDeck(data) {
      return axios.put("/api/decks/" + data.id, data).then(res => {
        console.log(res);
        alert("ok");
      });
    }
  },
  created() {
    let deckId = this.$route.params.id;
    if (deckId) {
      this.getDeck(deckId);
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

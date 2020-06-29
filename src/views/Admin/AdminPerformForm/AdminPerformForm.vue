<template>
  <div>
    <h1>perform {{ perform.id ? `#${perform.id} 수정` : '추가'}}</h1>
    <b-form @submit="onSubmit" @reset="onReset" class="detail" v-cloak>
      <b-form-group
        v-if="perform.id"
        label="Id"
        label-for="input-id"
        description="We'll never share your email with anyone else."
      >
        <b-form-input id="input-id" v-model="perform.id" disabled placeholder="Id"></b-form-input>
      </b-form-group>

      <b-form-group
        label="user"
        label-for="input-user"
      >{{ perform.user ? perform.user.name : perform.ipAddress }}</b-form-group>

      <b-form-group label="deck" label-for="input-deck">{{ perform.deck.title }}</b-form-group>

      <b-form-group
        v-for="(answer, index) in perform.answers"
        :key="index"
        label="answers"
        label-for="input-answers"
      >
        {{ answer.deckMusic.music.link }}
        <div v-if="answer.isCorrect">{{answer.answer}}</div>
        <div v-if="!answer.isCorrect">
          <h1 style="color:red">{{answer.deckMusic.music.title}}</h1>
          <span style="color:red;text-decoration:line-through">
            <h3 style="color:#333">{{answer.answer}}</h3>
          </span>
        </div>
      </b-form-group>

      <hr />
    </b-form>
    <b-card class="mt-3" header="Form Data Result">
      <pre class="m-0">{{ perform }}</pre>
    </b-card>
  </div>
</template>
<script>
export default {
  name: "Detail",
  data() {
    return {
      perform: {},
      show: true
    };
  },
  methods: {
    async getOldOne(id) {
      const res = await this.$httpService.get("/performs/" + id);
      if (!res.data) {
        throw Error();
      }
      this.perform = res.data;
      delete this.perform.pw;
      console.log(this.perform);
    }
  },
  created() {
    const performId = this.$route.params.id;
    if (performId) {
      this.getOldOne(performId).catch(e => {
        alert("데이터를 가져오는데 실패했습니다");
        this.$router.push({ name: "AdminPerformList" });
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

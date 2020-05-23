<template>
  <div id="view-result-index">
    <b-row class="mt-3">
      <b-col cols="12" align="center">
        <h2>{{currentUser ? currentUser.name: '익명'}}</h2>
        <h4>님의 점수는</h4>
        <h1>80</h1>
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col cols="12" align="center">
        <b-button>페이스북으로 공유</b-button>
        <b-button>카카오로 공유</b-button>
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col cols="12" align="center">
        <b-button to="/">다른 문제 풀기</b-button>
        <b-button to="/deck-form">나만의 덱 만들기</b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import * as axios from "axios";
import { mapState } from "vuex";
export default {
  name: "ResultIndex",
  data() {
    return {
      msg: "ResultIndex"
      // currentUser: {},
    };
  },
  methods: {},
  created() {},
  computed: mapState(["currentUser"])
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped></style>

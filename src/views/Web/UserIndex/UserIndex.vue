<template>
  <div id="view-user-index">
    <div v-if="currentUser">
      <b-row class="mt-3">
        <b-col cols="12" align="center">
          <b-avatar :src="currentUser.imgUrl" size="10em" badge-variant="info">
            <template v-slot:badge>
              <b-icon icon="star-fill"></b-icon>
            </template>
          </b-avatar>
        </b-col>
        <b-col cols="12" align="center" class="mt-3">
          <h1>{{currentUser.name}}</h1>
        </b-col>
        <b-col cols="12" align="center" class="mt-1">만든 덱 : {{currentUser.createdDecksCount}}</b-col>
        <b-col cols="12" align="center" class="mt-1">푼 문제 수 : {{currentUser.performedMusicsCount}}</b-col>
        <b-col cols="12" align="center" class="mt-1">푼 덱 수 : {{currentUser.performedDecksCount}}</b-col>
        <b-col cols="12" align="center" class="mt-1">평균점수 : {{currentUser.averageScore}}</b-col>
        <b-col
          cols="12"
          align="center"
          class="mt-2"
        >가입 : {{currentUser.createdAt | moment("YYYY년 MMMM Do H:mm:ss")}}</b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import * as axios from "axios";
import { mapState } from "vuex";
import { store } from "@/stores/index.js";
export default {
  name: "UserIndex",
  data() {
    return {
      msg: "UserIndex"
    };
  },
  methods: {},
  mounted() {},
  computed: mapState(["currentUser"])
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped></style>

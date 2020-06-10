<template>
  <header class="component-web-header">
    <v-app-bar flat dense class="topbar">
      <v-toolbar-title>듣고 맞춰보세요 - 단1초</v-toolbar-title>
      <v-spacer></v-spacer>
      <div v-if="currentUser">
        <v-btn to="/deck-add">새로운 덱</v-btn>
        <v-avatar to="/user-index">
          <img :src="currentUser.imgUrl" />
        </v-avatar>
        <v-btn @click="logout()">로그아웃</v-btn>
      </div>
      <div v-if="!currentUser">
        <v-btn style="cursor:pointer" @click="login()">로그인</v-btn>
      </div>
    </v-app-bar>
  </header>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "WebHeader",
  data: {
    currentUser: {}
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    login() {
      this.$router.push({ name: "LoginIndex" });
    },
    async logout() {
      await this.$httpService.logout();
      if (this.$router.currentRoute.name != "Home") {
        this.$router.push({ name: "Home" });
      }
      window.alert("로그아웃되었습니다.");
    }
  },
  computed: mapState(["currentUser"])
};
</script>

<style lang="scss" scoped>
.topbar {
  background-color: rgba(255, 255, 255, 0) !important;
}
</style>

<template>
  <header class="component-web-header">
    <b-navbar type="info" variant="info">
      <!-- <b-navbar-nav class="ml-0" @click="goBack">
        <b-icon icon="arrow-left" variant="dark"></b-icon>
      </b-navbar-nav>-->
      <b-navbar-nav class="ml-auto" align="center" variant="light">
        <b-navbar-brand to="/">듣고 맞춰보세요 - 단1초</b-navbar-brand>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <div v-if="currentUser">
          <b-avatar to="/user-index" :src="currentUser.imgUrl"></b-avatar>
          <b-navbar-brand @click="logout()">로그아웃</b-navbar-brand>
        </div>
        <div v-if="!currentUser">
          <b-navbar-brand style="cursor:pointer" @click="login()">로그인</b-navbar-brand>
        </div>
      </b-navbar-nav>
    </b-navbar>
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
    logout() {
      alert("로그아웃되었습니다.");
      this.$httpService.logout();
      this.$router.push({ name: "Home" });
    }
  },
  computed: mapState(["currentUser"])
};
</script>

<style lang="scss" scoped>
</style>

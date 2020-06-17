<template>
  <b-navbar type="dark" variant="dark">
    <!-- <b-navbar-brand
      ><router-link to="/admin">Just1s</router-link></b-navbar-brand
    >-->
    <b-navbar-brand to="/admin">Just1s</b-navbar-brand>
    <b-navbar-nav>
      <b-nav-item-dropdown text="관리" right>
        <b-dropdown-item to="/admin/users">유저 관리</b-dropdown-item>
        <b-dropdown-item to="/admin/decks">덱 관리</b-dropdown-item>
        <b-dropdown-item to="/admin/musics">음악 관리</b-dropdown-item>
        <b-dropdown-item to="/admin/performs">수행내역 관리</b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>
    <b-navbar-nav>
      <b-nav-item-dropdown text="접근권한" right>
        <b-dropdown-item to="/admin/access_user">모든유저</b-dropdown-item>
        <b-dropdown-item to="/admin/access_staff">모든관리자</b-dropdown-item>
        <b-dropdown-item to="/admin/access_master">마스터</b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>
    <b-navbar-nav>
      <b-nav-item-dropdown text="테스트" right>
        <b-dropdown-item to="/admin/ui_test">UI</b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>
    <!-- Right aligned nav items -->
    <b-navbar-nav class="ml-auto">
      <div v-if="currentUser">
        <b-navbar-brand>[ #{{ currentUser.id }} {{ currentUser.name }} ]</b-navbar-brand>
        <b-navbar-brand @click="logout()">로그아웃</b-navbar-brand>
      </div>
      <div v-if="!currentUser">
        <b-navbar-brand @click="login()">로그인</b-navbar-brand>
      </div>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "AdminHeader",
  data: {
    currentUser: {}
  },
  methods: {
    login() {
      // await this.$httpService.login("kimjbstar@gmail.com", "dummy");
      this.$router.push({ name: "AdminLoginForm" });
    },
    logout() {
      alert("로그아웃되었습니다.");
      this.$httpService.logout();
      this.$router.push({ name: "AdminHome" });
    }
  },
  computed: mapState(["currentUser"])
};
</script>

<style lang="scss" scoped></style>

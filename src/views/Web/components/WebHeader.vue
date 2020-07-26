<template>
  <v-app-bar class="topbar" flat fixed>
    <v-toolbar-title @click="goHome()">듣고 맞춰보세요 - 단1초!!</v-toolbar-title>
    <v-spacer></v-spacer>
    <div class="row-menu">
      <div v-if="currentUser">
        <span class="row-user">
          <v-avatar to="/user-index">
            <img :src="currentUser.imgUrl" />
          </v-avatar>
          {{ currentUser.name }}
        </span>
        <v-menu>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon large>mdi-view-list</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="logout()">
              <v-list-item-title>로그아웃</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <div v-if="!currentUser">
        <v-btn depressed :tile="true" @click="login()">로그인</v-btn>
      </div>
    </div>
  </v-app-bar>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "WebHeader",
  data: {
    currentUser: {},
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
    },
    goDeckAdd() {
      this.$router.push("deck-add");
    },
    goHome() {
      this.$router.push("/");
    },
  },
  computed: mapState(["currentUser"]),
  created() {},
};
</script>

<style lang="scss" scoped>
.topbar {
  background-color: $main-orange-dark !important;
  &.v-toolbar--collapsed {
    .row-user {
      display: none;
    }
  }
}
</style>

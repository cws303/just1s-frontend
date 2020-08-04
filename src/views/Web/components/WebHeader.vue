<template>
  <header>
    <div class="row-left-menu">
      <div class="left-title" @click="goHome()">듣고 맞춰보세요 - 단1초!!</div>
    </div>

    <div class="row-right-menu">
      <div v-if="currentUser">
        <div class="row-user">
          <div class="user-img-url" v-bg="currentUser.imgUrl"></div>
          <div class="user-name">{{ currentUser.name }}</div>
        </div>
        <div class="btn-logout" @click="logout()">로그아웃</div>
      </div>
      <div v-if="!currentUser">
        <div class="btn-login" @click="login()">로그인</div>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
header {
  position: fixed;
  width: 100%;
  display: flex;
  justify-content: space-between;
  background-color: $color-primary-dark;
  z-index: 10;

  @include desktop {
    height: 60px;
  }

  @include mobile {
    height: vw-base(100px);
  }

  .row-left-menu {
    @include flex-center;

    @include desktop {
      padding: 10px;
    }
    @include mobile {
      padding: vw-base(20px);
    }

    .left-title {
      @include flex-center;
      @include desktop {
        font-size: 25px;
      }

      @include mobile {
        font-size: vw-base(30px);
      }
    }
  }

  .row-right-menu {
    @include flex-center;

    @include desktop {
      padding: 10px;
    }
    @include mobile {
      padding: vw-base(20px);
    }

    .btn-login {
      @include btn-white;
    }
  }
}
</style>

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


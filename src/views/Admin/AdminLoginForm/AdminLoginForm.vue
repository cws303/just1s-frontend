<template>
  <div class="page-admin-login-form">
    <h1>관리자 로그인</h1>
    <b-form @submit="onSubmit" class="login-form" v-cloak>
      <b-form-group label="email" label-for="input-email">
        <b-form-input
          :type="'email'"
          v-model="loginFormData.email"
          id="input-email"
          required
          placeholder="Enter"
        ></b-form-input>
      </b-form-group>
      <b-form-group label="password" label-for="input-password">
        <b-form-input
          :type="'password'"
          id="input-password"
          v-model="loginFormData.password"
          required
          placeholder="Enter"
        ></b-form-input>
      </b-form-group>
      <b-button type="submit" variant="dark">로그인</b-button>
    </b-form>
    .vue
    {{ loginFormData}}
  </div>
</template>
<script>
export default {
  name: "AdminLoginForm",
  data() {
    return {
      loginFormData: {
        email: "",
        password: ""
      }
    };
  },
  methods: {
    async onSubmit(e) {
      e.preventDefault();
      const isSucceed = await this.$httpService.login(
        this.loginFormData.email,
        this.loginFormData.password
      );
      if (isSucceed === false) {
        alert("로그인에 실패하였습니다.");
        return;
      }
      this.$router.push({ name: "AdminHome" });
    }
  },
  created() {},
  mounted() {}
};
</script>
<style lang="scss" scoped>
</style>

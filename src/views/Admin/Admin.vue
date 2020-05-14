<template>
  <div class="admin-page">
    I'm "Admin" Component
    <admin-header></admin-header>
    <div class="container-admin">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import AdminHeader from "./components/AdminHeader";
export default {
  name: "Admin",
  components: {
    AdminHeader
  },
  data() {
    return {
      // route: this.$route
    };
  }
};
</script>
<style lang="scss" scoped>
.admin-page {
  padding-top: 10%;
}
.container-admin {
  padding: 0 20px 20px 20px;
}
</style>

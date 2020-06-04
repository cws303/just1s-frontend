<template>
  <div class="admin-page">
    <admin-header></admin-header>
    <!-- I'm "Admin" Component -->
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
  },
  created() {
    document.title = "just1s 백오피스";
  }
};
</script>
<style lang="scss" scoped>
// .admin-page {
//   padding-top: 10%;
// }
.container-admin {
  padding: 20px;
}
</style>

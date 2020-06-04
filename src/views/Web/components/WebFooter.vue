<template>
  <footer class="component-web-footer">
    <v-footer flat class="footerbar" absolute>
      <router-link to="/practice">Practice 이동</router-link>
      <p class="title">2020 All Right Reserved</p>
    </v-footer>
  </footer>
</template>

<script>
export default {
  name: "WebFooter"
};
</script>

<style lang="scss" scoped>
  .footerbar {
    background-color: rgba( 255, 255, 255, 0 ) !important;
  }
</style>

<template>
  <v-footer flat class="footerbar">
    <p class="title">2020 All Right Reserved</p>
    <div class="test">
      <router-link to="/practice">Practice 이동</router-link>
    </div>
  </v-footer>
</template>

<script>
export default {
  name: "WebFooter"
};
</script>

<style lang="scss" scoped>
  .footerbar {
    background-color: rgba( 255, 255, 255, 0 ) !important;
    display: flex;
    justify-content: space-between;
  }
</style>

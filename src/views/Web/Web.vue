<template>
  <div class="web-root">
    <web-header></web-header>
    <div class="container-root">
      <router-view></router-view>
    </div>
    <web-footer></web-footer>
  </div>
</template>

<script>
import WebHeader from "./components/header";
import WebFooter from "./components/footer";
export default {
  name: "Web",
  components: {
    WebHeader,
    WebFooter
  }
};
</script>
<style lang="scss" scoped>
.web-root {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .container-root {
    flex: 1;
  }
}
</style>

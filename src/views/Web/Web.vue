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
import WebHeader from "./components/WebHeader";
import WebFooter from "./components/WebFooter";
import Decks from "./Decks/Decks";
export default {
  name: "Web",
  components: {
    WebHeader,
    WebFooter,
    Decks
  },
  methods: {}
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
    padding: 16px;
  }
}
</style>

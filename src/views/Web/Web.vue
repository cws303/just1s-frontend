<template>
  <div class="web-root" data-app>
    <web-header></web-header>
    <div class="container-root">
      <router-view></router-view>
    </div>
    <!-- <web-footer></web-footer> -->
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
    Decks,
  },
  methods: {},
};
</script>
<style lang="scss" scope>
@font-face {
  font-family: "CookieRun";
  src: url("/static/assets/fonts/CookieRun Regular.ttf") format("truetype");
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: "CookieRun";
  src: url("/static/assets/fonts/CookieRun Bold.ttf") format("truetype");
  font-weight: bold;
  font-style: normal;
}

.web-root {
  height: 100%;
  min-height: 100vh;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  position: relative;
  .container-root {
    background-color: #ebecee;
    @include desktop {
      padding: 64px 15% 0;
      min-height: calc(100vh - 52px);
    }
    @include mobile {
      padding: 50px 3% 0;
    }
  }
}
</style>

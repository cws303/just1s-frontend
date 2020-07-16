<template>
  <div class="web-root" data-app>
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
<style lang="scss" scope>

@font-face { 
  font-family: 'CookieRun';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/CookieRun-Regular.woff') format('woff');
  font-weight: normal;
  font-style: normal; 
}

@font-face { 
  font-family: 'CookieRun';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_twelve@1.0/CookieRunOTF-Bold00.woff') format('woff');
  font-weight: bold;
  font-style: normal; 
}

// @font-face{ 
//   font-family:'CookieRun';
//   src:url('/src/fonts/CookieRun-Regular.eot');
//   src:url('/src/fonts/CookieRun-Regular.eot?#iefix') format('embedded-opentype'),
//   url('/src/fonts/CookieRun-Regular.woff') format('woff'),
//   url('/src/fonts/CookieRun-Regular.ttf') format('truetype');
//   font-weight: normal;
//   font-style: normal; 
// }

// @font-face{ 
//   font-family:'CookieRun';
//   src:url('/src/fonts/CookieRun-Bold.eot');
//   src:url('/src/fonts/CookieRun-Bold.eot?#iefix') format('embedded-opentype'),
//   url('/src/fonts/CookieRun-Bold.woff') format('woff'),
//   url('/src/fonts/CookieRun-Bold.ttf') format('truetype');
//   font-weight: bold;
//   font-style: normal; 
// }

.web-root {
  height: 100%;
  min-height: 100vh;
  font-family: 'CookieRun','Avenir', Helvetica, Arial, sans-serif;
  background: linear-gradient(white, $main-mint-light, $main-mint-dark);
  position: relative;
  .container-root {
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

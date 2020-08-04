<template>
  <div id="web" data-app>
    <web-header></web-header>
    <div id="router-wrapper">
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
#web {
  #router-wrapper {
    // min-height: calc(100vh - 52px);
    // padding: 64px 15% 0;
    // margin-top: 50px;
    @include desktop {
      padding-top: 60px;
    }

    @include mobile {
      padding-top: vw-base(100px);
    }

    // background-color: #ebecee;
    // @include desktop {
    //   padding: 64px 15% 0;
    //   min-height: calc(100vh - 52px);
    // }
    // @include mobile {
    //   padding: 50px 3% 0;
    // }
  }
}
</style>

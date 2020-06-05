import _Vue from "vue";
import getIdFromUrl from "get-youtube-id";
import YoutubePlayer from "@/components/YoutubePlayer.vue";

const youtubePlayer = {
  install(Vue: typeof _Vue, options?: any) {
    Vue.mixin({
      mounted: function() {
        console.log("moutned !!");
      }
    });

    Vue.prototype.$youtube = {
      getIdFromUrl
    };

    Vue.component("youtube-player", YoutubePlayer);
  }
};

export default youtubePlayer;

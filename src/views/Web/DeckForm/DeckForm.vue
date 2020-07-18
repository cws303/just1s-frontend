<template>
  <div id="view-deck-form">
    #deckform
  </div>
</template>

<script>
import * as axios from "axios";
import { mapState } from "vuex";
export default {
  name: "DeckForm",
  data() {
    return {
      msg: "DeckForm",
      tempFile: null,
      tempImage: null,
      newLink: "",
      newLinks: "",
      newHashtag: "",
      deck: {
        hashtags: [],
        deckMusics: []
      }
    };
  },
  methods: {
    getBulkMusics() {
      if (this.newLinks === "") {
        return;
      }
      // console.log(this.newLinks.split("\n"));
      const keywords = this.newLinks.split("\n");
      keywords.forEach(keyword => {
        this.addDeckMusic();
        const lastIndex = this.deck.deckMusics.length - 1;
        this.getMusicInfoByKeyword(keyword, lastIndex);
      });
    },
    getMusicInfoByKeyword(keyword, index) {
      if (this.deck.deckMusics[index] === undefined) {
        return;
      }
      axios
        .get(
          `https://u4zlh1xns8.execute-api.ap-northeast-2.amazonaws.com/dev/search/${encodeURI(
            keyword
          )}`
        )
        .then(res => {
          this.$set(this.deck.deckMusics, index, {
            artist: res.data.musics[0].artist,
            title: res.data.musics[0].song,
            link: res.data.url,
            key: res.data.key,
            second: 0
          });
        })
        .catch(e => {
          console.log(e);
          console.log("youtube parse fail. ignore...");
        });
    },
    newMusicLinkChanged(index) {
      console.log("newMusicLinkChanged", index);
      const changedLink = this.deck.deckMusics[index].link;
      console.log(changedLink);

      const youtubeLinkRegex = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/;
      if (!changedLink.match(youtubeLinkRegex)) {
        console.log("잘못된 URL");
        return;
      }

      const key = changedLink.match(youtubeLinkRegex)[1];
      const deckMusicCloned = JSON.parse(
        JSON.stringify(this.deck.deckMusics[index])
      );
      deckMusicCloned["key"] = key;
      console.log(deckMusicCloned);
      this.$set(this.deck.deckMusics, index, deckMusicCloned);

      axios
        .get(
          `https://u4zlh1xns8.execute-api.ap-northeast-2.amazonaws.com/dev/start/${key}`
        )
        .then(res => {
          console.log(res.data.musics[0]);
          deckMusicCloned["artist"] = res.data.musics[0].artist;
          deckMusicCloned["title"] = res.data.musics[0].song;
          console.log(deckMusicCloned);
          this.$set(this.deck.deckMusics, index, deckMusicCloned);
        })
        .catch(e => {
          console.log("youtube parse fail. ignore...");
        })
        .finally(() => {});
    },
    addDeckMusicByLink() {
      if (this.newLink === "") {
        return;
      }
      const links = this.deck.deckMusics.map(deckMusic => deckMusic.link);
      console.log(links);
      if (links.includes(this.newLink)) {
        alert("이미 존재하는 링크입니다.");
        this.newLink = "";
        return;
      }

      const youtubeLinkRegex = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/;
      if (!this.newLink.match(youtubeLinkRegex)) {
        console.log("잘못된 URL");
        return;
      }
      this.addDeckMusic();
      const lastIndex = this.deck.deckMusics.length - 1;
      this.deck.deckMusics[lastIndex].link = this.newLink;
      this.newMusicLinkChanged(lastIndex);
      this.newLink = "";
    },

    async captureSecond(index, videoId) {
      const youtubeComponentByVideoId = this.$refs.youtube.find(
        youtubeComponent => {
          return youtubeComponent.videoId == videoId;
        }
      );
      if (!youtubeComponentByVideoId) {
        console.log("플레이어 찾을 수 없음");
        return;
      }
      const player = youtubeComponentByVideoId.player;
      const currentTime = await player.getCurrentTime();
      const deckMusicCloned = JSON.parse(
        JSON.stringify(this.deck.deckMusics[index])
      );
      deckMusicCloned.second = parseInt(currentTime);
      this.$set(this.deck.deckMusics, index, deckMusicCloned);
    },

    onClickHashtag(index) {
      const hashtag = this.deck.hashtags[index];
      if (hashtag.id) {
        this.$set(this.deck.hashtags, index, {
          id: this.deck.hashtags[index].id,
          hashtag: this.deck.hashtags[index].hashtag,
          toDelete: !this.deck.hashtags[index].toDelete
        });
      } else {
        this.deleteHashtag(index);
      }
    },

    addHashtag() {
      const newHashtag = this.newHashtag;
      if (!newHashtag) {
        return;
      }
      if (
        this.deck.hashtags.map(hashtag => hashtag.hashtag).includes(newHashtag)
      ) {
        alert("이미 존재합니다.");
        this.newHashtag = "";
        return;
      }
      this.deck.hashtags.push({
        hashtag: newHashtag
      });
      this.newHashtag = "";
    },
    deleteHashtag(index) {
      this.deck.hashtags.splice(index, 1);
    },
    addDeckMusic() {
      this.deck.deckMusics.push({
        link: "",
        title: "",
        artist: "",
        second: 0
      });
    },
    deleteDeckMusic(index) {
      this.deck.deckMusics.splice(index, 1);
    },
    async getOldOne(id) {
      const res = await this.$httpService.get("/decks/" + id);
      console.log(res);
      if (!res.data) {
        throw Error();
      }
      this.deck = res.data;
      this.deck.userId = this.deck.user ? this.deck.user.id : undefined;
      this.deck.hashtags = this.deck.hashtags.map(hashtag => {
        hashtag.toDelete = false;
        return hashtag;
      });

      console.log(this.deck);
    },
    async add() {
      this.deck.userId = this.currentUser.id;

      const fieldsToAdd = [
        "userId",
        "title",
        "repImgUrl",
        "hashtags",
        "deckMusics"
      ];
      const formData = Object.keys(this.deck).reduce((result, key) => {
        if (fieldsToAdd.includes(key)) {
          result[key] = this.deck[key];
        }
        return result;
      }, {});
      console.log("add");
      console.log(formData);
      // console.log(qs.stringify(formData));
      const res = await this.$httpService.post("/decks", formData);
      alert("추가되었습니다.");
      this.$router.push({ name: "Home" });
    },
    async edit() {
      const fieldsToEdit = [
        "id",
        "userId",
        "title",
        "repImgUrl",
        "hashtags",
        "deckMusics"
      ];
      const formData = Object.keys(this.deck).reduce((result, key) => {
        if (fieldsToEdit.includes(key)) {
          result[key] = this.deck[key];
        }
        return result;
      }, {});
      console.log("edit");
      console.log(formData);
      const res = await this.$httpService.put(
        "/decks/" + formData.id,
        formData
      );
      alert("수정되었습니다.");
      this.$router.push({ name: "Home" });
    },
    onSubmit(e) {
      e.preventDefault();
      if (this.deck.id) {
        this.edit();
      } else {
        this.add();
      }
    }
  },
  created() {
    const deckId = this.$route.params.id;
    if (deckId) {
      this.getOldOne(deckId).catch(e => {
        console.log(e);
        alert("데이터를 가져오는데 실패했습니다. 추가 페이지로 이동합니다.");
        // this.$router.push({ name: "DeckAdd" });
      });
    } else {
      // this.addDeckMusic();
    }
  },
  computed: mapState(["currentUser"]),
  watch: {
    async tempFile(file) {
      const url = "www.google.com";
      const result = await this.$httpService.imageUpload(file);
      this.$set(this.deck, "repImgUrl", result.data.url);
    },
    tempImage(link) {
      this.deck.repImgUrl = link;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped></style>

<template>
  <div id="view-admin-deck-detail">
    <h1>덱 {{ deck.id ? `#${deck.id} 수정` : "추가" }}</h1>

    <b-form @submit="onSubmit" class="detail" v-cloak>
      <b-form-group label="제목" label-for="input-title">
        <b-form-input id="input-title" v-model="deck.title" required placeholder="Enter"></b-form-input>
      </b-form-group>

      <b-form-group label="대표 이미지">
        <div class="ml-3 mr-3">
          <b-row>
            <b-col style="border:1px solid #ccc" class="p-3">
              <b-form-file
                v-model="tempFile"
                placeholder="파일을 선택하거나 드래그앤드랍 해주세요"
                drop-placeholder="여기 넣어주세요"
                accept=".jpg, .png, .gif"
              ></b-form-file>
              <b-form-input id="input-temp-image" v-model="tempImage" placeholder="Enter"></b-form-input>
            </b-col>
            <b-col style="background-color:#ccc; position:relative" class="p-3">
              <span style="font-size:9px; color:#555; position:absolute">{{ deck.repImgUrl }}</span>
              <b-img thumbnail height="100" width="100" :center="true" :src="deck.repImgUrl"></b-img>
            </b-col>
          </b-row>
        </div>
      </b-form-group>

      <div v-if="!deck.id">
        <b-row>
          <b-col>
            <b-form-textarea
              style="font-size:9px"
              id="input-title"
              v-model="newLinks"
              rows="10"
              placeholder="엔터로 구분해서 입력하세요.
예)
윤하 혜성
윤하 486"
            ></b-form-textarea>
            <b-button @click="getBulkMusics">검색어로 추가</b-button>
          </b-col>
          <b-col>
            <b-input
              style="font-size:9px"
              id="input-title"
              v-model="newLink"
              v-on:keydown.enter.stop.prevent="addDeckMusicByLink"
              placeholder="예) https://www.youtube.com/watch?v=hrO-BgLjJ-Q"
            ></b-input>
            <b-button @click="addDeckMusicByLink">링크로 직접 추가</b-button>
          </b-col>
        </b-row>
      </div>
      <h6 style="color:#C60000" v-if="deck.id">* 출제 후에는 문제를 추가/삭제할수 없어요. :(</h6>
      <b-row>
        <b-col lg="4" sm="6" v-for="(deckMusic, index) in deck.deckMusics" :key="index">
          <b-card title="음악" no-body class="mt-2">
            <b-card-sub-title align="right" v-if="!deckMusic.id">
              <b-icon
                class="icon-delete align-middle text-center mt-3 mr-3"
                icon="trash"
                variant="danger"
                @click="deleteDeckMusic(index)"
              ></b-icon>
            </b-card-sub-title>
            <b-row>
              <b-card-body
                :title="
                  `Music #${index + 1} [${
                    deckMusic.music
                      ? deckMusic.music.title + '-' + deckMusic.music.artist
                      : '신규'
                  }]`
                "
              >
                <div v-if="!deckMusic.id">
                  <b-form-group
                    label="링크"
                    label-for="input-deck-music-link"
                    label-size="sm"
                    label-align
                  >
                    <b-form-input
                      id="input-deck-music-link"
                      v-model="deckMusic.link"
                      required
                      placeholder="Enter"
                      size="sm"
                    ></b-form-input>
                  </b-form-group>

                  <div v-if="deckMusic.key">
                    <youtube-player
                      :video-id="deckMusic.key"
                      width="240"
                      height="160"
                      ref="youtube"
                    ></youtube-player>
                    <b-button @click="captureSecond(index, deckMusic.key)">지금</b-button>
                  </div>

                  <b-form-group
                    label="아티스트"
                    label-for="input-deck-music-artist"
                    label-size="sm"
                    label-align
                  >
                    <b-form-input
                      id="input-deck-music-artist"
                      v-model="deckMusic.artist"
                      required
                      placeholder="Enter"
                      size="sm"
                    ></b-form-input>
                  </b-form-group>

                  <b-form-group
                    label="제목(정답)"
                    label-for="input-deck-music-title"
                    label-size="sm"
                    label-align
                  >
                    <b-form-input
                      id="input-deck-music-title"
                      v-model="deckMusic.title"
                      required
                      placeholder="Enter"
                      size="sm"
                    ></b-form-input>
                  </b-form-group>
                </div>

                <div v-if="deckMusic.id">
                  <youtube-player
                    :video-id="deckMusic.music.key"
                    width="240"
                    height="160"
                    ref="youtube"
                  ></youtube-player>
                  <b-button @click="captureSecond(index, deckMusic.music.key)">지금</b-button>
                </div>

                <b-form-group
                  label="시작(초)"
                  label-for="input-deck-music-second"
                  label-size="sm"
                  label-align
                >
                  <b-form-spinbutton
                    id="input-deck-music-second"
                    v-model="deckMusic.second"
                    min="0"
                    max="1000"
                  ></b-form-spinbutton>
                </b-form-group>
              </b-card-body>
            </b-row>
          </b-card>
        </b-col>
      </b-row>

      <b-card title="해시태그" class="mt-3">
        <b-card-text>클릭 시 삭제됩니다. 기존 해시태그는 저장해야 완전히 삭제됩니다.</b-card-text>
        <b-badge
          class="ml-2"
          pill
          v-for="(hashtag, index) in deck.hashtags"
          :key="index"
          :variant="`${hashtag.id ? 'primary' : ''}`"
          @click="onClickHashtag(index)"
          v-bind:style="{ opacity: hashtag.toDelete ? '0.3' : '' }"
        >#{{ hashtag.hashtag }}</b-badge>
        <br />
        <hr />
        <b-row>
          <b-col cols="3">
            <b-form-input v-model="newHashtag" v-on:keydown.enter.prevent="addHashtag()"></b-form-input>
          </b-col>
          <b-col cols="3">
            <b-button variant="primary" @click="addHashtag()">추가</b-button>
          </b-col>
        </b-row>
      </b-card>

      <b-row class="mt-3">
        <b-col cols="12">
          <b-button type="submit" variant="primary">저장</b-button>
        </b-col>
      </b-row>
    </b-form>
    <b-card class="mt-3" header="debug">
      <pre style="font-size:9px" class="m-0">{{ deck }}</pre>
    </b-card>
  </div>
</template>
<script>
import * as axios from "axios";
import { mapState } from "vuex";
import NbaseFileInput from "../components/NbaseFileInput";
export default {
  name: "AdminDeckForm",
  components: { NbaseFileInput },
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
      this.$router.push({ name: "AdminDeckList" });
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
      this.$router.push({ name: "AdminDeckList" });
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
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
.detail {
  margin-top: 20px;
  padding: 0 40px;
}
</style>

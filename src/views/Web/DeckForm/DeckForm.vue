<template>
  <div id="view-deck-form">
    <h1>덱 {{ deck.id ? `#${deck.id} 수정` : "추가" }}</h1>

    <b-form @submit="onSubmit" class="detail" v-cloak>
      <b-form-group label="제목" label-for="input-title">
        <b-form-input
          id="input-title"
          v-model="deck.title"
          required
          placeholder="Enter"
        ></b-form-input>
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
              <b-form-input
                id="input-temp-image"
                v-model="tempImage"
                placeholder="Enter"
              ></b-form-input>
            </b-col>
            <b-col style="background-color:#ccc; position:relative" class="p-3">
              <span style="font-size:9px; color:#555; position:absolute">{{
                deck.repImgUrl
              }}</span>
              <b-img
                thumbnail
                height="100"
                width="100"
                :center="true"
                :src="deck.repImgUrl"
              ></b-img>
            </b-col>
          </b-row>
        </div>
      </b-form-group>

      <b-button @click="addDeckMusic" v-if="!deck.id">음악 추가</b-button>
      <h6 style="color:#C60000" v-if="deck.id">
        * 출제 후에는 문제를 추가/삭제할수 없어요. :(
      </h6>
      <b-row>
        <b-col
          lg="4"
          sm="6"
          v-for="(deckMusic, index) in deck.deckMusics"
          :key="index"
        >
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
                      @change="newMusicLinkChanged(index)"
                    ></b-form-input>
                  </b-form-group>

                  <div v-if="deckMusic.key">
                    <youtube-player
                      :video-id="deckMusic.key"
                      width="240"
                      height="160"
                      ref="youtube"
                    ></youtube-player>
                    <b-button @click="captureSecond(index, deckMusic.key)"
                      >지금</b-button
                    >
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
                  <b-button @click="captureSecond(index, deckMusic.music.key)"
                    >지금</b-button
                  >
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
        <b-card-text
          >클릭 시 삭제됩니다. 기존 해시태그는 저장해야 완전히
          삭제됩니다.</b-card-text
        >
        <b-badge
          class="ml-2"
          pill
          v-for="(hashtag, index) in deck.hashtags"
          :key="index"
          :variant="`${hashtag.id ? 'primary' : ''}`"
          @click="onClickHashtag(index)"
          v-bind:style="{ opacity: hashtag.toDelete ? '0.3' : '' }"
          >#{{ hashtag.hashtag }}</b-badge
        >
        <br />
        <hr />
        <b-row>
          <b-col cols="3">
            <b-form-input
              v-model="newHashtag"
              v-on:keydown.enter.prevent="addHashtag()"
            ></b-form-input>
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
export default {
  name: "DeckForm",
  data() {
    return {
      msg: "DeckForm",
      tempFile: null,
      tempImage: null,
      newHashtag: "",
      deck: {
        hashtags: [],
        deckMusics: []
      }
    };
  },
  methods: {
    newMusicLinkChanged(index) {
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
      this.$set(this.deck.deckMusics, index, deckMusicCloned);
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
      this.addDeckMusic();
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

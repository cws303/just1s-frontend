<template>
  <div>
    <h1>music {{ music.id ? `#${music.id} 수정` : '추가'}}</h1>
    <b-form @submit="onSubmit" @reset="onReset" class="detail" v-cloak>
      <b-form-group
        v-if="music.id"
        label="Id"
        label-for="input-id"
        description="We'll never share your email with anyone else."
      >
        <b-form-input id="input-id" v-model="music.id" disabled placeholder="Id"></b-form-input>
      </b-form-group>

      <b-form-group label="title" label-for="input-title">
        <b-form-input id="input-title" v-model="music.title" required placeholder="Enter name"></b-form-input>
      </b-form-group>

      <b-form-group label="artist" label-for="input-artist">
        <b-form-input id="input-artist" v-model="music.artist" required placeholder="Enter name"></b-form-input>
      </b-form-group>

      <b-form-group label="link" label-for="input-link">
        <b-form-input id="input-link" v-model="music.link" required placeholder="Enter name"></b-form-input>
      </b-form-group>

      <hr />

      <b-button type="submit" variant="primary">Submit</b-button>
      <b-button type="reset" variant="danger">Reset</b-button>
    </b-form>
    <b-card class="mt-3" header="Form Data Result">
      <pre class="m-0">{{ music }}</pre>
    </b-card>
  </div>
</template>
<script>
export default {
  name: "Detail",
  data() {
    return {
      music: {},
      snsTypes: ["EMAIL", "INSTAGRAM", "FACEBOOK", "NAVER"],
      roles: ["NORMAL", "STAFF", "MASTER"],
      statuses: ["NORMAL", "WITHDRAWN"],
      show: true
    };
  },
  methods: {
    async getOldOne(id) {
      const res = await this.$httpService.get("/musics/" + id);
      if (!res.data) {
        throw Error();
      }
      this.music = res.data;
      delete this.music.pw;
      console.log(this.music);
    },
    async add() {
      // TODO : common method로 빼기
      const fieldsToAdd = ["title", "artist", "link", "key"];
      const formData = Object.keys(this.music).reduce((result, key) => {
        if (fieldsToAdd.includes(key)) {
          result[key] = this.music[key];
        }
        return result;
      }, {});

      const res = await this.$httpService.post("/musics", formData);
      alert("추가되었습니다.");
      this.$router.push({ name: "AdminMusicList" });
    },
    async edit() {
      const fieldsToEdit = ["id", "title", "artist"];
      const formData = Object.keys(this.music).reduce((result, key) => {
        if (fieldsToEdit.includes(key)) {
          result[key] = this.music[key];
        }
        return result;
      }, {});
      const res = await this.$httpService.put(
        "/musics/" + formData.id,
        formData
      );
      console.log(formData);
      alert("수정되었습니다.");
      this.$router.push({ name: "AdminMusicList" });
    },
    onSubmit(e) {
      e.preventDefault();
      if (this.music.id) {
        this.edit();
      } else {
        this.add();
      }
    },
    onReset(e) {
      e.preventDefault();
      this.$nextTick(() => {
        this.show = true;
      });
    }
  },
  created() {
    const musicId = this.$route.params.id;
    if (musicId) {
      this.getOldOne(musicId).catch(e => {
        alert("데이터를 가져오는데 실패했습니다. 추가 페이지로 이동합니다.");
        this.$router.push({ name: "AdminMusicAdd" });
      });
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

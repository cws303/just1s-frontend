<template>
  <div class="wrap-list">
    <div class="d-flex flex-row justify-content-between bd-highlight mb-3">
      <h1>music 리스트</h1>
      <b-button to="/admin/musics/add" variant="danger">추가</b-button>
    </div>
    <b-row class="mb-3">
      <b-col cols="2">
        <b-form-select v-model="query.orderby" :options="orderbys" @change="getMusicList(query)"></b-form-select>
      </b-col>

      <b-col cols="2">
        <b-form-input
          v-model="query.name"
          placeholder="name 입력"
          v-on:keyup.enter="getMusicList(query)"
        ></b-form-input>
      </b-col>
    </b-row>
    <b-table-simple hover small caption-top responsive>
      <b-thead head-variant="dark">
        <b-tr>
          <b-th class="align-middle text-center">Id</b-th>
          <b-th class="align-middle text-center">title</b-th>
          <b-th class="align-middle text-center">artist</b-th>
          <b-th class="align-middle text-center">link</b-th>
          <b-th class="align-middle text-center">averageScore</b-th>
          <b-th class="align-middle text-center">belongsDecksCount</b-th>
          <b-th class="align-middle text-center">performsCount</b-th>
          <b-th class="align-middle text-center">생성</b-th>
          <b-th class="align-middle text-center">관리</b-th>
        </b-tr>
      </b-thead>

      <b-tbody v-cloak>
        <b-tr v-for="(music, index) in musics" :key="index">
          <b-td class="align-middle text-center">{{ music.id }}</b-td>
          <b-td class="align-middle text-center">{{ music.title }}</b-td>
          <b-td class="align-middle text-center">{{ music.artist }}</b-td>
          <b-td class="align-middle text-center">{{ music.link }}</b-td>
          <b-td class="align-middle text-center">{{ music.averageScore }}</b-td>
          <b-td class="align-middle text-center">{{ music.belongsDecksCount }}</b-td>
          <b-td class="align-middle text-center">{{ music.performsCount }}</b-td>
          <b-td
            class="align-middle text-center"
          >{{ music.createdAt | moment("YYYY년 MMMM Do H:mm:ss") }}</b-td>
          <b-td class="align-middle text-center">
            <b-icon
              class="icon-delete align-middle text-center"
              icon="pencil"
              variant="success"
              @click="goDetail(music.id)"
            ></b-icon>
            <b-icon
              class="icon-delete align-middle text-center"
              icon="trash"
              variant="danger"
              @click="deleteMusic(music.id)"
            ></b-icon>
          </b-td>
        </b-tr>
      </b-tbody>
    </b-table-simple>
    <b-pagination
      v-model="currentPage"
      :total-rows="totalCount"
      :per-page="query.take"
      @change="getMusicList(query)"
    ></b-pagination>
  </div>
</template>
<script>
export default {
  name: "AdminMusicList",
  data() {
    return {
      currentPage: 1,
      musics: [],
      query: {},
      orderbys: [
        { text: "ID내림차순", value: "ID__DESC" },
        { text: "ID오름차순", value: "ID__ASC" }
      ],
      totalCount: -1
    };
  },
  created() {
    this.query = Object.assign(
      {
        orderby: "ID__DESC",
        take: 5
      },
      this.$route.query
    );
    this.getMusicList(this.query);
  },
  watch: {
    currentPage() {
      this.getMusicList(this.query);
    }
  },
  mounted() {},
  methods: {
    getMusicList(query) {
      Object.keys(query).forEach(key =>
        query[key] === undefined || query[key] === "" ? delete query[key] : {}
      );
      query.offset = this.currentPage - 1;

      return this.$httpService
        .get("/musics", {
          params: query
        })
        .then(res => {
          this.musics = res.data.musics;
          this.totalCount = res.data.totalCount;
        });
    },
    deleteMusic(id) {
      if (confirm("정말 삭제하시겠습니까?") !== false) {
        this.$httpService.delete("/musics/" + id).then(res => {
          this.getMusicList(this.query);
        });
      }
    },
    goDetail(id) {
      this.$router.push({ name: "AdminMusicEdit", params: { id: id } });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>

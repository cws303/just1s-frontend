<template>
  <div class="view-admin-deck-list">
    <div class="d-flex flex-row justify-content-between bd-highlight mb-3">
      <h1>덱 리스트</h1>
      <b-button to="/admin/decks/add" variant="danger">추가</b-button>
    </div>
    <b-row class="mb-3">
      <b-col cols="2">
        <b-form-select v-model="query.orderby" :options="orderbys" @change="getDeckList(query)"></b-form-select>
      </b-col>

      <b-col cols="2">
        <b-form-input
          v-model="query.title"
          placeholder="title 입력"
          v-on:keyup.enter="getDeckList(query)"
        ></b-form-input>
      </b-col>

      <b-col cols="2">
        <b-form-input
          v-model="query.music_title"
          placeholder="music_title 입력"
          v-on:keyup.enter="getDeckList(query)"
        ></b-form-input>
      </b-col>
    </b-row>
    <b-table-simple hover small caption-top responsive>
      <b-thead head-variant="dark">
        <b-tr>
          <b-th class="align-middle text-center">id</b-th>
          <b-th class="align-middle text-center">title</b-th>
          <b-th class="align-middle text-center">hitsCount</b-th>
          <b-th class="align-middle text-center">averageScore</b-th>
          <b-th class="align-middle text-center">user</b-th>
          <b-th class="align-middle text-center">hashtags 수</b-th>
          <b-th class="align-middle text-center">CreatedAt</b-th>
          <b-th class="align-middle text-center">관리</b-th>
        </b-tr>
      </b-thead>

      <b-tbody v-cloak>
        <b-tr
          v-for="(deck, index) in decks"
          :key="index"
          @click="goDetail(deck.id)"
          :style="{cursor:'pointer'}"
        >
          <b-td class="align-middle text-center">{{ deck.id }}</b-td>
          <b-td class="align-middle text-center">{{ deck.title }}</b-td>
          <b-td class="align-middle text-center">{{ deck.hitsCount }}</b-td>
          <b-td class="align-middle text-center">{{ deck.averageScore }}</b-td>
          <b-td class="align-middle text-center">{{ deck.user ? deck.user.name : "" }}</b-td>
          <b-td class="align-middle text-center">{{ deck.hashtags ? deck.hashtags.length : "" }}</b-td>
          <b-td
            class="align-middle text-center"
          >{{ deck.createdAt | moment("YYYY년 MMMM Do H:mm:ss") }}</b-td>
          <b-td class="align-middle text-center">
            <b-icon
              class="icon-delete align-middle text-center"
              icon="pencil"
              variant="success"
              @click:stop="goDetail(deck.id)"
            ></b-icon>
            <b-icon
              class="icon-delete align-middle text-center"
              icon="trash"
              variant="danger"
              @click="deleteDeck(deck.id)"
            ></b-icon>
          </b-td>
        </b-tr>
      </b-tbody>
    </b-table-simple>
    <b-pagination
      v-model="currentPage"
      :total-rows="totalCount"
      :per-page="query.take"
      @change="getDeckList(query)"
    ></b-pagination>
  </div>
</template>
<script>
export default {
  name: "AdminDeckList",
  data() {
    return {
      currentPage: 1,
      decks: [],
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
    this.getDeckList(this.query);
  },
  watch: {
    currentPage() {
      this.getDeckList(this.query);
    }
  },
  methods: {
    getDeckList(query) {
      Object.keys(query).forEach(key =>
        query[key] === undefined || query[key] === "" ? delete query[key] : {}
      );
      query.offset = this.currentPage - 1;

      return this.$httpService
        .get("/decks", {
          params: query
        })
        .then(res => {
          this.decks = res.data.decks;
          this.totalCount = res.data.totalCount;
        });
    },
    deleteDeck(id) {
      if (confirm("정말 삭제하시겠습니까?") !== false) {
        this.$httpService.delete("/decks/" + id).then(res => {
          this.getDeckList(this.query);
        });
      }
    },
    goDetail(id) {
      this.$router.push({ name: "AdminDeckEdit", params: { id: id } });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>

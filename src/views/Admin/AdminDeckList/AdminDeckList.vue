<template>
  <div class="view-admin-deck-list">
    <b-row>
      <b-col cols="11">
        <h1>덱 리스트</h1>
      </b-col>
      <b-col>
        <b-button to="/admin/decks/add" variant="danger">추가</b-button>
      </b-col>
    </b-row>
    <div class="mb-3"></div>
    <b-row>
      <b-col cols="3">
        <b-form-select
          v-model="query.orderby"
          :options="orderbys"
          @change="getDeckList()"
          size="sm"
        ></b-form-select>
      </b-col>
    </b-row>
    <b-row v-if="search.fields">
      <b-col cols="3">
        <b-form-select
          v-model="search.fieldName"
          :options="search.fields"
          text-field="text"
          value-field="field"
          size="sm"
        ></b-form-select>
      </b-col>

      <b-col cols="3">
        <b-form-input
          v-model="search.input"
          :disabled="search.fieldName === null"
          :placeholder="search.fieldName ? search.fieldName + ' 입력' : ''"
          v-on:keyup.enter="applySearchQuery($event)"
          size="sm"
        ></b-form-input>
      </b-col>
    </b-row>

    <b-row>
      <b-col cols="2">
        <b-form-select v-model="query.status" :options="statuses" @change="getDeckList()" size="sm"></b-form-select>
      </b-col>
    </b-row>
    <div
      class="nbase-loading-bar-wrapper"
      style="position:absolute; top:200px left:200px"
      v-show="isLoading"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        style="margin: auto; background: transparent; display: block; shape-rendering: auto;"
        width="50px"
        height="50px"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
      >
        <circle
          cx="50"
          cy="50"
          fill="none"
          stroke="#5b5b5b"
          stroke-width="10"
          r="35"
          stroke-dasharray="164.93361431346415 56.97787143782138"
          transform="rotate(324.486 50 50)"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            repeatCount="indefinite"
            dur="1s"
            values="0 50 50;360 50 50"
            keyTimes="0;1"
          />
        </circle>
      </svg>
    </div>
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

      <b-tbody v-cloak v-show="!isLoading">
        <b-tr
          v-for="(deck, index) in decks"
          :key="index"
          @click="goForm(deck.id)"
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
              @click:stop="goForm(deck.id)"
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
      @change="getDeckList()"
    ></b-pagination>
  </div>
</template>
<script>
export default {
  name: "AdminDeckList",
  data() {
    return {
      // common
      isLoading: false,
      query: {},
      currentPage: 1,
      orderbys: [
        { text: "ID내림차순", value: "ID__DESC" },
        { text: "ID오름차순", value: "ID__ASC" },
      ],
      search: {
        fieldName: null,
        input: "",
        fields: [
          { text: "검색할 필드명을 선택해주세요", field: null, disabled: true },
          { text: "제목", field: "title" },
          { text: "음악제목", field: "music_title" },
        ],
      },
      totalCount: -1,
      // decks
      decks: [],
      statuses: [
        { text: "status를 선택해주세요", field: null, disabled: true },
        { text: "좋음", value: 10 },
        { text: "나쁨", value: 20 },
      ],
    };
  },
  created() {
    this.query = Object.assign(
      {
        orderby: "ID__DESC",
        with_hashtag: true,
        take: 10,
      },
      this.$route.query
    );
    Object.entries(this.$route.query).map(([k, v]) => {
      if (this.search.fields.find((fieldObj) => fieldObj.field === k)) {
        this.search = {
          fieldName: k,
          input: v,
        };
      }
    });
    this.getDeckList();
  },
  watch: {
    currentPage() {
      this.getDeckList();
    },
  },
  methods: {
    getDeckList() {
      const query = this.query;
      Object.keys(query).forEach((key) =>
        query[key] === undefined || query[key] === "" ? delete query[key] : {}
      );
      query.offset = this.currentPage - 1;

      this.isLoading = true;
      return this.$httpService
        .get("/decks", query)
        .then((res) => {
          this.decks = res.data.decks;
          this.totalCount = res.data.totalCount;

          // TODO
          const originURL = window.location.href.split("?")[0];
          const qs = Object.entries(query)
            .map(([k, v]) => `${k}=${v}`)
            .join("&");
          history.pushState({}, "", originURL + "?" + qs);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    deleteDeck(id) {
      if (confirm("정말 삭제하시겠습니까?") === false) {
        return;
      }
      this.$httpService.delete("/decks/" + id).then((res) => {
        this.getDeckList();
      });
    },
    goForm(id) {
      this.$router.push({ name: "AdminDeckEdit", params: { id: id } });
    },
    applySearchQuery() {
      if (this.search.fieldName === null) {
        return;
      }
      this.query[this.search.fieldName] = this.search.input;
      this.getDeckList();
    },
  },
};
</script>
<style lang="scss" scoped>
</style>

<template>
  <div class="wrap-list">
    <div class="d-flex flex-row justify-content-between bd-highlight mb-3">
      <h1>perform 리스트</h1>
    </div>
    <b-row class="mb-3">
      <b-col cols="2">
        <b-form-select v-model="query.orderby" :options="orderbys" @change="getPerformList(query)"></b-form-select>
      </b-col>

      <b-col cols="2">
        <b-form-input
          v-model="query.name"
          placeholder="name 입력"
          v-on:keyup.enter="getPerformList(query)"
        ></b-form-input>
      </b-col>
    </b-row>
    <b-table-simple hover small caption-top responsive>
      <b-thead head-variant="dark">
        <b-tr>
          <b-th class="align-middle text-center">Id</b-th>
          <b-th class="align-middle text-center">deck</b-th>
          <b-th class="align-middle text-center">user</b-th>
          <!-- <b-th class="align-middle text-center">answers</b-th> -->
          <b-th class="align-middle text-center">생성</b-th>
          <b-th class="align-middle text-center">관리</b-th>
        </b-tr>
      </b-thead>

      <b-tbody v-cloak>
        <b-tr v-for="(perform, index) in performs" :key="index">
          <b-td class="align-middle text-center">{{ perform.id }}</b-td>
          <b-td class="align-middle text-center">{{ perform.deck.title }}</b-td>
          <b-td
            class="align-middle text-center"
          >{{ perform.user ? perform.user.name : perform.ipAddress }}</b-td>
          <!-- <b-td class="align-middle text-center">{{ perform.answers.count }}</b-td> -->
          <b-td
            class="align-middle text-center"
          >{{ perform.createdAt | moment("YYYY년 MMMM Do H:mm:ss") }}</b-td>
          <b-td class="align-middle text-center">
            <b-icon
              class="icon-delete align-middle text-center"
              icon="pencil"
              variant="success"
              @click="goDetail(perform.id)"
            ></b-icon>
          </b-td>
        </b-tr>
      </b-tbody>
    </b-table-simple>
    <b-pagination
      v-model="currentPage"
      :total-rows="totalCount"
      :per-page="query.take"
      @change="getPerformList(query)"
    ></b-pagination>
  </div>
</template>
<script>
export default {
  name: "AdminPerformList",
  data() {
    return {
      currentPage: 1,
      performs: [],
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
    this.getPerformList(this.query);
  },
  watch: {
    currentPage() {
      this.getPerformList(this.query);
    }
  },
  mounted() {},
  methods: {
    getPerformList(query) {
      Object.keys(query).forEach(key =>
        query[key] === undefined || query[key] === "" ? delete query[key] : {}
      );
      query.offset = this.currentPage - 1;

      return this.$httpService.get("/performs", query).then(res => {
        this.performs = res.data.performs;
        this.totalCount = res.data.totalCount;

        // TODO
        const originURL = window.location.href.split("?")[0];
        const qs = Object.entries(query)
          .map(([k, v]) => `${k}=${v}`)
          .join("&");
        history.pushState({}, "", originURL + "?" + qs);
      });
    },
    goDetail(id) {
      this.$router.push({ name: "AdminPerformEdit", params: { id: id } });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>

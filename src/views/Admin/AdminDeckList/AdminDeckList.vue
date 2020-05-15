<template>
  <div class="wrap-list">
    {{ query }}
    <div class="wrap-top">
      <span class="title">덱 리스트</span>
      <router-link to="/admin/decks/add">
        <b-button variant="danger" class="add">추가</b-button>
      </router-link>
    </div>
    <b-row class="mb-3">
      <b-col cols="2">
        <b-form-select
          v-model="query.orderby"
          :options="orderbys"
          @change="getDeckList(query)"
        ></b-form-select>
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
          <b-th>id</b-th>
          <b-th>title</b-th>
          <b-th>hitsCount</b-th>
          <b-th>averageScore</b-th>
          <b-th>user</b-th>
          <b-th>hashtags 수</b-th>
          <b-th>Created at/ Updated at</b-th>
          <b-th></b-th>
        </b-tr>
      </b-thead>

      <b-tbody v-cloak>
        <b-tr
          v-for="(deck, index) in decks"
          :key="index"
          @click="goDetail(deck.id)"
        >
          <b-td>{{ deck.id }}</b-td>
          <b-td>{{ deck.title }}</b-td>
          <b-td>{{ deck.hitsCount }}</b-td>
          <b-td>{{ deck.averageScore }}</b-td>
          <b-td>{{ deck.user ? deck.user.name : "" }}</b-td>
          <b-td>{{ deck.hashtags ? deck.hashtags.length : "" }}</b-td>
          <b-td>
            {{ deck.createdAt | moment("YYYY년 MMMM Do H:mm:ss") }}
            <br />
            {{ deck.updatedAt | moment("YYYY년 MMMM Do H:mm:ss") }}
          </b-td>
          <b-td>
            <b-icon
              class="icon-delete"
              icon="x"
              variant="danger"
              font-scale="2"
              @click="deleteDeck(deck.id)"
            ></b-icon>
          </b-td>
        </b-tr>
      </b-tbody>
    </b-table-simple>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "AdminDeckList",
  data() {
    return {
      decks: [],
      query: {},
      orderbys: [
        { text: "ID내림차순", value: "ID__DESC" },
        { text: "ID오름차순", value: "ID__ASC" }
      ]

      // fields: ['id', 'createdAt', 'updateAt', 'snsType', 'status', 'snsKey', 'email', 'name']
    };
  },
  created() {
    this.query = Object.assign(
      {
        orderby: "ID__DESC"
      },
      this.$route.query
    );
    this.getDeckList(this.query);
  },
  mounted() {},
  methods: {
    getDeckList(query) {
      // remove empty
      Object.keys(query).forEach(key =>
        query[key] === undefined || query[key] === "" ? delete query[key] : {}
      );

      return axios
        .get("/api/decks", {
          params: query
        })
        .then(res => {
          console.log(res.data.decks);
          this.decks = res.data.decks;
        });
    },
    deleteDeck(id) {
      if (confirm("realy want delete this deck?")) {
        return axios.delete("/api/decks/" + id).then(res => {
          console.log(res);
          alert("delete success");
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
.wrap-list {
  .wrap-top {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    .title {
      font-size: 40px;
    }
  }
}
.icon-delete {
  &:hover {
    cursor: pointer;
  }
}
</style>

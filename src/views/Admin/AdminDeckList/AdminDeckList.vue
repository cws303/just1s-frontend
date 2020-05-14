<template>
  <div class="wrap-list">
    <div class="wrap-top">
      <span class="title">덱 리스트</span>
      <router-link to="/admin/decks/add">
        <b-button variant="danger" class="add">추가</b-button>
      </router-link>
    </div>
    <b-table-simple hover small caption-top responsive>
      <b-thead head-variant="dark">
        <b-tr>
          <b-th>id</b-th>
          <b-th>title</b-th>
          <b-th>hitsCount</b-th>
          <b-th>averageScore</b-th>
          <b-th>user</b-th>
          <b-th>Created at</b-th>
          <b-th>Updated at</b-th>
          <b-th></b-th>
        </b-tr>
      </b-thead>

      <b-tbody v-cloak>
        <b-tr v-for="(deck, index) in decks" :key="index" @click="goDetail(deck.id)">
          <b-td>{{ deck.id }}</b-td>
          <b-td>{{ deck.title }}</b-td>
          <b-td>{{ deck.hitsCount }}</b-td>
          <b-td>{{ deck.averageScore }}</b-td>
          <b-td>{{ deck.user }}</b-td>
          <b-td>{{ deck.createdAt }}</b-td>
          <b-td>{{ deck.updatedAt }}</b-td>
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
// import * as decks from '@/api/decks'

export default {
  name: "AdminDeckList",
  data() {
    return {
      decks: []
      // fields: ['id', 'createdAt', 'updateAt', 'snsType', 'status', 'snsKey', 'email', 'name']
    };
  },
  created() {
    this.getDeckList();
  },
  mounted() {},
  methods: {
    getDeckList() {
      return axios.get("/api/decks").then(res => {
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

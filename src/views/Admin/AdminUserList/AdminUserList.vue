<template>
  <div class="wrap-list">
    <div class="wrap-top">
      <span class="title">유저 리스트</span>
      <router-link to="/admin/users/add">
        <b-button variant="danger" class="add">추가</b-button>
      </router-link>
    </div>
    <!-- <b-table class="list" striped hover :items="users" :fields="fields"></b-table> -->
    <b-table-simple hover small caption-top responsive>
      <b-thead head-variant="dark">
        <b-tr>
          <b-th>Id</b-th>
          <b-th>Role</b-th>
          <b-th>SNS type</b-th>
          <b-th>Status</b-th>
          <b-th>Email</b-th>
          <b-th>Name</b-th>
          <b-th>Created at</b-th>
          <b-th>Updated at</b-th>
          <b-th></b-th>
        </b-tr>
      </b-thead>

      <b-tbody v-cloak>
        <b-tr v-for="(user, index) in users" :key="index" @click="goDetail(user.id)">
          <b-td>{{ user.id }}</b-td>
          <b-td>{{ user.role }}</b-td>
          <b-td>{{ user.snsType }}</b-td>
          <b-td>{{ user.status }}</b-td>
          <b-td>{{ user.email }}</b-td>
          <b-td>{{ user.name }}</b-td>
          <b-td>{{ user.createdAt }}</b-td>
          <b-td>{{ user.updatedAt }}</b-td>
          <b-td>
            <b-icon
              class="icon-delete"
              icon="x"
              variant="danger"
              font-scale="2"
              @click="deleteUser(user.id)"
            ></b-icon>
          </b-td>
        </b-tr>
      </b-tbody>
    </b-table-simple>
  </div>
</template>
<script>
export default {
  name: "AdminUserLit",
  data() {
    return {
      currentPage: 1,
      users: [],
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
    this.getUserList(this.query);
  },
  watch: {
    currentPage() {
      this.getUserList(this.query);
    }
  },
  mounted() {},
  methods: {
    getUserList(query) {
      Object.keys(query).forEach(key =>
        query[key] === undefined || query[key] === "" ? delete query[key] : {}
      );
      query.offset = this.currentPage - 1;

      return this.$httpService
        .get("/users", {
          params: query
        })
        .then(res => {
          this.users = res.data.users;
          this.totalCount = res.data.totalCount;
        });
    },
    deleteUser(id) {
      if (confirm("realy want delete this user?")) {
        return this.$httpService.delete("/users/" + id).then(res => {
          console.log(res);
          alert("delete success");
        });
      }
    },
    goDetail(id) {
      this.$router.push({ name: "AdminUserEdit", params: { id: id } });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>

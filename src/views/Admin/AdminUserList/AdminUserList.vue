<template>
  <div class="wrap-list">
    <div class="d-flex flex-row justify-content-between bd-highlight mb-3">
      <h1>유저 리스트</h1>
      <b-button to="/admin/users/add" variant="danger">추가</b-button>
    </div>
    <b-row class="mb-3">
      <b-col cols="2">
        <b-form-select v-model="query.orderby" :options="orderbys" @change="getUserList(query)"></b-form-select>
      </b-col>

      <b-col cols="2">
        <b-form-input
          v-model="query.name"
          placeholder="name 입력"
          v-on:keyup.enter="getUserList(query)"
        ></b-form-input>
      </b-col>
    </b-row>
    <b-table-simple hover small caption-top responsive>
      <b-thead head-variant="dark">
        <b-tr>
          <b-th class="align-middle text-center">Id</b-th>
          <b-th class="align-middle text-center">Role</b-th>
          <b-th class="align-middle text-center">Name</b-th>
          <b-th class="align-middle text-center">SNS type</b-th>
          <b-th class="align-middle text-center">Status</b-th>
          <b-th class="align-middle text-center">Email</b-th>
          <b-th class="align-middle text-center">CreatedAt</b-th>
          <b-th class="align-middle text-center">관리</b-th>
        </b-tr>
      </b-thead>

      <b-tbody v-cloak>
        <b-tr v-for="(user, index) in users" :key="index">
          <b-td class="align-middle text-center">{{ user.id }}</b-td>
          <b-td class="align-middle text-center">{{ user.role }}</b-td>
          <b-td class="align-middle text-center">{{ user.name }}</b-td>
          <b-td class="align-middle text-center">{{ user.snsType }}</b-td>
          <b-td class="align-middle text-center">{{ user.status }}</b-td>
          <b-td class="align-middle text-center">{{ user.email }}</b-td>
          <b-td
            class="align-middle text-center"
          >{{ user.createdAt | moment("YYYY년 MMMM Do H:mm:ss") }}</b-td>
          <b-td class="align-middle text-center">
            <b-icon
              class="icon-delete align-middle text-center"
              icon="pencil"
              variant="success"
              @click="goDetail(user.id)"
            ></b-icon>
            <b-icon
              class="icon-delete align-middle text-center"
              icon="trash"
              variant="danger"
              @click="deleteUser(user.id)"
            ></b-icon>
          </b-td>
        </b-tr>
      </b-tbody>
    </b-table-simple>
    <b-pagination
      v-model="currentPage"
      :total-rows="totalCount"
      :per-page="query.take"
      @change="getUserList(query)"
    ></b-pagination>
  </div>
</template>
<script>
export default {
  name: "AdminUserList",
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
      if (confirm("정말 삭제하시겠습니까?") !== false) {
        this.$httpService.delete("/users/" + id).then(res => {
          this.getUserList(this.query);
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

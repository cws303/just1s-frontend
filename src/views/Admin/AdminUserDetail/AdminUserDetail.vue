<template>
  <div>
    <h1>유저 {{ user.id ? `#${user.id} 수정` : '추가'}}</h1>
    <b-form @submit="onSubmit" @reset="onReset" class="detail" v-cloak>
      <b-form-group
        v-if="user.id"
        label="Id"
        label-for="input-id"
        description="We'll never share your email with anyone else."
      >
        <b-form-input id="input-id" v-model="user.id" disabled placeholder="Id"></b-form-input>
      </b-form-group>

      <b-form-group label="SNS type" label-for="input-snstype">
        <b-form-select id="input-snstype" v-model="user.snsType" :options="snsTypes" required></b-form-select>
      </b-form-group>

      <b-form-group label="status" label-for="input-status">
        <b-form-select id="input-status" v-model="user.status" :options="statuses" required></b-form-select>
      </b-form-group>

      <b-form-group label="role" label-for="input-role">
        <b-form-select id="input-role" v-model="user.role" :options="roles" required></b-form-select>
      </b-form-group>

      <b-form-group label="Email" label-for="input-email">
        <b-form-input
          id="input-email"
          v-model="user.email"
          type="email"
          required
          placeholder="Enter email"
        ></b-form-input>
      </b-form-group>

      <b-form-group label="img url" label-for="input-imgUrl">
        <b-form-input id="input-imgUrl" v-model="user.imgUrl" required placeholder="Enter"></b-form-input>
      </b-form-group>

      <b-form-group label="name" label-for="input-name">
        <b-form-input id="input-name" v-model="user.name" required placeholder="Enter name"></b-form-input>
      </b-form-group>

      <b-button type="submit" variant="primary">Submit</b-button>
      <b-button type="reset" variant="danger">Reset</b-button>
    </b-form>
    <b-card class="mt-3" header="Form Data Result">
      <pre class="m-0">{{ user }}</pre>
    </b-card>
  </div>
</template>
<script>
export default {
  name: "Detail",
  data() {
    return {
      user: {},
      snsTypes: ["EMAIL", "INSTAGRAM", "FACEBOOK", "NAVER"],
      roles: ["NORMAL", "STAFF", "MASTER"],
      statuses: ["NORMAL", "WITHDRAWN"],
      show: true
    };
  },
  methods: {
    async getOldOne(id) {
      const res = await this.$httpService.get("/users/" + id);
      if (!res.data) {
        throw Error();
      }
      this.user = res.data;
      console.log(this.user);
    },
    async add() {
      // TODO : common method로 빼기
      const fieldsToAdd = [
        "snsType",
        "status",
        "snsKey",
        "email",
        "imgeUrl",
        "name",
        "role"
      ];
      const formData = Object.keys(this.user).reduce((result, key) => {
        if (fieldsToAdd.includes(key)) {
          result[key] = this.user[key];
        }
        return result;
      }, {});
      const res = await this.$httpService.post("/users", formData);
      alert("추가되었습니다.");
      this.$router.push({ name: "AdminUserList" });
    },
    async edit() {
      const fieldsToEdit = [
        "id",
        "snsType",
        "status",
        "snsKey",
        "email",
        "imgeUrl",
        "name",
        "role"
      ];
      const formData = Object.keys(this.user).reduce((result, key) => {
        if (fieldsToEdit.includes(key)) {
          result[key] = this.user[key];
        }
        return result;
      }, {});
      const res = await this.$httpService.put(
        "/users/" + formData.id,
        formData
      );
      alert("수정되었습니다.");
      this.$router.push({ name: "AdminUserList" });
    },
    onSubmit(e) {
      e.preventDefault();
      if (this.user.id) {
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
    const userId = this.$route.params.id;
    if (userId) {
      this.getOldOne(userId).catch(e => {
        alert("데이터를 가져오는데 실패했습니다. 추가 페이지로 이동합니다.");
        this.$router.push({ name: "AdminUserAdd" });
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

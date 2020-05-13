<template>
  <div class="wrap-list">
    <div class="wrap-top">
      <span class="title">리뷰 리스트</span>
      <router-link to='/admin/users/add'>
        <b-button variant="danger" class="add">추가</b-button>
      </router-link>
    </div>
    <!-- <b-table class="list" striped hover :items="users" :fields="fields"></b-table> -->
    <b-table-simple hover small caption-top responsive>
      <b-thead head-variant="dark">
        <b-tr>
          <b-th>Id</b-th>
          <b-th>SNS type</b-th>
          <b-th>Status</b-th>
          <b-th>Email</b-th>
          <b-th>Name</b-th>
          <b-th>Created at</b-th>
          <b-th>Updated at</b-th>
          <b-th> </b-th>
        </b-tr>
      </b-thead>
    
      <b-tbody v-cloak>
        <b-tr v-for="(user, index) in users" :key="index" @click="goDetail(user.id)">
          <b-td>{{user.id}}</b-td>
          <b-td>{{user.snsType}}</b-td>
          <b-td>{{user.status}}</b-td>
          <b-td>{{user.email}}</b-td>
          <b-td>{{user.name}}</b-td>
          <b-td>{{user.createdAt}}</b-td>
          <b-td>{{user.updatedAt}}</b-td>
          <b-td><b-icon class="icon-delete" icon="x" variant="danger" font-scale="2" @click="deleteUser(user.id)"></b-icon></b-td>
        </b-tr>
      </b-tbody>
    </b-table-simple>
  </div>
</template>
<script>
import axios from 'axios'
// import * as users from '@/api/users'

export default {
  name: 'List',
  data () {
    return {
      users: [],
      fields: ['id', 'createdAt', 'updateAt', 'snsType', 'status', 'snsKey', 'email', 'name']
    }
  },
  created () {
    this.getUserList()
  },
  mounted () {
  },
  methods: {
    getUserList () {
      return axios.get('/api/users').then(res => {
        console.log(res.data.users)
        this.users = res.data.users
      })
    },
    deleteUser (id) {
      if(confirm("realy want delete this user?")){
        return axios.delete('/api/users/' + id).then(res => {
          console.log(res)
          alert('delete success')
        })
      }
    },
    goDetail(id) {
      this.$router.push('/admin/users/' + id)
    }
  }
}
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

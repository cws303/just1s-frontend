<template>
  <div class="admin-body">
    <admin-header></admin-header>
    <router-view></router-view>
  </div>
</template>

<script>
import AdminHeader from './components/header'
export default {
  name: 'Admin',
  components: {
    AdminHeader
  }
}
</script>
<style lang="scss" scoped>
  .admin-body {
    padding-top: 10%;
  }
</style>

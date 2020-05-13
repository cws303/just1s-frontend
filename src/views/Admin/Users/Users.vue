<template>
  <div id="users">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'User'
}
</script>
<style lang="scss" scoped>
  #users {
    height: 100%;
    position: relative;
  }
</style>

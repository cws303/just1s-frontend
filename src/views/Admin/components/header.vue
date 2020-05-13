<template>
  <header class="header">
    <p class="title">Just 1 Second</p>
  </header>
</template>

<script>
export default {
  name: 'AdminHeader'
}
</script>

<style lang="scss" scoped>
  .header {
    background-color:black;
    color: white;
    position: fixed;
    top: 0;
    height: 10%;
    width: 100%;

    .title {
      margin-top: 20px;
      margin-left: 100px;
      font-size: 30px;
      font-weight: bold;
    }
  }
</style>

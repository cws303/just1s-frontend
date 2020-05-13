<template>
  <footer class="web-footer">
    <p class="title">2020 All Right Reserved</p>
  </footer>
</template>

<script>
export default {
  name: "WebFooter"
};
</script>

<style lang="scss" scoped>
.web-footer {
  background-color: #a239ca;
  color: white;
  display: flex;
  height: 10%;
  width: 100%;

  .title {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>

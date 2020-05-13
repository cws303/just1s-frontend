<template>
  <header class="web-header">
    <p class="title">듣고 맞춰보세요 - 단1초</p>
  </header>
</template>

<script>
export default {
  name: "WebHeader"
};
</script>

<style lang="scss" scoped>
.web-header {
  display: flex;
  background-color: #a239ca;
  color: white;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  .title {
    height: 100%;
    display: flex;
    align-items: center;
    font-size: 30px;
    font-weight: bold;
  }
}
</style>

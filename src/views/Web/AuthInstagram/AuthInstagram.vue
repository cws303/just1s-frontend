<template>
  <div id="view-auth-instagram">{{accessToken}}</div>
</template>

<script>
export default {
  name: "AuthInstagram",
  data() {
    return {
      msg: "AuthInstagram"
    };
  },
  created() {
    console.log(this.$route.query);
    accessToken = this.$route.query.access_token;
    window.postMessage("instagram-login", accessToken);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>

<template>
  <b-navbar type="dark" variant="dark">
    <!-- <b-navbar-brand
      ><router-link to="/admin">Just1s</router-link></b-navbar-brand
    >-->
    <b-navbar-brand to="/admin">Just1s</b-navbar-brand>
    <b-navbar-nav>
      <b-nav-item-dropdown text="관리" right>
        <b-dropdown-item to="/admin/users">유저 관리</b-dropdown-item>
        <b-dropdown-item to="/admin/decks">덱 관리</b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>
    <!-- Right aligned nav items -->
    <b-navbar-nav class="ml-auto">
      <b-navbar-brand>이름</b-navbar-brand>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
export default {
  name: "AdminHeader"
};
</script>

<style lang="scss" scoped></style>

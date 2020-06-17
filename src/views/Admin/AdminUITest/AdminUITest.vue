<template>
  <div class="ui-test">
    fdfd11
    <b-form-group
      id="product-title"
      label="title을 입력해주세요 111"
      label-for="product-title"
      :invalid-feedback="invalidFeedback"
      :valid-feedback="validFeedback"
      :state="state"
    >
      <b-form-input
        id="product-title"
        v-model="name"
        :state="state"
        trim
      ></b-form-input>
    </b-form-group>
  </div>
</template>
<script>
export default {
  name: "AdminUITest",
  computed: {
    state() {
      return this.name.length >= 4 ? true : false;
    },
    invalidFeedback() {
      if (this.name.length > 4) {
        return "";
      } else if (this.name.length > 0) {
        return "Enter at least 4 characters";
      } else {
        return "Please enter something";
      }
    },
    validFeedback() {
      return this.state === true ? "Thank you" : "";
    }
  },
  data() {
    return {
      name: ""
    };
  }
};
</script>
<style lang="scss" scoped></style>

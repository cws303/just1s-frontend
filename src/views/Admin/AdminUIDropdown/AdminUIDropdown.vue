<template>
  <div class="ui-dropdown">
    <b-form-group label="object 형태" label-for="input-product">
      <b-form-select
        id="input-product"
        :options="products"
        text-field="name"
        value-field="id"
        v-model="product.product"
      ></b-form-select>
    </b-form-group>
    [{{product.product}}]
    <b-form-group label="날짜/시간" label-for="input-beginAt">
      <nbase-datetimepicker v-model="product.beginAt"></nbase-datetimepicker>
    </b-form-group>
    [{{product.beginAt}}]
  </div>
</template>
<script>
import moment from "moment";
import NbaseDatetimepicker from "./components/NbaseDatetimepicker";
export default {
  name: "AdminUIDropdown",
  data() {
    return {
      products: [
        { name: "이거", price: 100, id: 1 },
        { name: "저거", price: 200, id: 2 }
      ],
      product: {
        endAt: "2020-05-08T08:07:46.850Z"
      }
    };
  },
  components: {
    NbaseDatetimepicker
  }
};
</script>
<style lang="scss" scoped></style>


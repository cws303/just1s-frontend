<template>
  <div class="ui-dropdown">
    <b-form-group label="object 형태" label-for="input-snsType">
      <nbase-select
        :items="snsTypes"
        text-field="name"
        value-field="typeId"
        v-model="product.snsType"
      ></nbase-select>
    </b-form-group>
    [{{product.snsType}}]
    <b-form-group label="날짜/시간" label-for="input-beginAt">
      <nbase-datetimepicker v-model="product.beginAt"></nbase-datetimepicker>
    </b-form-group>
    [{{product.beginAt}}]
  </div>
</template>
<script>
import moment from "moment";
import NbaseDatetimepicker from "./components/NbaseDatetimepicker";
import NbaseSelect from "./components/NbaseSelect";
export default {
  name: "AdminUIDropdown",
  data() {
    return {
      snsTypes: [
        { name: "이거", foo: "bar1", typeId: 1 },
        { name: "저거", foo: "bar12", typeId: 2 }
      ],
      product: {
        endAt: "2020-05-08T08:07:46.850Z"
      }
    };
  },
  components: {
    NbaseDatetimepicker,
    NbaseSelect
  }
};
</script>
<style lang="scss" scoped></style>


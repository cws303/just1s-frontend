<template>
  <div class="ui-test">
    <div>
      <b-btn v-b-modal.modal1>Launch demo modal</b-btn>
      <b-modal id="modal1" title="Bootstrap-Vue">
        <b-btn v-b-modal.modal2>Launch another modal</b-btn>
      </b-modal>
      <b-modal id="modal2" title="Bootstrap-Vue">Vueception</b-modal>
    </div>
    <b-form-group id="product-title" label="title을 입력해주세요" label-for="product-title">
      <b-form-input id="product-title" v-model="product.title" trim></b-form-input>
    </b-form-group>
    <b-form-group id="product-price" label="price을 입력해주세요" label-for="product-price">
      <b-form-input id="product-price" v-model="product.price" type="number" trim></b-form-input>
    </b-form-group>
    <b-form-group label="role" label-for="input-role">
      <b-form-select id="input-role" v-model="product.role" :options="roles" required></b-form-select>
    </b-form-group>
    <b-form-group label="프리오더 여부" label-for="input-isGood">
      <b-form-checkbox v-model="product.isGood" name="check-button" switch></b-form-checkbox>
    </b-form-group>
    [{{product.beginAt}}]
    <b-card class="mt-3" header="debug">
      <pre style="font-size:9px" class="m-0">{{ product }}</pre>
    </b-card>
  </div>
</template>
<script>
export default {
  name: "AdminUITest",
  data() {
    return {
      roles: ["NORMAL", "STAFF", "MASTER"],
      snsTypes: [
        { name: "이거", foo: "bar1", typeId: 1 },
        { name: "저거", foo: "bar12", typeId: 2 }
      ],
      product: {
        endAt: "2020-05-08T08:07:46.850Z"
      }
    };
  },
  methods: {},
  components: {}
};
</script>
<style lang="scss" scoped></style>


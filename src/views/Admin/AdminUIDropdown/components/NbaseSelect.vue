<template>
  <b-form-select id="input-snsType" :options="innerItems" v-on:change="onChange($event)"></b-form-select>
</template>

<script>
export default {
  props: {
    items: {
      type: [Object, Array]
    },
    textField: {
      type: String,
      default: "name"
    },
    valueField: {
      type: String,
      default: "id"
    },
    isDebugMode: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    onChange(event) {
      this.$emit("input", event);
    },
    toDropdown(arrObj, textName, valueName) {
      // TODO 이 로직 포함하여 컴포넌트화 하여 플러터 처럼 UI 상 경고 처리
      if (arrObj.length < 1) {
        return {};
      }
      if (arrObj[0].hasOwnProperty(textName) === false) {
        console.log(textName + "이 없습니다.");
        return {};
      }
      if (arrObj[0].hasOwnProperty(valueName) === false) {
        console.log(valueName + "이 없습니다.");
        return {};
      }
      return arrObj.map(obj => {
        return {
          text: obj[textName],
          value: obj[valueName]
        };
      });
    }
  },
  created() {
    this.innerItems = this.toDropdown(
      this.items,
      this.textField,
      this.valueField
    );
    console.log("inner", this.innerItems);
  },
  data() {
    return {
      innerItems: [],
      item: null
    };
  }
};
</script>

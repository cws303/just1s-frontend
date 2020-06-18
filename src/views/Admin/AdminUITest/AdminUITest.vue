ftoDropdown<template>
  <div class="ui-test">
    <b-form-group id="product-title" label="title을 입력해주세요" label-for="product-title">
      <b-form-input id="product-title" v-model="product.title" trim></b-form-input>
    </b-form-group>
    <b-form-group id="product-price" label="price을 입력해주세요" label-for="product-price">
      <b-form-input id="product-price" v-model="product.price" type="number" trim></b-form-input>
    </b-form-group>

    <b-form-group label="role" label-for="input-role">
      <b-form-select id="input-role" v-model="product.role" :options="roles" required></b-form-select>
    </b-form-group>

    <b-form-group label="snsType122" label-for="input-snsType">
      <nbase-select
        :items="snsTypes"
        text-field="name"
        value-field="typeId"
        v-model="product.snsType"
      ></nbase-select>
    </b-form-group>
    [{{product.snsType}}]
    <b-form-group label="프리오더 여부" label-for="input-isGood">
      <b-form-checkbox v-model="product.isGood" name="check-button" switch></b-form-checkbox>
    </b-form-group>
    <b-form-group label="날짜/시간" label-for="input-beginAt">
      <nbase-datetimepicker v-model="product.beginAt"></nbase-datetimepicker>
    </b-form-group>
    [{{product.beginAt}}]
    <b-card class="mt-3" header="debug">
      <pre style="font-size:9px" class="m-0">{{ product }}</pre>
    </b-card>
  </div>
</template>
<script>
import moment from "moment";

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
  methods: {
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
  components: {
    "nbase-datetimepicker": {
      template: `
<div>
    <b-row>
      <b-col>
        <b-form-datepicker v-model="date" locale="ko"></b-form-datepicker>
      </b-col>
      <b-col>
        <b-form-timepicker v-model="time" locale="ko"></b-form-timepicker>
      </b-col>
    </b-row>
    <b-card v-if="isDebugMode" :header="'[debug] ' + tagName + ' component'">
      <pre style="font-size:9px" class="m-0">
  date : {{ date }}
  time : {{ time }}
  output : {{ output }}
      </pre>
    </b-card>
</div>
`,
      props: {
        value: {
          type: String
        },
        isDebugMode: {
          type: Boolean,
          default: true
        }
      },
      methods: {
        // TODO : onChange 콜백
        parseDateFromTZ(tz) {
          const datetimeStr = moment
            .tz(tz, "Asia/Seoul")
            .format("YYYY-MM-DD HH:mm:ss");
          const [dateStr, timeStr] = datetimeStr.split(" ");
          return {
            date: dateStr,
            time: timeStr
          };
        }
      },
      created() {
        const dateTime =
          this.value !== undefined
            ? this.value
            : moment.tz().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

        const { date: dateParsed, time: timeParsed } = this.parseDateFromTZ(
          dateTime
        );
        this.date = dateParsed;
        this.time = timeParsed;
      },
      computed: {
        tagName: function() {
          return this.$options._componentTag;
        },
        output: function() {
          const result = moment(`${this.date} ${this.time}`).format(
            "YYYY-MM-DDThh:mm:ss.SSS[Z]"
          );
          this.$emit("input", result);
          return result;
        }
      },
      data() {
        return {
          date: "",
          time: ""
        };
      }
    },
    "nbase-select": {
      template: `
    <b-form-select
      id="input-snsType"
      :options="innerItems"
      v-on:change="onChange($event)"
    ></b-form-select>
`,
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
    }
  }
};
</script>
<style lang="scss" scoped></style>


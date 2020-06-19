<template>
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
</template>
<script>
import moment from "moment";
export default {
  data() {},
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
};
</script >
  <style></style>;

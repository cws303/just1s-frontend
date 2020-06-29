<template>
  <b-form-group label="대표 이미지">
    <div class="ml-3 mr-3">
      <b-row>
        <b-col style="border:1px solid #ccc" class="p-3">
          <b-form-file
            v-model="tempFile"
            placeholder="파일을 선택하거나 드래그앤드랍 해주세요"
            drop-placeholder="여기 넣어주세요"
            accept=".jpg, .png, .gif"
            @change="setWithFile"
          ></b-form-file>
          <b-form-input
            @change="setWithURL"
            id="input-temp-image"
            v-model="tempImage"
            placeholder="Enter"
          ></b-form-input>
        </b-col>
      </b-row>
      <b-row v-if="preview !== ''">
        <b-col class="p-3 preview-wrapper">
          <span class="preview-desc">{{preview}}</span>
          <b-img height="200" width="200" :src="preview"></b-img>
        </b-col>
      </b-row>
    </div>
  </b-form-group>
</template>
<script>
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
    async setWithFile(event) {
      const file = event.target.files[0];
      const result = await this.$httpService.imageUpload(file);
      this.preview = result.data.url;
      this.tempImage = null;
      this.$emit("input", this.preview);
    },
    setWithURL(event) {
      this.preview = event;
      this.tempFile = null;
      this.$emit("input", this.preview);
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.setWithURL(val);
      }
    }
  },
  data() {
    return {
      tempFile: null,
      tempImage: null,
      preview: null
    };
  }
};
</script >
<style>
.preview-wrapper {
  background-color: #ccc;
  position: relative;
}
.preview-desc {
  font-size: 9px;
  color: #555;
  position: absolute;
}
</style>

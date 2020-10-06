<template>
  <div class="app-input" :class="classSize">
    <label v-if="label" :class="classLabel">{{label}}</label>
    <div class="app-input-file-upload" v-else-if="type == 'file'">
      <label class="app-input-file-upload__label">
        {{placeholder}}
        <input
          type="file"
          class="app-input-file-upload__input"
          :value="value"
          :disabled="disabled"
          @input="updateInput"
        />
        <p class="app-input__error" v-if="message && validate == 2">{{message}}</p>
      </label>
    </div>
  </div>
</template>

<script>
// import IconSuccess from "~/assets/svg/icons/success.svg?inline";

export default {
  inheritAttrs: false,

  components: {
    // IconSuccess
  },
  model: {
    prop: "value",
    event: "input"
  },

  props: {
    value: {
      type: [String, Number],
      required: false,
      default: ""
    },
    validate: {
      type: [String, Number],
      required: false,
      default: 0
    },
    placeholder: {
      type: String,
      required: false,
      default: ""
    },
    size: {
      type: String,
      required: false,
      default: ""
    },
    message: {
      type: String,
      required: false,
      default: ""
    },
    label: String,
    labelFixed: {
      type: Boolean,
      default: false
    },
    labelBold: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    error: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {};
  },

  methods: {
    updateInput: function(event) {
      this.$emit("input", event.target.value);
    }
  },

  computed: {
    classSize() {
      const disableClass = {
        disabled: this.disabled
      };
      const classSize = {
        "input--size-xs": this.size === "xs",
        "input--size-sm": this.size === "sm",
        "input--size-md": this.size === "md" || !this.size,
        "input--size-lg": this.size === "lg"
      };
      return { ...classSize, ...disableClass };
    },

    classLabel() {
      const labelBold = {
        "label-bold": this.labelBold
      };
      const labelFixed = {
        "label-fixed": this.labelFixed
      };
      return { ...labelBold, ...labelFixed };
    }
  }
};
</script>

<style lang="scss">
// @import "@/styles/scss/components/app/_app-input.scss";
</style>
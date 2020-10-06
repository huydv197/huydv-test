<template>
  <div class="app-input" :class="classSize">
    <label v-if="label" :class="classLabel">
      {{ label }}
      <span class="label--sub" v-if="subLabel">{{ subLabel }}</span>
    </label>
    <div class="app-input__input">
      <slot name="prepend-inner"></slot>
      <!-- Textarea  -->
      <textarea
        v-if="textarea"
        v-bind="$attrs"
        v-textarea-autosize="autosize"
        ref="input"
        :rows="rows"
        :type="type"
        :value="localValue"
        :placeholder="placeholder"
        :disabled="disabled"
        v-on="inputListeners"
      />
      <!-- Input Text  -->
      <input
        v-else
        v-bind="$attrs"
        ref="input"
        :type="type"
        :value="localValue"
        :disabled="disabled"
        :placeholder="placeholder"
        v-on="inputListeners"
      />

      <slot name="append-inner"></slot>

      <div class="app-input__unit" v-if="$slots.unit">
        <slot name="unit"></slot>
      </div>

      <div class="app-input__validate-status" v-if="localValidate">
        <svg-icon
          v-if="localValidate == VALIDATE_STATUS.SUCCESS"
          icon-class="check"
          class-name="mr-1 app-input__validate-status--success"
        >
        </svg-icon>
        <svg-icon
          v-if="localValidate == VALIDATE_STATUS.ERROR"
          icon-class="error"
          class-name="mr-1 app-input__validate-status--error"
        >
        </svg-icon>
        <svg-icon
          v-if="localValidate == VALIDATE_STATUS.WARNING"
          icon-class="warning"
          class-name="mr-1 app-input__validate-status--warning"
        >
        </svg-icon>
      </div>

      <div v-if="counter" class="app-input__counter">
        {{ `${localValue.toString().length}/${counter}` }}
      </div>
    </div>

    <div
      class="app-input__default"
      v-if="message && localValidate == VALIDATE_STATUS.DEFAULT"
    >
      {{ message }}
    </div>
    <div
      class="app-input__success"
      v-if="message && localValidate == VALIDATE_STATUS.SUCCESS"
    >
      {{ message }}
    </div>
    <div
      class="app-input__error"
      v-else-if="message && localValidate == VALIDATE_STATUS.ERROR"
    >
      {{ message }}
    </div>
    <div
      class="app-input__warning"
      v-else-if="message && localValidate == VALIDATE_STATUS.WARNING"
    >
      {{ message }}
    </div>
  </div>
</template>

<script>
import { APP_INPUT_VALIDATE_STATUS as VALIDATE_STATUS } from "@/utils/constants";
import TextareaAutosize from '@/directive/textarea-autosize/index.js'

export default {
  inheritAttrs: false,

  directives: {
    'textarea-autosize': TextareaAutosize
  },

  components: {
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
    placeholder: {
      type: String,
      required: false,
      default: ""
    },
    type: {
      type: String,
      required: false,
      default: "text"
    },
    size: {
      type: String,
      required: false,
      default: ""
    },
    disabled: Boolean,
    validate: {
      type: [String, Number],
      required: false,
      default: VALIDATE_STATUS.DEFAULT
    },
    message: {
      type: String,
      required: false,
      default: ""
    },
    label: String,
    labelFixed: Boolean,
    labelBold: Boolean,
    textarea: Boolean,
    rows: {
      type: [String, Number],
      required: false,
      default: 6
    },
    counter: {
      type: Number
    },
    subLabel: String,
    onlyNumber: {
      type: Boolean,
      default: false
    },
    autosize: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      VALIDATE_STATUS: Object.freeze(VALIDATE_STATUS),
      localValue: this.value,
      localValidate: this.validate,
      isFocus: false
    };
  },

  computed: {
    hasUnitSlot() {
      return !!this.$slots["unit"];
    },

    classSize() {
      const disableClass = {
        disabled: this.disabled
      };
      const classSize = {
        "app-input--size-xs": this.size === "xs",
        "app-input--size-sm": this.size === "sm",
        "app-input--size-md": this.size === "md" || !this.size,
        "app-input--size-lg": this.size === "lg"
      };
      return {
        ...classSize,
        ...disableClass,
        "app-input--has-counter": !!this.counter,
        "app-input--error": this.localValidate === VALIDATE_STATUS.ERROR,
        "app-input--success": this.localValidate === VALIDATE_STATUS.SUCCESS,
        "app-input--warning": this.localValidate === VALIDATE_STATUS.WARNING,
        "app-input--focused": this.isFocus,
        "app-input--textarea": this.textarea
      };
    },

    classLabel() {
      const labelBold = {
        "app-input__label--bold": this.labelBold
      };
      const labelFixed = {
        "app-input__label--fixed": this.labelFixed
      };
      return {
        "app-input__label": true,
        ...labelBold,
        ...labelFixed
      };
    },

    inputListeners: function() {
      const vm = this;
      // `Object.assign` merges objects together to form a new object
      return Object.assign(
        {},
        // We add all the listeners from the parent
        this.$listeners,
        // Then we can add custom listeners or override the
        // behavior of some listeners.
        {
          // This ensures that the component works with v-model
          input: event => this.updateInput(event),
          blur: event => this.handleBlur(event),
          focus: event => this.handleFocus(event)
        }
      );
    }
  },

  watch: {
    value(newValue) {
      this.localValue = newValue;
    },

    localValue(newValue) {
      if (this.counter) {
        this.validateCounter();
      }
    },

    validate(newValue) {
      this.localValidate = newValue;
    }
  },

  methods: {
    updateInput: function(event) {
      if (this.onlyNumber == true) {
        this.localValue = event.target.value.replace(/[^\d]/g, "");
        this.$emit("input", parseFloat(this.localValue));
      } else {
        this.localValue = event.target.value;
        this.$emit("input", event.target.value);
      }
    },

    handleFocus(event) {
      this.$emit("onFocus", event);
      this.isFocus = true;
    },

    handleBlur(event) {
      this.$emit("handleBlur", event);
      this.$emit("onBlur", event);
      this.isFocus = false;
    },

    validateCounter() {
      const { counter, localValue } = this;
      const valueLength = localValue.toString().length;

      if (valueLength > counter) {
        this.localValidate = VALIDATE_STATUS.ERROR;
      } else {
        this.localValidate = VALIDATE_STATUS.DEFAULT;
      }
    },

    focus() {
      this.$refs.input.focus();
    }
  }
};
</script>

<style lang="scss">
@import "@/styles/components/app/_app-input.scss";
</style>

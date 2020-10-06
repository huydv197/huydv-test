<template>
  <div class="app-select" :class="classes" v-click-outside="hideOptions">
    <label v-if="label" :class="classLabel">
      {{ label }}
    </label>
    <!-- TAGS MODE -->
    <template v-if="mode === 'tags' || mode === 'multiple'">
      <div class="app-select__selected" @click="handleClickSelected">
        <span class="app-select__placeholder" v-if="!localValue.length">
          {{
          $attrs.placeholder || ""
          }}
        </span>
        <app-tag
          v-for="(item, index) in selected"
          :key="item.value"
          class="ma-1"
          show-close
          @close.stop="handleCloseTag(item, index)"
        >{{ item.text }}</app-tag>

        <div class="app-select__field">
          <input
            ref="search"
            type="text"
            autocomplete="off"
            class="app-select__field__input"
            v-model="search"
            @input="handleSearchTag"
          />
          <!-- <span class="app-select__field__mirror">{{ search }}</span> -->
        </div>
      </div>

      <div class="app-select__options" v-show="active">
        <div
          v-if="!tmpOptions.length && emptyMessage"
          class="app-select__option text-sub text-center"
        >{{ emptyMessage }}</div>

        <div
          v-for="option in tmpOptions"
          class="app-select__option"
          :class="{ active: localValue.includes(option.value) }"
          :key="option.value"
          @click="handleClickOption(option)"
        >
          <span v-if="localValue.includes(option.value)" class="app-select__checked-icon">
            <svg-icon icon-class="checked"></svg-icon>
          </span>
          <slot v-if="$scopedSlots.option || $slots.option" name="option" :option="option" />
          <template v-else>{{ option.text }}</template>
        </div>

        <slot name="options-append" />
      </div>
    </template>
    <!-- END TAGS MODE -->

    <!-- DEFAULT MODE -->
    <template v-else>
      <div class="app-select__selected" tabindex="0" @click="handleClickSelected">
        <span class="app-select__prepend" v-if="$slots.prepend || $scopedSlots.prepend">
          <slot name="prepend" :selected="selected" />
        </span>

        <span
          v-if="localValue === null || localValue === undefined"
          class="app-select__placeholder"
        >{{ $attrs.placeholder || "" }}</span>

        <span v-else class="app-select__selected-value">
          {{
          selected.text
          }}
        </span>

        <div class="mr-auto"></div>

        <template v-if="searchable">
          <div v-show="active" class="app-select__search">
            <input
              ref="search"
              type="text"
              autocomplete="off"
              class="app-select__search-input"
              v-model="search"
              @input="handleSearchDefault"
            />
          </div>
        </template>

        <template v-if="showClear">
          <span
            v-if="!(localValue === null || localValue === undefined)"
            class="app-select__clear"
            @click.stop="handleClickClear"
          >
            <svg-icon icon-class="cancel"></svg-icon>
          </span>
        </template>

        <span class="app-select__arrow">
          <!--Slot for change the caret icon-->
          <slot name="placeholder-icon">
            <svg-icon icon-class="sort-down"></svg-icon>
          </slot>
        </span>
      </div>

      <div class="app-select__options" v-show="active">
        <div
          v-if="!tmpOptions.length && emptyMessage"
          class="app-select__option text-sub"
        >{{ emptyMessage }}</div>

        <div
          v-for="option in tmpOptions"
          :class="[
            'app-select__option',
            option.value === localValue && 'active',
          ]"
          :key="option.value"
          @click="handleClickOption(option)"
        >
          <span v-if="option.value === localValue" class="app-select__checked-icon">
            <svg-icon icon-class="checked"></svg-icon>
          </span>
          <slot v-if="$scopedSlots.option || $slots.option" name="option" :option="option" />
          <template v-else>{{ option.text }}</template>
        </div>

        <slot name="options-append" />
      </div>
    </template>
    <!-- END DEFAULT MODE -->
  </div>
</template>

<script>
import { uniqWith } from "lodash";
import ClickOutside from '@/directive/click-outside/index.js' // use clipboard by v-directive

// const IconExpandMore = () =>
//   import("~/assets/svg/v2-icons/expand_more_24px.svg?inline");
// const IconClose = () => import("~/assets/svg/icons/close.svg?inline");
// const IconTick = () => import("~/assets/svg/icons/tick-gray.svg?inline");

export default {
  inheritAttrs: false,

  directives: {
    'click-outside': ClickOutside
  },

  provide() {
    return {
      appSelect: this
    };
  },

  components: {
    // IconExpandMore,
    // IconClose,
    // IconTick
  },

  model: {
    prop: "value",
    event: "change"
  },

  props: {
    options: {
      type: Array,
      default: () => [],
      validator: value =>
        value.every(option => ["value", "text"].every(key => key in option))
    },
    value: {
      type: [String, Number, Array, Boolean],
      default: null
    },
    defaultValue: {
      type: [String, Number, Array, Boolean],
      default: null
    },
    mode: {
      type: String,
      default: "" // '' | 'tags' | 'multiple'
    },
    emptyMessage: {
      type: String,
      default: "No option"
    },
    label: String,
    labelFixed: Boolean,
    labelBold: Boolean,
    showClear: Boolean,
    searchable: Boolean,
    size: {
      type: String,
      default: "md" // 'sm' | 'md'
    },
    bordered: Boolean,
    disabled: Boolean,
    error: Boolean
  },

  data() {
    return {
      active: false,
      search: "",
      localValue:
        this.value === null || this.value === undefined
          ? this.defaultValue || (this.mode === "" ? null : [])
          : this.value || (this.mode === "" ? null : []),
      tmpOptions: this.options
    };
  },

  computed: {
    classes() {
      return {
        active: this.active,
        "app-select--disabled": this.disabled,
        "app-select--tags": ["tags", "multiple"].indexOf(this.mode) > -1,
        "app-select--searchable": this.searchable,
        "app-select--size-sm": this.size === "sm",
        "app-select--bordered": this.bordered,
        "app-select--error": this.error
      };
    },

    classLabel() {
      const labelBold = {
        "app-select__label--bold": this.labelBold
      };
      const labelFixed = {
        "app-select__label--fixed": this.labelFixed
      };
      return {
        "app-select__label": true,
        ...labelBold,
        ...labelFixed
      };
    },

    selected() {
      if (["tags", "multiple"].indexOf(this.mode) > -1) {
        return this.localValue.map(id => {
          const [optionItem = {}] = this.options.filter(
            option => option.value === id
          );
          return optionItem;
        });
      } else {
        const [optSelected = {}] = this.options.filter(
          item => item.value === this.localValue
        );
        return optSelected;
      }
    }
  },

  watch: {
    active(newValue) {
      this.$emit("visible-change", newValue);
    },

    value(newValue) {
      this.localValue = newValue;
    },

    localValue(newValue) {
      this.$emit("change", newValue, this.selected);
    },

    options: {
      immediate: true,
      handler(newValue) {
        this.setTmpOptions();
      }
    },

    search(newValue) {
      if (this.$listeners.search) {
        this.$emit("search", newValue);
      } else {
        this.setTmpOptions();
      }
    }
  },

  methods: {
    hideOptions() {
      this.active = false;
      this.search = "";
    },

    unSelectOption(index) {
      return this.localValue
        .slice(0, index)
        .concat(this.localValue.slice(index + 1, this.localValue.length));
    },

    handleClickOption(option) {
      if (["tags", "multiple"].indexOf(this.mode) > -1) {
        this.search = '';
        if (this.localValue.includes(option.value)) {
          this.localValue = this.localValue.filter(
            item => item !== option.value
          );
        } else {
          this.localValue = [...this.localValue, option.value];
        }
      } else {
        // on default mode
        this.localValue = option.value;
        this.hideOptions();
      }
    },

    handleClickSelected() {
      if (this.active) {
        this.active = false;
        this.search = "";
      } else {
        this.active = true;
        this.$nextTick(() => {
          this.$refs.search && this.$refs.search.focus();
        });
      }
    },

    handleSearchTag(e) {
      // Set width of input
      const el = e.target;
      el.style.width = el.scrollWidth + "px";

      this.search = e.target.value;
    },

    handleSearchDefault(e) {
      this.search = e.target.value;
    },

    handleCloseTag(id, index) {
      this.localValue = this.unSelectOption(index);
    },

    handleClickClear() {
      if (["tags", "multiple"].indexOf(this.mode) > -1) {
        this.localValue = [];
      } else {
        this.localValue = null;
      }
    },

    setTmpOptions() {
      const enableSearch =
        this.searchable || ["tags", "multiple"].indexOf(this.mode) > -1;
      if (enableSearch && this.search) {
        this.tmpOptions = this.options.filter(opt =>
          new RegExp(this.search, "i").test(opt.text)
        );
      } else {
        this.tmpOptions = this.options;
      }
    }
  }
};
</script>

<style lang="scss">
@import "@/styles/components/app/_app-select.scss";
</style>

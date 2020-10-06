<script>
export default {
  props: {
    nuxt: Boolean,
    flat: Boolean,
    outline: Boolean,
    fullWidth: Boolean,
    square: Boolean,
    rounded: Boolean,
    normal: Boolean,
    tag: {
      type: String,
      default: "button" // 'button', 'a'
    },
    size: {
      type: String,
      default: "md" // 'sm' | 'md' | 'lg'
    },
    color: {
      type: String,
      default: "primary" // 'primary' | 'white', ...
    },
    to: {
      type: [String, Object] // Vue-router prop. Denotes the target route of the link.
    },
    exact: {
      type: Boolean // Vue-router prop. Exactly match the link. Without this, '/' will match every route.
    },
    loading: Boolean,
    pointer: {
      type: Boolean,
      default: true,
    }
  },

  computed: {
    classes() {
      const sizeClasses = {
        "btn--size-xs": this.size === "xs",
        "btn--size-sm": this.size === "sm",
        "btn--size-md": this.size === "md",
        "btn--size-lg": this.size === "lg",
        "btn--size-xl": this.size === "xl",
        "btn--full-width": this.fullWidth
      };

      const colorClasses = {
        "btn--color-primary": this.color === "primary",
        "btn--color-secondary": this.color === "secondary",
        "btn--color-info": this.color === "info",
        "btn--color-success": this.color === "success",
        "btn--color-error": this.color === "error",
        "btn--color-warning": this.color === "warning",
      };


      const otherClasses = {
        // Border-radius
        "btn--square": this.square,
        "btn--rounded": this.rounded,

        // Font weight
        "btn--normal": this.normal,

        // State
        "btn--loading": this.loading,

        // behavior
        "btn--text": !this.pointer
      };

      return {
        "btn--flat": this.flat,
        ...sizeClasses,
        ...(this.outline ? outlineColorClasses : colorClasses),
        ...otherClasses
      };
    }
  },

  render: function(h) {
    return h(
      this.nuxt ? "router-link" : this.tag,
      {
        props: {
          to: this.to,
          exact: this.exact
        },
        attrs: this.attrs,
        class: {
          btn: true,
          ...this.classes
        },
        on: this.$listeners
      },
      [
        this.loading &&
          h("app-spin", {
            class: "btn__spin",
            props: {
              color: ['primary'].includes(this.color) ? 'white' : ''
            }
          }),
        this.$slots.default
      ]
    );
  }
};
</script>

<style lang="scss">
@import "@/styles/components/app/_app-button.scss";
</style>

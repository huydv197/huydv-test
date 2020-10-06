<script>
const classes = (props) => {
  const spinnerCls = {
    "app-spin-spinner": props.type === "spinner",
    "app-spin-spinner--white": props.color === "white",
    "app-spin-spinner--sm": props.size === "sm",
  };

  const circleCls = {
    "app-spin-circle": props.type === "circle",
    "app-spin-circle--white": props.color === "white",
    "app-spin-circle--xs": props.size === "xs",
    "app-spin-circle--sm": props.size === "sm",
    "app-spin-circle--md": props.size === "md",
    "app-spin-circle--lg": props.size === "lg",
  };

  return props.type === "spinner" ? spinnerCls : circleCls;
};

export default {
  functional: true,

  props: {
    text: {
      type: String,
    },
    color: {
      type: String,
      default: "",
      validator: (value) => ["", "white"].includes(value),
    },
    size: {
      type: String,
      default: "md",
      validator: (value) => ["xs", "sm", "md", "lg"].includes(value),
    },
    type: {
      type: String,
      default: "circle",
      validator: (value) => ["spinner", "circle"].includes(value),
    },
  },

  render(h, ctx) {
    const spinner = () =>
      h(
        "div",
        {
          class: "app-spin-spinner__dots",
        },
        [h("i"), h("i"), h("i"), h("i")]
      );

    const circle = () => h("span");

    const text = () => h("div", { class: "app-spin__text" }, ctx.props.text);

    return h(
      "div",
      {
        class: ["app-spin", ctx.data.class, classes(ctx.props)],
      },
      [
        ctx.props.type === "spinner" ? spinner() : circle(),
        ctx.text && ctx.text.length && text(),
      ]
    );
  },
};
</script>

<style lang="scss">
@import "@/styles/components/app/_app-spin.scss";
</style>
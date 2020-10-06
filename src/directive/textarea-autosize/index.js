import Vue from "vue";
import TextareaAutosize from "./textarea-autosize"

const install = () => {
  Vue.directive('textarea-autosize', TextareaAutosize)
}

if (window.Vue) {
  Vue.use(install); // eslint-disable-line
}

TextareaAutosize.install = install
export default TextareaAutosize
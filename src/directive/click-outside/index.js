import Vue from "vue";
import ClickOutside from "./click-outside"

const install = () => {
  Vue.directive('click-outside', ClickOutside)
}

if (window.Vue) {
  Vue.use(install); // eslint-disable-line
}

ClickOutside.install = install
export default ClickOutside
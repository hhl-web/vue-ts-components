import Vue, { DirectiveOptions } from "vue";
import ElementUI from "element-ui";
Vue.use(ElementUI);
import "element-ui/lib/theme-chalk/index.css";
import App from "./App.vue";

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");

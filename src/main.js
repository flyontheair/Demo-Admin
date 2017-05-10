// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router/index'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import lodash from "lodash"

Vue.config.productionTip = false
Vue.use(ElementUI)

Object.defineProperty(Vue.prototype, '$_', { value: lodash });

window.$AppMain = new Vue(
    {
      router
    }
).$mount("#app");
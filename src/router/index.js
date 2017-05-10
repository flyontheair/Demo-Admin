import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router);

import MainLayout from '../pages/MainLayout'
import one from './one'
import two from './two'

export default new Router({
    routes: [
        {
            path: '/',
            component: MainLayout,
            children: [
                one,
                two
            ]
        }
    ]
})

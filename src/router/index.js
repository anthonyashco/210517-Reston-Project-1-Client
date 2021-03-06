import Vue from 'vue';
import Router from 'vue-router';
import Login from '../components/Login.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Employee Expenses',
      component: Login,
    },
  ],
});

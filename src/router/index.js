import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/login',
        name: 'login',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/LoginView.vue')
    },
    {
        path: '/customers',
        name: 'customers',
        component: () => import(/* webpackChunkName: "about" */ '../views/CustomersView.vue')
    },
    {
        path: '/incomes',
        name: 'incomes',
        component: () => import(/* webpackChunkName: "about" */ '../views/IncomesView.vue')
    },
    {
        path: '/expenses',
        name: 'expenses',
        component: () => import(/* webpackChunkName: "about" */ '../views/ExpensesView.vue')
    },
    {
        path: '/expenses/:id',
        name: 'expenseItem',
        component: () => import(/* webpackChunkName: "about" */ '../views/ExpenseItem.vue')
    },

    {
        path: '/managers',
        name: 'managers',
        component: () => import(/* webpackChunkName: "about" */ '../views/ManagersView.vue')
    },
    {
        path: '/contacts',
        name: 'contacts',
        component: () => import(/* webpackChunkName: "about" */ '../views/ContactsView.vue')
    },

]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router

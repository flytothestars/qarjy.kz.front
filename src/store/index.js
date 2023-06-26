import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import router from "@/router";
Vue.use(Vuex)

/* eslint-disable no-new */
const store = new Vuex.Store({
    plugins: [createPersistedState()],
    state: {
        token: undefined,
        user: undefined,
    },
    getters: {
        token: state => state.token,
        user: state => state.user,
    },
    mutations: {
        setToken(state, token) {
            state.token = token;
            if (token) {
                Vue.http.headers.common['Authorization'] = `Bearer ${token}`;
            }
        },
        setUser(state, user) {
            state.user = user;
        }
    },
    actions: {
        GET_ME({commit}) {
            Vue.http.get(`auth/me`).then(r => {
                commit('setUser', r.body.user);
            }).catch(() => {
                commit('setToken', undefined);
                commit('setUser', undefined);
                router.push('/login')
            })
        }
    }
})

export default store

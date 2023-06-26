<template>
  <v-app>
    <v-app-bar
        app
        color="primary"
        dark
        clipped-left
    >
      <v-app-bar-nav-icon class="hidden-md-and-up" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-spacer class="hidden-md-and-up"/>
      <div class="d-flex align-center">
        <v-img
            alt="Vuetify Logo"
            class="shrink mr-2"
            contain
            :src="require('@/assets/logo_mini.svg')"
            transition="scale-transition"
            width="40"
        />
        <v-img
            alt="Vuetify Name"
            class="shrink mt-1 hidden-sm-and-down"
            contain
            min-width="100"
            :src="require('@/assets/logo.svg')"
            width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
          v-if="user"
          to="/profile"
          icon
      >
        <v-icon>mdi-account</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer v-if="user" app v-model="drawer" clipped>
      <v-list
          dense
          nav
      >
        <v-list-item link to="/">
          <v-list-item-content>
            <v-list-item-title>Главная</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/customers">
          <v-list-item-content>
            <v-list-item-title>Пользователи</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/managers" v-if="user.role==='admin'">
          <v-list-item-content>
            <v-list-item-title>Администраторы</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/incomes">
          <v-list-item-content>
            <v-list-item-title>Доходы</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/expenses">
          <v-list-item-content>
            <v-list-item-title>Расходы</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/contacts">
          <v-list-item-content>
            <v-list-item-title>Контакты</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

      </v-list>
    </v-navigation-drawer>
    <v-main>
      <router-view class="px-5 py-5" />
    </v-main>
  </v-app>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  name: 'AppView',

  data() {
    return {
      drawer: true,
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  created() {
    this.$store.dispatch("GET_ME")
  }
};
</script>

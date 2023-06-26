<template>
  <v-card max-width="700" class="mx-auto mt-5">
    <v-card-text>Вход в панель администратора</v-card-text>
    <v-card-text>
      <v-text-field
          label="Email"
          v-model="credentials.email"
          :error-messages="errors.email"
          :error-count="1"
          :error="!!errors.email"
      />
      <v-text-field
          type="password"
          label="Пароль"
          v-model="credentials.password"
          :error-messages="errors.password"
          :error-count="1"
          :error="!!errors.password"
      />
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" @click="login()">Войти</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "LoginView",
  data() {
    return {
      credentials: {},
      errors: {}
    }
  },
  methods: {
    login() {
      this.errors = {};
      this.$http.post(`auth/admin-login`, this.credentials).then(r => {
        this.$store.commit('setToken', r.body.token);
        this.$store.commit('setUser', r.body.user);
        this.$router.push('/')
      }).catch(err => {
        this.errors = err.body.errors;
      })
    }
  }
}
</script>

<style scoped>

</style>
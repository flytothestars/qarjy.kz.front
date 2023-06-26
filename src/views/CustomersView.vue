<template>
  <div>
    <div class="text-h4 mb-4">Пользователи</div>
    <v-row>
      <v-col cols="6" sm="4" md="3" v-for="user in customers" :key="user.id">
        <v-card>
          <v-card-title>{{ user.phone }}</v-card-title>
          <v-card-text>
            <div>Дата регистрации: <b>{{ moment(user.created_at).format("HH:mm DD MMM YYYY") }}</b></div>
            <div>Кол-во вх. транзакций: <b>{{ user.income_transactions_count }}</b></div>
            <div>Кол-во исх. транзакций: <b>{{ user.expense_transactions_count }}</b></div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-pagination v-if="page>1" v-model="page" :length="pagesCount"/>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: "CustomersView",
  data() {
    return {
      moment: moment,
      customers: [],
      page: 1,
      pagesCount: 1,
    }
  },
  created() {
    this.getCustomers();
  },
  watch: {
    page() {
      this.getCustomers()
    }
  },
  methods: {
    getCustomers() {
      this.$http.get(`customers?page=${this.page}`).then(r => {
        this.customers = r.body.users;
        this.pagesCount = r.body.pagesCount;
      })
    }
  }
}
</script>

<style scoped>

</style>
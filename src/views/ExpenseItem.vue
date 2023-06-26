<template>
  <div>
    <v-progress-circular indeterminate v-if="!category"/>
    <div v-else>
      <v-breadcrumbs
          :items="breadcrumbs"
          divider="-"
      ></v-breadcrumbs>
      <div class="text-h4">{{ category.title }}</div>
      <service-category v-if="category.isService" :category="category"/>
      <normal-category v-else :category="category"/>
      <div class="text-caption mt-6">Страница: {{ page }}</div>
      <expense-transactions
          @product-moved="getCategory"
          v-if="!loading" :page="page" :pagination-is-over="isLastPage" @page="onPage"
          :category="category"/>
    </div>
  </div>

</template>

<script>
import NormalCategory from "@/components/expenses/NormalCategory";
import ServiceCategory from "@/components/expenses/ServiceCategory";
import ExpenseTransactions from "@/components/expenses/levels/ExpenseTransactions";

export default {
  name: "ExpenseItem",
  components: {ExpenseTransactions, ServiceCategory, NormalCategory},
  data() {
    return {
      categoryId: this.$route.params.id,
      category: undefined,
      page: 1,
      take: 30,
      isLastPage: false,
      loading: true,
    }
  },

  created() {
    this.getCategory();
  },
  watch: {
    page() {
      this.getCategory();
    }
  },
  methods: {
    onPage(dir) {
      switch (dir) {
        case "up":
          this.page++;
          break;
        case "down":
          this.page--;
          break;
      }
    },
    getCategory() {
      const parentId = this.$route.query.parent_id;
      this.loading = true;
      this.$http.get(`expense-categories/${this.categoryId}?parent_id=${parentId ? parentId : ''}&page=${this.page}&take=${this.take}`).then(r => {
        this.category = r.data.expenseCategory;
        switch (this.category.level) {
          case 0:
            this.isLastPage = r.data.expenseCategory.root_products.length < this.take;
            break;
          case 1:
            this.isLastPage = r.data.expenseCategory.secondary_products.length < this.take;
            break;

          case 2:
            this.isLastPage = r.data.expenseCategory.final_products.length < this.take;
            break;
        }
        this.loading = false;
      }).catch(() => {
        this.$router.replace('/expenses')
        this.loading = false;
      })
    }
  },
  computed: {
    breadcrumbs() {
      return [
        {
          text: 'Категории расходов',
          disabled: false,
          href: '/expenses',
        },
        {
          text: `${this.category.title}`,
          disabled: true,
          href: '#',
        },
      ];
    }
  }
}
</script>

<style scoped>

</style>
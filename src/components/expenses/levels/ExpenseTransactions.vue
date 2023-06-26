<template>
  <div>
    <v-list>
      <v-list-item link @click="solve(transaction)" v-for="transaction in transactions" :key="transaction.id">
        <v-list-item-content>
          <v-list-item-title>{{ transaction.title }}</v-list-item-title>
          <!--<v-list-item-subtitle>Цена: {{ transaction.price }}</v-list-item-subtitle>
          <v-list-item-subtitle>{{ transaction.company }}</v-list-item-subtitle>-->
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <div class="d-flex">
      <v-btn icon @click="$emit('page','down')" :disabled="page<=1">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-btn icon @click="$emit('page','up')" :disabled="paginationIsOver">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </div>
    <v-dialog v-model="editDialog" max-width="400">
      <v-card v-if="editItem" :key="editItem.id">
        <v-card-title>Распределить товар</v-card-title>
        <v-card-subtitle class="mt-2">
          {{ editItem.title }} <br>
          <!--Цена: {{ editItem.price }}<br>
          {{ editItem.company }}-->
        </v-card-subtitle>
        <v-card-text>
          <root-category-picker
              v-model="editItem.root_category_id"
          />
          <secondary-category-picker
              v-model="editItem.secondary_category_id"
              :parent-id="editItem.root_category_id"
          />
          <final-category-picker
              v-model="editItem.final_category_id"
              :parent-id="editItem.secondary_category_id"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="editDialog=false">Закрыть</v-btn>
          <v-spacer/>
          <v-btn color="primary" @click="save()">Сохранить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import RootCategoryPicker from "@/components/expenses/pickers/RootCategoryPicker";
import SecondaryCategoryPicker from "@/components/expenses/pickers/SecondaryCategoryPicker";
import FinalCategoryPicker from "@/components/expenses/pickers/FinalCategoryPicker";

export default {
  name: "ExpenseTransactions",
  components: {FinalCategoryPicker, SecondaryCategoryPicker, RootCategoryPicker},
  props: ['category','page','paginationIsOver'],
  data() {
    return {
      transactions: this.category.level === 0 ? this.category.root_products : this.category.level === 1 ? this.category.secondary_products : this.category.final_products,
      editItem: {},
      editDialog: false,
    }
  },
  methods: {
    solve(transaction) {
      this.editItem = transaction;
      this.editDialog = true;
    },
    save() {
      this.$http.put(`managers/products/${this.editItem.id}`, this.editItem).then(() => {
        this.editDialog = false;
        this.$emit('product-moved')
      })
    }
  }
}
</script>

<style scoped>

</style>
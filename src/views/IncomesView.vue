<template>
  <div>
    <div class="d-flex justify-end">
      <v-btn color="primary" @click="create()">Добавить категорию</v-btn>
    </div>
    <v-list class="mt-5">
      <v-list-item v-for="category in categories" :key="category.id">
        <v-list-item-content>
          <v-list-item-title>{{ category.title }}</v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <div class="d-flex">
            <v-btn small color="primary" class="mr-3" @click="edit(category)">Изменить</v-btn>
            <v-btn small color="error" @click="destroy(category)">Удалить</v-btn>
          </div>
        </v-list-item-action>
      </v-list-item>
    </v-list>

    <v-dialog v-model="editDialog" max-width="400">
      <v-card v-if="editItem">
        <v-card-title>Информация о категории</v-card-title>
        <v-card-text>
          <v-text-field
              label="Название"
              v-model="editItem.title"
              :error-messages="errors.title"
              :error-count="1"
              :error="!!errors.title"
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
export default {
  name: "IncomesView",
  data() {
    return {
      categories: [],

      editItem: undefined,
      errors: {},
      editDialog: false,
    }
  },
  created() {
    this.getCategories();
  },
  methods: {
    getCategories() {
      this.$http.get(`income-categories`).then(r => {
        this.categories = r.body.incomeCategories;
      })
    },
    create() {
      this.editItem = {}
      this.editDialog = true;
    },
    edit(item) {
      this.editItem = item;
      this.editDialog = true;
    },
    save() {
      this.errors = {};
      if (this.editItem.id) {
        this.update();
      } else {
        this.store();
      }
    },
    store() {
      this.$http.post(`income-categories`, this.editItem).then(r => {
        this.categories.push(r.body.incomeCategory);
        this.editDialog = false;
      }).catch(err => {
        this.errors = err.body.errors;
      })
    },
    update() {
      this.$http.put(`income-categories/${this.editItem.id}`, this.editItem).then(() => {
        this.editDialog = false;
      }).catch(err => {
        this.errors = err.body.errors;
      })
    },
    destroy(item) {
      this.$http.delete(`income-categories/${item.id}`).then(() => {
        this.categories.splice(this.categories.indexOf(item), 1);
      })
    }
  }
}
</script>

<style scoped>

</style>
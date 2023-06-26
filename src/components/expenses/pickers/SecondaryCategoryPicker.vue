<template>
  <v-autocomplete
      label="Подкатегория"
      v-model="id"
      :items="items"
      :loading="isLoading"
      :search-input.sync="search"
      item-value="id"
      item-text="title"
      @keydown.enter="create"
  />
</template>

<script>
export default {
  name: "SecondaryCategoryPicker",
  props: ['value', 'parentId'],
  data() {
    return {
      id: this.value,
      items: [],
      isLoading: false,
      search: ``
    }
  },
  watch: {
    id() {
      this.$emit('input', this.id)
    },
    search() {
      this.getCategories();
    },
    parentId(){
      this.getCategories();
    }
  },
  created() {
    this.getCategories()
  },
  methods: {
    getCategories() {
      if (this.isLoading) return;
      this.isLoading = true;

      this.$http.get(`expense-categories?level=1&parent_id=${this.parentId}&search=${this.search}`).then(r => {
        this.items = r.data.expenseCategories;
        this.isLoading = false;
      })
    },
    create() {
      this.$http.post(`expense-categories`, {
        title: this.search,
        parent_id: this.parentId,
        level:1,
      }).then(r => {
        this.items.unshift(r.data.expenseCategory);
        this.id = r.data.expenseCategory.id;
      })
    }
  }
}
</script>

<style scoped>

</style>
<template>
  <div class="mt-3">
    <v-text-field
        v-model="title"
        :error="!!errors.title"
        :error-count="1"
        :error-messages="errors.title"
    />
    <v-file-input
        v-model="icon"
        @change="upload"
        :prepend-icon="''"
        label="Иконка"
    >
      <!--<v-icon
          slot="prepend"
          color="green"
      >
        mdi-minus
      </v-icon>-->
      <template v-slot:prepend-inner>
        <v-img v-if="category.icon" :src="category.icon" width="30" height="30"/>
      </template>
      <!--<v-icon
      slot="prepend-inner"
      >
        <v-img slot="" :src="category.icon"/>
      </v-icon>-->
    </v-file-input>
    <div class="d-flex">
      <v-btn color="primary" @click="update()">Сохранить</v-btn>
      <v-spacer/>
      <v-btn color="error" @click="destroy()">Удалить</v-btn>
    </div>
    <div class="mt-5 text-h5">Тэги</div>
    <v-chip-group column class="mt-3">
      <v-chip @click="editTag(tag)" v-for="tag in tags" :key="tag.id" color="primary" outlined>
        {{ tag.text }}
      </v-chip>
      <v-btn icon outlined color="primary" class="ml-2" @click="createTag()">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-chip-group>
    <v-dialog max-width="400" v-model="tagDialog">
      <v-card v-if="selectedTag">
        <v-card-title>
          <v-spacer/>
          <v-btn icon @click="tagDialog=false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-text-field
              v-model="selectedTag.text"
              label="Введите тэг"
              :error="!!errors.text"
              :error-count="1"
              :error-messages="errors.text"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn icon color="error" @click="destroyTag()">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
          <v-spacer/>
          <v-btn color="primary" @click="saveTag()">Сохранить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "NormalCategory",
  props: ['category'],
  data() {
    return {
      errors: {},
      title: this.category.title,
      icon: null,
      tags: this.category.tags,
      selectedTag: null,
      tagDialog: false,
    }
  },
  methods: {
    update() {
      this.errors = {};
      this.$http.put(`expense-categories/${this.category.id}`, {
        ...this.category,
        title: this.title
      }).then(r => {
        this.$set(this.category, 'title', r.body.expenseCategory.title);
        alert("Изменения сохранены")
      }).catch(err => {
        this.errors = err.body.errors;
      })
    },
    destroy() {
      this.$http.delete(`expense-categories/${this.category.id}`).then(() => {
        this.$router.push('/expenses');
      })
    },
    upload(file) {
      const fd = new FormData;
      fd.append('file', file)
      this.$http.post(`upload`, fd).then(r => {
        this.$set(this.category, 'icon', r.body.url);
      })
    },

    createTag() {
      this.selectedTag = {};
      this.tagDialog = true;
    },
    editTag(tag) {
      this.selectedTag = tag;
      this.tagDialog = true;
    },
    saveTag() {
      this.errors = {};
      if (this.selectedTag.id) {
        this.updateTag()
      } else {
        this.storeTag();
      }
    },
    storeTag() {
      this.$http.post(`expense-categories/${this.category.id}/tags`,this.selectedTag).then(r => {
        this.tags.push(r.body.tag);
        this.tagDialog = false;
      }).catch(err => {
        this.errors = err.body.errors;
      })
    },
    updateTag() {
      this.$http.put(`expense-categories/${this.category.id}/tags/${this.selectedTag.id}`,this.selectedTag).then(() => {
        this.tagDialog = false;
      }).catch(err => {
        this.errors = err.body.errors;
      })
    },
    destroyTag() {
      if(!confirm('Вы уверены, что хотите удалить тэг?')) return;
      this.$http.delete(`expense-categories/${this.category.id}/tags/${this.selectedTag.id}`).then(() => {
        this.tags.splice(this.tags.indexOf(this.selectedTag), 1);
        this.tagDialog = false;
      })
    }
  }
}
</script>

<style scoped>

</style>
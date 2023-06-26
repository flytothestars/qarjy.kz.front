<template>
  <div>
    <div class="d-flex justify-end">
      <v-btn color="primary" @click="create()">Добавить менеджера</v-btn>
    </div>
    <v-row class="mt-4">
      <v-col cols="12" md="4" v-for="manager in managers" :key="manager.id">
        <v-card>
          <v-card-title>{{ manager.name }}</v-card-title>
          <v-card-text>
            <div>E-mail: <b>{{ manager.email }}</b></div>
            <div>Телефон: <b>{{ manager.phone }}</b></div>
          </v-card-text>
          <v-card-actions>
            <v-btn v-if="manager.role!=='admin'" icon color="error" @click="destroy(manager)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <v-spacer/>
            <v-btn small color="primary" @click="edit(manager)">Редактировать</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="editDialog" max-width="400">
      <v-card v-if="editItem">
        <v-card-title>Информация о пользователе</v-card-title>
        <v-card-text>
          <v-text-field
              label="Имя"
              v-model="editItem.name"
              :error="!!errors.name"
              :error-count="1"
              :error-messages="errors.name"
          />
          <v-text-field
              label="Email"
              v-model="editItem.email"
              :error="!!errors.email"
              :error-count="1"
              :error-messages="errors.email"
          />
          <v-text-field
              label="Телефон"
              v-model="editItem.phone"
              :error="!!errors.phone"
              :error-count="1"
              :error-messages="errors.phone"
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
import Swal from 'sweetalert2'
export default {
  name: "ManagersView",
  data() {
    return {
      managers: [],

      editItem: undefined,
      errors: {},
      editDialog: false,
    }
  },
  created() {
    this.getManagers();
  },
  methods: {
    getManagers() {
      this.$http.get(`managers`).then(r => {
        this.managers = r.body.users;
      })
    },
    create() {
      this.editItem = {};
      this.editDialog = true;
    },
    edit(item) {
      this.editItem = item;
      this.editDialog = true;
    },
    store() {
      this.$http.post(`managers`, this.editItem).then(r => {
        this.managers.unshift(r.body.user);
        this.editDialog = false;
        Swal.fire({
          title: "Пароль для входа:",
          text: r.body.password,
        })
      }).catch(err => {
        this.errors = err.body.errors;
      })
    },
    update() {
      this.$http.put(`managers/${this.editItem.id}`, this.editItem).then(() => {
        this.editDialog = false;
      }).catch(err => {
        this.errors = err.body.errors;
      })
    },
    destroy(item) {
      this.$http.delete(`managers/${item.id}`).then(() => {
        this.managers.splice(this.managers.indexOf(item), 1);
      })
    },
    save() {
      this.errors = {};
      if (this.editItem.id) {
        this.update();
      } else {
        this.store();
      }
    }
  }
}
</script>

<style scoped>

</style>
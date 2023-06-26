<template>
  <div>
    <div class="text-h4">Контакты</div>
    <v-row>
      <v-col cols="12" md="6">
        <v-list>
          <v-list-item v-for="contact in contacts" :key="contact.id">
            <v-list-item-icon>
              <v-img :src="getIcon(contact.type)"/>
            </v-list-item-icon>
            <v-list-item-title>{{ contact.value }}</v-list-item-title>
            <v-list-item-action>
              <div class="d-flex">
                <v-btn icon small color="warning" @click="edit(contact)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon small color="error" @click="destroy(contact)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </div>
            </v-list-item-action>
          </v-list-item>
          <v-list-item link @click="create()">
            <v-list-item-icon>
              <v-icon>mdi-plus</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Добавить контакт</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
    <v-dialog v-model="editDialog" max-width="500">
      <v-card>
        <v-card-title>Контакт</v-card-title>
        <v-card-text>
          <v-select
              v-model="editItem.type"
              :items="[
                  {key:'email',text:'E-mail'},
                  {key:'phone',text:'Телефон'},
                  {key:'whatsapp',text:'What`s App'},
                  {key:'telegram',text:'Telegram'},
              ]"
              :error-messages="errors.type"
              :error-count="1"
              :error="!!errors.type"
              item-text="text"
              item-value="key"
              label="Выберите тип контакта"
          />
          <v-text-field
              v-model="editItem.value"
              :error-messages="errors.value"
              :error-count="1"
              :error="!!errors.value"
              label="Контактный адрес"
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
  name: "ContactsView",
  data() {
    return {
      contacts: [],
      editItem: {},
      errors: {},
      editDialog: false,
    }
  },
  created() {
    this.getContacts();
  },
  methods: {
    getContacts() {
      this.$http.get(`contacts`).then(r => {
        this.contacts = r.body.contacts;
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
    save() {
      this.errors = {};
      if (this.editItem.id) {
        this.update();
      } else {
        this.store();
      }
    },
    store() {
      this.$http.post(`contacts`, this.editItem).then(r => {
        this.contacts.push(r.body.contact);
        this.editDialog = false;
      }).catch(err => {
        this.errors = err.body.errors;
      })
    },
    update() {
      this.$http.put(`contacts/${this.editItem.id}`, this.editItem).then(() => {
        this.editDialog = false;
      }).catch(err => {
        this.errors = err.body.errors;
      })
    },
    destroy(item) {
      if (!confirm('Вы уверены, что хотите удалить контакт?')) return;
      this.$http.delete(`contacts/${item.id}`).then(() => {
        this.contacts.splice(this.contacts.indexOf(item), 1);
      })
    },
    getIcon(type) {
      return require(`@/assets/icons/${type}.svg`);
    }
  }
}
</script>

<style scoped>

</style>
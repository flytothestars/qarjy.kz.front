<template>
  <v-row style="    min-width: 1140px; ">
    <v-col cols="4">
      <div class="text-subtitle-2">Общие категории</div>
      <v-list>
        <v-list-item
            link
            v-for="category in rootCategories"
            :key="category.id"
            @click="$router.push(`/expenses/${category.id}`)"
            v-bind:class="{'item-active':category.id === rootParentId}"
        >
          <v-list-item-icon>
            <v-img :src="category.icon" width="30" height="30"/>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ category.title }}</v-list-item-title>
            <v-list-item-subtitle>
              <v-chip small color="primary" outlined v-if="category.root_transactions_count">
                {{ category.root_transactions_count }}
              </v-chip>
              <v-chip small color="warning" outlined v-if="!category.isService" class="ml-2">
                {{ category.children_count }}
              </v-chip>
              <v-chip small color="error" outlined v-if="!category.isService" class="ml-2">
                {{ category.secondary_service_transactions_count }}
              </v-chip>
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action v-if="!category.isService">
            <v-btn icon @click.stop="onOverRoot(category)">
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
        <v-list-item link class="primary--text" @click="createCategory()">
          <v-list-item-icon>
            <v-icon color="primary">mdi-plus</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            Добавить категорию
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-col>
    <v-col cols="4">
      <div class="text-subtitle-2">Подраздел</div>
      <v-list>
        <v-list-item
            link
            v-for="category in secondaryCategories"
            :key="category.id"
            @click="$router.push(`/expenses/${category.id}?parent_id=${rootParentId}`)"
            v-bind:class="{'item-active':category.id === secondaryParentId}"
        >
          <v-list-item-icon>
            <v-img :src="category.icon" width="30" height="30"/>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              {{ category.title }}
            </v-list-item-title>
            <v-list-item-subtitle>
              <v-chip small color="primary" outlined v-if="category.secondary_transactions_count">
                {{ category.secondary_transactions_count }}
              </v-chip>
              <v-chip small color="warning" outlined v-if="!category.isService" class="ml-2">
                {{ category.children_count }}
              </v-chip>
              <v-chip small color="error" outlined v-if="!category.isService" class="ml-2">
                {{ category.final_service_transactions_count }}
              </v-chip>
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action v-if="!category.isService">
            <v-btn icon @click.stop="onOverSecondary(category)">
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
        <v-list-item v-if="rootParentId" link class="primary--text" @click="createCategory(1,rootParentId)">
          <v-list-item-icon>
            <v-icon color="primary">mdi-plus</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            Добавить категорию
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-col>
    <v-col cols="4">
      <div class="text-subtitle-2">Итоговая категория</div>
      <v-list>
        <v-list-item
            link
            v-for="category in finalCategories"
            :key="category.id"
            @click="$router.push(`/expenses/${category.id}?parent_id=${secondaryParentId}`)">
          <v-list-item-icon>
            <v-img :src="category.icon" width="30" height="30"/>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              {{ category.title }}
            </v-list-item-title>
            <v-list-item-subtitle>
              <v-chip small color="primary" outlined v-if="category.final_transactions_count">
                {{ category.final_transactions_count }}
              </v-chip>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="secondaryParentId" link class="primary--text" @click="createCategory(2,secondaryParentId)">
          <v-list-item-icon>
            <v-icon color="primary">mdi-plus</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            Добавить категорию
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-col>
    <v-col cols="12">
      <v-chip color="primary" outlined>Кол-во транзакций</v-chip>
      <v-chip color="warning" outlined class="ml-2">Кол-во вложенных категорий</v-chip>
      <v-chip color="error" outlined class="ml-2">Кол-во транзакций в "прочее"</v-chip>
    </v-col>
    <v-dialog v-model="editDialog" max-width="400">
      <v-card>
        <v-card-title>Добавить категорию</v-card-title>
        <v-card-text>
          <v-text-field
              v-model="editCategory.title"
              :error-messages="errors.title"
              :error-count="1"
              :error="!!errors.title"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="editDialog=false">Закрыть</v-btn>
          <v-spacer/>
          <v-btn color="primary" @click="store()">Сохранить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import {debounce} from "lodash";

export default {
  name: "ExpensesView",
  data() {
    return {
      rootCategories: [],
      secondaryCategories: [],
      finalCategories: [],
      editCategory: {},
      editDialog: false,
      errors: {},
      rootParentId: undefined,
      secondaryParentId: undefined,
    }
  },
  created() {
    this.getRootCategories();
    this.readRoute(this.$route.query)
  },
  watch: {
    '$route.query': {
      handler(value) {
        this.readRoute(value);
      }, deep: true,
    }
  },
  methods: {
    readRoute(value) {
      if (value.root_id) {
        const rootId = parseInt(value.root_id);
        if (rootId !== this.rootParentId) {
          this.getSecondaryCategories(rootId);
          this.rootParentId = rootId;
          this.secondaryParentId = undefined;
          this.finalCategories = [];
        }
      }
      if (value.secondary_id) {
        const secondaryId = parseInt(value.secondary_id);
        if (secondaryId !== this.secondaryParentId) {
          this.getFinalCategories(secondaryId);
          this.secondaryParentId = secondaryId;
        }
      }
    },
    onOverRoot: debounce(function (category) {
      this.$router.push(`/expenses?root_id=${category.id}`)
      /*this.getSecondaryCategories(category.id);
      this.rootParentId = category.id;
      this.secondaryParentId = undefined;
      this.finalCategories = [];*/
    }, 500),
    onOverSecondary: debounce(function (category) {
      this.$router.push(`/expenses?root_id=${this.rootParentId}&secondary_id=${category.id}`)
      /*this.getFinalCategories(category.id);
      this.secondaryParentId = category.id;*/
    }, 500),
    getRootCategories() {
      this.$http.get(`expense-categories?level=0`).then(r => {
        this.rootCategories = r.body.expenseCategories;
      })
    },
    getSecondaryCategories(parentId) {
      this.$http.get(`expense-categories?level=1&parent_id=${parentId}`).then(r => {
        this.secondaryCategories = r.body.expenseCategories
      })
    },
    getFinalCategories(parentId) {
      this.$http.get(`expense-categories?level=2&parent_id=${parentId}`).then(r => {
        this.finalCategories = r.body.expenseCategories
      })
    },
    createCategory(level = 0, parentId = null,) {
      this.editCategory = {
        level: level,
        parent_id: parentId
      };
      this.editDialog = true;
    },
    store() {
      this.errors = {};
      this.$http.post(`expense-categories`, this.editCategory).then(() => {
        switch (this.editCategory.level) {
          case 0:
            this.getRootCategories();
            break;
          case 1:
            this.getSecondaryCategories(this.rootParentId);
            break;
          case 2:
            this.getFinalCategories(this.secondaryParentId);
        }
        this.editDialog = false;
      }).catch(err => {
        this.errors = err.body.errors;
      })
    }
  }
}
</script>

<style scoped>
.item-active {
  background: #e3e3e3;
}
</style>
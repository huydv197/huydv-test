<template>
  <div class="todo">
    <div class="container-fluid">
      <app-sticky>
        <section class="" style="background-color: #F5F7FF;">
          <h3 class="text-center page-title">Todo List</h3>
          <div class="">
            <div class="text-right">
              <app-button
                nuxt
                to="/todo-list/add"
                size="sm"
                class="mb-4"
              >
                Add
              </app-button>
            </div>
          </div>
        </section>
      </app-sticky>

      <section>
        <div class="todo__list">
          <div v-if="todoItems.length > 0">
            <div
              v-for="(item, index) in todoItems"
              :key="index.id"
              class="mb-3 box"
            >
              <todo-item
                :key="item.id"
                :detail="item"
                @show="showItem"
                @remove="removeItem"
                @toggleSelect="toggleSelect"
              />
              <div v-if="editingItem.id == item.id">
                <hr class="my-4">
                <form-add
                  :mode="2"
                  :content="item"
                  @cancel="cancelEdit"
                  @done="doneUpdate"
                />
              </div>
            </div>
          </div>
          <p v-else class="todo--no-data text-center caption text-gray bg-white">No Data</p>
          <div v-if="isLoadingList" class="todo__loading text-center">Loading...</div>
        </div>
      </section>
    </div>

    <footer
      class="todo__footer"
      :class="{ 'todo__footer--active': showFooter }"
    >
      <div class="container d-flex align-items-center">
        <p class="h5">Bulk Action:</p>
        <div class="ml-auto">
          <app-button
            class="mx-3"
            @click.prevent="markDoneTasks"
          >
            Done
          </app-button>
          <app-button
            color="error"
            @click.prevent="removeMulti"
          >
            Remove
          </app-button>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import FormAdd from '@/components/pages/todo/FormAdd'
import TodoItem from '@/components/pages/todo/TodoItem'

import {
  mapGetters,
  mapActions
} from 'vuex'

export default {
  name: 'TodoList',
  components: {
    FormAdd,
    TodoItem
  },
  data() {
    return {
      isLoadingList: false,
      editingItem: {},
      selectedItems: [],
      params: {
        q: ''
      }
    }
  },
  computed: {
    ...mapGetters('todo', ['todoItems']),
    showFooter() {
      return this.selectedItems.length > 0
    }
  },
  watch: {
    'params.q': function(newVal) {
      this.getList()
    }
  },
  created() {
    this.getList()
  },
  methods: {
    ...mapActions('todo', ['getTodos', 'deleteTodo', 'deleteTodos', 'markDone']),
    async getList() {
      try {
        this.isLoadingList = true
        await this.getTodos(this.params)
      } catch (error) {
        console.log('[error]', error)
      } finally {
        this.isLoadingList = false
      }
    },
    showItem(data) {
      this.editingItem = data
    },
    async removeItem(item) {
      const result = confirm('Are you sure?')
      if (result) {
        try {
          await this.deleteTodo(item.id)
          this.getList()
          alert('Delete task successful')
        } catch (error) {
          console.log('[error]', error)
        }
      }
    },
    toggleSelect(status, item) {
      const alreadySelect = (this.selectedItems).includes(item.id)
      if (alreadySelect) {
        if (!status) {
          this.selectedItems = (this.selectedItems).filter(ele => {
            return ele !== item.id
          })
        }
      } else {
        if (status) {
          this.selectedItems.push(item.id)
        }
      }
    },
    async markDoneTasks() {
      try {
        const result = confirm('Are you sure?')
        if (result) {
          await this.markDone(this.selectedItems)
          alert('Mark done tasks successful')
          this.selectedItems = []
          this.getList()
        }
      } catch (error) {
        console.log('[error]', error)
      }
    },
    async removeMulti() {
      try {
        const result = confirm('Are you sure?')
        if (result) {
          await this.deleteTodos(this.selectedItems)
          alert('Remove tasks successful')
          this.selectedItems = []
          this.getList()
        }
      } catch (error) {
        console.log('[error]', error)
      }
    },
    doneUpdate() {
      this.getList()
      this.editingItem = {}
    },
    cancelEdit() {
      this.editingItem = {}
    }
  }
}
</script>

<style lang="scss" scoped>
.todo {
  padding-bottom: 12rem;
}

.todo__footer {
  position: fixed;
  bottom: -10rem;
  left: 0;
  right: 0;
  padding: 3rem 2rem;
  background-color: #c4e9e8;
  transition: all 1s ease 0s;

  &.todo__footer--active {
    bottom: 0;
  }
}
.todo__list {
  position: relative;
}

.todo__loading {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffffe0;
}

.todo--no-data {
  padding: 4rem 1.5rem;
  border: 1px solid $color-border;
  border-radius: $border-radius-common;
}
</style>

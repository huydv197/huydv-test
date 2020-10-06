import * as todo from '@/api/todo'

const state = {
  todos: []
}

const getters = {
  todoItems(state) {
    return !state.todos
      ? []
      : state.todos.map((item, idx) => {
        return {
          ...item,
          index: idx
        }
      })
  }
}

const mutations = {
  setTodos(state, _data) {
    state.todos = _data
  }
}

const actions = {
  async getTodos({ commit }, payload = {}) {
    const data = todo.list(payload)
    commit('setTodos', data)
  },
  async addTodo({ commit }, payload) {
    const data = todo.add(payload)
    return data
  },
  async updateTodo({ commit }, payload) {
    const data = todo.update(payload)
    return data
  },
  async deleteTodo({ commit }, id) {
    const data = todo.destroy(id)
    return data
  },
  async deleteTodos({ commit }, ids) {
    const data = todo.destroyMulti(ids)
    return data
  },
  async markDone({ commit }, ids) {
    const data = todo.markDone(ids)
    return data
  }

}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

const STORAGE_TODO_KEY = 'todo-list'
const CURRENT_TODO_KEY = 'todo-list-key'

function byQuery(data, q) {
  const result = data.filter(item =>
    new RegExp(q, 'i').test(item.title)
  )
  return result
}

function sortByDueDate(data, order = 'asc') {
  return data.sort(function(first, second) {
    const datetimeFirst = `${first.date} ${first.time}`
    const datetimeSecond = `${second.date} ${second.time}`
    const dateA = new Date(datetimeFirst)
    const dateB = new Date(datetimeSecond)
    if (order === 'asc') {
      return dateA - dateB
    }
    return dateB - dateA
  })
}

export function list(query = {}) {
  const {
    q
  } = query
  let data = JSON.parse(localStorage.getItem(STORAGE_TODO_KEY) || '[]')
  if (q) {
    data = byQuery(data, q)
  }
  data = sortByDueDate(data, 'asc')
  return data
}

export function add(payload) {
  let todos = JSON.parse(localStorage.getItem(STORAGE_TODO_KEY) || '[]')
  const currentUid = localStorage.getItem(CURRENT_TODO_KEY) || 0
  payload.id = parseInt(currentUid) + 1
  todos = [
    payload,
    ...todos
  ]
  localStorage.setItem(CURRENT_TODO_KEY, parseInt(currentUid) + 1)
  localStorage.setItem(STORAGE_TODO_KEY, JSON.stringify(todos))
  return todos
}

export function update(payload) {
  const todos = JSON.parse(localStorage.getItem(STORAGE_TODO_KEY) || '[]')
  const currentItemIdx = todos.findIndex((item) => {
    return item.id === payload.id
  })
  todos[currentItemIdx] = { ...payload }
  localStorage.setItem(STORAGE_TODO_KEY, JSON.stringify(todos))
}

export function destroy(id) {
  const todos = JSON.parse(localStorage.getItem(STORAGE_TODO_KEY) || '[]')
  const currentItemIdx = todos.findIndex((item) => {
    return item.id === id
  })
  todos.splice(currentItemIdx, 1)
  localStorage.setItem(STORAGE_TODO_KEY, JSON.stringify(todos))
  return todos
}

export function destroyMulti(ids) {
  ids.map(ele => {
    destroy(ele)
  })
}

export function markDone(ids) {
  const todos = JSON.parse(localStorage.getItem(STORAGE_TODO_KEY) || '[]')
  ids.map(ele => {
    const tmpIndex = todos.findIndex((todo) => {
      return todo.id === ele
    })
    todos[tmpIndex]['completed'] = true
  })
  localStorage.setItem(STORAGE_TODO_KEY, JSON.stringify(todos))
  return todos
}

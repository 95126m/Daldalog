import { ref, push, remove, onValue } from 'firebase/database'
import { database } from '@/api/firebaseApp'
import { create } from 'zustand'

interface Todos {
  id: string
  value: string
}

interface TodosState {
  todos: string
  todosItem: Todos[]
  setTodos: (value: string) => void
  addTodo: () => Promise<void>
  deleteTodo: (id: string) => Promise<void>
  fetchTodos: () => void
}

export const useTodosStore = create<TodosState>((set, get) => ({
  todos: '',
  todosItem: [],

  setTodos: value => set({ todos: value }),

  addTodo: async () => {
    const { todos } = get()
    if (todos.trim() === '') {
      alert('할 일을 입력해주세요.')
      return
    }

    try {
      const todosRef = ref(database, 'todos')
      await push(todosRef, todos)
      set({ todos: '' })
    } catch (error) {
      console.error('Firebase에 데이터 추가 실패:', error)
      alert('데이터 추가 중 문제가 발생했습니다.')
    }
  },

  deleteTodo: async id => {
    try {
      const todoRef = ref(database, `todos/${id}`)
      await remove(todoRef)
      set(state => ({
        todosItem: state.todosItem.filter(todo => todo.id !== id)
      }))
    } catch (error) {
      console.error('할 일 삭제 실패:', error)
      alert('할 일을 삭제하는 중 문제가 발생했습니다.')
    }
  },

  fetchTodos: () => {
    const todosRef = ref(database, 'todos')

    onValue(todosRef, snapshot => {
      if (snapshot.exists()) {
        const data: Record<string, string> = snapshot.val()
        const todosArray: Todos[] = Object.entries(data).map(
          ([key, value]) => ({
            id: key,
            value
          })
        )
        set({ todosItem: todosArray })
      } else {
        set({ todosItem: [] })
      }
    })
  }
}))

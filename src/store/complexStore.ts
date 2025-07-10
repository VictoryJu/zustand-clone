import { createStore } from './createStore';

export type ComplexState = {
  counter: { count: number; step: number };
  user: { name: string; age: number; isOnline: boolean };
  todos: { id: number; text: string; completed: boolean }[];
};

// 초기 상태 정의
const initialState: ComplexState = {
  counter: { count: 0, step: 1 },
  user: { name: '사용자', age: 25, isOnline: true },
  todos: [
    { id: 1, text: '첫 번째 할 일', completed: false },
    { id: 2, text: '두 번째 할 일', completed: true },
    { id: 3, text: '세 번째 할 일', completed: false },
  ],
};

export const complexStore = createStore<ComplexState>(initialState);

export const actions = {
  // 카운터 액션
  incrementCounter: () => {
    const state = complexStore.getState();
    complexStore.setState({
      counter: { ...state.counter, count: state.counter.count + state.counter.step },
    });
  },

  decrementCounter: () => {
    const state = complexStore.getState();
    complexStore.setState({
      counter: { ...state.counter, count: state.counter.count - state.counter.step },
    });
  },

  setStep: (step: number) => {
    const state = complexStore.getState();
    complexStore.setState({
      counter: { ...state.counter, step },
    });
  },

  // 유저 액션
  updateUser: (updates: Partial<ComplexState['user']>) => {
    const state = complexStore.getState();
    complexStore.setState({
      user: { ...state.user, ...updates },
    });
  },

  toggleOnlineStatus: () => {
    const state = complexStore.getState();
    complexStore.setState({
      user: { ...state.user, isOnline: !state.user.isOnline },
    });
  },

  // 투두 액션
  addTodo: (text: string) => {
    const state = complexStore.getState();
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
    };
    complexStore.setState({
      todos: [...state.todos, newTodo],
    });
  },

  toggleTodo: (id: number) => {
    const state = complexStore.getState();
    complexStore.setState({
      todos: state.todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)),
    });
  },

  removeTodo: (id: number) => {
    const state = complexStore.getState();
    complexStore.setState({
      todos: state.todos.filter((todo) => todo.id !== id),
    });
  },
};

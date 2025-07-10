import { useState } from 'react';
import { useStore } from '../store/useStore';
import { complexStore, actions } from '../store/complexStore';
import { RenderCounter } from './RenderCounter';
import './TodoSection.scss';

export function TodoSection() {
  const [newTodoText, setNewTodoText] = useState('');

  // todos 상태만 구독
  const todos = useStore(complexStore, (state) => state.todos);

  const handleAddTodo = () => {
    if (newTodoText.trim()) {
      actions.addTodo(newTodoText.trim());
      setNewTodoText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTodo();
    }
  };

  return (
    <div className="todo-section">
      <h3>
        📝 투두리스트
        <RenderCounter name="Todo" color="#28a745" />
      </h3>

      <div className="todo-input">
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="새로운 할 일을 입력하세요"
          className="todo-input-field"
        />
        <button onClick={handleAddTodo} className="todo-add-btn">
          추가
        </button>
      </div>

      <div className="todo-list">
        {todos.map((todo) => (
          <div key={todo.id} className="todo-item">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => actions.toggleTodo(todo.id)}
              className="todo-checkbox"
            />
            <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>{todo.text}</span>
            <button onClick={() => actions.removeTodo(todo.id)} className="todo-delete-btn">
              삭제
            </button>
          </div>
        ))}
      </div>

      <div className="todo-stats">
        <p>
          전체: {todos.length}개 | 완료: {todos.filter((t) => t.completed).length}개 | 미완료:{' '}
          {todos.filter((t) => !t.completed).length}개
        </p>
      </div>
    </div>
  );
}

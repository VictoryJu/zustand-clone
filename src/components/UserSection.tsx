import { useStore } from '../store/useStore';
import { complexStore, actions } from '../store/complexStore';
import { RenderCounter } from './RenderCounter';
import './UserSection.scss';

export function UserSection() {
  // user 상태만 구독
  const user = useStore(complexStore, (state) => state.user);

  return (
    <div className="user-section">
      <h3>
        👤 사용자 정보
        <RenderCounter name="User" color="#6f42c1" />
      </h3>

      <div className="user-info">
        <div className="user-status">
          <span className={`status-indicator ${user.isOnline ? 'online' : 'offline'}`} />
          {user.isOnline ? '온라인' : '오프라인'}
        </div>

        <div className="user-details">
          <p>
            <strong>이름:</strong> {user.name}
          </p>
          <p>
            <strong>나이:</strong> {user.age}세
          </p>
        </div>
      </div>

      <div className="user-controls">
        <div className="form-group">
          <label>
            이름:
            <input
              type="text"
              value={user.name}
              onChange={(e) => actions.updateUser({ name: e.target.value })}
              className="form-input"
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            나이:
            <input
              type="number"
              value={user.age}
              onChange={(e) => actions.updateUser({ age: parseInt(e.target.value) || 0 })}
              min="0"
              className="form-input age-input"
            />
          </label>
        </div>

        <button
          onClick={actions.toggleOnlineStatus}
          className={`status-toggle-btn ${user.isOnline ? 'online' : 'offline'}`}
        >
          {user.isOnline ? '오프라인으로 전환' : '온라인으로 전환'}
        </button>
      </div>
    </div>
  );
}

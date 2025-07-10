import { useStore } from '../store/useStore';
import { complexStore } from '../store/complexStore';
import { RenderCounter } from './RenderCounter';
import './DebugSection.scss';

export function DebugSection() {
  // 전체 상태 구독 (디버깅용)
  const fullState = useStore(complexStore, (state) => state);
  return (
    <div className="debug-section">
      <h3>
        🐛 디버그 정보
        <RenderCounter name="Debug" color="#6c757d" />
      </h3>

      <div className="debug-info">
        <p>
          <strong>Counter:</strong> {fullState.counter.count} (step: {fullState.counter.step})
        </p>
        <p>
          <strong>User:</strong> {fullState.user.name} ({fullState.user.age}세,{' '}
          {fullState.user.isOnline ? '온라인' : '오프라인'})
        </p>
        <p>
          <strong>Todos:</strong> {fullState.todos.length}개
        </p>
      </div>

      <small className="debug-warning">⚠️ 이 섹션은 전체 상태를 구독하므로 모든 변경 시 리렌더링됩니다.</small>
    </div>
  );
}

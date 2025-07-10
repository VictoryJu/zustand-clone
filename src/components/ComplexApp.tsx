import { CounterSection } from './CounterSection';
import { UserSection } from './UserSection';
import { TodoSection } from './TodoSection';
import { DebugSection } from './DebugSection';
import { RenderCounter } from './RenderCounter';
import './ComplexApp.scss';

export function ComplexApp() {
  return (
    <div className="complex-app">
      <header className="app-header">
        <h1>
          🚀 Zustand Clone - 렌더링 최적화 테스트
          <RenderCounter name="App" color="#343a40" />
        </h1>
        <p>각 섹션은 자신이 담당하는 상태만 구독합니다. 다른 섹션의 상태가 변경되어도 해당 섹션만 리렌더링됩니다.</p>
      </header>

      <div className="sections-container">
        <div className="section-grid">
          <div className="section-card">
            <CounterSection />
          </div>

          <div className="section-card">
            <UserSection />
          </div>

          <div className="section-card">
            <TodoSection />
          </div>

          <div className="section-card">
            <DebugSection />
          </div>
        </div>
      </div>

      <footer className="app-footer">
        <h3>🧪 테스트 방법:</h3>
        <ul>
          <li>카운터 버튼을 클릭하면 Counter 섹션만 리렌더링됩니다</li>
          <li>투두 항목을 추가/수정하면 Todo 섹션만 리렌더링됩니다</li>
          <li>사용자 정보를 변경하면 User 섹션만 리렌더링됩니다</li>
          <li>Debug 섹션은 전체 상태를 구독하므로 모든 변경 시 리렌더링됩니다</li>
          <li>각 섹션의 렌더링 횟수를 확인하여 최적화를 검증할 수 있습니다</li>
        </ul>
      </footer>
    </div>
  );
}

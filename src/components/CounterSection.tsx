import { useStore } from '../store/useStore';
import { complexStore, actions } from '../store/complexStore';
import { RenderCounter } from './RenderCounter';
import './CounterSection.scss';

export function CounterSection() {
  // counter 상태만 구독
  const counter = useStore(complexStore, (state) => state.counter);

  return (
    <div className="counter-section">
      <h3>
        🔢 카운터
        <RenderCounter name="Counter" color="#007bff" />
      </h3>

      <div className="counter-display">
        <h2 className="counter-value">{counter.count}</h2>
      </div>

      <div className="counter-controls">
        <button onClick={actions.decrementCounter} className="counter-btn decrement">
          -
        </button>
        <button onClick={actions.incrementCounter} className="counter-btn increment">
          +
        </button>
      </div>

      <div className="step-control">
        <label>
          증가/감소 단위:
          <input
            type="number"
            value={counter.step}
            onChange={(e) => actions.setStep(parseInt(e.target.value) || 1)}
            min="1"
            className="step-input"
          />
        </label>
      </div>
    </div>
  );
}

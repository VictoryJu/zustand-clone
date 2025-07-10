import { useRef } from 'react';
import './RenderCounter.scss';

type RenderCounterProps = {
  name: string;
  color?: string;
};

export function RenderCounter({ name, color = '#007bff' }: RenderCounterProps) {
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <div className="render-counter" style={{ backgroundColor: color }}>
      {name}: {renderCount.current}회
    </div>
  );
}

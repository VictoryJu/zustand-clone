import { useEffect, useRef, useReducer } from 'react';
import type { Store } from './createStore';

// shallow comparison 함수
function shallowEqual<T>(a: T, b: T): boolean {
  if (a === b) {
    return true;
  }

  if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) {
    return false;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (let i = 0; i < keysA.length; i++) {
    const key = keysA[i];
    if (!Object.prototype.hasOwnProperty.call(b, key)) {
      return false;
    }
    if ((a as Record<string, unknown>)[key] !== (b as Record<string, unknown>)[key]) {
      return false;
    }
  }

  return true;
}

// 리렌더링을 위한 reducer
function forceUpdateReducer(state: number): number {
  return state + 1;
}

/**
 * React 컴포넌트에서 store 상태를 사용하기 위한 커스텀 훅
 * selector를 통해 선택적으로 상태 일부를 구독하고
 * shallow comparison을 통해 필요한 경우에만 리렌더링
 */
export function useStore<T extends object, U>(store: Store<T>, selector: (state: T) => U): U {
  // 강제 리렌더링을 위한 reducer
  const [, forceUpdate] = useReducer(forceUpdateReducer, 0);

  // 현재 선택된 값을 저장하는 ref
  const selectedValueRef = useRef<U | undefined>(undefined);

  // 현재 상태에서 selector를 통해 값 계산
  const currentState = store.getState();
  const currentSelectedValue = selector(currentState);

  // 초기 렌더링 시 선택된 값 설정
  if (selectedValueRef.current === undefined) {
    selectedValueRef.current = currentSelectedValue;
  }

  // 상태 변경 감지 및 구독 관리
  useEffect(() => {
    // 구독 함수 정의
    const listener = (newState: T) => {
      const newSelectedValue = selector(newState);
      const prevSelectedValue = selectedValueRef.current;

      // shallow comparison으로 변경 확인
      if (!shallowEqual(prevSelectedValue, newSelectedValue)) {
        selectedValueRef.current = newSelectedValue;
        forceUpdate(); // 리렌더링 트리거
      }
    };

    // 구독 시작
    const unsubscribe = store.subscribe(listener);

    // 컴포넌트 언마운트 시 구독 해제
    return unsubscribe;
  }, [store, selector]);

  // 현재 선택된 값이 최신 상태와 다른 경우 업데이트
  if (!shallowEqual(selectedValueRef.current, currentSelectedValue)) {
    selectedValueRef.current = currentSelectedValue;
  }

  return selectedValueRef.current!;
}

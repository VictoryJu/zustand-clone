import { useSyncExternalStore, useRef, useCallback } from 'react';
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

/**
 * React 컴포넌트에서 store 상태를 사용하기 위한 커스텀 훅
 * useSyncExternalStore를 사용하여 안전하고 효율적인 구독 시스템 구현
 * selector를 통해 선택적으로 상태 일부를 구독하고
 * shallow comparison을 통해 필요한 경우에만 리렌더링
 */
export function useStore<T extends object, U>(store: Store<T>, selector: (state: T) => U): U {
  // 이전 선택된 값을 저장하는 ref
  const selectorRef = useRef(selector);
  const selectedValueRef = useRef<U | undefined>(undefined);

  // 최신 selector 함수 저장
  selectorRef.current = selector;

  // getSnapshot: 현재 선택된 값을 반환
  const getSnapshot = useCallback(() => {
    const newSelectedValue = selectorRef.current(store.getState());

    // shallow comparison으로 변경 확인
    if (selectedValueRef.current === undefined || !shallowEqual(selectedValueRef.current, newSelectedValue)) {
      selectedValueRef.current = newSelectedValue;
    }

    return selectedValueRef.current!;
  }, [store]);

  // subscribe: store의 변경을 구독
  const subscribe = useCallback(
    (callback: () => void) => {
      return store.subscribe(() => {
        // 상태 변경 시 callback 호출하여 리렌더링 트리거
        callback();
      });
    },
    [store]
  );

  // useSyncExternalStore를 사용하여 안전한 구독
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

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
 * Subscriber 구조 정의
 * 컴포넌트가 구독하는 방식으로 selector를 통해 상태의 특정 값만 구독하여 관리
 */
interface Subscriber<T, U> {
  selector: (state: T) => U; // 상태 중 선택할 값 선택
  currentSlice: U; // 현재 구독 중인 상태 값
  listener: () => void; // 값이 바뀌면 리렌더링을 트리거
}

/**
 * React 컴포넌트에서 store 상태를 사용하기 위한 커스텀 훅
 * 명시적인 Subscriber 구조를 사용하여 구독 시스템 구현
 * selector를 통해 선택적으로 상태 일부를 구독하고
 * shallow comparison을 통해 필요한 경우에만 리렌더링
 */
export function useStore<T extends object, U>(store: Store<T>, selector: (state: T) => U): U {
  // Subscriber 구조를 ref로 관리
  const subscriberRef = useRef<Subscriber<T, U> | null>(null);

  // 초기 subscriber 설정
  if (!subscriberRef.current) {
    const initialSlice = selector(store.getState());
    subscriberRef.current = {
      selector,
      currentSlice: initialSlice,
      listener: () => {}, // 나중에 설정됨
    };
  }

  // selector 업데이트
  subscriberRef.current.selector = selector;

  // getSnapshot: 현재 선택된 값을 반환
  const getSnapshot = useCallback(() => {
    const subscriber = subscriberRef.current!;
    const newSelectedValue = subscriber.selector(store.getState());

    // shallow comparison으로 변경 확인
    if (!shallowEqual(subscriber.currentSlice, newSelectedValue)) {
      subscriber.currentSlice = newSelectedValue;
    }

    return subscriber.currentSlice;
  }, [store]);

  // subscribe: store의 변경을 구독
  const subscribe = useCallback(
    (callback: () => void) => {
      const subscriber = subscriberRef.current!;
      // subscriber의 listener 설정
      subscriber.listener = callback;

      return store.subscribe(() => {
        // 상태 변경 시 선택된 값이 변경되었는지 확인
        const newSelectedValue = subscriber.selector(store.getState());
        const hasChanged = !shallowEqual(subscriber.currentSlice, newSelectedValue);

        if (hasChanged) {
          subscriber.currentSlice = newSelectedValue;
          subscriber.listener(); // 리렌더링 트리거
        }
      });
    },
    [store]
  );

  // useSyncExternalStore를 사용하여 안전한 구독
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

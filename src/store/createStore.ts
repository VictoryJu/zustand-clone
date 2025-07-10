// Listener 타입 정의 - 상태 변경 시 호출되는 함수
export type Listener<T> = (newState: T, prevState: T) => void;

// Store 인터페이스 정의
export interface Store<T> {
  getState: () => T;
  setState: (next: Partial<T> | ((prev: T) => Partial<T>)) => void;
  subscribe: (listener: Listener<T>) => () => void;
}

/**
 * 전역 상태 store를 생성하는 팩토리 함수
 * Publisher-Subscriber 패턴을 사용하여 상태 관리
 */
export function createStore<T extends object>(initialState: T): Store<T> {
  // 내부 상태 저장
  let state = initialState;

  // 구독자 목록 관리 (Set을 사용하여 중복 방지)
  const listeners = new Set<Listener<T>>();

  // 현재 상태 반환
  const getState = (): T => {
    return state;
  };

  // 상태 변경 및 구독자들에게 알림
  const setState = (next: Partial<T> | ((prev: T) => Partial<T>)): void => {
    const prevState = state;

    // 함수형 업데이트인지 확인
    const nextState = typeof next === 'function' ? next(prevState) : next;

    // 새로운 상태 생성 (shallow merge)
    const newState = {
      ...prevState,
      ...nextState,
    };

    // 상태가 실제로 변경되었는지 확인 (reference equality)
    if (prevState !== newState) {
      state = newState;

      // 모든 구독자에게 상태 변경 알림
      listeners.forEach((listener) => {
        listener(newState, prevState);
      });
    }
  };

  // 구독자 등록 및 해제 함수 반환
  const subscribe = (listener: Listener<T>): (() => void) => {
    // 구독자 등록
    listeners.add(listener);

    // 구독 해제 함수 반환
    return () => {
      listeners.delete(listener);
    };
  };

  return {
    getState,
    setState,
    subscribe,
  };
}

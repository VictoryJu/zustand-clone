# Zustand Clone

Mini Zustand 구현 프로젝트입니다.

## 🎯 목적

Zustand의 핵심 기능인 구독 기반 상태 관리 (Publisher-Subscriber 패턴)를 직접 구현해보는 프로젝트입니다.

## 🛠️ 기술 스택

- React 18
- TypeScript
- Vite
- Custom State Management (Zustand Clone)

## 📦 구현 기능

- [ ] `createStore` - 전역 상태 생성 팩토리 함수
- [ ] `useStore` - React 컴포넌트 연동용 커스텀 훅
- [ ] Shallow comparison을 통한 리렌더링 최적화
- [ ] 구독 기반 상태 변경 알림

## 🚀 실행 방법

```bash
npm install
npm run dev
```

## 📁 프로젝트 구조

```
/src
├── store/
│   ├── createStore.ts  # 핵심 store 생성 로직
│   └── useStore.ts     # React 연동용 hook
├── components/         # 테스트용 컴포넌트
└── App.tsx            # 메인 앱 컴포넌트
```

## 🧱 주요 동작 흐름

1. `createStore()`로 store 생성
2. store는 내부에 상태(state)와 구독자 목록(Set<Listener>)을 가짐
3. `setState()`를 통해 상태 변경 시 모든 listener에게 알림
4. `useStore()`는 selector와 shallow comparison을 통해 리렌더링 최적화

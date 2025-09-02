- 요약

Context API는 트리 깊은 곳의 컴포넌트까지 prop drilling 없이 값을 공유하기 위한 React 내장 메커니즘

전역/횡단 관심사(테마, 인증, i18n, 권한, 피처플래그 등)에 적합

주의: Context 값이 바뀌면 해당 값을 구독하는 모든 하위 컴포넌트가 리렌더
→ value를 useMemo로 안정화, 컨텍스트 분리(상태/디스패치), 스코프 최소화로 최적화

1) Context API란?

React의 데이터 전달 기본은 부모 → 자식 props입니다. 하지만 트리 깊숙한 자식에게 같은 값을 계속 넘겨야 하면 prop drilling이 발생합니다.
Context는 상위에서 Provider로 값을 공급하고, 하위 어느 컴포넌트에서든 useContext로 값을 직접 구독하는 방식으로 이 문제를 해결합니다.

핵심 구성요소:

createContext<T>() : 컨텍스트 객체 생성

<MyContext.Provider value={...}> : 트리 하위에 값 공급

useContext(MyContext) : 하위에서 값 소비

2) 왜 사용하는가? (언제 쓰는가)

적합한 경우

테마, 로케일(i18n), 인증 정보, 사용자 권한, 피처 플래그

폼 마법사 단계 상태처럼 한 기능 안에서만 공유되는 지역 전역 상태

여러 컴포넌트가 동일 소스의 상태를 필요로 할 때 덜 적합하거나 대안 고려

- 서버 상태(API 캐싱·동기화): React Query(TanStack Query) 권장

- 매우 복잡한 전역 상태/비즈니스 로직: Redux Toolkit, Zustand, Jotai 등

- 단순한 단방향 전달 1~2단계: 그냥 props가 더 간단
<br />
<br />

3) 기본 사용 예제: 테마 토글
디렉터리 구조 예
src/
  context/
    ThemeContext.tsx
  App.tsx
  components/
    ThemeButton.tsx
    ThemedBox.tsx

<details> <summary><strong>ThemeContext.tsx</strong></summary>

```typescript
import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react'

type Theme = 'light' | 'dark'

type ThemeContextValue = {
  theme: Theme
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('light')

  const toggle = () => setTheme(t => (t === 'light' ? 'dark' : 'light'))

  // value가 객체이므로 useMemo로 참조 안정화
  const value = useMemo(() => ({ theme, toggle }), [theme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

// 안전한 커스텀 훅
export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
```

</details> <details> <summary><strong>ThemeButton.tsx</strong></summary>

```typescript
import React from 'react'
import { useTheme } from '../context/ThemeContext'

export const ThemeButton = () => {
  const { theme, toggle } = useTheme()
  return (
    <button onClick={toggle}>
      현재 테마: {theme} → 클릭해서 전환
    </button>
  )
}

</details> <details> <summary><strong>ThemedBox.tsx</strong></summary>
import React from 'react'
import { useTheme } from '../context/ThemeContext'

export const ThemedBox = () => {
  const { theme } = useTheme()
  const style = {
    padding: 16,
    borderRadius: 8,
    background: theme === 'light' ? '#f5f5f5' : '#222',
    color: theme === 'light' ? '#222' : '#f5f5f5'
  }
  return <div style={style}>테마에 따라 스타일이 바뀌는 박스</div>
}
```

</details> <details> <summary><strong>App.tsx</strong></summary>

```typescript
import React from 'react'
import { ThemeProvider } from './context/ThemeContext'
import { ThemeButton } from './components/ThemeButton'
import { ThemedBox } from './components/ThemedBox'

const App = () => {
  return (
    <ThemeProvider>
      <h1>Context 기본 예제</h1>
      <ThemeButton />
      <ThemedBox />
    </ThemeProvider>
  )
}

export default App
```

</details>

포인트

ThemeProvider의 value는 객체이므로 useMemo로 안정화

트리 어디서든 useTheme()로 접근

Provider 범위를 좁게 유지해 불필요한 리렌더를 줄임

4) 패턴: 상태 컨텍스트와 디스패치 컨텍스트 분리

Context 값 변경 시 그 값을 구독하는 모든 소비자가 리렌더됩니다.
이때 상태 읽기와 디스패치 함수를 분리해 리렌더 영향을 최소화할 수 있습니다.

<details> <summary><strong>CounterContext (분리 패턴)</strong></summary>

```typescript
import React, { createContext, useContext, useReducer, ReactNode } from 'react'

type State = { count: number }
type Action = { type: 'inc' } | { type: 'dec' } | { type: 'set'; payload: number }

const StateCtx = createContext<State | undefined>(undefined)
const DispatchCtx = createContext<React.Dispatch<Action> | undefined>(undefined)

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'inc':
      return { count: state.count + 1 }
    case 'dec':
      return { count: state.count - 1 }
    case 'set':
      return { count: action.payload }
    default:
      return state
  }
}

export const CounterProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, { count: 0 })

  // state와 dispatch를 서로 다른 Provider로 분리
  return (
    <DispatchCtx.Provider value={dispatch}>
      <StateCtx.Provider value={state}>{children}</StateCtx.Provider>
    </DispatchCtx.Provider>
  )
}

export const useCounterState = () => {
  const s = useContext(StateCtx)
  if (!s) throw new Error('useCounterState must be used within CounterProvider')
  return s
}

export const useCounterDispatch = () => {
  const d = useContext(DispatchCtx)
  if (!d) throw new Error('useCounterDispatch must be used within CounterProvider')
  return d
}
```

</details> <details> <summary><strong>사용 예</strong></summary>

```typescript
import React from 'react'
import { CounterProvider, useCounterState, useCounterDispatch } from './context/CounterContext'

const Display = () => {
  const { count } = useCounterState()
  return <div>현재 값: {count}</div>
}

const Controls = () => {
  const dispatch = useCounterDispatch()
  return (
    <div>
      <button onClick={() => dispatch({ type: 'dec' })}>-1</button>
      <button onClick={() => dispatch({ type: 'inc' })}>+1</button>
      <button onClick={() => dispatch({ type: 'set', payload: 0 })}>reset</button>
    </div>
  )
}

const App = () => {
  return (
    <CounterProvider>
      <Display />
      <Controls />
    </CounterProvider>
  )
}

export default App
```

</details>

효과

dispatch 컨텍스트는 변경되지 않으므로 이를 구독하는 컴포넌트는 리렌더를 피함

상태를 실제로 읽는 컴포넌트만 리렌더

5) 실전 예시 아이디어

AuthContext: user, isAuthenticated, login, logout

I18nContext: locale, t(key) 번역 함수

PermissionContext: can('post.edit') 같은 권한 체크

FeatureFlagContext: A/B 테스트 토글, 새 UI 스위치

WizardContext: 다단계 폼의 현재 단계, 폼 데이터

<details> <summary><strong>간단 AuthContext 예시</strong></summary>

```typescript
import React, { createContext, useContext, useMemo, useState } from 'react'

type User = { id: string; name: string } | null

type AuthContextValue = {
  user: User
  login: (name: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(null)

  const login = (name: string) => setUser({ id: 'u1', name })
  const logout = () => setUser(null)

  const value = useMemo(() => ({ user, login, logout }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
```

</details>

6) 성능 최적화 요령

Provider 스코프를 최소화
필요한 서브트리까지만 감싸기

value 안정화

객체/배열/함수는 useMemo·useCallback으로 참조 고정

value={{ a, b, c }}에 불변성 깨지는 값을 직접 넣지 않기

컨텍스트 분리
읽기 빈도가 다른 데이터는 여러 Context로 나누기

예) StateContext vs DispatchContext

비싼 계산은 컨텍스트 밖에서
Provider 내부에서 무거운 계산을 매 렌더마다 하지 않기

과도한 전역화 지양
특정 페이지/모듈에만 쓰는 값은 지역 컨텍스트 또는 단순 props

7) 흔한 실수 & 안티패턴

createContext(defaultValue)로 실제 앱에서 쓰지 않는 가짜 기본값을 넣고, Provider 없이도 동작해 버리게 만드는 것
→ **undefined**를 기본값으로 두고 커스텀 훅에서 에러를 던지면 안전

value에 매 렌더마다 새 객체/함수 리터럴 전달
→ useMemo/useCallback 필수

모든 글로벌 상태를 Context로 해결하려는 시도
→ 서버 상태는 React Query, 복잡한 클라이언트 전역은 Zustand/Redux 고려

너무 큰 트리를 하나의 Provider로 감싸기
→ 스코프 축소, 컨텍스트 세분화

8) TypeScript 팁

컨텍스트 타입은 명시적인 제네릭과 undefined 기본값을 권장

커스텀 훅에서 if (!ctx) throw new Error(...) 패턴으로 사용 보장

액션형 상태는 useReducer + Action 유니온으로 안전성 확보

<details> <summary><strong>TS 안전한 컨텍스트 스니펫</strong></summary>

```typescript
type Ctx<T> = T | undefined

export const makeCtx = <T,>() => {
  const C = React.createContext<Ctx<T>>(undefined)
  const useCtx = () => {
    const v = React.useContext(C)
    if (!v) throw new Error('Missing Provider')
    return v
  }
  return [C, useCtx] as const
}
```

</details>

9) 테스트 전략

컨텍스트를 사용하는 컴포넌트를 테스트할 때는 테스트 전용 Provider로 감싸기

필요한 경우 목 구현의 Provider를 만들어 의존성 주입

<details> <summary><strong>React Testing Library 예시</strong></summary>

```typescript
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '../context/ThemeContext'
import { ThemedBox } from '../components/ThemedBox'

test('테마에 따라 색상 변경', () => {
  render(
    <ThemeProvider>
      <ThemedBox />
    </ThemeProvider>
  )
  expect(screen.getByText(/테마에 따라/)).toBeInTheDocument()
})
```

</details>

10) 기존 props에서 Context로 점진적 마이그레이션

반복 전달되는 prop 식별(테마, 사용자, 설정 등)

해당 값만 작은 Provider로 추출

하위 컴포넌트에서 useContext로 대체

영향 범위를 보면서 Provider 스코프를 점점 조정

리렌더 패턴을 관찰해 분리/메모로 최적화

11) FAQ

Q. Context만으로도 전역 상태 관리가 충분한가?
A. 단순 전역/횡단 관심사는 충분하다. 다만 서버 동기화/캐싱이 핵심이면 React Query, 복잡한 클라 상태는 Zustand/Redux Toolkit 등을 권장한다.

Q. 성능 이슈가 생기면?
A. Provider 스코프 최소화, value 메모, 컨텍스트 분리, 리스트 아이템처럼 자주 변하는 값은 별도 컨텍스트 또는 로컬 상태로 분리한다.
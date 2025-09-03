# useRef

## TL;DR

**useRef**는 컴포넌트가 리렌더돼도 같은 객체 참조를 유지하는 가변 컨테이너
변화가 생겨도 리렌더를 유발하지 않음 → DOM 엘리먼트 참조, 타이머/외부 값 보관, 최신 콜백 유지에 적합

**useState**는 값이 바뀌면 리렌더를 유발하는 반응형 상태
화면에 보여지는 값, 렌더링에 영향을 주는 로직은 useState로 관리

## useRef란?

- 호출 시 { current: initialValue } 형태의 안정적인 객체를 반환

- 컴포넌트의 생애주기 동안 동일한 ref 객체를 유지

- ref.current를 바꿔도 리렌더되지 않음

- JSX 요소에 ref 속성으로 넘기면 해당 DOM 노드를 연결받을 수 있음

## useRef vs useState 비교
| 기준 |	useRef |	useState |

| 값 변경 시 |	리렌더 안 함 |	리렌더 함 |

| 용도 |	DOM 노드 핸들, 타이머 ID, 외부 라이브러리 인스턴스, 최신 값 캐시, 이전 값 추적 |	화면에 보이는 데이터, 렌더링 의존 로직 |

| 값 저장 위치 |	가변 컨테이너 ref.current |	반응형 상태 |

| 불변성 요구 |	없음 (직접 변경) |	있음 (setState로 교체) |

| 초기화 타이밍 |	마운트 시 한 번 생성되는 객체 |	렌더마다 읽히고, setState 시 재렌더 |

## 언제 useRef를 쓰나

- DOM 조작: 포커스, 스크롤, 치수 측정, 비디오 컨트롤 등

- 렌더와 무관한 값 보관: 타이머 ID, WebSocket/Map/Observer 인스턴스, 외부 SDK 객체

- 최신 값/콜백 고정: 이벤트 핸들러의 stale closure 방지

- 이전 값 추적: 리렌더를 유발하지 않고 전·현재 값 비교

- 성능 최적화: 빈번히 변하지만 화면엔 영향 없는 값 저장

^반대로, 화면에 보여야 하거나 렌더 결과에 영향을 주면 **반드시 useState**를 사용하세요

## 핵심 예제들
1) DOM 포커스 제어
<details> <summary><strong>입력창에 포커스 주기</strong></summary>

```typescript
import { useRef } from 'react'

export default function FocusExample() {
  const inputRef = useRef<HTMLInputElement | null>(null)

  return (
    <div>
      <input ref={inputRef} placeholder='여기에 포커스' />
      <button onClick={() => inputRef.current?.focus()}>
        포커스
      </button>
    </div>
  )
}
```

</details>


2) 리렌더 차이 체감: useState vs useRef
<details> <summary><strong>버튼 클릭 시 무엇이 리렌더될까?</strong></summary>

```typescript
import { useRef, useState } from 'react'

export default function RenderDiff() {
  const [count, setCount] = useState(0)
  const refCount = useRef(0)
  const renderCount = useRef(0)
  renderCount.current += 1

  return (
    <div>
      <p>렌더 횟수: {renderCount.current}</p>

      <div style={{ marginTop: 8 }}>
        <p>state count: {count}</p>
        <button onClick={() => setCount(v => v + 1)}>
          state +1 (리렌더 발생)
        </button>
      </div>

      <div style={{ marginTop: 8 }}>
        <p>ref count: {refCount.current}</p>
        <button onClick={() => { refCount.current += 1 }}>
          ref +1 (리렌더 없음)
        </button>
      </div>
    </div>
  )
}
```

</details>

ref는 값이 바뀌어도 렌더를 트리거하지 않기 때문에 화면 숫자가 즉시 갱신되지 않습니다
화면에 보여야 한다면 useState로 관리해야 합니다

3) 최신 콜백 유지로 stale closure 방지
<details> <summary><strong>setInterval 안에서 최신 핸들러 사용</strong></summary>

```typescript
import { useEffect, useRef } from 'react'

type Handler = () => void

function useInterval(handler: Handler, delay: number) {
  const savedHandler = useRef<Handler>(() => {})

  useEffect(() => {
    savedHandler.current = handler
  }, [handler])

  useEffect(() => {
    const id = setInterval(() => {
      savedHandler.current()
    }, delay)
    return () => clearInterval(id)
  }, [delay])
}

export default function Timer() {
  const tick = () => {
    // 항상 최신 로직이 실행됨
    console.log('tick')
  }

  useInterval(tick, 1000)

  return <div>매초 tick</div>
}
```

</details>

4) 디바운스/타이머 ID 보관
<details> <summary><strong>입력 디바운스</strong></summary>

```typescript
import { useRef, useState } from 'react'

export default function DebouncedInput() {
  const [value, setValue] = useState('')
  const timerRef = useRef<number | null>(null)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setValue(v)

    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => {
      // v로 API 호출 등
      console.log('debounced', v)
    }, 500)
  }

  return <input value={value} onChange={onChange} placeholder='검색어' />
}
```

</details>

5) 이전 값 추적
<details> <summary><strong>prev 값과 비교</strong></summary>

```typescript
import { useEffect, useRef, useState } from 'react'

function usePrevious<T>(value: T) {
  const prevRef = useRef<T | undefined>(undefined)
  useEffect(() => {
    prevRef.current = value
  }, [value])
  return prevRef.current
}

export default function PreviousExample() {
  const [n, setN] = useState(0)
  const prev = usePrevious(n)

  return (
    <div>
      <p>현재: {n}, 이전: {prev ?? '없음'}</p>
      <button onClick={() => setN(v => v + 1)}>+1</button>
    </div>
  )
}
```

</details>

6) forwardRef + useImperativeHandle로 내부 메서드 공개
<details> <summary><strong>부모에서 자식의 focus 메서드 호출</strong></summary>

```typescript
import { forwardRef, useImperativeHandle, useRef } from 'react'

type InputHandle = {
  focus: () => void
}

const FancyInput = forwardRef<InputHandle>((_, ref) => {
  const inputRef = useRef<HTMLInputElement | null>(null)

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus()
  }))

  return <input ref={inputRef} placeholder='자식 입력창' />
})

export default function Parent() {
  const handleRef = useRef<InputHandle | null>(null)

  return (
    <div>
      <FancyInput ref={handleRef} />
      <button onClick={() => handleRef.current?.focus()}>
        자식 포커스
      </button>
    </div>
  )
}
```

</details>

## 실무 체크리스트

### useRef가 적합

1) 화면에 보일 필요는 없지만 유지해야 하는 값이 있다
- 예: 타이머/요청 취소 토큰/외부 SDK 인스턴스/최근 좌표

2) DOM 직접 제어가 필요하다
- 예: 포커스, 스크롤, 측정, 캔버스 조작

3) 이벤트 핸들러가 최신 값/콜백을 참조해야 한다

### useState가 적합

1) 값이 바뀌면 UI가 업데이트되어야 한다

2) 렌더링 분기, 스타일, 조건부 렌더링 등 반응형 로직에 쓰인다

3) 상태 추적과 불변성이 중요한 경우

## 흔한 실수 & 주의점

ref 변경으로 UI가 갱신되길 기
→ ref는 비반응형입니다. 화면에 보여야 하면 useState로

렌더 중 ref 변경과 사이드이펙트 실행
→ 사이드이펙트는 useEffect에서 수행

모든 전역성 데이터를 ref로 보관
→ 렌더에 영향을 주는 전역 데이터면 상태 관리 도구나 useState 사용

언마운트 시 정리 누락
→ 타이머, 리스너는 useEffect의 cleanup에서 해제

초기값 계산 비용 과다
→ useRef는 지연 초기화 함수가 없습니다. 무거운 초기화는 별도 함수로 한 번만 수행해 넣거나 useMemo로 감싸세요

## useRef vs useMemo 간단 비교
| 항목 |	useRef | useMemo |

| 반환 |	{ current } 컨테이너 |	계산된 값 |

| 재계산 |	없음 |	의존성이 바뀌면 재계산 |

| 주용도 |	인스턴스 변수 보관, DOM 핸들 |	값 메모이제이션 |

| 리렌더 트리거 |	아님 |	아님 |

- 인스턴스처럼 mutable하고 동일 참조가 중요하면 useRef
계산 결과를 캐시하고 싶으면 useMemo

## 결론

렌더링에 영향이 없고 생명주기 동안 유지해야 하는 가변 데이터 → useRef

값이 바뀌면 UI가 업데이트되어야 하는 반응형 데이터 → useState

실무에선 DOM 제어, 타이머/외부 객체 관리, 최신 콜백 유지, 이전 값 추적에서 useRef가 빛납니다
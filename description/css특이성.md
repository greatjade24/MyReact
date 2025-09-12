# CSS **특이성(specificity)** 쉽게 이해하기

**특이성**은 “여러 규칙이 같은 요소에 적용될 때, **누가 이길지**를 결정하는 숫자 우선순위”예요.
CSS는 보통 아래 순서로 충돌을 해결합니다:

1. `!important` 여부 → 2) 출처(브라우저/사용자/작성자) → 3) **@layer**(레이어) → 4) **특이성** → 5) 선언 **순서(나중 것이 이김)**

---

## 특이성은 어떻게 계산되나?

보통 **벡터**처럼 생각합니다: **(A, B, C, D)**

* **A**: 인라인 스타일 `style="..."` → 매칭 시 (1,0,0,0)
* **B**: **ID 선택자** `#id` 개수
* **C**: **클래스/속성/의사클래스** 개수

  * `.class`, `[type="text"]`, `:hover`, `:focus`, `:not(...)`, `:root`, `:has(...)` 등
* **D**: **요소/의사요소** 개수

  * `div`, `h1`, `::before`, `::after` 등
* `*`(유니버설), 결합자(`>` `+` `~` 공백)는 **0**에 영향 없음

> 비교는 A부터 차례대로 해요. 먼저 큰 쪽이 승리합니다. 모두 같으면 **나중에 선언된 규칙**이 이깁니다.

---

## 빠른 비교 예시

| 선택자                  |       특이성 | 비고                         |
| -------------------- | --------: | -------------------------- |
| `#app`               | (0,1,0,0) | ID 한 개                     |
| `.card.active`       | (0,0,2,0) | 클래스 두 개                    |
| `.card h2`           | (0,0,1,1) | 클래스 1 + 요소 1               |
| `h2.title`           | (0,0,1,1) | 동일값 → **나중 선언**이 이김        |
| `header nav a:hover` | (0,0,1,2) | 의사클래스 1 + 요소 2             |
| `:where(h1, h2)`     | (0,0,0,0) | **항상 0**                   |
| `.card :is(h1, h2)`  | (0,0,1,1) | `:is()`는 **가장 특이한 인자**를 반영 |
| `style="color: red"` | (1,0,0,0) | 인라인이 매우 강함                 |
| `!important`         |         — | 특이성보다 **먼저** 비교됨           |

---

## `:is()` / `:where()` / `:not()`과 특이성

* **`:is()`**: 괄호 안에서 **가장 특이한** 선택자의 특이성을 가져옵니다

  <details><summary>예시</summary>

  ```css
  .wrap :is(h1, h2) { color: red }
  ```

  `h1`과 `h2`는 요소 선택자이므로 `:is(h1, h2)`는 요소 1개로 계산 → `.wrap`(클래스 1)과 합쳐져 **(0,0,1,1)**

  </details>

* **`:where()`**: **항상 0**으로 처리 → “약한 베이스 스타일”에 좋음

  <details><summary>예시</summary>

  ```css
  :where(h1, h2, h3) { margin-block: .6em }
  ```

  특정성이 0이라 조금만 더 구체적인 규칙이 있으면 쉽게 덮어씌워짐

  </details>

* **`:not()`**: 인자 선택자의 **특이성 반영**(최신 스펙)

  <details><summary>예시</summary>

  ```css
  button:not(.primary) { opacity: .7 }
  ```

  `.primary`가 클래스이므로 `:not(.primary)`는 C가 +1

  </details>

---

## 실전에서 체감하기

### 1) 클래스 vs ID

<details>
<summary><strong>ID가 이기는 예</strong></summary>

```css
#app { color: red }      /* (0,1,0,0) */
.title { color: blue }   /* (0,0,1,0) */
```

같은 요소에 둘 다 적용되면 **#app** 규칙이 이겨서 빨강이 됩니다

</details>

### 2) 같은 특이성 → 나중 선언 승리

<details>
<summary><strong>선언 순서가 승부를 가름</strong></summary>

```css
.card h2 { color: green }   /* (0,0,1,1) */
h2.title { color: purple }  /* (0,0,1,1) */
```

둘 다 (0,0,1,1)이므로 **나중에 나온** `h2.title`이 이깁니다

</details>

### 3) `:where()`로 약하게 깔고 나중에 오버라이드

<details>
<summary><strong>베이스 + 변형</strong></summary>

```css
:where(.btn) { background: #eee }   /* (0,0,0,0) */
.btn--primary { background: dodgerblue }  /* (0,0,1,0) */
```

베이스는 약하게, 변형은 쉽게 덮어씌우기

</details>

---

## 특이성 “전쟁”을 피하는 베스트 프랙티스

* **ID보다 클래스** 중심으로 설계
* 선택자를 **짧고 평평하게** 유지(BEM 등)
* 베이스/리셋/컴포넌트 기본값엔 \*\*`:where()`\*\*로 **낮은 특이성** 사용
* 꼭 필요한 경우에만 `!important`
* 규모가 커진다면 \*\*`@layer`\*\*로 레이어 우선순위를 먼저 고정한 뒤, 내부에선 낮은 특이성 전략 유지

<details>
<summary><strong>@layer 예시</strong></summary>

```css
@layer reset, base, components, utilities

@layer reset {
  :where(*, *::before, *::after) { box-sizing: border-box }
}

@layer base {
  :where(body) { line-height: 1.5 }
}

@layer components {
  .card { padding: 16px }
}

@layer utilities {
  .text-right { text-align: right }
}
```

레이어 순서는 **reset → base → components → utilities**
같은 특이성이라도 **레이어가 더 뒤**면 이깁니다

</details>

---

## 한 줄 요약

> **특이성**은 규칙 간 충돌 시 “누가 더 구체적인가”를 수치화한 값입니다.
> **낮은 특이성으로 베이스를 깔고, 필요한 곳에서만 조금 더 구체적으로 덮어쓰기**—이게 확장성과 유지보수의 핵심이에요.

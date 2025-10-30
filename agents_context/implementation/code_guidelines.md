# TheraType 코딩 가이드라인

**목적**: 일관된 코드 작성, 협업 효율성 향상, 유지보수 용이성 확보

---

## 📁 프로젝트 구조

```
theratype/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
│
├── src/
│   ├── components/          # 재사용 가능한 컴포넌트
│   │   ├── common/          # 공통 UI 컴포넌트
│   │   │   ├── Button.js
│   │   │   ├── Button.module.css
│   │   │   ├── Input.js
│   │   │   ├── Card.js
│   │   │   ├── Modal.js
│   │   │   └── Loading.js
│   │   │
│   │   ├── insight/         # Insight Mode 전용
│   │   │   ├── SentencePair.js
│   │   │   ├── SentencePair.module.css
│   │   │   └── ResultSummary.js
│   │   │
│   │   ├── therapy/         # Therapy Mode 전용
│   │   │   ├── TypingInterface.js
│   │   │   ├── FeedbackCard.js
│   │   │   └── SentenceCard.js
│   │   │
│   │   └── dashboard/       # Dashboard 전용
│   │       ├── SpeedChart.js
│   │       ├── ProfileRadar.js
│   │       └── StatCard.js
│   │
│   ├── pages/               # 페이지 컴포넌트 (라우트)
│   │   ├── Home.js
│   │   ├── Login.js
│   │   ├── Signup.js
│   │   ├── Onboarding.js
│   │   ├── InsightMode.js
│   │   ├── TherapyMode.js
│   │   ├── Dashboard.js
│   │   └── Settings.js
│   │
│   ├── contexts/            # React Context API
│   │   ├── UserContext.js
│   │   └── ProfileContext.js
│   │
│   ├── hooks/               # Custom Hooks
│   │   ├── useAuth.js
│   │   ├── useTyping.js
│   │   └── useFirestore.js
│   │
│   ├── utils/               # 유틸리티 함수
│   │   ├── typingAnalyzer.js
│   │   ├── profileCalculator.js
│   │   ├── dashboardData.js
│   │   └── validators.js
│   │
│   ├── data/                # 정적 데이터 (JSON)
│   │   ├── insightPairs.json
│   │   └── therapySentences.json
│   │
│   ├── firebase/            # Firebase 설정
│   │   └── config.js
│   │
│   ├── styles/              # 전역 스타일
│   │   ├── global.css
│   │   └── variables.css
│   │
│   ├── App.js               # 메인 앱 컴포넌트
│   ├── App.css
│   └── index.js             # 진입점
│
├── .env.local               # 환경 변수 (로컬)
├── .env.production          # 환경 변수 (배포)
├── .gitignore
├── package.json
├── README.md
└── firebase.json
```

---

## 📝 파일명 규칙

### JavaScript/JSX 파일
- **컴포넌트**: PascalCase
  - 예: `Button.js`, `SentencePair.js`, `InsightMode.js`
- **유틸리티/함수**: camelCase
  - 예: `typingAnalyzer.js`, `profileCalculator.js`
- **Context**: PascalCase + "Context"
  - 예: `UserContext.js`
- **Hooks**: camelCase + "use" 접두사
  - 예: `useAuth.js`, `useTyping.js`

### CSS 파일
- **CSS Modules**: `[ComponentName].module.css`
  - 예: `Button.module.css`, `SentencePair.module.css`
- **전역 CSS**: kebab-case
  - 예: `global.css`, `variables.css`

### JSON 데이터 파일
- camelCase
  - 예: `insightPairs.json`, `therapySentences.json`

---

## 🧩 컴포넌트 작성 패턴

### 기본 구조

```javascript
// src/components/common/Button.js

import React from 'react';
import styles from './Button.module.css';

/**
 * 재사용 가능한 버튼 컴포넌트
 * @param {string} variant - 버튼 스타일 ('primary', 'secondary', 'danger')
 * @param {function} onClick - 클릭 핸들러
 * @param {boolean} disabled - 비활성화 여부
 * @param {ReactNode} children - 버튼 텍스트/내용
 */
const Button = ({
  variant = 'primary',
  onClick,
  disabled = false,
  children
}) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
```

### Prop Types 문서화

```javascript
// JSDoc 활용 (TypeScript 대신)
/**
 * @typedef {Object} SentencePairProps
 * @property {Object} pair - 문장 쌍 데이터
 * @property {string} pair.id - 문장 쌍 ID
 * @property {Object} pair.sentenceA - 문장 A
 * @property {Object} pair.sentenceB - 문장 B
 * @property {function} onSelect - 선택 핸들러
 */

const SentencePair = ({ pair, onSelect }) => {
  // ...
};
```

---

## 🎨 스타일링 규칙

### CSS Modules 사용

```css
/* Button.module.css */

.button {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.primary {
  background-color: #4f46e5;
  color: white;
}

.primary:hover {
  background-color: #4338ca;
}

.secondary {
  background-color: #e5e7eb;
  color: #374151;
}

.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### CSS 변수 활용 (전역)

```css
/* styles/variables.css */

:root {
  /* Colors */
  --color-primary: #4f46e5;
  --color-primary-dark: #4338ca;
  --color-secondary: #10b981;
  --color-danger: #ef4444;
  --color-text: #1f2937;
  --color-text-light: #6b7280;
  --color-background: #ffffff;
  --color-background-alt: #f9fafb;

  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;

  /* Typography */
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 24px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.15);
}
```

---

## 🔄 State 관리 규칙

### Local State (useState)

```javascript
// 간단한 UI 상태
const [isOpen, setIsOpen] = useState(false);
const [typedText, setTypedText] = useState('');
const [loading, setLoading] = useState(false);

// 복잡한 상태는 객체로
const [session, setSession] = useState({
  startTime: null,
  sentences: [],
  currentIndex: 0
});

// 업데이트 시 spread 연산자
setSession(prev => ({
  ...prev,
  currentIndex: prev.currentIndex + 1
}));
```

### Context (전역 상태)

```javascript
// contexts/UserContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../firebase/config';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading
  };

  return (
    <UserContext.Provider value={value}>
      {!loading && children}
    </UserContext.Provider>
  );
};

// Custom Hook for easy access
export const useAuth = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useAuth must be used within UserProvider');
  }
  return context;
};
```

---

## 📦 Custom Hooks 패턴

### useTyping Hook

```javascript
// hooks/useTyping.js

import { useState, useCallback } from 'react';
import { calculateWPM, calculateAccuracy } from '../utils/typingAnalyzer';

/**
 * 타이핑 로직을 캡슐화한 Hook
 */
const useTyping = (targetSentence) => {
  const [typedText, setTypedText] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [isComplete, setIsComplete] = useState(false);

  const handleKeyDown = useCallback((e) => {
    // 시작 시간 기록
    if (!startTime) {
      setStartTime(Date.now());
    }
  }, [startTime]);

  const handleChange = useCallback((e) => {
    const newText = e.target.value;
    setTypedText(newText);

    // 완료 체크
    if (newText === targetSentence) {
      const timeMs = Date.now() - startTime;
      setIsComplete(true);

      return {
        wpm: calculateWPM(targetSentence, timeMs),
        accuracy: 100,
        timeMs
      };
    }

    return null;
  }, [targetSentence, startTime]);

  const reset = useCallback(() => {
    setTypedText('');
    setStartTime(null);
    setIsComplete(false);
  }, []);

  return {
    typedText,
    isComplete,
    handleKeyDown,
    handleChange,
    reset
  };
};

export default useTyping;
```

### useFirestore Hook

```javascript
// hooks/useFirestore.js

import { useState, useEffect } from 'react';
import { db } from '../firebase/config';

/**
 * Firestore 데이터 조회 Hook
 * @param {string} collection - 컬렉션 이름
 * @param {string} docId - 문서 ID (optional)
 */
const useFirestore = (collection, docId = null) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        if (docId) {
          // 단일 문서 조회
          const docRef = db.collection(collection).doc(docId);
          const doc = await docRef.get();

          if (doc.exists) {
            setData({ id: doc.id, ...doc.data() });
          } else {
            setError('Document not found');
          }
        } else {
          // 컬렉션 조회
          const snapshot = await db.collection(collection).get();
          const docs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setData(docs);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [collection, docId]);

  return { data, loading, error };
};

export default useFirestore;
```

---

## 🔐 Firebase 사용 규칙

### Authentication

```javascript
// 회원가입
import { auth } from '../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const signup = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 로그인
import { signInWithEmailAndPassword } from 'firebase/auth';

const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 로그아웃
import { signOut } from 'firebase/auth';

const logout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
```

### Firestore CRUD

```javascript
import { db } from '../firebase/config';
import {
  collection,
  addDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';

// Create
const createSession = async (sessionData) => {
  try {
    const docRef = await addDoc(collection(db, 'therapySessions'), {
      ...sessionData,
      createdAt: new Date()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Create failed:', error);
    return { success: false, error: error.message };
  }
};

// Read
const getSession = async (sessionId) => {
  try {
    const docRef = doc(db, 'therapySessions', sessionId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { success: true, data: docSnap.data() };
    } else {
      return { success: false, error: 'Document not found' };
    }
  } catch (error) {
    console.error('Read failed:', error);
    return { success: false, error: error.message };
  }
};

// Update
const updateSession = async (sessionId, updates) => {
  try {
    const docRef = doc(db, 'therapySessions', sessionId);
    await updateDoc(docRef, updates);
    return { success: true };
  } catch (error) {
    console.error('Update failed:', error);
    return { success: false, error: error.message };
  }
};

// Delete
const deleteSession = async (sessionId) => {
  try {
    const docRef = doc(db, 'therapySessions', sessionId);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error('Delete failed:', error);
    return { success: false, error: error.message };
  }
};
```

---

## 🧪 에러 처리 패턴

### Try-Catch 표준화

```javascript
// 모든 비동기 함수는 try-catch로 감싸기
const saveData = async (data) => {
  try {
    // 비즈니스 로직
    const result = await db.collection('sessions').add(data);
    return { success: true, data: result };
  } catch (error) {
    // 에러 로깅
    console.error('saveData failed:', error);

    // 사용자 친화적 메시지
    return {
      success: false,
      error: '데이터 저장에 실패했습니다. 다시 시도해주세요.'
    };
  }
};
```

### 사용자에게 에러 표시

```javascript
// components/common/ErrorMessage.js

const ErrorMessage = ({ error, onRetry }) => {
  if (!error) return null;

  return (
    <div className={styles.errorContainer}>
      <p className={styles.errorText}>{error}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          다시 시도
        </Button>
      )}
    </div>
  );
};
```

---

## 📊 주석 작성 규칙

### 함수 주석 (JSDoc)

```javascript
/**
 * 타이핑 속도(WPM)를 계산합니다.
 *
 * @param {string} text - 입력된 텍스트
 * @param {number} timeMs - 소요 시간 (밀리초)
 * @returns {number} WPM (분당 단어 수, 한글은 글자수/5)
 *
 * @example
 * calculateWPM("나는 충분히 잘하고 있다", 20000)
 * // returns 78
 */
function calculateWPM(text, timeMs) {
  const characters = text.length;
  const words = characters / 5;  // 한글 기준
  const minutes = timeMs / 60000;

  return Math.round(words / minutes);
}
```

### 인라인 주석

```javascript
// ✅ Good: 왜 이렇게 했는지 설명
// Firebase에서 한글 전문 검색이 제한적이므로 카테고리별 필터링 우선
const filteredSentences = sentences.filter(s => s.category === profile);

// ❌ Bad: 코드를 그대로 반복
// 문장을 필터링한다
const filteredSentences = sentences.filter(s => s.category === profile);
```

### TODO 주석

```javascript
// TODO: 향후 기계학습 기반 추천으로 개선
// TODO(username): 정확도 계산 알고리즘 재검토 필요
// FIXME: 한글 조합 중 타이핑 입력 버그 수정 필요
```

---

## 🔀 Git Commit 메시지 규칙

### 커밋 메시지 형식

```
<type>: <subject>

<body> (선택적)

<footer> (선택적)
```

### Type 종류

- **feat**: 새로운 기능 추가
- **fix**: 버그 수정
- **docs**: 문서 수정
- **style**: 코드 포매팅 (기능 변경 없음)
- **refactor**: 코드 리팩토링
- **test**: 테스트 추가/수정
- **chore**: 빌드 설정, 패키지 등

### 예시

```bash
# Good
git commit -m "feat: Insight Mode 문장 선택 기능 구현"
git commit -m "fix: 타이핑 입력 시 한글 조합 버그 수정"
git commit -m "refactor: typingAnalyzer.js 함수 분리"

# Bad
git commit -m "수정"
git commit -m "버그 고침"
git commit -m "작업 중"
```

### Body 포함 예시

```
feat: Therapy Mode 프로파일 매칭 로직 추가

Insight Mode 결과를 기반으로 사용자 프로파일을 자동 분류.
가장 낮은 점수의 카테고리를 우선 지원하는 문장 제공.

Closes #12
```

---

## 📏 코드 품질 체크리스트

개발 중 자주 확인할 사항:

### 컴포넌트
- [ ] Props가 명확하게 정의되어 있는가?
- [ ] 재사용 가능한 구조인가?
- [ ] 하나의 책임만 가지는가? (Single Responsibility)
- [ ] 불필요한 리렌더링이 없는가?

### 함수
- [ ] 함수명이 기능을 명확히 표현하는가?
- [ ] 한 함수가 하나의 작업만 하는가?
- [ ] 주석이 충분한가? (JSDoc)
- [ ] Edge case 처리가 되어 있는가?

### 스타일
- [ ] CSS Modules로 스타일이 캡슐화되어 있는가?
- [ ] 반응형 디자인이 적용되어 있는가?
- [ ] 색상이 CSS 변수로 관리되는가?

### Firebase
- [ ] try-catch로 에러 처리가 되어 있는가?
- [ ] 사용자 친화적 에러 메시지가 있는가?
- [ ] 불필요한 Firestore 읽기/쓰기가 없는가?

### Git
- [ ] 커밋 메시지가 규칙을 따르는가?
- [ ] 작은 단위로 자주 커밋하는가?
- [ ] 민감 정보(.env)가 커밋되지 않았는가?

---

## 🚀 성능 최적화 팁

### React 최적화

```javascript
// 1. React.memo로 불필요한 리렌더 방지
import React, { memo } from 'react';

const SentenceCard = memo(({ sentence, onClick }) => {
  return <div onClick={onClick}>{sentence.text}</div>;
});

// 2. useMemo로 비용 큰 계산 캐싱
import { useMemo } from 'react';

const DashboardChart = ({ sessions }) => {
  const chartData = useMemo(() => {
    return sessions.map(s => ({
      date: formatDate(s.date),
      wpm: calculateAvgWpm(s.sentences)
    }));
  }, [sessions]);

  return <LineChart data={chartData} />;
};

// 3. useCallback으로 함수 재생성 방지
import { useCallback } from 'react';

const ParentComponent = () => {
  const handleClick = useCallback((id) => {
    console.log('Clicked:', id);
  }, []); // 의존성 배열 비어있으면 한 번만 생성

  return <ChildComponent onClick={handleClick} />;
};
```

### Firestore 최적화

```javascript
// ❌ Bad: 매번 전체 컬렉션 조회
const sessions = await db.collection('therapySessions').get();

// ✅ Good: 필터링 및 제한
const sessions = await db.collection('therapySessions')
  .where('userId', '==', currentUser.uid)
  .where('date', '>=', sevenDaysAgo)
  .orderBy('date', 'desc')
  .limit(10)
  .get();
```

---

## 🔧 유용한 VS Code 설정

### settings.json

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.associations": {
    "*.css": "css"
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  }
}
```

### 추천 확장

- ESLint: 코드 품질 체크
- Prettier: 코드 포매팅
- ES7+ React/Redux Snippets: 빠른 코드 생성
- CSS Modules: CSS 자동완성

---

**문서 버전**: 1.0
**최종 수정**: 2025-01-30
**작성자**: Implementation Lead
**다음 문서**: implementation_guide.md

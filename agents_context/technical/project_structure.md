# TheraType 프로젝트 디렉토리 구조

**작성자**: Technical Architect Agent
**작성일**: 2025-01-30
**문서 목적**: 프로젝트 폴더 및 파일 구조 설계

---

## 프로젝트 구조 개요

### 디렉토리 전략

**선택**: **모놀리식 (Monolithic) 구조**

**근거**:
- MVP 규모가 작음 (프론트엔드만 존재)
- 백엔드는 Firebase가 처리 (별도 서버 불필요)
- 모노레포(Monorepo) 관리 복잡도 불필요
- 빠른 개발에 집중

---

## 전체 디렉토리 구조

```
theratype/
├── .firebase/                    # Firebase 설정 (자동 생성)
├── .github/                      # GitHub 설정
│   └── workflows/
│       └── deploy.yml            # CI/CD (선택적)
│
├── dist/                         # 빌드 결과물 (자동 생성, .gitignore)
│
├── node_modules/                 # 의존성 (자동 생성, .gitignore)
│
├── public/                       # 정적 자산
│   ├── favicon.ico
│   ├── logo.png
│   ├── robots.txt
│   └── manifest.json             # PWA (선택적)
│
├── src/                          # 소스 코드 (핵심 디렉토리)
│   ├── assets/                   # 이미지, 폰트 등
│   │   ├── images/
│   │   │   ├── hero-bg.svg
│   │   │   └── onboarding-1.svg
│   │   └── fonts/
│   │       └── Pretendard.woff2
│   │
│   ├── components/               # React 컴포넌트
│   │   ├── common/               # 공통 컴포넌트
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── ProgressBar.jsx
│   │   │
│   │   ├── layout/               # 레이아웃 컴포넌트
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── MainLayout.jsx
│   │   │
│   │   ├── auth/                 # 인증 관련
│   │   │   ├── LoginForm.jsx
│   │   │   ├── SignupForm.jsx
│   │   │   └── PrivateRoute.jsx
│   │   │
│   │   ├── insight/              # Insight Mode 컴포넌트
│   │   │   ├── SentencePair.jsx
│   │   │   ├── TypingInput.jsx
│   │   │   ├── ProgressIndicator.jsx
│   │   │   └── ResultSummary.jsx
│   │   │
│   │   ├── therapy/              # Therapy Mode 컴포넌트
│   │   │   ├── SentenceDisplay.jsx
│   │   │   ├── TypingArea.jsx
│   │   │   ├── FeedbackCard.jsx
│   │   │   └── SessionSummary.jsx
│   │   │
│   │   └── dashboard/            # 대시보드 컴포넌트
│   │       ├── SpeedChart.jsx
│   │       ├── ProfileRadar.jsx
│   │       ├── StreakCounter.jsx
│   │       └── StatCard.jsx
│   │
│   ├── pages/                    # 페이지 컴포넌트 (라우트별)
│   │   ├── Home.jsx              # 홈/랜딩 페이지
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Onboarding.jsx
│   │   ├── InsightMode.jsx
│   │   ├── TherapyMode.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Settings.jsx
│   │   └── NotFound.jsx
│   │
│   ├── contexts/                 # React Context (전역 상태)
│   │   ├── AuthContext.jsx
│   │   ├── ProfileContext.jsx
│   │   └── ThemeContext.jsx      # (선택적, 다크모드)
│   │
│   ├── hooks/                    # Custom Hooks
│   │   ├── useAuth.js
│   │   ├── useTypingAnalyzer.js
│   │   ├── useFirestore.js
│   │   └── useLocalStorage.js
│   │
│   ├── utils/                    # 유틸리티 함수
│   │   ├── typingAnalyzer.js     # WPM, 정확도 계산
│   │   ├── profileCalculator.js  # 프로파일 점수 계산
│   │   ├── dateFormatter.js
│   │   ├── validators.js         # 폼 검증
│   │   └── constants.js          # 상수 정의
│   │
│   ├── services/                 # 외부 서비스 연동
│   │   ├── firebase.js           # Firebase 초기화
│   │   ├── authService.js        # 인증 로직
│   │   ├── firestoreService.js   # DB CRUD
│   │   └── analyticsService.js   # (선택적)
│   │
│   ├── data/                     # 정적 데이터
│   │   ├── insightSentences.js   # Insight Mode 문장 쌍
│   │   ├── therapySentences.js   # Therapy Mode 문장
│   │   └── onboardingSlides.js
│   │
│   ├── styles/                   # 글로벌 스타일
│   │   ├── index.css             # Tailwind imports
│   │   └── custom.css            # 커스텀 CSS (최소화)
│   │
│   ├── App.jsx                   # 루트 컴포넌트
│   ├── main.jsx                  # 진입점 (Vite)
│   └── router.jsx                # 라우팅 설정
│
├── .env.local                    # 환경 변수 (개발용, .gitignore)
├── .env.production               # 환경 변수 (배포용, .gitignore)
├── .env.example                  # 환경 변수 템플릿 (git 포함)
├── .eslintrc.json                # ESLint 설정
├── .gitignore
├── .prettierrc                   # Prettier 설정
├── firebase.json                 # Firebase 설정
├── firestore.rules               # Firestore 보안 규칙
├── firestore.indexes.json        # Firestore 인덱스
├── index.html                    # HTML 진입점
├── package.json
├── package-lock.json
├── postcss.config.js             # PostCSS (Tailwind용)
├── tailwind.config.js            # Tailwind CSS 설정
├── vite.config.js                # Vite 설정
└── README.md
```

---

## 주요 디렉토리 상세 설명

### 1. src/components/

**역할**: 재사용 가능한 UI 컴포넌트

**폴더 구조 원칙**:
- **common/**: 프로젝트 전체에서 사용되는 범용 컴포넌트
- **기능별 폴더**: Insight, Therapy, Dashboard 등 각 기능 전용 컴포넌트

**컴포넌트 파일 구조 예시**:
```javascript
// src/components/common/Button.jsx
import React from 'react';

/**
 * 공통 버튼 컴포넌트
 * @param {string} variant - primary, secondary, outline
 * @param {string} size - sm, md, lg
 * @param {function} onClick - 클릭 핸들러
 * @param {string} children - 버튼 텍스트
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  onClick,
  children,
  disabled = false
}) {
  const baseClasses = 'rounded-lg font-medium transition-colors';

  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-dark',
    secondary: 'bg-secondary text-white hover:bg-secondary-dark',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
```

---

### 2. src/pages/

**역할**: 라우트에 매핑되는 페이지 컴포넌트

**원칙**:
- 각 페이지는 하나의 파일로 작성
- 페이지 로직은 hooks로 분리
- 복잡한 UI는 `components/`로 분리

**페이지 예시**:
```javascript
// src/pages/InsightMode.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../contexts/ProfileContext';
import SentencePair from '../components/insight/SentencePair';
import ProgressIndicator from '../components/insight/ProgressIndicator';
import ResultSummary from '../components/insight/ResultSummary';
import { insightSentences } from '../data/insightSentences';
import { calculateProfileScores, assignProfile } from '../utils/profileCalculator';
import { saveInsightSession } from '../services/firestoreService';

export default function InsightMode() {
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [selections, setSelections] = useState([]);
  const [isComplete, setIsComplete] = useState(false);

  const { user } = useAuth();
  const { setProfile } = useProfile();
  const navigate = useNavigate();

  const handleSelection = (selection) => {
    const newSelections = [...selections, selection];
    setSelections(newSelections);

    if (currentPairIndex < insightSentences.length - 1) {
      setCurrentPairIndex(currentPairIndex + 1);
    } else {
      finishSession(newSelections);
    }
  };

  const finishSession = async (allSelections) => {
    const profileScores = calculateProfileScores(allSelections);
    const assignedProfile = assignProfile(profileScores);

    await saveInsightSession(user.uid, allSelections, profileScores, assignedProfile);

    setProfile({ scores: profileScores, type: assignedProfile });
    setIsComplete(true);
  };

  if (isComplete) {
    return <ResultSummary scores={profile.scores} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProgressIndicator current={currentPairIndex + 1} total={insightSentences.length} />
      <SentencePair
        pair={insightSentences[currentPairIndex]}
        onSelect={handleSelection}
      />
    </div>
  );
}
```

---

### 3. src/contexts/

**역할**: 전역 상태 관리

**AuthContext 예시**:
```javascript
// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

---

### 4. src/hooks/

**역할**: 재사용 가능한 로직 (Custom Hooks)

**useTypingAnalyzer 예시**:
```javascript
// src/hooks/useTypingAnalyzer.js
import { useState, useCallback, useRef } from 'react';
import { calculateWPM, calculateAccuracy } from '../utils/typingAnalyzer';

export default function useTypingAnalyzer() {
  const [keystrokeLog, setKeystrokeLog] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  const targetSentenceRef = useRef('');

  const startSession = useCallback((targetSentence) => {
    targetSentenceRef.current = targetSentence;
    setKeystrokeLog([]);
    setStartTime(Date.now());
    setIsTyping(true);
  }, []);

  const logKeystroke = useCallback((key) => {
    if (!isTyping) return;

    const timestamp = Date.now() - startTime;
    setKeystrokeLog(prev => [...prev, { key, timestamp }]);
  }, [isTyping, startTime]);

  const endSession = useCallback((typedText) => {
    const endTime = Date.now();
    const totalTime = endTime - startTime;

    const wpm = calculateWPM(typedText, totalTime);
    const accuracy = calculateAccuracy(targetSentenceRef.current, typedText);

    setIsTyping(false);

    return {
      wpm,
      accuracy,
      totalTime,
      keystrokeLog,
      backspaceCount: keystrokeLog.filter(k => k.key === 'Backspace').length
    };
  }, [startTime, keystrokeLog, isTyping]);

  return {
    startSession,
    logKeystroke,
    endSession,
    isTyping
  };
}
```

---

### 5. src/utils/

**역할**: 순수 함수 유틸리티

**typingAnalyzer.js 예시**:
```javascript
// src/utils/typingAnalyzer.js

/**
 * WPM (Words Per Minute) 계산
 * 한글 기준: 5자 = 1 단어
 */
export function calculateWPM(text, timeMs) {
  if (timeMs <= 0) return 0;

  const characters = text.length;
  const words = characters / 5;
  const minutes = timeMs / 60000;

  return Math.round(words / minutes);
}

/**
 * 타이핑 정확도 계산
 */
export function calculateAccuracy(targetText, typedText) {
  if (!targetText || !typedText) return 0;

  const target = targetText.split('');
  const typed = typedText.split('');
  const maxLength = Math.max(target.length, typed.length);

  let correctCount = 0;

  for (let i = 0; i < maxLength; i++) {
    if (target[i] === typed[i]) {
      correctCount++;
    }
  }

  const accuracy = (correctCount / target.length) * 100;
  return Math.round(accuracy);
}

/**
 * 망설임 패턴 분석
 * @param {Array} keystrokeLog - [{key, timestamp}]
 * @returns {Array} - 2초 이상 멈춘 구간
 */
export function analyzeHesitation(keystrokeLog) {
  const pauses = [];

  for (let i = 1; i < keystrokeLog.length; i++) {
    const interval = keystrokeLog[i].timestamp - keystrokeLog[i - 1].timestamp;

    if (interval > 2000) {
      pauses.push({
        position: i,
        duration: interval
      });
    }
  }

  return pauses;
}
```

---

### 6. src/services/

**역할**: 외부 서비스 API 래핑

**firestoreService.js 예시**:
```javascript
// src/services/firestoreService.js
import { db } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';

/**
 * Insight Session 저장
 */
export async function saveInsightSession(userId, selections, profileScores, assignedProfile) {
  const sessionData = {
    userId,
    completedAt: Timestamp.now(),
    selections,
    profileScores,
    assignedProfile
  };

  const docRef = await addDoc(collection(db, 'insightSessions'), sessionData);
  return docRef.id;
}

/**
 * Therapy Session 저장
 */
export async function saveTherapySession(userId, profile, sentences) {
  const sessionData = {
    userId,
    date: Timestamp.now(),
    profile,
    sentences
  };

  const docRef = await addDoc(collection(db, 'therapySessions'), sessionData);
  return docRef.id;
}

/**
 * 사용자의 최근 세션 조회
 */
export async function getRecentSessions(userId, days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const q = query(
    collection(db, 'therapySessions'),
    where('userId', '==', userId),
    where('date', '>=', Timestamp.fromDate(startDate)),
    orderBy('date', 'asc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
```

---

### 7. src/data/

**역할**: 정적 콘텐츠 데이터

**insightSentences.js 예시**:
```javascript
// src/data/insightSentences.js
export const insightSentences = [
  {
    id: 'SP1',
    category: 'self_perception',
    sentenceA: '나는 내 장점과 강점을 잘 알고 있다',
    sentenceB: '나는 내 단점이 더 많이 눈에 띈다',
    scoreA: 'positive',
    scoreB: 'negative'
  },
  {
    id: 'SP2',
    category: 'self_perception',
    sentenceA: '나는 충분히 잘하고 있다고 느낀다',
    sentenceB: '항상 더 잘해야 한다는 압박감이 있다',
    scoreA: 'positive',
    scoreB: 'negative'
  },
  // ... 나머지 8개
];
```

---

## 라우팅 구조

### router.jsx

```javascript
// src/router.jsx
import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import PrivateRoute from './components/auth/PrivateRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import InsightMode from './pages/InsightMode';
import TherapyMode from './pages/TherapyMode';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      {
        path: 'onboarding',
        element: <PrivateRoute><Onboarding /></PrivateRoute>
      },
      {
        path: 'insight',
        element: <PrivateRoute><InsightMode /></PrivateRoute>
      },
      {
        path: 'therapy',
        element: <PrivateRoute><TherapyMode /></PrivateRoute>
      },
      {
        path: 'dashboard',
        element: <PrivateRoute><Dashboard /></PrivateRoute>
      },
      {
        path: 'settings',
        element: <PrivateRoute><Settings /></PrivateRoute>
      },
      { path: '*', element: <NotFound /> }
    ]
  }
]);
```

---

## 설정 파일 상세

### package.json

```json
{
  "name": "theratype",
  "version": "1.0.0",
  "description": "Therapeutic Typing Platform - MVP",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext js,jsx",
    "format": "prettier --write \"src/**/*.{js,jsx,css}\"",
    "test": "vitest",
    "deploy": "npm run build && firebase deploy"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "firebase": "^10.7.0",
    "chart.js": "^4.4.0",
    "react-chartjs-2": "^5.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.32",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.55.0",
    "eslint-plugin-react": "^7.33.2",
    "prettier": "^3.1.1",
    "vitest": "^1.0.4",
    "@testing-library/react": "^14.1.2"
  }
}
```

---

### vite.config.js

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild'
  }
});
```

---

### tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5',  // Indigo-600
          dark: '#4338CA',     // Indigo-700
          light: '#6366F1',    // Indigo-500
        },
        secondary: {
          DEFAULT: '#10B981',  // Green-500
          dark: '#059669',     // Green-600
          light: '#34D399',    // Green-400
        },
        accent: '#F59E0B',     // Amber-500
      },
      fontFamily: {
        sans: ['Pretendard', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

---

### .eslintrc.json

```json
{
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime"
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "react/prop-types": "off",
    "no-unused-vars": "warn"
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
```

---

### .gitignore

```
# Dependencies
node_modules/

# Build output
dist/

# Environment variables
.env.local
.env.production

# Firebase
.firebase/
firebase-debug.log

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*

# Testing
coverage/
```

---

## 명명 규칙

### 파일명

- **컴포넌트**: PascalCase (예: `Button.jsx`, `InsightMode.jsx`)
- **유틸리티**: camelCase (예: `typingAnalyzer.js`)
- **설정 파일**: kebab-case 또는 점 표기 (예: `tailwind.config.js`, `.eslintrc.json`)

### 변수/함수명

- **변수**: camelCase (예: `userName`, `totalScore`)
- **상수**: UPPER_SNAKE_CASE (예: `MAX_ATTEMPTS`, `API_KEY`)
- **함수**: camelCase (예: `calculateWPM`, `handleSubmit`)
- **컴포넌트**: PascalCase (예: `function Button()`)
- **Private 함수**: `_` 접두사 (예: `_internalHelper()`)

---

## 주의사항

### 1. 파일 크기 제한

- 컴포넌트: 200줄 이하 (넘으면 분할)
- 페이지: 300줄 이하
- 유틸리티 파일: 파일당 5-10개 함수

### 2. Import 순서

```javascript
// 1. React
import React, { useState, useEffect } from 'react';

// 2. 외부 라이브러리
import { useNavigate } from 'react-router-dom';

// 3. 내부 컴포넌트
import Button from '../components/common/Button';

// 4. Hooks
import useTypingAnalyzer from '../hooks/useTypingAnalyzer';

// 5. 유틸리티
import { calculateWPM } from '../utils/typingAnalyzer';

// 6. 스타일
import './InsightMode.css';
```

### 3. 절대 경로 설정 (선택적)

Vite에서 절대 경로 사용:

```javascript
// vite.config.js
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@utils': path.resolve(__dirname, './src/utils'),
    }
  }
});

// 사용 예시
import Button from '@components/common/Button';
import { calculateWPM } from '@utils/typingAnalyzer';
```

---

## 다음 단계

1. ✅ 프로젝트 구조 설계 완료
2. 다음: **Setup Guide 작성** (실제 프로젝트 생성 명령어)
3. 다음: **Database Schema 상세 설계**

---

**문서 버전**: 1.0
**최종 수정**: 2025-01-30
**작성자**: Technical Architect Agent

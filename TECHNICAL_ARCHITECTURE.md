# TheraType 기술 아키텍처 문서

**문서 목적**: 시스템 구조, 기술 스택, 데이터 플로우 설명

---

## 🏗️ 시스템 아키텍처 개요

### High-Level Architecture

```
┌─────────────────────────────────────────────┐
│              Client (Browser)               │
│  ┌─────────────────────────────────────┐   │
│  │         React Application           │   │
│  │  ┌──────────┐  ┌──────────────┐    │   │
│  │  │  UI      │  │ Typing       │    │   │
│  │  │Components│  │ Analysis     │    │   │
│  │  └──────────┘  └──────────────┘    │   │
│  │  ┌──────────┐  ┌──────────────┐    │   │
│  │  │  State   │  │ Keystroke    │    │   │
│  │  │ Mgmt     │  │ Logger       │    │   │
│  │  └──────────┘  └──────────────┘    │   │
│  └─────────────────────────────────────┘   │
└───────────────┬─────────────────────────────┘
                │ HTTPS (TLS 1.3)
                ↓
┌─────────────────────────────────────────────┐
│          Firebase (Google Cloud)            │
│  ┌──────────────┐  ┌──────────────────┐    │
│  │ Auth         │  │ Firestore        │    │
│  │ (Email/PW)   │  │ (NoSQL DB)       │    │
│  └──────────────┘  └──────────────────┘    │
│  ┌──────────────┐  ┌──────────────────┐    │
│  │ Hosting      │  │ Storage          │    │
│  │ (Static)     │  │ (Files, Optional)│    │
│  └──────────────┘  └──────────────────┘    │
└─────────────────────────────────────────────┘
```

---

## 🛠️ 기술 스택 상세

### Frontend

#### Core Framework
- **React 18.2+**
  - 이유: 컴포넌트 기반 UI, 풍부한 생태계, 빠른 개발
  - Virtual DOM으로 성능 최적화
  - Hooks API 활용 (useState, useEffect, useContext)

#### Language
- **JavaScript (ES6+)**
  - 선택적: TypeScript (타입 안정성 원하면)
  - MVP는 JavaScript로 충분

#### Routing
- **React Router v6**
  - SPA 라우팅
  - 주요 라우트:
    - `/` - 홈/로그인
    - `/onboarding` - 온보딩
    - `/insight` - Insight Mode
    - `/therapy` - Therapy Mode
    - `/dashboard` - 대시보드
    - `/settings` - 설정

#### Styling
- **Option 1: CSS Modules**
  - 컴포넌트별 스타일 캡슐화
  - 클래스 이름 충돌 방지
  - 예: `Button.module.css`

- **Option 2: Tailwind CSS** (추천)
  - 유틸리티 퍼스트 CSS
  - 빠른 프로토타이핑
  - 일관된 디자인 시스템
  - 반응형 쉬움: `md:`, `lg:` 등

#### State Management
- **React Context API**
  - 전역 상태: 사용자 정보, 프로파일 점수
  - Redux 불필요 (상태 복잡도 낮음)

```javascript
// contexts/UserContext.js
const UserContext = React.createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser, profile, setProfile }}>
      {children}
    </UserContext.Provider>
  );
};
```

#### Data Visualization
- **Chart.js** 또는 **Recharts**
  - Chart.js: 더 가볍고 간단
  - Recharts: React 친화적, 컴포넌트 기반
  - 사용 차트: Line (속도 추이), Radar (프로파일)

#### UI Components
- **기본 컴포넌트 직접 구현** (Button, Input, Card 등)
  - 이유: 가벼움, 커스터마이징 쉬움
  - Material-UI, Ant Design 사용도 가능하지만 MVP에 과함

---

### Backend & Infrastructure

#### Backend as a Service: Firebase

**Firebase 선택 이유**:
- ✅ 빠른 개발 (인프라 관리 불필요)
- ✅ 실시간 데이터베이스
- ✅ 무료 티어 넉넉 (Spark Plan)
- ✅ 자동 확장
- ✅ 통합 서비스 (Auth + DB + Hosting)

#### Firebase Authentication
- **이메일/비밀번호 인증**
- 비밀번호 재설정 이메일 자동 발송
- 사용자 익명화 옵션 (UID로만 식별)

```javascript
// Auth 예시
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth();
createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    // Firestore에 추가 정보 저장
  });
```

#### Cloud Firestore (NoSQL Database)
- **Document 기반 구조**
- **실시간 동기화** (옵션)
- **오프라인 지원** (Progressive Web App 확장 시 유용)

**데이터 구조** (자세한 내용은 데이터 모델 섹션 참조):
```
users/
  {userId}/
    - email
    - ageGroup
    - createdAt

insightSessions/
  {sessionId}/
    - userId
    - selections[]
    - profileScores{}

therapySessions/
  {sessionId}/
    - userId
    - sentences[]
    - date
```

#### Firebase Hosting
- **정적 사이트 호스팅**
- React 빌드 결과물 (HTML, CSS, JS) 배포
- CDN 자동 적용 (전 세계 빠른 로딩)
- SSL 자동 제공 (HTTPS)
- 커스텀 도메인 연결 가능

**배포 명령**:
```bash
npm run build
firebase deploy
```

---

### Development Tools

#### Version Control
- **Git + GitHub**
- Branch 전략:
  - `main`: 배포 가능 상태
  - `develop`: 개발 진행
  - `feature/*`: 기능별 브랜치

#### Package Manager
- **npm** 또는 **yarn**
- `package.json`으로 의존성 관리

#### Code Editor
- **Visual Studio Code**
- 추천 확장:
  - ESLint (코드 품질)
  - Prettier (포매팅)
  - ES7 React Snippets (빠른 코드 작성)

#### Testing (선택적)
- **Jest**: Unit 테스트
- **React Testing Library**: 컴포넌트 테스트
- MVP 단계에서는 최소한으로

---

## 📦 데이터 모델

### Users Collection

```
users/{userId}
  - uid: string (Firebase Auth UID)
  - email: string
  - ageGroup: string ("19-25", "26-35", "36-45", "46+")
  - gender: string | null (optional)
  - typingLevel: string ("beginner", "intermediate", "advanced")
  - createdAt: timestamp
  - lastLoginAt: timestamp
```

### Insight Sessions Collection

```
insightSessions/{sessionId}
  - userId: string (ref to users)
  - completedAt: timestamp
  - selections: array[
      {
        pairId: string ("SP1", "SR1", etc.)
        category: string ("self_perception", etc.)
        sentenceA: string
        sentenceB: string
        selected: string ("A" or "B")
        selectionTime: number (ms)
      }
    ]
  - profileScores: {
      self_perception: number (0-100)
      stress_response: number (0-100)
      social_energy: number (0-100)
      emotion_regulation: number (0-100)
      future_orientation: number (0-100)
    }
  - assignedProfile: string ("self_esteem", "stress_management", etc.)
```

### Therapy Sessions Collection

```
therapySessions/{sessionId}
  - userId: string
  - date: timestamp
  - profile: string ("self_esteem", etc.)
  - sentences: array[
      {
        sentenceId: string
        sentenceText: string
        difficulty: string ("beginner", "intermediate", "advanced")
        attemptNumber: number (몇 번째 시도)
        wpm: number
        accuracy: number (0-100)
        timeMs: number
        errorCount: number
        backspaceCount: number
      }
    ]
  - totalDuration: number (세션 총 시간)
```

### Keystroke Logs Collection (선택적, 상세 분석용)

```
keystrokeLogs/{logId}
  - userId: string
  - sessionId: string (ref to therapySessions)
  - sentenceId: string
  - keystrokes: array[
      {
        key: string
        timestamp: number (ms, 세션 시작 기준)
        event: string ("down" or "up")
      }
    ]
  - createdAt: timestamp
```

**저장 정책**:
- 모든 사용자 데이터는 익명화된 UID로만 연결
- 이메일은 별도 암호화 고려 (Firebase Auth가 기본 처리)
- Keystroke logs는 선택적 동의 후에만 저장

---

## 🔄 데이터 플로우

### Insight Mode Flow

```
[사용자]
  ↓ 문장 선택
[React Component]
  ↓ 선택 기록
[Local State (useState)]
  ↓ 타이핑 완료 후
[Calculation Logic]
  ↓ WPM, 정확도 계산
[Firestore API]
  ↓ 저장
[Firestore Database]
```

**코드 예시**:
```javascript
// Insight Mode 결과 저장
const saveInsightSession = async (selections) => {
  const profileScores = calculateProfileScores(selections);
  const assignedProfile = assignProfile(profileScores);

  const sessionData = {
    userId: currentUser.uid,
    completedAt: new Date(),
    selections: selections,
    profileScores: profileScores,
    assignedProfile: assignedProfile
  };

  await db.collection('insightSessions').add(sessionData);

  // Context 업데이트
  setProfile({ scores: profileScores, type: assignedProfile });
};
```

### Therapy Mode Flow

```
[사용자]
  ↓ 세션 시작
[Firestore]
  ↓ 프로파일 조회
[React Component]
  ↓ 맞춤 문장 로드
[Typing Interface]
  ↓ 키스트로크 캡처
[Keystroke Logger]
  ↓ 분석
[WPM/Accuracy Calculator]
  ↓ 저장
[Firestore]
```

**코드 예시**:
```javascript
// 타이핑 세션 저장
const saveTypingAttempt = async (sentenceData) => {
  const sessionRef = db.collection('therapySessions').doc(currentSessionId);

  await sessionRef.update({
    sentences: firebase.firestore.FieldValue.arrayUnion(sentenceData)
  });
};
```

### Dashboard Data Aggregation

```
[Dashboard Component Mount]
  ↓ 데이터 요청
[Firestore Queries]
  ├─ insightSessions (최신 1개)
  ├─ therapySessions (최근 7일)
  └─ User streak 계산
  ↓ 데이터 가공
[Aggregation Logic]
  ↓ 시각화
[Chart Components]
```

**코드 예시**:
```javascript
// 최근 7일 타이핑 속도 데이터
const fetchRecentSessions = async () => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const snapshot = await db.collection('therapySessions')
    .where('userId', '==', currentUser.uid)
    .where('date', '>=', sevenDaysAgo)
    .orderBy('date', 'asc')
    .get();

  const data = snapshot.docs.map(doc => {
    const session = doc.data();
    const avgWpm = session.sentences.reduce((sum, s) => sum + s.wpm, 0)
                   / session.sentences.length;
    return { date: session.date, wpm: avgWpm };
  });

  return data;
};
```

---

## 🔐 보안 및 프라이버시

### Authentication Security

- **비밀번호 요구사항**:
  - 최소 8자
  - Firebase Auth 기본 보안 적용

- **세션 관리**:
  - Firebase Auth Token (자동 갱신)
  - 로그아웃 시 토큰 무효화

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users: 본인만 읽기/쓰기
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Insight Sessions: 본인 데이터만
    match /insightSessions/{sessionId} {
      allow create: if request.auth != null;
      allow read, update: if request.auth != null
                          && resource.data.userId == request.auth.uid;
    }

    // Therapy Sessions: 본인 데이터만
    match /therapySessions/{sessionId} {
      allow create: if request.auth != null;
      allow read, update: if request.auth != null
                          && resource.data.userId == request.auth.uid;
    }

    // Keystroke Logs: 본인 데이터만 (선택적)
    match /keystrokeLogs/{logId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null
                  && resource.data.userId == request.auth.uid;
    }
  }
}
```

### Data Anonymization

- **User ID**: Firebase UID 사용 (이메일과 분리)
- **연구 데이터 추출 시**: UID도 해시 처리 (SHA-256)

```javascript
// 연구용 익명화 예시
const anonymizeForResearch = (data) => {
  const hash = crypto.createHash('sha256');
  hash.update(data.userId);

  return {
    ...data,
    userId: hash.digest('hex'),  // 원본 UID 해시
    email: undefined  // 이메일 제거
  };
};
```

### HTTPS Enforcement

- Firebase Hosting이 자동으로 HTTPS 적용
- HTTP → HTTPS 자동 리다이렉트

---

## ⚡ 성능 최적화

### Frontend Optimization

#### Code Splitting
```javascript
// 라우트별 lazy loading
import React, { lazy, Suspense } from 'react';

const InsightMode = lazy(() => import('./pages/InsightMode'));
const TherapyMode = lazy(() => import('./pages/TherapyMode'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/insight" element={<InsightMode />} />
        <Route path="/therapy" element={<TherapyMode />} />
      </Routes>
    </Suspense>
  );
}
```

#### Memoization
```javascript
// 불필요한 리렌더 방지
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
```

### Database Optimization

#### Indexing
Firestore composite index for queries:
```
Collection: therapySessions
Fields: userId (Ascending), date (Ascending)
```

#### Pagination (향후)
```javascript
// 무한 스크롤 시
const loadMore = async () => {
  const lastDoc = sessions[sessions.length - 1];

  const snapshot = await db.collection('therapySessions')
    .where('userId', '==', currentUser.uid)
    .orderBy('date', 'desc')
    .startAfter(lastDoc.date)
    .limit(20)
    .get();
};
```

#### Caching
```javascript
// React Query 또는 SWR 사용 (선택적)
import useSWR from 'swr';

const { data, error } = useSWR(
  `/sessions/${userId}`,
  fetchSessions,
  { refreshInterval: 60000 }  // 1분마다 갱신
);
```

---

## 📱 반응형 웹 디자인

### Breakpoints (Tailwind CSS 기준)

```css
/* Mobile First Approach */
sm: 640px   /* 스마트폰 가로 */
md: 768px   /* 태블릿 */
lg: 1024px  /* 데스크탑 */
xl: 1280px  /* 큰 데스크탑 */
```

### Layout Strategy

```javascript
// 예시: 대시보드 레이아웃
<div className="container mx-auto px-4">
  {/* 모바일: 세로 스택, 데스크탑: 2열 그리드 */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <ChartCard />
    <ProfileCard />
  </div>
</div>
```

### Touch-Friendly UI

- 버튼 최소 크기: 44x44px (Apple HIG)
- 터치 타겟 간격: 최소 8px
- 모바일에서 타이핑: `<input type="text" />`가 아닌 커스텀 입력 필드 (자동완성 비활성화)

---

## 🚀 배포 전략

### Development → Production

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Development  │ →  │   Staging    │ →  │  Production  │
│   (Local)    │    │  (Firebase)  │    │  (Firebase)  │
└──────────────┘    └──────────────┘    └──────────────┘
     localhost       test.theratype.app   theratype.app
```

### CI/CD (선택적, GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Firebase

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run build
      - uses: w9jds/firebase-action@master
        with:
          args: deploy --only hosting
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```

### Environment Variables

```javascript
// .env.local (개발용)
REACT_APP_FIREBASE_API_KEY=xxxxx
REACT_APP_FIREBASE_AUTH_DOMAIN=xxxxx
REACT_APP_FIREBASE_PROJECT_ID=xxxxx

// .env.production (배포용)
REACT_APP_FIREBASE_API_KEY=yyyyy
REACT_APP_FIREBASE_AUTH_DOMAIN=yyyyy
REACT_APP_FIREBASE_PROJECT_ID=yyyyy
```

---

## 🧪 테스팅 전략 (MVP 간소화)

### Manual Testing Checklist

- [ ] 회원가입/로그인 작동
- [ ] Insight Mode 10개 문장 완료
- [ ] 프로파일 점수 계산 정확성
- [ ] Therapy Mode 문장 제시 정확성
- [ ] 타이핑 WPM/정확도 계산 검증
- [ ] 대시보드 차트 표시
- [ ] 모바일 반응형 확인
- [ ] 브라우저 호환성 (Chrome, Safari, Firefox)

### Automated Testing (시간 있으면)

```javascript
// Button.test.js (Jest + RTL 예시)
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

test('calls onClick when clicked', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click Me</Button>);

  fireEvent.click(screen.getByText('Click Me'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

---

## 📊 모니터링 및 로깅 (선택적)

### Firebase Analytics
- 페이지뷰 추적
- 사용자 이벤트 (세션 완료, 문장 마스터 등)

```javascript
import { logEvent } from 'firebase/analytics';

logEvent(analytics, 'insight_completed', {
  profile_type: assignedProfile
});
```

### Error Tracking (선택적)
- **Sentry**: 프론트엔드 에러 자동 수집
- 설정 5분, 버그 발견에 유용

---

## 🔧 확장 가능성 (향후)

### Phase 2+ Features

**모바일 앱**:
- React Native로 포팅 (코드 재사용 80%)
- 푸시 알림 (Firebase Cloud Messaging)

**고급 분석**:
- BigQuery로 데이터 익스포트
- 머신러닝 모델 (Vertex AI)
- 예측 분석 (dropout, 개입 타이밍)

**소셜 기능**:
- Firestore subcollections로 친구 추가
- 리더보드 (Cloud Functions로 집계)

**결제 시스템**:
- Stripe 연동
- 프리미엄 기능 (더 많은 문장, 고급 통계)

---

## 📝 개발 환경 설정 가이드

### 1. Prerequisites

```bash
# Node.js 설치 확인
node -v  # v16+ 권장
npm -v   # v8+ 권장
```

### 2. 프로젝트 초기화

```bash
# React 앱 생성
npx create-react-app theratype
cd theratype

# 필요한 패키지 설치
npm install firebase
npm install react-router-dom
npm install chart.js react-chartjs-2
npm install tailwindcss  # Tailwind 사용 시
```

### 3. Firebase 설정

```bash
# Firebase CLI 설치
npm install -g firebase-tools

# Firebase 로그인
firebase login

# Firebase 프로젝트 초기화
firebase init
# 선택: Firestore, Hosting, (Optional) Functions
```

```javascript
// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

### 4. 프로젝트 구조

```
theratype/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.js
│   │   │   ├── Input.js
│   │   │   └── Card.js
│   │   ├── insight/
│   │   │   ├── SentencePair.js
│   │   │   └── ResultSummary.js
│   │   ├── therapy/
│   │   │   ├── TypingInterface.js
│   │   │   └── FeedbackCard.js
│   │   └── dashboard/
│   │       ├── SpeedChart.js
│   │       └── ProfileRadar.js
│   ├── pages/
│   │   ├── Home.js
│   │   ├── InsightMode.js
│   │   ├── TherapyMode.js
│   │   └── Dashboard.js
│   ├── contexts/
│   │   └── UserContext.js
│   ├── utils/
│   │   ├── typingAnalyzer.js
│   │   └── profileCalculator.js
│   ├── firebase/
│   │   └── config.js
│   ├── App.js
│   └── index.js
├── .env.local
├── package.json
└── README.md
```

---

## 🎓 핵심 알고리즘

### 1. WPM 계산

```javascript
/**
 * WPM (Words Per Minute) 계산
 * 한글의 경우 글자 수 / 5를 단어로 간주
 */
function calculateWPM(text, timeMs) {
  const characters = text.length;
  const words = characters / 5;  // 한글 기준
  const minutes = timeMs / 60000;

  return Math.round(words / minutes);
}

// 예: "나는 충분히 잘하고 있다" (13자)
// 20초 소요 → WPM = (13/5) / (20/60000) = 78
```

### 2. 정확도 계산

```javascript
/**
 * 타이핑 정확도 계산
 */
function calculateAccuracy(targetText, typedText) {
  const targetChars = targetText.split('');
  const typedChars = typedText.split('');

  let correctCount = 0;
  const maxLength = Math.max(targetChars.length, typedChars.length);

  for (let i = 0; i < maxLength; i++) {
    if (targetChars[i] === typedChars[i]) {
      correctCount++;
    }
  }

  const accuracy = (correctCount / targetChars.length) * 100;
  return Math.round(accuracy);
}

// 예:
// 목표: "나는 충분히"
// 입력: "나는 충문히"
// 정확도: 5/6 = 83%
```

### 3. 프로파일 점수 계산

```javascript
/**
 * Insight Mode 선택 결과 → 카테고리별 점수
 */
function calculateProfileScores(selections) {
  const categories = [
    'self_perception',
    'stress_response',
    'social_energy',
    'emotion_regulation',
    'future_orientation'
  ];

  const scores = {};

  categories.forEach(category => {
    const categorySelections = selections.filter(s => s.category === category);
    const positiveCount = categorySelections.filter(s => s.selected === 'A').length;
    const total = categorySelections.length;

    scores[category] = (positiveCount / total) * 100;
  });

  return scores;
}

// 예: 자기인식 2문항 중 1개 A 선택 → 50점
```

### 4. 프로파일 할당

```javascript
/**
 * 점수 → 프로파일 매칭
 */
function assignProfile(scores) {
  // 가장 낮은 점수의 카테고리 찾기
  const lowestCategory = Object.keys(scores).reduce((a, b) =>
    scores[a] < scores[b] ? a : b
  );

  const profileMap = {
    'self_perception': 'self_esteem',
    'stress_response': 'stress_management',
    'social_energy': 'balanced',  // 치료 불필요, 개인 성향
    'emotion_regulation': 'emotion_control',
    'future_orientation': 'motivation'
  };

  return profileMap[lowestCategory] || 'balanced';
}
```

---

**문서 버전**: 1.0
**최종 수정**: 2025-01-30
**다음 단계**: RESEARCH_REFERENCES.md 작성

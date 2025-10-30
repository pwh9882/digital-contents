# TheraType 기술 스택 선정 문서

**작성자**: Technical Architect Agent
**작성일**: 2025-01-30
**문서 목적**: 4주 MVP 개발을 위한 기술 스택 선정 근거 및 결정 사항

---

## 의사결정 원칙

1. **빠른 개발 속도**: 4주 내 완성 가능한 기술
2. **낮은 학습 곡선**: 팀이 빠르게 습득 가능
3. **안정성**: 검증된 기술 스택 우선
4. **비용**: 무료 또는 저비용
5. **확장 가능성**: MVP 이후 스케일업 가능

---

## 프론트엔드 기술 스택

### Framework 선택: Vite + React

#### 비교 분석

| 항목 | Create React App | Next.js | Vite + React |
|------|------------------|---------|--------------|
| **학습 곡선** | 쉬움 | 중간 | 쉬움 |
| **빌드 속도** | 느림 | 중간 | 매우 빠름 |
| **SSR 필요성** | 없음 | 있음 | 없음 (SPA만) |
| **MVP 적합성** | 중간 | 과함 | 높음 |
| **커뮤니티** | 대규모 | 대규모 | 성장 중 |
| **유지보수** | 공식 지원 종료 (2025) | 활발 | 활발 |

#### 최종 선택: **Vite + React**

**선정 근거**:
- **Create React App 제외 이유**: React 팀이 2025년 2월 공식 지원 중단 발표
- **Next.js 제외 이유**:
  - SSR(Server Side Rendering) 불필요 (SPA로 충분)
  - 파일 기반 라우팅 등 추가 개념이 MVP에 과함
  - Firebase Hosting과 통합 시 추가 설정 필요
- **Vite 선택 이유**:
  - ⚡ 초고속 빌드 (HMR 1초 이내)
  - 📦 간단한 설정 (즉시 시작 가능)
  - 🔥 React 공식 권장 도구 (2024+)
  - 🎯 SPA에 최적화

**설치 명령어**:
```bash
npm create vite@latest theratype -- --template react
cd theratype
npm install
npm run dev
```

---

### Language 선택: JavaScript (ES6+)

#### 비교: JavaScript vs TypeScript

| 항목 | JavaScript | TypeScript |
|------|-----------|------------|
| **개발 속도** | 빠름 | 중간 (타입 정의 시간) |
| **학습 곡선** | 낮음 | 중간 |
| **에러 검출** | 런타임 | 컴파일 타임 |
| **MVP 적합성** | 높음 | 중간 |

#### 최종 선택: **JavaScript (ES6+)**

**선정 근거**:
- 4주 일정 상 타입 정의에 시간 소요는 부담
- 팀원 모두 JS 숙련도 높음
- MVP 단계에서는 코드베이스가 크지 않아 타입 안정성 이점이 크지 않음
- **선택적 TS 전환 가능**: 향후 필요 시 점진적 전환 가능

**권장 사항**:
- JSDoc 주석으로 타입 힌트 제공
- ESLint + Prettier 사용으로 코드 품질 유지

```javascript
/**
 * WPM 계산 함수
 * @param {string} text - 타이핑한 텍스트
 * @param {number} timeMs - 소요 시간 (밀리초)
 * @returns {number} WPM 값
 */
function calculateWPM(text, timeMs) {
  const characters = text.length;
  const words = characters / 5;
  const minutes = timeMs / 60000;
  return Math.round(words / minutes);
}
```

---

### Styling: Tailwind CSS

#### 비교 분석

| 항목 | CSS Modules | Styled Components | Tailwind CSS |
|------|-------------|-------------------|--------------|
| **학습 곡선** | 낮음 | 중간 | 중간 |
| **개발 속도** | 중간 | 중간 | 빠름 |
| **일관성** | 수동 관리 | 컴포넌트별 | 디자인 시스템 내장 |
| **반응형** | 수동 작성 | 수동 작성 | 유틸리티 클래스 |
| **번들 크기** | 작음 | 중간 (런타임) | 작음 (PurgeCSS) |

#### 최종 선택: **Tailwind CSS**

**선정 근거**:
- ⚡ 빠른 프로토타이핑 (클래스명만으로 스타일링)
- 🎨 일관된 디자인 시스템 (색상, 간격, 타이포그래피)
- 📱 반응형 웹 쉬움 (`md:`, `lg:` prefix)
- 🔧 커스터마이징 가능 (`tailwind.config.js`)

**설치 및 설정**:
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

```javascript
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5',      // Indigo
        secondary: '#10B981',    // Green
        accent: '#F59E0B',       // Amber
      },
    },
  },
  plugins: [],
}
```

---

### State Management: React Context API

#### 비교 분석

| 항목 | Context API | Redux Toolkit | Zustand |
|------|-------------|---------------|----------|
| **복잡도** | 낮음 | 중간 | 낮음 |
| **보일러플레이트** | 적음 | 중간 | 매우 적음 |
| **학습 곡선** | 낮음 | 높음 | 낮음 |
| **MVP 적합성** | 높음 | 과함 | 높음 |

#### 최종 선택: **React Context API**

**선정 근거**:
- TheraType의 전역 상태는 단순함:
  - 사용자 정보 (`user`)
  - 프로파일 점수 (`profile`)
  - 인증 상태 (`isAuthenticated`)
- Redux의 복잡한 설정 불필요
- React 내장 기능으로 추가 라이브러리 불필요

**구조 예시**:
```javascript
// src/contexts/AuthContext.js
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

---

### Data Visualization: Chart.js

#### 비교 분석

| 항목 | Chart.js | Recharts | D3.js |
|------|----------|----------|-------|
| **학습 곡선** | 낮음 | 낮음 | 높음 |
| **React 통합** | 중간 (wrapper 필요) | 쉬움 (네이티브) | 어려움 |
| **커스터마이징** | 중간 | 높음 | 매우 높음 |
| **문서** | 우수 | 좋음 | 우수하지만 복잡 |
| **번들 크기** | 60KB | 90KB | 230KB |

#### 최종 선택: **Chart.js + react-chartjs-2**

**선정 근거**:
- 가벼움 (Recharts보다 30% 작음)
- 간단한 사용법 (설정 JSON만 작성)
- 필요한 차트 타입 모두 지원 (Line, Radar)
- 애니메이션 자동 지원

**설치**:
```bash
npm install chart.js react-chartjs-2
```

**사용 예시**:
```javascript
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement);

const SpeedChart = ({ data }) => {
  const chartData = {
    labels: ['월', '화', '수', '목', '금', '토', '일'],
    datasets: [{
      label: 'WPM',
      data: data,
      borderColor: '#4F46E5',
      backgroundColor: '#4F46E520',
    }]
  };

  return <Line data={chartData} />;
};
```

---

## 백엔드 및 인프라

### Backend as a Service: Firebase

#### 비교 분석

| 항목 | Firebase | Supabase | Custom Backend (Node.js + Express) |
|------|----------|----------|----------------------------------|
| **설정 시간** | 1시간 | 2시간 | 2-3일 |
| **인증** | 내장 | 내장 | 직접 구현 |
| **데이터베이스** | Firestore (NoSQL) | PostgreSQL (SQL) | 직접 선택 |
| **호스팅** | 통합 | 별도 | 별도 |
| **무료 티어** | 넉넉 | 넉넉 | 서버 비용 발생 |
| **확장성** | 자동 | 자동 | 수동 관리 |
| **학습 곡선** | 낮음 | 중간 | 높음 |

#### 최종 선택: **Firebase**

**선정 근거**:
- ⚡ **빠른 개발**: 인증, DB, 호스팅 통합 (하루 내 설정 완료)
- 💰 **비용**: Spark Plan (무료)으로 MVP 충분
  - Firestore: 50K reads/day, 20K writes/day
  - Hosting: 10GB storage, 360MB/day transfer
  - Authentication: 무제한 사용자
- 🔒 **보안**: 보안 규칙으로 간단하게 데이터 접근 제어
- 📈 **확장성**: 향후 유료 플랜으로 자동 확장 가능
- 🎓 **익숙함**: 팀원 중 2명이 Firebase 경험 있음

**Firebase 서비스 구성**:
1. **Authentication**: 이메일/비밀번호 인증
2. **Firestore**: NoSQL 데이터베이스
3. **Hosting**: 정적 사이트 호스팅
4. **Analytics** (선택적): 사용자 행동 추적

---

### Database: Cloud Firestore

#### Firestore vs Realtime Database

| 항목 | Firestore | Realtime Database |
|------|-----------|-------------------|
| **데이터 모델** | 문서/컬렉션 | JSON 트리 |
| **쿼리** | 복합 쿼리 지원 | 제한적 |
| **확장성** | 자동 확장 | 수동 샤딩 |
| **오프라인 지원** | 우수 | 좋음 |
| **추천 여부** | Firebase 권장 | 레거시 |

#### 최종 선택: **Cloud Firestore**

**선정 근거**:
- Firebase 공식 권장 (Realtime DB는 레거시 취급)
- 복잡한 쿼리 가능 (예: userId로 필터 + 날짜로 정렬)
- 문서 기반 구조가 TheraType 데이터 모델과 잘 맞음
- 오프라인 지원 (PWA 확장 시 유용)

**NoSQL 선택 이유** (PostgreSQL 대신):
- **스키마 유연성**: MVP 단계에서 데이터 모델 변경 빈번
- **빠른 개발**: 마이그레이션 불필요
- **간단한 관계**: TheraType은 복잡한 JOIN이 필요 없음
- **자동 확장**: Firestore가 자동으로 샤딩 및 확장

---

### Hosting: Firebase Hosting

#### 비교 분석

| 항목 | Firebase Hosting | Vercel | Netlify | AWS S3 + CloudFront |
|------|------------------|--------|---------|---------------------|
| **설정 난이도** | 쉬움 | 쉬움 | 쉬움 | 어려움 |
| **Firebase 통합** | 완벽 | 없음 | 없음 | 없음 |
| **무료 티어** | 10GB | 100GB | 100GB | 5GB (1년) |
| **자동 SSL** | 있음 | 있음 | 있음 | 수동 설정 |
| **CDN** | 있음 | 있음 | 있음 | 있음 |

#### 최종 선택: **Firebase Hosting**

**선정 근거**:
- Firebase 전체 생태계와 완벽 통합
- 단일 CLI로 배포 (`firebase deploy`)
- 자동 HTTPS, 자동 CDN
- 롤백 기능 (이전 버전 복구 1-click)

**배포 프로세스**:
```bash
# 1회만 실행 (초기 설정)
firebase init hosting

# 빌드
npm run build

# 배포
firebase deploy --only hosting

# 결과: https://theratype.web.app
```

---

## 타이핑 분석 라이브러리

### Custom Implementation (직접 구현)

#### 기존 라이브러리 조사 결과

| 라이브러리 | 용도 | 적합성 |
|-----------|------|--------|
| **typing-test-js** | 일반 타이핑 테스트 | 부분 적합 (WPM만) |
| **keystroke-dynamics** | 생체 인증 | 과함 (MVP 범위 초과) |
| **react-typing-test** | React 타이핑 컴포넌트 | 커스터마이징 어려움 |

#### 최종 결정: **직접 구현**

**선정 근거**:
- TheraType의 특수 요구사항:
  - 한글 WPM 계산 (영어 기준 라이브러리와 다름)
  - 문장 제시 방식 (두 문장 중 선택)
  - 망설임 패턴 분석 (keystroke timing)
- 기존 라이브러리로는 요구사항 충족 어려움
- 직접 구현이 가볍고 유연함

**핵심 알고리즘**:

```javascript
// 1. 키스트로크 이벤트 캡처
class TypingAnalyzer {
  constructor() {
    this.keystrokes = [];
    this.startTime = null;
    this.currentText = '';
  }

  onKeyDown(event) {
    if (!this.startTime) this.startTime = Date.now();

    this.keystrokes.push({
      key: event.key,
      timestamp: Date.now() - this.startTime,
      type: 'down'
    });
  }

  // 2. WPM 계산 (한글 기준)
  calculateWPM(text, timeMs) {
    const characters = text.length;
    const words = characters / 5;  // 한글 평균 5자 = 1 단어
    const minutes = timeMs / 60000;
    return Math.round(words / minutes);
  }

  // 3. 정확도 계산
  calculateAccuracy(target, typed) {
    let correct = 0;
    const maxLen = Math.max(target.length, typed.length);

    for (let i = 0; i < maxLen; i++) {
      if (target[i] === typed[i]) correct++;
    }

    return Math.round((correct / target.length) * 100);
  }

  // 4. 망설임 패턴 분석
  analyzeHesitation() {
    const pauses = [];

    for (let i = 1; i < this.keystrokes.length; i++) {
      const interval = this.keystrokes[i].timestamp - this.keystrokes[i-1].timestamp;

      if (interval > 2000) {  // 2초 이상 멈춤
        pauses.push({
          position: i,
          duration: interval
        });
      }
    }

    return pauses;
  }
}
```

---

## 개발 도구

### Version Control: Git + GitHub

**구성**:
- **Repository**: `theratype-mvp` (private)
- **Branch 전략**:
  - `main`: 배포 가능한 안정 버전
  - `develop`: 개발 진행 중인 브랜치
  - `feature/*`: 기능별 브랜치 (예: `feature/insight-mode`)

**Commit Convention**:
```
feat: Insight Mode 문장 선택 UI 구현
fix: WPM 계산 오류 수정
docs: README 업데이트
style: Tailwind CSS 색상 변경
refactor: 타이핑 분석 로직 리팩토링
test: TypingAnalyzer 유닛 테스트 추가
```

---

### Package Manager: npm

#### npm vs yarn vs pnpm

| 항목 | npm | yarn | pnpm |
|------|-----|------|------|
| **속도** | 중간 | 빠름 | 매우 빠름 |
| **디스크 사용** | 높음 | 높음 | 낮음 (symlink) |
| **Node.js 내장** | 예 | 아니오 | 아니오 |
| **학습 곡선** | 낮음 | 낮음 | 중간 |

#### 최종 선택: **npm**

**선정 근거**:
- Node.js 기본 포함 (별도 설치 불필요)
- 팀원 모두 npm 익숙
- MVP 단계에서 속도 차이 무시 가능
- Vite 공식 문서가 npm 기준

---

### Code Editor: Visual Studio Code

**추천 확장**:
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "dsznajder.es7-react-js-snippets",
    "firebase.vscode-firebase-explorer"
  ]
}
```

---

### Testing (최소한으로)

#### 최종 선택: **Manual Testing 우선, Automated Testing 선택적**

**선정 근거**:
- 4주 일정 상 자동화 테스트 작성 시간 부족
- MVP 단계에서는 수동 테스트로 충분
- 핵심 로직(WPM 계산 등)만 유닛 테스트 작성

**최소 자동화 테스트** (시간 있으면):
```bash
npm install -D vitest @testing-library/react
```

```javascript
// src/utils/__tests__/typingAnalyzer.test.js
import { describe, it, expect } from 'vitest';
import { calculateWPM, calculateAccuracy } from '../typingAnalyzer';

describe('TypingAnalyzer', () => {
  it('calculates WPM correctly', () => {
    const text = '나는 충분히 잘하고 있다';  // 13자
    const timeMs = 20000;  // 20초
    const wpm = calculateWPM(text, timeMs);

    expect(wpm).toBe(78);  // (13/5) / (20/60) = 78
  });

  it('calculates accuracy correctly', () => {
    const target = '나는 충분히';
    const typed = '나는 충문히';
    const accuracy = calculateAccuracy(target, typed);

    expect(accuracy).toBe(83);  // 5/6 = 83%
  });
});
```

---

## 환경 변수 관리

### .env 파일 구조

```bash
# .env.local (개발 환경, git ignore)
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=theratype-dev.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=theratype-dev
VITE_FIREBASE_STORAGE_BUCKET=theratype-dev.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdefg

# .env.production (배포 환경)
VITE_FIREBASE_API_KEY=AIzaSyYYYYYYYYYYYYYYYYYYYYYYYYYY
VITE_FIREBASE_AUTH_DOMAIN=theratype.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=theratype-prod
# ... (production credentials)
```

**사용 방법**:
```javascript
// src/firebase/config.js
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  // ...
};

const app = initializeApp(firebaseConfig);
```

---

## 비용 분석

### 예상 월별 비용 (MVP 기간)

| 항목 | 무료 티어 | MVP 사용량 (20명) | 비용 |
|------|-----------|-------------------|------|
| **Firebase Hosting** | 10GB storage, 360MB/day | ~100MB/day | $0 |
| **Firestore** | 50K reads, 20K writes/day | ~10K reads/day | $0 |
| **Firebase Auth** | 무제한 | 20명 | $0 |
| **Domain (선택적)** | - | theratype.com | $12/year |
| **총 비용** | - | - | **$0/month** |

**결론**: MVP 단계에서는 **완전 무료** 운영 가능

---

## 리스크 및 대응

### 기술적 리스크

1. **Firebase 무료 한도 초과**
   - **확률**: 낮음 (20명 규모로는 충분)
   - **대응**: 실시간 모니터링, 초과 시 Blaze Plan ($0.06/read per 100K)

2. **브라우저 호환성**
   - **확률**: 중간 (구버전 Safari, IE)
   - **대응**:
     - 타겟 브라우저 명시 (Chrome 90+, Safari 14+, Firefox 88+)
     - Polyfill 추가 (필요 시)

3. **성능 이슈** (Firestore 쿼리)
   - **확률**: 낮음 (데이터량 작음)
   - **대응**:
     - Composite Index 미리 생성
     - 쿼리 최적화 (limit 사용)

---

## 다음 단계

이 기술 스택 결정을 바탕으로:

1. **Project Structure 설계** (`project_structure.md`)
2. **Setup Guide 작성** (`setup_guide.md`)
3. **Database Schema 상세 설계** (`database_schema.md`)
4. **Implementation Lead에게 인계**

---

**문서 버전**: 1.0
**최종 수정**: 2025-01-30
**작성자**: Technical Architect Agent

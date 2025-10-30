# Therapy Mode 아키텍처 문서

## 컴포넌트 계층 구조

```
App.jsx
└── Router
    └── Route /therapy
        └── TherapyMode (페이지)
            ├── ProfileBadge (헤더)
            │   └── 프로파일 정보 표시
            │
            ├── TherapySentence (메인 영역)
            │   ├── 문장 표시
            │   ├── TypingInput (재사용)
            │   │   ├── 실시간 피드백
            │   │   ├── WPM 계산
            │   │   └── 정확도 계산
            │   └── 결과 화면
            │
            └── ProgressTracker (사이드바)
                ├── 전체 진행률 바
                ├── 문장별 마스터 상태
                └── 마스터 기준 안내
```

## 데이터 흐름

```
┌─────────────────────┐
│   Insight Mode      │
│  (완료 후 저장)      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│        localStorage                     │
│  Key: 'insightResults'                  │
│  {                                      │
│    assignedProfile: 'self_esteem',      │
│    scores: { ... }                      │
│  }                                      │
└──────────┬──────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│       TherapyMode.jsx                   │
│  - profileKey 로드                      │
│  - sessionHistory 로드                  │
│  - recommendNextSentence() 호출         │
└──────────┬──────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│    therapySentences.js                  │
│  - getSentencesByProfile()              │
│  - recommendNextSentence()              │
│    → 다음 연습 문장 반환                │
└──────────┬──────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│    TherapySentence.jsx                  │
│  - 문장 표시                            │
│  - TypingInput 사용                     │
│  - onComplete → sessionData 반환        │
└──────────┬──────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│   TherapyMode.handleSessionComplete     │
│  - sessionHistory 업데이트              │
│  - localStorage 저장                    │
│  - masteryProgress 재계산               │
└──────────┬──────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│        localStorage                     │
│  Key: 'therapySessions'                 │
│  {                                      │
│    profileKey: 'self_esteem',           │
│    sessions: [                          │
│      {                                  │
│        sentenceId: 'self_esteem_01',    │
│        wpm: 45,                         │
│        accuracy: 92,                    │
│        keystrokeLogs: [...],            │
│        completedAt: '...'               │
│      }                                  │
│    ]                                    │
│  }                                      │
└─────────────────────────────────────────┘
```

## 상태 관리 전략

### TherapyMode (부모 컴포넌트)
```javascript
const [profileKey, setProfileKey] = useState(null)
// - Insight Mode에서 할당된 프로파일
// - 'self_esteem', 'stress_management', 'emotion_control', 'motivation'

const [sessionHistory, setSessionHistory] = useState([])
// - 모든 타이핑 세션 기록
// - 마스터 진행도 계산의 기반

const [currentSentence, setCurrentSentence] = useState(null)
// - 현재 연습 중인 문장 객체
// - recommendNextSentence()로 업데이트

const [masteryProgress, setMasteryProgress] = useState(null)
// - { masteredCount, totalCount, masteredSentences, progress }
// - ProgressTracker에 전달
```

### TherapySentence (자식 컴포넌트)
```javascript
const [showResult, setShowResult] = useState(false)
// - 타이핑 완료 후 결과 화면 표시 여부

const [lastResult, setLastResult] = useState(null)
// - 마지막 세션 결과
// - { wpm, accuracy, isSuccess }
```

### TypingInput (재사용 컴포넌트)
```javascript
const [typedText, setTypedText] = useState('')
const [startTime, setStartTime] = useState(null)
const [keystrokeLogs, setKeystrokeLogs] = useState([])
const [wpm, setWpm] = useState(0)
const [accuracy, setAccuracy] = useState(100)
// - Insight Mode와 동일한 로직 재사용
```

## 핵심 알고리즘

### 1. 다음 문장 추천 (recommendNextSentence)

```javascript
// therapySentences.js
export const recommendNextSentence = (sessionHistory, profileKey) => {
  const profile = therapySentences[profileKey];
  const { masteredSentences } = calculateMasteryProgress(sessionHistory, profileKey);

  // 1. 마스터하지 못한 문장 필터링
  const unmastered = profile.sentences.filter(
    (s) => !masteredSentences.includes(s.id)
  );

  // 2. 모두 마스터했으면 복습 (첫 번째 문장)
  if (unmastered.length === 0) {
    return profile.sentences[0];
  }

  // 3. 시도 횟수가 가장 적은 문장 우선
  const sentenceAttempts = unmastered.map((sentence) => {
    const attempts = sessionHistory.filter((s) => s.sentenceId === sentence.id).length;
    return { sentence, attempts };
  });

  sentenceAttempts.sort((a, b) => a.attempts - b.attempts);

  return sentenceAttempts[0].sentence;
};
```

**로직 설명:**
- 마스터하지 못한 문장 중 가장 시도 횟수가 적은 것을 추천
- 모두 마스터했으면 첫 번째 문장으로 복습
- 공정한 연습 기회 보장 (골고루 연습)

### 2. 마스터 판정 (calculateMasteryProgress)

```javascript
// therapySentences.js
export const calculateMasteryProgress = (sessionHistory, profileKey) => {
  const profile = therapySentences[profileKey];
  const masteredSentences = [];

  profile.sentences.forEach((sentence) => {
    // 해당 문장의 모든 시도
    const attempts = sessionHistory.filter((s) => s.sentenceId === sentence.id);

    // 성공 기준 충족 시도만 필터링
    const successfulAttempts = attempts.filter(
      (s) => s.accuracy >= 90 && s.wpm >= 20
    );

    // 3회 이상 성공하면 마스터
    if (successfulAttempts.length >= 3) {
      masteredSentences.push(sentence.id);
    }
  });

  return {
    masteredCount: masteredSentences.length,
    totalCount: profile.sentences.length,
    masteredSentences,
    progress: Math.round((masteredSentences.length / totalCount) * 100),
  };
};
```

**마스터 기준:**
- 정확도: 90% 이상
- 속도: 20 WPM 이상
- 반복: 3회 이상 성공

**설계 의도:**
- 단순 속도 경쟁이 아닌 정확하고 유창한 타이핑 유도
- 반복을 통한 긍정 문구 내면화 (Self-Affirmation 효과)
- 명확한 달성 기준으로 동기부여

### 3. 세션 데이터 저장

```javascript
// TherapyMode.jsx
const handleSessionComplete = (sessionData) => {
  const newSession = {
    ...sessionData,  // sentenceId, wpm, accuracy, keystrokeLogs, completedAt
    profileKey       // 현재 프로파일 추가
  };

  // 1. 상태 업데이트
  const updatedHistory = [...sessionHistory, newSession];
  setSessionHistory(updatedHistory);

  // 2. localStorage 저장
  localStorage.setItem('therapySessions', JSON.stringify({
    profileKey,
    sessions: updatedHistory
  }));

  // 3. 진행도 재계산
  const progress = calculateMasteryProgress(updatedHistory, profileKey);
  setMasteryProgress(progress);
};
```

**데이터 일관성:**
- 상태 → localStorage 동기화
- 세션 완료 즉시 반영
- 진행도 자동 업데이트

## UI/UX 설계 원칙

### 1. 색상 코딩 (프로파일별)

```javascript
const profileColors = {
  self_esteem: '#9C27B0',      // Purple
  stress_management: '#2196F3', // Blue
  emotion_control: '#4CAF50',   // Green
  motivation: '#FF9800'         // Orange
};
```

**적용:**
- ProfileBadge: 배지 테두리 및 배경
- ProgressTracker: 진행률 바 색상
- 마스터 완료 항목: 배경 색상

### 2. 시각적 피드백

**성공 시:**
- 🎉 이모지
- 녹색 배경 (bg-green-50, border-green-500)
- "마스터 성공!" 메시지

**재도전 시:**
- 💪 이모지
- 노란색 배경 (bg-yellow-50, border-yellow-500)
- "좋은 시도!" 격려 메시지

**마스터 완료:**
- ✓ 체크 마크
- 프로파일 색상 강조

### 3. 반응형 레이아웃

```jsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* 왼쪽 2칸: 타이핑 영역 */}
  <div className="lg:col-span-2">
    <TherapySentence />
  </div>

  {/* 오른쪽 1칸: 진행도 */}
  <div className="lg:col-span-1">
    <ProgressTracker />
  </div>
</div>
```

**모바일:**
- 세로 스택 (타이핑 영역 → 진행도)

**데스크톱:**
- 2:1 비율 가로 배치

## 데이터 구조 상세

### localStorage: 'insightResults'
```json
{
  "assignedProfile": "self_esteem",
  "scores": {
    "self_perception": 35,
    "self_worth": 40,
    "stress_response": 65,
    "emotion_regulation": 55
  },
  "completedAt": "2025-10-30T09:00:00.000Z"
}
```

### localStorage: 'therapySessions'
```json
{
  "profileKey": "self_esteem",
  "sessions": [
    {
      "sentenceId": "self_esteem_01",
      "wpm": 45.2,
      "accuracy": 92.5,
      "keystrokeLogs": [
        { "timestamp": 1730280000000, "key": "나" },
        { "timestamp": 1730280150, "key": "는" }
      ],
      "completedAt": "2025-10-30T10:00:00.000Z"
    },
    {
      "sentenceId": "self_esteem_01",
      "wpm": 48.7,
      "accuracy": 95.0,
      "keystrokeLogs": [...],
      "completedAt": "2025-10-30T10:05:00.000Z"
    }
  ]
}
```

### therapySentences.js 문장 구조
```javascript
{
  id: 'self_esteem_01',
  text: '나는 충분히 노력하고 있으며, 그것만으로도 가치 있다',
  difficulty: 'beginner',  // beginner | intermediate | advanced
  therapeuticIntent: '노력 자체의 가치 인정 (과정 중심적 사고)',
  scientificBasis: 'Growth Mindset (Dweck, 2006)'
}
```

## 성능 최적화

### 1. useCallback 활용 (미래 확장)
```javascript
const handleSessionComplete = useCallback((sessionData) => {
  // ... 로직
}, [profileKey, sessionHistory]);
```

### 2. localStorage 읽기 최소화
- 초기 로드 시에만 읽기 (useEffect)
- 이후는 React 상태로 관리
- 저장만 localStorage에 동기화

### 3. 조건부 렌더링
```javascript
if (!profileKey || !currentSentence) {
  return <LoadingScreen />;
}
```

## 에러 처리

### 1. Insight Mode 미완료
```javascript
useEffect(() => {
  const insightResults = localStorage.getItem('insightResults');

  if (!insightResults) {
    navigate('/insight');  // 리다이렉트
    return;
  }

  try {
    const results = JSON.parse(insightResults);
    // ...
  } catch (error) {
    console.error('Failed to load insight results:', error);
    navigate('/insight');
  }
}, [navigate]);
```

### 2. 잘못된 프로파일 키
```javascript
const profile = therapySentences[profileKey];

if (!profile) {
  return null;  // 컴포넌트 렌더링 중단
}
```

## 접근성 (Accessibility)

### 키보드 내비게이션
- TypingInput: autoFocus로 즉시 타이핑 가능
- "다음 문장" 버튼: 키보드로 접근 가능

### 색상 대비
- WCAG AA 기준 충족 (4.5:1 이상)
- 녹색/빨간색 외에 텍스트로도 상태 표시

### 스크린 리더
- 의미 있는 HTML 구조 (h1, h2, h3)
- aria-label 추가 가능 (미래 개선)

## 테스트 케이스

### 단위 테스트 (Jest)
```javascript
describe('recommendNextSentence', () => {
  it('should recommend least attempted sentence', () => {
    const history = [
      { sentenceId: 'self_esteem_01', accuracy: 95, wpm: 45 },
      { sentenceId: 'self_esteem_01', accuracy: 92, wpm: 50 }
    ];

    const next = recommendNextSentence(history, 'self_esteem');

    expect(next.id).toBe('self_esteem_02');  // 시도 0회
  });
});
```

### 통합 테스트 (Cypress)
```javascript
describe('Therapy Mode', () => {
  it('should save session and update progress', () => {
    cy.visit('/therapy');
    cy.get('input').type('나는 충분히 노력하고 있으며, 그것만으로도 가치 있다');
    cy.get('.wpm').should('exist');
    cy.get('.accuracy').should('exist');
    cy.get('button').contains('다음 문장').click();

    // localStorage 확인
    cy.window().then((win) => {
      const sessions = JSON.parse(win.localStorage.getItem('therapySessions'));
      expect(sessions.sessions.length).to.equal(1);
    });
  });
});
```

## 향후 확장 가능성

### 1. 난이도 적응형 시스템
```javascript
// 사용자 WPM 평균에 따라 문장 추천
const userAvgWpm = calculateAvgWpm(sessionHistory);

if (userAvgWpm < 20) {
  recommendedSentence = getSentencesByDifficulty(profileKey, 'beginner');
} else if (userAvgWpm < 40) {
  recommendedSentence = getSentencesByDifficulty(profileKey, 'intermediate');
} else {
  recommendedSentence = getSentencesByDifficulty(profileKey, 'advanced');
}
```

### 2. 복습 알림 시스템
```javascript
// 3일 이상 연습하지 않은 문장
const needsReview = profile.sentences.filter((sentence) => {
  const lastAttempt = sessionHistory
    .filter((s) => s.sentenceId === sentence.id)
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))[0];

  if (!lastAttempt) return false;

  const daysSince = (Date.now() - new Date(lastAttempt.completedAt)) / (1000 * 60 * 60 * 24);
  return daysSince >= 3;
});
```

### 3. 소셜 기능
- 익명 순위표 (프로파일별 평균 WPM)
- 그룹 챌린지 (함께 5개 문장 마스터하기)
- 격려 메시지 공유

---

**버전**: 1.0
**작성일**: 2025-10-30
**작성자**: Implementation Lead Agent
**목적**: 개발팀 온보딩 및 유지보수 가이드

# TheraType 개발 로드맵 (Week 2-3)

**목적**: 핵심 기능 개발 단계의 일일 세부 계획

**기간**: Week 2 (Day 6-12) + Week 3 (Day 11-17)

---

## 📅 Week 2: 핵심 기능 개발 (7일)

### Day 6 (월요일): Insight Mode 기초

#### 오전 (4시간)
- [ ] 문장 쌍 데이터 구조 설계 및 JSON 파일 작성
  - `src/data/insightPairs.json` 생성
  - 10개 문장 쌍 데이터 입력
  - 카테고리별 분류 (self_perception, stress_response 등)

```json
// insightPairs.json 예시 구조
[
  {
    "id": "SP1",
    "category": "self_perception",
    "sentenceA": {
      "text": "나는 내 장점과 강점을 잘 알고 있다",
      "value": "positive"
    },
    "sentenceB": {
      "text": "나는 내 단점이 더 많이 눈에 띈다",
      "value": "negative"
    }
  },
  // ... 9개 더
]
```

- [ ] Insight Mode 페이지 기본 구조 생성
  - `src/pages/InsightMode.js` 파일 생성
  - React Router 라우트 연결
  - 기본 레이아웃 구성

#### 오후 (4시간)
- [ ] 문장 제시 컴포넌트 구현
  - `src/components/insight/SentencePair.js`
  - 두 문장 표시 UI
  - 선택 버튼 ("이 문장 선택하기")
  - 진행도 표시 (3/10)

- [ ] 선택 로직 구현
  - useState로 선택 기록 관리
  - 다음 문장으로 이동 로직
  - 선택 시간 측정 (Date.now() 활용)

**Day 6 완료 기준**:
- [ ] 10개 문장 쌍 선택 플로우 작동
- [ ] 선택 데이터가 state에 저장됨
- [ ] 다음 문장으로 자동 이동

---

### Day 7 (화요일): Insight Mode 타이핑 기능

#### 오전 (4시간)
- [ ] 타이핑 입력 컴포넌트 구현
  - `src/components/common/TypingInput.js`
  - 입력 필드 (autoComplete="off", spellCheck="false")
  - 제시 문장과 입력 문장 실시간 비교
  - 글자별 색상 표시 (정확: 초록, 오류: 빨강)

```javascript
// TypingInput 핵심 로직
const [typedText, setTypedText] = useState('');
const [startTime, setStartTime] = useState(null);

const handleKeyDown = (e) => {
  if (!startTime) setStartTime(Date.now());

  // 키스트로크 로깅 (선택적)
  logKeystroke(e.key, Date.now() - startTime, 'down');
};

const handleChange = (e) => {
  setTypedText(e.target.value);

  // 완료 체크
  if (e.target.value === targetSentence) {
    onComplete({
      timeMs: Date.now() - startTime,
      wpm: calculateWPM(targetSentence, Date.now() - startTime),
      accuracy: 100
    });
  }
};
```

#### 오후 (4시간)
- [ ] WPM/정확도 계산 로직 구현
  - `src/utils/typingAnalyzer.js` 생성
  - calculateWPM() 함수
  - calculateAccuracy() 함수
  - 단위 테스트 (콘솔 로그로 확인)

- [ ] Insight Mode 타이핑 통합
  - 선택 후 타이핑 화면 전환
  - 타이핑 완료 후 다음 문장으로
  - 전체 10개 완료까지 반복

**Day 7 완료 기준**:
- [ ] 문장 선택 → 타이핑 → 다음 문장 플로우 완성
- [ ] WPM, 정확도 계산 정확성 확인
- [ ] 10개 완료 시 결과 화면으로 이동 (빈 화면이라도 OK)

---

### Day 8 (수요일): Insight Mode 결과 및 Firebase 저장

#### 오전 (4시간)
- [ ] 프로파일 점수 계산 로직
  - `src/utils/profileCalculator.js` 생성
  - calculateProfileScores() 함수
  - assignProfile() 함수
  - 카테고리별 점수 산출 (0-100점)

```javascript
// 예시
const selections = [
  { category: 'self_perception', selected: 'A' },
  { category: 'self_perception', selected: 'B' },
  // ...
];

const scores = calculateProfileScores(selections);
// { self_perception: 50, stress_response: 30, ... }

const profile = assignProfile(scores);
// "stress_management"
```

- [ ] 결과 화면 UI 구현
  - `src/components/insight/ResultSummary.js`
  - 카테고리별 점수 막대 그래프
  - 간단한 인사이트 메시지
  - "Therapy Mode 시작하기" 버튼

#### 오후 (4시간)
- [ ] Firebase Firestore 연동
  - Insight Session 데이터 저장
  - User Context에 프로파일 정보 저장
  - 에러 처리 (try-catch)

```javascript
// Firebase 저장 예시
const saveInsightSession = async (selections, scores, profile) => {
  try {
    await db.collection('insightSessions').add({
      userId: currentUser.uid,
      completedAt: new Date(),
      selections: selections,
      profileScores: scores,
      assignedProfile: profile
    });

    // Context 업데이트
    setProfile({ scores, type: profile });

    return true;
  } catch (error) {
    console.error('저장 실패:', error);
    return false;
  }
};
```

**Day 8 완료 기준**:
- [ ] Insight Mode 완료 시 결과 화면 표시
- [ ] Firestore에 데이터 저장 확인
- [ ] User Context에 프로파일 정보 저장 확인

---

### Day 9 (목요일): Therapy Mode 기초

#### 오전 (4시간)
- [ ] Therapy 문장 데이터 준비
  - `src/data/therapySentences.json` 생성
  - 프로파일별 5개씩 (총 20개)
  - 난이도별 분류 (beginner, intermediate, advanced)

```json
// therapySentences.json 구조
{
  "self_esteem": [
    {
      "id": "SE_01",
      "text": "나는 소중한 사람이다",
      "difficulty": "beginner",
      "length": 11
    },
    // ... 4개 더
  ],
  "stress_management": [ ... ],
  // ...
}
```

- [ ] Therapy Mode 페이지 기본 구조
  - `src/pages/TherapyMode.js`
  - 프로파일 정보 가져오기 (Context)
  - 오늘의 문장 선택 로직 (처음엔 순서대로)

#### 오후 (4시간)
- [ ] 타이핑 연습 인터페이스 구현
  - `src/components/therapy/TypingInterface.js`
  - TypingInput 컴포넌트 재사용
  - 실시간 WPM/정확도 표시
  - 완료 시 피드백 모달

**Day 9 완료 기준**:
- [ ] Therapy Mode 진입 가능
- [ ] 프로파일 맞춤 문장 표시
- [ ] 한 문장 타이핑 연습 가능

---

### Day 10 (금요일): Therapy Mode 완성

#### 오전 (4시간)
- [ ] 완료 피드백 컴포넌트
  - `src/components/therapy/FeedbackCard.js`
  - WPM, 정확도, 소요 시간 표시
  - 격려 메시지 (조건부)
  - "다음 문장" / "한 번 더" 버튼

```javascript
// 격려 메시지 로직
const getMessage = (wpm, accuracy) => {
  if (accuracy === 100 && wpm >= 50) {
    return "완벽해요! 이 문장을 완전히 익혔어요 ⭐";
  } else if (accuracy >= 95) {
    return "훌륭해요! 조금만 더 연습하면 완벽할 거예요 💪";
  } else {
    return "좋아요! 한 번 더 해보면 더 나아질 거예요 😊";
  }
};
```

#### 오후 (4시간)
- [ ] Therapy Session 데이터 저장
  - 세션 시작 시 Firestore 문서 생성
  - 문장 완료마다 array update
  - 세션 종료 시 총 시간 기록

- [ ] 반복 연습 기능
  - "한 번 더" 클릭 시 동일 문장 재시도
  - attemptNumber 증가
  - 마스터리 상태 판단 (3회 이상 && 평균 정확도 95%+)

**Day 10 완료 기준**:
- [ ] Therapy Mode 5개 문장 연습 플로우 완성
- [ ] Firestore에 세션 데이터 저장 확인
- [ ] 반복 연습 기능 작동

---

### Day 11-12 (주말): 버그 수정 및 통합 테스트

#### Day 11 (토요일)
- [ ] 전체 플로우 통합 테스트
  - 회원가입 → Insight Mode → Therapy Mode
  - 데이터 흐름 확인
  - Edge case 처리 (빈 입력, 로그아웃 등)

- [ ] UI/UX 개선
  - 로딩 상태 표시 (Spinner)
  - 에러 메시지 개선
  - 버튼 disable 상태 관리

#### Day 12 (일요일)
- [ ] 코드 리팩토링
  - 중복 코드 제거
  - 주석 추가
  - 변수명 명확화

- [ ] 팀 내부 데모
  - 실제 사용 시연
  - 피드백 수집
  - 긴급 버그 수정

**Week 2 마일스톤 확인**:
- [ ] Insight Mode 완전 작동
- [ ] Therapy Mode 완전 작동
- [ ] Firebase 데이터 저장 검증
- [ ] 기본 플로우 안정성 확보

---

## 📅 Week 3: 대시보드 및 통합 (7일)

### Day 13 (월요일): 대시보드 데이터 준비

#### 오전 (4시간)
- [ ] 대시보드 데이터 조회 로직
  - `src/utils/dashboardData.js` 생성
  - 최근 7일 세션 조회
  - 최신 Insight 프로파일 조회
  - 스트릭 계산 (연속 사용 일수)

```javascript
// 스트릭 계산 예시
const calculateStreak = (sessions) => {
  sessions.sort((a, b) => b.date - a.date);

  let streak = 0;
  let currentDate = new Date();

  for (const session of sessions) {
    const sessionDate = session.date.toDate();
    const daysDiff = Math.floor((currentDate - sessionDate) / (1000 * 60 * 60 * 24));

    if (daysDiff === streak) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};
```

#### 오후 (4시간)
- [ ] 타이핑 속도 추이 그래프 구현
  - `src/components/dashboard/SpeedChart.js`
  - Chart.js 또는 Recharts 설치 및 설정
  - Line Chart 생성
  - 최근 7일 WPM 데이터 표시

**Day 13 완료 기준**:
- [ ] Firestore에서 대시보드 데이터 조회 가능
- [ ] 타이핑 속도 그래프 표시

---

### Day 14 (화요일): 대시보드 UI 완성

#### 오전 (4시간)
- [ ] 프로파일 레이더 차트
  - `src/components/dashboard/ProfileRadar.js`
  - 5개 카테고리 점수 시각화
  - Chart.js Radar Chart

- [ ] 통계 카드 컴포넌트
  - `src/components/dashboard/StatCard.js`
  - 스트릭, 평균 WPM, 마스터 문장 수 등

#### 오후 (4시간)
- [ ] 대시보드 페이지 통합
  - `src/pages/Dashboard.js`
  - 모든 컴포넌트 배치
  - 반응형 레이아웃 (Grid)
  - 버튼: "Insight 다시하기", "오늘의 연습"

**Day 14 완료 기준**:
- [ ] 대시보드 모든 정보 표시
- [ ] 데이터 업데이트 시 자동 반영
- [ ] 반응형 레이아웃 작동

---

### Day 15 (수요일): 사용자 플로우 통합

#### 오전 (4시간)
- [ ] 네비게이션 개선
  - 상단 네비게이션 바 (로고, 메뉴, 로그아웃)
  - 모바일 햄버거 메뉴
  - 현재 페이지 하이라이트

- [ ] 라우팅 보호
  - 인증 체크 (ProtectedRoute)
  - 비로그인 시 로그인 페이지로 리다이렉트
  - Insight 미완료 시 Therapy 접근 제한 (선택적)

#### 오후 (4시간)
- [ ] 온보딩 플로우 개선
  - 개인정보 동의 화면 추가
  - 3페이지 소개 슬라이드
  - Skip 버튼 (개발 편의)

- [ ] 설정 페이지
  - `src/pages/Settings.js`
  - 계정 정보 표시
  - 알림 설정 (UI만, 기능은 추후)
  - 데이터 다운로드 버튼 (JSON export)
  - 계정 삭제 (확인 모달)

**Day 15 완료 기준**:
- [ ] 전체 페이지 네비게이션 매끄러움
- [ ] 인증 보호 작동
- [ ] 설정 페이지 기본 기능 구현

---

### Day 16 (목요일): 반응형 및 모바일 최적화

#### 오전 (4시간)
- [ ] 모바일 레이아웃 점검
  - 모든 페이지 모바일 뷰 확인 (Chrome DevTools)
  - 버튼 크기 조정 (44x44px 이상)
  - 타이핑 입력 필드 모바일 최적화

- [ ] Touch 이벤트 처리
  - 터치 타겟 간격 확보
  - 스크롤 동작 개선

#### 오후 (4시간)
- [ ] 브라우저 호환성 테스트
  - Chrome (데스크탑/모바일)
  - Safari (데스크탑/iPhone)
  - Firefox (데스크탑)
  - Edge (선택적)

- [ ] 성능 최적화
  - React.memo() 적용 (필요한 컴포넌트)
  - useMemo() 활용 (차트 데이터 계산)
  - Lazy loading (라우트별 Code Splitting)

**Day 16 완료 기준**:
- [ ] 모바일에서 모든 기능 사용 가능
- [ ] 주요 브라우저 호환성 확인
- [ ] Lighthouse 점수 80+ (Performance, Accessibility)

---

### Day 17 (금요일): 버그 수정 및 배포 준비

#### 오전 (4시간)
- [ ] 버그 수정
  - 지난 주 발견된 버그 해결
  - 에러 로깅 확인 (Firebase Console)
  - Edge case 테스트

- [ ] 에러 처리 강화
  - 네트워크 오류 시 재시도 로직
  - Firestore 쓰기 실패 시 알림
  - 빈 상태 처리 (데이터 없을 때)

#### 오후 (4시간)
- [ ] Firebase 배포 준비
  - 환경 변수 설정 (.env.production)
  - Firebase Hosting 설정 확인
  - Firestore Security Rules 적용 및 테스트

```bash
# 배포 명령
npm run build
firebase deploy --only hosting
```

- [ ] 배포 테스트
  - 배포된 URL에서 전체 플로우 테스트
  - 모바일 실기기 테스트
  - 팀원들과 공유하여 피드백 수집

**Day 17 완료 기준**:
- [ ] 모든 핵심 기능 정상 작동
- [ ] 배포 완료 (실제 URL 확보)
- [ ] 팀 내부 승인 완료

---

## 🔧 버퍼 시간 활용 계획

### 예상 지연 시나리오

**시나리오 1: Firebase 연동 어려움** (Day 8 지연)
- 대응: Day 11-12 버퍼 시간 활용
- 우선순위: Insight Mode 저장 > Therapy Mode 저장

**시나리오 2: 차트 구현 복잡함** (Day 13-14 지연)
- 대응: 차트 간소화 (막대 그래프로 대체)
- 또는 Day 16 모바일 최적화 시간 단축

**시나리오 3: 예상치 못한 버그 다수**
- 대응: Day 17 오후를 추가 버그 수정에 투입
- 최악의 경우: Week 4 Day 18-19 활용

---

## ✅ 일일 체크리스트 템플릿

매일 작업 종료 시 점검:

```markdown
### Day X 완료 체크

- [ ] 계획된 기능 구현 완료
- [ ] 코드 커밋 및 푸시 (GitHub)
- [ ] 주요 버그 기록 (Issues 등록)
- [ ] 다음 날 준비 사항 확인
- [ ] 팀원과 진행 상황 공유

**오늘의 성과**:
- [기능 A 완성]
- [버그 B 수정]

**내일 우선 작업**:
- [작업 1]
- [작업 2]

**블로커**:
- [있다면 기록]
```

---

## 📞 데일리 스탠드업 (선택적)

팀 규모가 2명 이상이면 매일 15분 스탠드업 권장:

**시간**: 오전 10시 (개발 시작 전)

**질문 3가지**:
1. 어제 무엇을 했나요?
2. 오늘 무엇을 할 건가요?
3. 어떤 어려움이 있나요?

**목적**: 빠른 동기화, 블로커 조기 발견

---

**문서 버전**: 1.0
**최종 수정**: 2025-01-30
**작성자**: Implementation Lead
**다음 문서**: code_guidelines.md

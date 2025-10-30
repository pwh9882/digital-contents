# Therapy Mode - 구현 완료

## 개요

Therapy Mode는 Insight Mode에서 분석된 사용자 프로파일을 기반으로 맞춤형 긍정 자극 타이핑 훈련을 제공하는 TheraType의 핵심 기능입니다.

**구현 날짜**: 2025-10-30
**구현자**: Implementation Lead Agent
**상태**: ✅ 완료 (테스트 필요)

---

## 빠른 시작

### 개발 서버 실행
```bash
cd /Users/woohyeok/development/2025/digital-contents/theratype
npm run dev
```

서버 주소: http://localhost:5173/ (또는 자동으로 할당된 포트)

### 테스트 플로우
1. `/insight` 접속 → Insight Mode 완료
2. `/therapy` 접속 → 맞춤형 타이핑 훈련
3. 문장 타이핑 → 결과 확인 → 다음 문장
4. 5개 문장 마스터 → 대시보드 이동

---

## 파일 구조

```
src/
├── pages/
│   └── TherapyMode.jsx              # 메인 페이지
├── components/
│   └── therapy/
│       ├── TherapySentence.jsx      # 타이핑 연습 컴포넌트
│       ├── ProgressTracker.jsx      # 진행도 추적기
│       └── ProfileBadge.jsx         # 프로파일 배지
├── data/
│   └── therapySentences.js          # 20개 치료적 문장 데이터
└── utils/
    └── typingAnalyzer.js            # 타이핑 분석 (재사용)

agents_context/
└── implementation/
    ├── therapy_mode_completion_report.md    # 완료 보고서
    ├── therapy_mode_architecture.md         # 아키텍처 문서
    └── integration_checklist.md             # 통합 체크리스트
```

---

## 핵심 기능

### 1. 프로파일 기반 맞춤화
- Insight Mode 결과에서 프로파일 자동 할당
- 4개 프로파일: 자존감, 스트레스 관리, 감정 조절, 동기부여
- 각 프로파일별 5개 치료적 문장

### 2. 마스터 시스템
**기준:**
- 정확도 90% 이상
- 타이핑 속도 20 WPM 이상
- 3회 이상 성공

**진행도 추적:**
- 실시간 성공 횟수 표시
- 마스터 완료 시 ✓ 마크
- 전체 진행률 바 (X/5)

### 3. 지능적 문장 추천
- 마스터하지 못한 문장 중 시도 횟수가 적은 것 우선
- 모두 마스터했으면 복습 (첫 번째 문장)
- 공정한 연습 기회 보장

### 4. 데이터 영속성
- localStorage 기반 세션 기록 저장
- 브라우저 종료 후에도 진행도 유지
- 프로파일별 세션 분리

---

## 데이터 구조

### localStorage: 'therapySessions'
```json
{
  "profileKey": "self_esteem",
  "sessions": [
    {
      "sentenceId": "self_esteem_01",
      "wpm": 45.2,
      "accuracy": 92.5,
      "keystrokeLogs": [...],
      "completedAt": "2025-10-30T10:00:00.000Z"
    }
  ]
}
```

### 프로파일 종류
```javascript
{
  self_esteem: {
    profileName: '자존감 향상',
    color: '#9C27B0',  // Purple
    icon: '💜'
  },
  stress_management: {
    profileName: '스트레스 관리',
    color: '#2196F3',  // Blue
    icon: '💙'
  },
  emotion_control: {
    profileName: '감정 조절',
    color: '#4CAF50',  // Green
    icon: '💚'
  },
  motivation: {
    profileName: '동기부여',
    color: '#FF9800',  // Orange
    icon: '🧡'
  }
}
```

---

## 주요 컴포넌트

### TherapyMode (메인 페이지)
**경로**: `/src/pages/TherapyMode.jsx`

**역할:**
- Insight Mode 결과 로드
- 세션 기록 관리
- 다음 문장 추천
- 진행도 계산

**Props:** 없음 (localStorage에서 직접 읽기)

### TherapySentence (타이핑 연습)
**경로**: `/src/components/therapy/TherapySentence.jsx`

**역할:**
- 치료적 문장 표시
- TypingInput 컴포넌트 재사용
- 성공/실패 판정
- 결과 화면 표시

**Props:**
```javascript
{
  sentence: {
    id: 'self_esteem_01',
    text: '나는 충분히 노력하고 있으며...',
    therapeuticIntent: '...',
    scientificBasis: '...'
  },
  onComplete: (sessionData) => {...}
}
```

### ProgressTracker (진행도 추적기)
**경로**: `/src/components/therapy/ProgressTracker.jsx`

**역할:**
- 5개 문장 마스터 진행도 표시
- 각 문장의 성공 횟수 표시
- 마스터 기준 안내

**Props:**
```javascript
{
  profileKey: 'self_esteem',
  sessionHistory: [...]
}
```

### ProfileBadge (프로파일 배지)
**경로**: `/src/components/therapy/ProfileBadge.jsx`

**역할:**
- 현재 프로파일 아이콘, 이름 표시
- 프로파일별 색상 적용

**Props:**
```javascript
{
  profileKey: 'self_esteem'
}
```

---

## 사용된 기술

### React Hooks
- `useState`: 로컬 상태 관리
- `useEffect`: 데이터 로드, 자동 업데이트
- `useCallback`: 성능 최적화 준비 (미래)

### React Router
- `useNavigate`: 리다이렉트 (Insight Mode 미완료 시)

### Tailwind CSS
- 동적 색상 적용 (`style={{ backgroundColor: color }}`)
- 반응형 그리드 (`grid-cols-1 lg:grid-cols-3`)

### localStorage API
- 세션 영속성
- JSON 직렬화/역직렬화

---

## 테스트 방법

### 1. 정상 플로우
```bash
1. npm run dev
2. http://localhost:5173/insight 접속
3. Insight Mode 완료 (10개 문장 쌍 선택)
4. http://localhost:5173/therapy 접속
5. 프로파일 배지 확인
6. 문장 타이핑
7. 결과 확인 (WPM, 정확도)
8. "다음 문장" 클릭
9. 진행도 트래커 업데이트 확인
10. 같은 문장 3회 성공 → ✓ 마크 확인
```

### 2. Insight Mode 미완료 시
```bash
1. localStorage.clear() (개발자 도구)
2. http://localhost:5173/therapy 접속
3. /insight로 리다이렉트 확인
```

### 3. 세션 영속성
```bash
1. 2개 문장 연습 (총 5회 시도)
2. 브라우저 닫기
3. 다시 열기
4. http://localhost:5173/therapy 접속
5. 이전 진행도 유지 확인
```

### 4. localStorage 확인
```javascript
// 개발자 도구 Console
localStorage.getItem('therapySessions')

// 예상 출력:
// {"profileKey":"self_esteem","sessions":[...]}
```

---

## 알려진 제한사항

### 1. Insight Mode 연결 버튼 없음
**문제**: Insight Mode 완료 후 Therapy Mode로 가는 직접적인 버튼 없음
**해결**: InsightResult 컴포넌트에 버튼 추가 필요

### 2. 프로파일 변경 불가
**문제**: 한 번 할당된 프로파일 변경 불가
**해결**: 설정 페이지에서 재진단 기능 필요 (미래)

### 3. 세션 기록 제한 없음
**문제**: sessionHistory 배열이 무한정 증가
**해결**: 최근 100개로 제한 또는 정기적 정리 (미래)

### 4. 오프라인 지원 없음
**문제**: localStorage만 사용, 서버 동기화 없음
**해결**: Firebase 연동 (Week 3-4)

---

## 향후 개선 사항

### 우선순위 높음
1. **Insight Mode 연결 버튼 추가**
   - InsightResult에 "Therapy Mode 시작" 버튼
   - 자연스러운 플로우 연결

2. **Dashboard 연동**
   - Therapy Mode 통계 표시
   - 시간대별 성과 그래프

### 우선순위 중간
3. **난이도 적응형 시스템**
   - 사용자 평균 WPM에 따라 문장 추천
   - beginner → intermediate → advanced

4. **복습 알림**
   - 3일 이상 연습하지 않은 문장 강조
   - 이메일/푸시 알림 (선택적)

### 우선순위 낮음
5. **소셜 기능**
   - 익명 순위표
   - 그룹 챌린지

6. **음향 피드백**
   - 타이핑 소리 (옵션)
   - 마스터 달성 시 축하 소리

---

## 문제 해결

### 문제: /therapy 접속 시 무한 로딩
**원인**: insightResults가 없거나 잘못됨
**해결**:
```javascript
// 개발자 도구 Console
localStorage.setItem('insightResults', JSON.stringify({
  assignedProfile: 'self_esteem',
  scores: {}
}))
```

### 문제: 진행도가 업데이트되지 않음
**원인**: localStorage 저장 실패
**해결**:
```javascript
// 개발자 도구 Console
localStorage.getItem('therapySessions')
// null이면 저장 안 된 것 → 코드 확인
```

### 문제: 프로파일 색상이 안 보임
**원인**: Tailwind 동적 색상 생성 안 됨
**해결**: `style={{ color: ... }}` 사용 (현재 구현됨)

---

## 기여자

### Implementation Lead Agent
- 4개 컴포넌트 구현
- 3개 문서 작성
- 통합 테스트 시나리오 작성

### 참고한 기존 코드
- TypingInput (Insight Mode, 재사용)
- typingAnalyzer utils (공유)
- therapySentences.js (데이터)

---

## 라이선스 및 출처

### 과학적 근거
- Self-Affirmation Theory (Steele, 1988; Cohen & Sherman, 2014)
- Growth Mindset (Dweck, 2006)
- Self-Compassion (Neff, 2003)
- 상세 레퍼런스: `RESEARCH_REFERENCES.md` 참고

### 프로젝트 문서
- `AGENTS.md` - 프로젝트 개요
- `CONCEPT_DETAIL.md` - 기능 상세 설계
- `TECHNICAL_ARCHITECTURE.md` - 시스템 설계

---

## 연락처

**프로젝트 목적**: 디지털헬스케어 센터 과제
**팀**: 2-5명 소규모
**기간**: 4주 (프로토타입)

**다음 단계**: Week 3 - Dashboard 구현

---

**버전**: 1.0
**최종 업데이트**: 2025-10-30
**문서 작성자**: Implementation Lead Agent

# TheraType 데이터베이스 스키마 설계

**작성자**: Technical Architect Agent
**작성일**: 2025-01-30
**문서 목적**: Firestore 데이터베이스 구조 및 보안 규칙 설계

---

## 데이터베이스 선택: Cloud Firestore

### Firestore 특징

- **문서 기반 NoSQL**: JSON 형태의 유연한 스키마
- **실시간 동기화**: 변경 사항 자동 반영
- **오프라인 지원**: 네트워크 끊겨도 로컬 캐시 사용
- **자동 확장**: 트래픽 증가 시 자동 스케일링
- **강력한 쿼리**: 복합 쿼리 및 인덱싱 지원

---

## 데이터 모델 개요

### Collection 구조

```
Firestore
├── users/                      # 사용자 정보
│   └── {userId}/
│       ├── profile             # 기본 정보
│       └── preferences         # 설정
│
├── insightSessions/            # Insight Mode 세션
│   └── {sessionId}/
│       ├── selections[]        # 선택 기록
│       └── profileScores{}     # 점수
│
├── therapySessions/            # Therapy Mode 세션
│   └── {sessionId}/
│       └── sentences[]         # 타이핑 기록
│
├── keystrokeLogs/              # 상세 키스트로크 (선택적)
│   └── {logId}/
│       └── keystrokes[]
│
└── systemConfig/               # 시스템 설정 (관리자용)
    └── sentences/
        ├── insight
        └── therapy
```

---

## 1. Users Collection

### 데이터 구조

```javascript
users/{userId}
{
  // 기본 정보
  uid: string,                          // Firebase Auth UID (Primary Key)
  email: string,                        // 이메일 (Firebase Auth 자동 생성)
  emailVerified: boolean,               // 이메일 인증 여부

  // 프로필 정보
  profile: {
    ageGroup: string,                   // "19-25", "26-35", "36-45", "46+"
    gender: string | null,              // "male", "female", "other", null (선택 사항)
    typingLevel: string,                // "beginner", "intermediate", "advanced"
  },

  // 프로그램 진행 상태
  progress: {
    hasCompletedOnboarding: boolean,
    lastInsightDate: timestamp | null,
    lastTherapyDate: timestamp | null,
    assignedProfile: string | null,     // "self_esteem", "stress_management", etc.
    totalSessions: number,              // 총 세션 수
  },

  // 통계
  stats: {
    currentStreak: number,              // 연속 사용 일수
    longestStreak: number,              // 최장 연속 일수
    totalTypingTime: number,            // 총 타이핑 시간 (ms)
    masteredSentences: string[],        // 마스터한 문장 ID 리스트
  },

  // 설정
  preferences: {
    notificationsEnabled: boolean,
    theme: string,                      // "light", "dark"
    language: string,                   // "ko"
  },

  // 개인정보 동의
  consents: {
    dataCollection: boolean,            // 데이터 수집 동의
    researchParticipation: boolean,     // 연구 참여 동의
    marketingEmails: boolean,           // 마케팅 이메일 수신 동의
  },

  // 메타데이터
  createdAt: timestamp,
  updatedAt: timestamp,
  lastLoginAt: timestamp,
}
```

### 예시 데이터

```json
{
  "uid": "abc123xyz789",
  "email": "user@example.com",
  "emailVerified": true,
  "profile": {
    "ageGroup": "26-35",
    "gender": "female",
    "typingLevel": "intermediate"
  },
  "progress": {
    "hasCompletedOnboarding": true,
    "lastInsightDate": "2025-01-28T10:30:00Z",
    "lastTherapyDate": "2025-01-30T14:20:00Z",
    "assignedProfile": "stress_management",
    "totalSessions": 12
  },
  "stats": {
    "currentStreak": 5,
    "longestStreak": 10,
    "totalTypingTime": 3600000,
    "masteredSentences": ["stress_01", "stress_02", "self_est_01"]
  },
  "preferences": {
    "notificationsEnabled": true,
    "theme": "light",
    "language": "ko"
  },
  "consents": {
    "dataCollection": true,
    "researchParticipation": true,
    "marketingEmails": false
  },
  "createdAt": "2025-01-20T09:00:00Z",
  "updatedAt": "2025-01-30T14:20:00Z",
  "lastLoginAt": "2025-01-30T14:15:00Z"
}
```

---

## 2. Insight Sessions Collection

### 데이터 구조

```javascript
insightSessions/{sessionId}
{
  // 세션 정보
  userId: string,                       // users/{userId} 참조
  sessionId: string,                    // 자동 생성 ID

  // 선택 기록
  selections: [
    {
      pairId: string,                   // "SP1", "SP2", "SR1", etc.
      category: string,                 // "self_perception", "stress_response", etc.
      sentenceA: string,                // 문장 A 텍스트
      sentenceB: string,                // 문장 B 텍스트
      selected: string,                 // "A" 또는 "B"
      selectionTime: number,            // 선택까지 걸린 시간 (ms)
      typingData: {
        wpm: number,
        accuracy: number,
        timeMs: number,
        errorCount: number,
        backspaceCount: number,
      }
    }
  ],

  // 프로파일 점수
  profileScores: {
    self_perception: number,            // 0-100
    stress_response: number,
    social_energy: number,
    emotion_regulation: number,
    future_orientation: number,
  },

  // 할당된 프로파일
  assignedProfile: string,              // "self_esteem", "stress_management", etc.

  // 세션 메타데이터
  startedAt: timestamp,
  completedAt: timestamp,
  duration: number,                     // 전체 소요 시간 (ms)
  deviceInfo: {
    userAgent: string,
    screenSize: string,                 // "1920x1080"
    isMobile: boolean,
  }
}
```

### 예시 데이터

```json
{
  "userId": "abc123xyz789",
  "sessionId": "insight_session_001",
  "selections": [
    {
      "pairId": "SP1",
      "category": "self_perception",
      "sentenceA": "나는 내 장점과 강점을 잘 알고 있다",
      "sentenceB": "나는 내 단점이 더 많이 눈에 띈다",
      "selected": "B",
      "selectionTime": 3500,
      "typingData": {
        "wpm": 42,
        "accuracy": 96,
        "timeMs": 8200,
        "errorCount": 2,
        "backspaceCount": 3
      }
    }
  ],
  "profileScores": {
    "self_perception": 40,
    "stress_response": 60,
    "social_energy": 70,
    "emotion_regulation": 50,
    "future_orientation": 55
  },
  "assignedProfile": "self_esteem",
  "startedAt": "2025-01-28T10:30:00Z",
  "completedAt": "2025-01-28T10:48:00Z",
  "duration": 1080000,
  "deviceInfo": {
    "userAgent": "Mozilla/5.0...",
    "screenSize": "1920x1080",
    "isMobile": false
  }
}
```

---

## 3. Therapy Sessions Collection

### 데이터 구조

```javascript
therapySessions/{sessionId}
{
  // 세션 정보
  userId: string,
  sessionId: string,
  date: timestamp,

  // 프로파일 정보
  profile: string,                      // "self_esteem", "stress_management", etc.

  // 타이핑 기록
  sentences: [
    {
      sentenceId: string,               // "stress_01", "self_est_02", etc.
      sentenceText: string,
      difficulty: string,               // "beginner", "intermediate", "advanced"

      // 타이핑 성능
      attemptNumber: number,            // 이 문장을 몇 번째 시도하는지
      wpm: number,
      accuracy: number,                 // 0-100
      timeMs: number,

      // 에러 분석
      errorCount: number,
      errorPositions: number[],         // 에러 발생 위치 인덱스
      backspaceCount: number,

      // 키스트로크 타이밍
      avgKeypressInterval: number,      // 평균 키 간격 (ms)
      maxPause: number,                 // 최대 멈춤 시간 (ms)
      pauseCount: number,               // 2초 이상 멈춤 횟수

      // 마스터리 상태
      masteryStatus: string,            // "learning", "practicing", "mastered"
      masteryScore: number,             // 0-100 (WPM + 정확도 기반)
    }
  ],

  // 세션 요약
  summary: {
    totalDuration: number,              // 세션 총 시간 (ms)
    sentencesCompleted: number,
    avgWpm: number,
    avgAccuracy: number,
    newMasteredSentences: string[],     // 이번 세션에 마스터한 문장
  },

  // 메타데이터
  startedAt: timestamp,
  completedAt: timestamp,
}
```

### 예시 데이터

```json
{
  "userId": "abc123xyz789",
  "sessionId": "therapy_session_042",
  "date": "2025-01-30T14:20:00Z",
  "profile": "stress_management",
  "sentences": [
    {
      "sentenceId": "stress_01",
      "sentenceText": "나는 이 순간을 견딜 수 있다",
      "difficulty": "beginner",
      "attemptNumber": 2,
      "wpm": 48,
      "accuracy": 100,
      "timeMs": 6500,
      "errorCount": 0,
      "errorPositions": [],
      "backspaceCount": 0,
      "avgKeypressInterval": 250,
      "maxPause": 800,
      "pauseCount": 0,
      "masteryStatus": "mastered",
      "masteryScore": 95
    }
  ],
  "summary": {
    "totalDuration": 900000,
    "sentencesCompleted": 5,
    "avgWpm": 46,
    "avgAccuracy": 97,
    "newMasteredSentences": ["stress_01"]
  },
  "startedAt": "2025-01-30T14:20:00Z",
  "completedAt": "2025-01-30T14:35:00Z"
}
```

---

## 4. Keystroke Logs Collection (선택적)

### 데이터 구조

```javascript
keystrokeLogs/{logId}
{
  // 참조 정보
  userId: string,
  sessionId: string,                    // therapySessions/{sessionId} 참조
  sentenceId: string,

  // 상세 키스트로크 데이터
  keystrokes: [
    {
      key: string,                      // 누른 키 ("a", "ㄱ", "Backspace", etc.)
      keyCode: number,                  // 키 코드
      timestamp: number,                // 세션 시작 기준 상대 시간 (ms)
      eventType: string,                // "keydown", "keyup"

      // 키 타이밍
      dwellTime: number | null,         // keydown → keyup 시간 (ms)
      flightTime: number | null,        // 이전 키 up → 현재 키 down 시간 (ms)
    }
  ],

  // 분석 결과 (계산된 값)
  analysis: {
    typingRhythm: number,               // 타이핑 리듬 안정성 (표준편차)
    hesitationPoints: number[],         // 망설임 발생 위치
    errorCorrections: number,           // 백스페이스로 수정한 횟수
  },

  // 메타데이터
  createdAt: timestamp,
}
```

**중요**: 이 컬렉션은 **사용자 동의 후에만** 저장합니다.

---

## 5. System Config Collection (관리자용)

### 데이터 구조

```javascript
systemConfig/sentences
{
  // Insight Mode 문장
  insight: [
    {
      id: "SP1",
      category: "self_perception",
      sentenceA: "나는 내 장점과 강점을 잘 알고 있다",
      sentenceB: "나는 내 단점이 더 많이 눈에 띈다",
      scoreWeight: {
        A: { self_perception: 10 },
        B: { self_perception: -10 }
      }
    }
  ],

  // Therapy Mode 문장
  therapy: [
    {
      id: "stress_01",
      profile: "stress_management",
      text: "나는 이 순간을 견딜 수 있다",
      difficulty: "beginner",
      order: 1,
      tags: ["mindfulness", "present_moment"],
      isActive: true
    }
  ],

  // 버전 관리
  version: string,
  updatedAt: timestamp,
  updatedBy: string,
}
```

---

## Firestore 보안 규칙

### firestore.rules 파일

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // Users Collection
    match /users/{userId} {
      // 본인 데이터만 읽기/쓰기 가능
      allow read, write: if isOwner(userId);

      // 회원가입 시 생성만 허용
      allow create: if isAuthenticated() && request.auth.uid == userId;
    }

    // Insight Sessions Collection
    match /insightSessions/{sessionId} {
      // 생성: 로그인한 사용자만
      allow create: if isAuthenticated()
                    && request.resource.data.userId == request.auth.uid;

      // 읽기/수정: 본인 세션만
      allow read, update: if isAuthenticated()
                          && resource.data.userId == request.auth.uid;

      // 삭제: 불가 (데이터 보존)
      allow delete: if false;
    }

    // Therapy Sessions Collection
    match /therapySessions/{sessionId} {
      allow create: if isAuthenticated()
                    && request.resource.data.userId == request.auth.uid;

      allow read, update: if isAuthenticated()
                          && resource.data.userId == request.auth.uid;

      allow delete: if false;
    }

    // Keystroke Logs Collection
    match /keystrokeLogs/{logId} {
      // 생성: 사용자 동의 확인 (users/{userId}.consents.dataCollection == true)
      allow create: if isAuthenticated()
                    && request.resource.data.userId == request.auth.uid
                    && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.consents.dataCollection == true;

      allow read: if isAuthenticated()
                  && resource.data.userId == request.auth.uid;

      allow update, delete: if false;
    }

    // System Config Collection (관리자만)
    match /systemConfig/{document=**} {
      allow read: if isAuthenticated();  // 모든 인증된 사용자가 읽기 가능
      allow write: if false;             // 관리자 전용 (Firebase Console에서 수동 관리)
    }
  }
}
```

---

## Firestore 인덱스

### firestore.indexes.json 파일

```json
{
  "indexes": [
    {
      "collectionGroup": "therapySessions",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "date", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "insightSessions",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "completedAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "therapySessions",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "profile", "order": "ASCENDING" },
        { "fieldPath": "date", "order": "DESCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
```

**자동 생성 방법**:
Firebase Console에서 복합 쿼리 실행 시 자동으로 인덱스 생성 링크 제공

---

## 주요 쿼리 패턴

### 1. 사용자 최근 세션 조회

```javascript
// 최근 7일간의 Therapy 세션
import { collection, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';

async function getRecentTherapySessions(userId, days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const q = query(
    collection(db, 'therapySessions'),
    where('userId', '==', userId),
    where('date', '>=', Timestamp.fromDate(startDate)),
    orderBy('date', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
```

---

### 2. 가장 최근 Insight 세션 조회

```javascript
async function getLatestInsightSession(userId) {
  const q = query(
    collection(db, 'insightSessions'),
    where('userId', '==', userId),
    orderBy('completedAt', 'desc'),
    limit(1)
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
}
```

---

### 3. 특정 프로파일의 세션 통계

```javascript
async function getProfileStats(userId, profileType) {
  const q = query(
    collection(db, 'therapySessions'),
    where('userId', '==', userId),
    where('profile', '==', profileType),
    orderBy('date', 'desc')
  );

  const snapshot = await getDocs(q);
  const sessions = snapshot.docs.map(doc => doc.data());

  // 통계 계산
  const totalSessions = sessions.length;
  const avgWpm = sessions.reduce((sum, s) => sum + s.summary.avgWpm, 0) / totalSessions;
  const avgAccuracy = sessions.reduce((sum, s) => sum + s.summary.avgAccuracy, 0) / totalSessions;

  return { totalSessions, avgWpm, avgAccuracy };
}
```

---

## 데이터 용량 추정

### MVP 단계 (20명 사용자, 2주)

| Collection | 문서 개수 | 평균 크기 | 총 용량 |
|-----------|----------|----------|---------|
| users | 20 | 2 KB | 40 KB |
| insightSessions | 40 (20명 × 2회) | 15 KB | 600 KB |
| therapySessions | 280 (20명 × 14일) | 8 KB | 2.24 MB |
| keystrokeLogs | 560 (선택적) | 50 KB | 28 MB |
| **총합** | **900** | - | **~31 MB** |

**Firebase 무료 한도**: 1GB 저장소, 50K reads/day → MVP 충분

---

## 프라이버시 및 GDPR 준수

### 1. 데이터 최소화

- 이름, 주소, 전화번호 등 **불필요한 개인정보 미수집**
- 이메일은 Firebase Auth가 관리 (Firestore에 중복 저장 최소화)
- UID로만 식별 (익명화)

---

### 2. 사용자 데이터 다운로드

```javascript
// 사용자 데이터 전체 추출 (JSON)
async function exportUserData(userId) {
  const collections = ['users', 'insightSessions', 'therapySessions', 'keystrokeLogs'];
  const userData = {};

  for (const collectionName of collections) {
    const q = query(
      collection(db, collectionName),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    userData[collectionName] = snapshot.docs.map(doc => doc.data());
  }

  // JSON 파일로 다운로드
  const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `theratype_data_${userId}.json`;
  a.click();
}
```

---

### 3. 사용자 데이터 삭제

```javascript
// 계정 삭제 (모든 데이터 영구 삭제)
async function deleteUserAccount(userId) {
  const collections = ['users', 'insightSessions', 'therapySessions', 'keystrokeLogs'];

  for (const collectionName of collections) {
    const q = query(
      collection(db, collectionName),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);

    const batch = writeBatch(db);
    snapshot.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
  }

  // Firebase Auth 계정 삭제
  await deleteUser(auth.currentUser);

  console.log('User data permanently deleted');
}
```

---

## 백업 전략

### 자동 백업 (Firebase 내장)

1. **Firebase Console** → "Firestore" → "백업"
2. **일일 자동 백업** 설정 (Blaze Plan 필요)
3. **Cloud Storage** 또는 **BigQuery**로 익스포트

### 수동 백업 (MVP 단계)

```bash
# Firebase CLI로 수동 익스포트
firebase firestore:export gs://theratype-mvp-backup/$(date +%Y%m%d)

# 복원
firebase firestore:import gs://theratype-mvp-backup/20250130
```

---

## 마이그레이션 계획 (향후)

### Phase 2: 스케일업 시 고려사항

1. **PostgreSQL 전환** (선택적):
   - 복잡한 관계형 쿼리 필요 시
   - 트랜잭션 무결성 요구 시

2. **데이터 파티셔닝**:
   - 사용자 수 10,000명+ 도달 시
   - 날짜별 또는 지역별 분할

3. **캐싱 레이어**:
   - Redis 추가 (자주 조회되는 통계 데이터)

---

## 다음 단계

1. ✅ 데이터베이스 스키마 설계 완료
2. 다음: **Implementation Lead에게 인계**
   - Firestore 보안 규칙 배포
   - 초기 데이터 (systemConfig/sentences) 입력
   - CRUD 함수 구현 시작

---

**문서 버전**: 1.0
**최종 수정**: 2025-01-30
**작성자**: Technical Architect Agent

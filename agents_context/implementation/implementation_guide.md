# TheraType 핵심 기능 구현 가이드

**목적**: 주요 기능별 상세 구현 방법 및 코드 예시 제공

---

## 🎯 1. 타이핑 이벤트 캡처

### 1.1 기본 키스트로크 로깅

```javascript
// utils/keystrokeLogger.js

/**
 * 키스트로크 데이터 구조
 * @typedef {Object} Keystroke
 * @property {string} key - 입력된 키
 * @property {number} timestamp - 세션 시작 기준 밀리초
 * @property {string} event - 'down' 또는 'up'
 */

class KeystrokeLogger {
  constructor() {
    this.log = [];
    this.startTime = null;
  }

  /**
   * 세션 시작
   */
  start() {
    this.log = [];
    this.startTime = Date.now();
  }

  /**
   * 키 입력 기록
   * @param {string} key - 입력된 키
   * @param {string} event - 'down' 또는 'up'
   */
  record(key, event) {
    if (!this.startTime) {
      this.start();
    }

    this.log.push({
      key: key,
      timestamp: Date.now() - this.startTime,
      event: event
    });
  }

  /**
   * 현재 로그 반환
   * @returns {Keystroke[]}
   */
  getLog() {
    return this.log;
  }

  /**
   * 로그 초기화
   */
  reset() {
    this.log = [];
    this.startTime = null;
  }
}

export default KeystrokeLogger;
```

### 1.2 React 컴포넌트에서 사용

```javascript
// components/common/TypingInput.js

import React, { useState, useRef, useEffect } from 'react';
import KeystrokeLogger from '../../utils/keystrokeLogger';
import styles from './TypingInput.module.css';

const TypingInput = ({ targetSentence, onComplete }) => {
  const [typedText, setTypedText] = useState('');
  const [startTime, setStartTime] = useState(null);
  const loggerRef = useRef(new KeystrokeLogger());
  const inputRef = useRef(null);

  // 컴포넌트 마운트 시 포커스
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e) => {
    // 시작 시간 기록
    if (!startTime) {
      setStartTime(Date.now());
      loggerRef.current.start();
    }

    // 키스트로크 로깅
    loggerRef.current.record(e.key, 'down');

    // Backspace 처리
    if (e.key === 'Backspace') {
      // 로깅만, 실제 삭제는 onChange에서 처리됨
    }
  };

  const handleKeyUp = (e) => {
    loggerRef.current.record(e.key, 'up');
  };

  const handleChange = (e) => {
    const newText = e.target.value;
    setTypedText(newText);

    // 완료 체크
    if (newText === targetSentence) {
      const timeMs = Date.now() - startTime;
      const keystrokeLog = loggerRef.current.getLog();

      onComplete({
        timeMs,
        keystrokeLog,
        targetSentence,
        typedText: newText
      });
    }
  };

  /**
   * 글자별 색상 표시 (정확도 피드백)
   */
  const renderHighlightedText = () => {
    const targetChars = targetSentence.split('');
    const typedChars = typedText.split('');

    return targetChars.map((char, index) => {
      let className = styles.char;

      if (index < typedChars.length) {
        if (typedChars[index] === char) {
          className += ` ${styles.correct}`;
        } else {
          className += ` ${styles.incorrect}`;
        }
      }

      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className={styles.container}>
      {/* 제시 문장 */}
      <div className={styles.targetSentence}>
        {renderHighlightedText()}
      </div>

      {/* 입력 필드 */}
      <input
        ref={inputRef}
        type="text"
        value={typedText}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        className={styles.input}
        placeholder="여기에 타이핑하세요..."
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />

      {/* 진행도 표시 */}
      <div className={styles.progress}>
        {typedText.length} / {targetSentence.length} 글자
      </div>
    </div>
  );
};

export default TypingInput;
```

### 1.3 CSS 스타일

```css
/* TypingInput.module.css */

.container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  background-color: var(--color-background-alt);
  border-radius: var(--radius-lg);
}

.targetSentence {
  font-size: 24px;
  line-height: 1.6;
  padding: 16px;
  background-color: white;
  border-radius: var(--radius-md);
  min-height: 80px;
}

.char {
  color: var(--color-text-light);
}

.correct {
  color: var(--color-secondary);
  font-weight: 600;
}

.incorrect {
  color: var(--color-danger);
  font-weight: 600;
  text-decoration: underline;
}

.input {
  width: 100%;
  padding: 16px;
  font-size: 18px;
  border: 2px solid var(--color-primary);
  border-radius: var(--radius-md);
  outline: none;
  transition: border-color 0.2s;
}

.input:focus {
  border-color: var(--color-primary-dark);
}

.progress {
  text-align: right;
  font-size: 14px;
  color: var(--color-text-light);
}
```

---

## 📊 2. WPM 및 정확도 계산

### 2.1 타이핑 분석 유틸리티

```javascript
// utils/typingAnalyzer.js

/**
 * WPM (Words Per Minute) 계산
 * 한글의 경우 글자 수 / 5를 단어로 간주
 *
 * @param {string} text - 입력된 텍스트
 * @param {number} timeMs - 소요 시간 (밀리초)
 * @returns {number} WPM
 */
export const calculateWPM = (text, timeMs) => {
  if (!text || timeMs <= 0) return 0;

  const characters = text.trim().length;
  const words = characters / 5; // 한글 기준
  const minutes = timeMs / 60000; // 밀리초 → 분

  const wpm = Math.round(words / minutes);

  // 비정상적으로 높은 값 방지 (복붙 감지)
  return wpm > 300 ? 0 : wpm;
};

/**
 * 타이핑 정확도 계산 (Levenshtein Distance 간소화 버전)
 *
 * @param {string} targetText - 목표 텍스트
 * @param {string} typedText - 입력된 텍스트
 * @returns {number} 정확도 (0-100)
 */
export const calculateAccuracy = (targetText, typedText) => {
  if (!targetText) return 0;
  if (targetText === typedText) return 100;

  const targetChars = targetText.split('');
  const typedChars = typedText.split('');

  let correctCount = 0;
  const maxLength = Math.max(targetChars.length, typedChars.length);

  for (let i = 0; i < targetChars.length; i++) {
    if (targetChars[i] === typedChars[i]) {
      correctCount++;
    }
  }

  // 길이 차이 페널티 (너무 짧거나 길면 정확도 감소)
  const lengthPenalty = Math.abs(targetChars.length - typedChars.length);
  const adjustedCorrect = Math.max(0, correctCount - lengthPenalty);

  const accuracy = (adjustedCorrect / targetChars.length) * 100;
  return Math.round(Math.max(0, accuracy));
};

/**
 * 에러 위치 추출
 *
 * @param {string} targetText - 목표 텍스트
 * @param {string} typedText - 입력된 텍스트
 * @returns {number[]} 에러 인덱스 배열
 */
export const getErrorPositions = (targetText, typedText) => {
  const targetChars = targetText.split('');
  const typedChars = typedText.split('');
  const errors = [];

  for (let i = 0; i < targetChars.length; i++) {
    if (targetChars[i] !== typedChars[i]) {
      errors.push(i);
    }
  }

  return errors;
};

/**
 * 백스페이스 사용 횟수 계산
 *
 * @param {Keystroke[]} keystrokeLog - 키스트로크 로그
 * @returns {number} 백스페이스 횟수
 */
export const countBackspaces = (keystrokeLog) => {
  return keystrokeLog.filter(k => k.key === 'Backspace' && k.event === 'down').length;
};

/**
 * 타이핑 망설임 패턴 분석
 * 2초 이상 멈춤을 "망설임"으로 판단
 *
 * @param {Keystroke[]} keystrokeLog - 키스트로크 로그
 * @returns {number} 망설임 횟수
 */
export const analyzeHesitations = (keystrokeLog) => {
  let hesitations = 0;
  const threshold = 2000; // 2초

  for (let i = 1; i < keystrokeLog.length; i++) {
    const timeDiff = keystrokeLog[i].timestamp - keystrokeLog[i - 1].timestamp;

    if (timeDiff > threshold) {
      hesitations++;
    }
  }

  return hesitations;
};

/**
 * 타이핑 리듬 분석 (표준편차)
 * 리듬이 일정할수록 편차가 작음
 *
 * @param {Keystroke[]} keystrokeLog - 키스트로크 로그
 * @returns {number} 표준편차 (낮을수록 일정)
 */
export const analyzeRhythm = (keystrokeLog) => {
  if (keystrokeLog.length < 2) return 0;

  // 키 간 간격 계산
  const intervals = [];
  for (let i = 1; i < keystrokeLog.length; i++) {
    const interval = keystrokeLog[i].timestamp - keystrokeLog[i - 1].timestamp;
    intervals.push(interval);
  }

  // 평균 계산
  const mean = intervals.reduce((sum, val) => sum + val, 0) / intervals.length;

  // 표준편차 계산
  const variance = intervals.reduce((sum, val) => {
    return sum + Math.pow(val - mean, 2);
  }, 0) / intervals.length;

  return Math.sqrt(variance);
};

/**
 * 종합 타이핑 분석 결과 생성
 *
 * @param {Object} params
 * @param {string} params.targetSentence - 목표 문장
 * @param {string} params.typedText - 입력된 텍스트
 * @param {number} params.timeMs - 소요 시간
 * @param {Keystroke[]} params.keystrokeLog - 키스트로크 로그
 * @returns {Object} 분석 결과
 */
export const analyzeTypingSession = ({
  targetSentence,
  typedText,
  timeMs,
  keystrokeLog
}) => {
  return {
    wpm: calculateWPM(targetSentence, timeMs),
    accuracy: calculateAccuracy(targetSentence, typedText),
    timeMs: timeMs,
    errorCount: getErrorPositions(targetSentence, typedText).length,
    backspaceCount: countBackspaces(keystrokeLog),
    hesitations: analyzeHesitations(keystrokeLog),
    rhythmStdDev: analyzeRhythm(keystrokeLog),
    completedAt: new Date()
  };
};
```

### 2.2 사용 예시

```javascript
// InsightMode.js 또는 TherapyMode.js

import { analyzeTypingSession } from '../utils/typingAnalyzer';

const handleTypingComplete = (data) => {
  const analysis = analyzeTypingSession({
    targetSentence: currentSentence.text,
    typedText: data.typedText,
    timeMs: data.timeMs,
    keystrokeLog: data.keystrokeLog
  });

  console.log('타이핑 분석 결과:', analysis);
  /*
  {
    wpm: 42,
    accuracy: 98,
    timeMs: 12000,
    errorCount: 1,
    backspaceCount: 3,
    hesitations: 1,
    rhythmStdDev: 156.7,
    completedAt: Date
  }
  */

  // Firebase에 저장
  saveTypingData(analysis);
};
```

---

## 🧠 3. 프로파일 점수 계산 및 매칭

### 3.1 Insight Mode 점수 계산

```javascript
// utils/profileCalculator.js

/**
 * Insight Mode 선택 결과를 기반으로 카테고리별 점수 계산
 *
 * @param {Array} selections - 선택 데이터 배열
 * @returns {Object} 카테고리별 점수 (0-100)
 */
export const calculateProfileScores = (selections) => {
  const categories = {
    self_perception: [],
    stress_response: [],
    social_energy: [],
    emotion_regulation: [],
    future_orientation: []
  };

  // 카테고리별 선택 그룹화
  selections.forEach(selection => {
    if (categories[selection.category]) {
      categories[selection.category].push(selection.selected);
    }
  });

  // 카테고리별 점수 계산
  const scores = {};

  Object.keys(categories).forEach(category => {
    const categorySelections = categories[category];

    if (categorySelections.length === 0) {
      scores[category] = 0;
      return;
    }

    // 'A' 선택 = 긍정적, 'B' 선택 = 부정적
    const positiveCount = categorySelections.filter(s => s === 'A').length;
    const total = categorySelections.length;

    // 점수: 긍정적 비율 (0-100)
    scores[category] = Math.round((positiveCount / total) * 100);
  });

  return scores;
};

/**
 * 점수를 기반으로 프로파일 할당
 *
 * @param {Object} scores - 카테고리별 점수
 * @returns {string} 할당된 프로파일
 */
export const assignProfile = (scores) => {
  // 가장 낮은 점수의 카테고리 찾기
  const lowestCategory = Object.keys(scores).reduce((a, b) =>
    scores[a] < scores[b] ? a : b
  );

  const lowestScore = scores[lowestCategory];

  // 프로파일 매핑
  const profileMap = {
    self_perception: 'self_esteem',       // 자존감 향상형
    stress_response: 'stress_management', // 스트레스 관리형
    social_energy: 'balanced',            // 균형형 (치료 불필요)
    emotion_regulation: 'emotion_control',// 감정조절형
    future_orientation: 'motivation'      // 동기부여형
  };

  // 모든 점수가 70 이상이면 균형형
  const allScoresHigh = Object.values(scores).every(score => score >= 70);
  if (allScoresHigh) {
    return 'balanced';
  }

  return profileMap[lowestCategory] || 'balanced';
};

/**
 * 프로파일 설명 생성
 *
 * @param {string} profile - 프로파일 타입
 * @param {Object} scores - 카테고리별 점수
 * @returns {Object} 프로파일 정보
 */
export const getProfileDescription = (profile, scores) => {
  const descriptions = {
    self_esteem: {
      title: '자존감 향상형',
      description: '자신에 대한 긍정적 인식을 강화하는 연습이 필요해요.',
      focus: '자기 수용, 자기 긍정, 가치 인정',
      color: '#f59e0b' // 주황색
    },
    stress_management: {
      title: '스트레스 관리형',
      description: '스트레스 대응 능력을 키우는 연습이 필요해요.',
      focus: '스트레스 완화, 회복 탄력성, 대처 전략',
      color: '#3b82f6' // 파란색
    },
    emotion_control: {
      title: '감정조절형',
      description: '감정을 이해하고 조절하는 연습이 필요해요.',
      focus: '감정 인식, 수용, 조절 전략',
      color: '#8b5cf6' // 보라색
    },
    motivation: {
      title: '동기부여형',
      description: '미래에 대한 긍정적 관점을 키우는 연습이 필요해요.',
      focus: '목표 설정, 성장 마인드셋, 희망',
      color: '#10b981' // 초록색
    },
    balanced: {
      title: '균형형',
      description: '전반적으로 잘 유지하고 있어요. 지속적인 관리가 중요해요.',
      focus: '현재 상태 유지, 일상적 돌봄',
      color: '#6b7280' // 회색
    }
  };

  return descriptions[profile] || descriptions.balanced;
};

/**
 * 인사이트 메시지 생성
 *
 * @param {Object} scores - 카테고리별 점수
 * @returns {string[]} 인사이트 메시지 배열
 */
export const generateInsights = (scores) => {
  const insights = [];

  // 강점 찾기 (70점 이상)
  const strengths = Object.entries(scores)
    .filter(([_, score]) => score >= 70)
    .map(([category, _]) => category);

  // 개선 영역 찾기 (50점 미만)
  const improvements = Object.entries(scores)
    .filter(([_, score]) => score < 50)
    .map(([category, _]) => category);

  // 강점 메시지
  if (strengths.length > 0) {
    const categoryNames = {
      self_perception: '자기인식',
      stress_response: '스트레스 대응',
      social_energy: '사회적 에너지',
      emotion_regulation: '감정 조절',
      future_orientation: '미래 지향성'
    };

    const strengthName = categoryNames[strengths[0]];
    insights.push(`💪 ${strengthName} 영역이 강점이에요!`);
  }

  // 개선 메시지
  if (improvements.length > 0) {
    const categoryNames = {
      self_perception: '자기인식',
      stress_response: '스트레스 대응',
      social_energy: '사회적 에너지',
      emotion_regulation: '감정 조절',
      future_orientation: '미래 지향성'
    };

    const improvementName = categoryNames[improvements[0]];
    insights.push(`🎯 ${improvementName} 영역에 집중하면 도움이 될 거예요`);
  }

  // 균형 메시지
  const avgScore = Object.values(scores).reduce((sum, s) => sum + s, 0) / Object.keys(scores).length;
  if (avgScore >= 60) {
    insights.push('✨ 전반적으로 균형 잡힌 상태를 유지하고 있어요');
  }

  return insights;
};
```

### 3.2 사용 예시

```javascript
// pages/InsightMode.js

import {
  calculateProfileScores,
  assignProfile,
  getProfileDescription,
  generateInsights
} from '../utils/profileCalculator';

const InsightMode = () => {
  const [selections, setSelections] = useState([]);
  const [result, setResult] = useState(null);

  const handleAllSelectionsComplete = () => {
    // 점수 계산
    const scores = calculateProfileScores(selections);

    // 프로파일 할당
    const profile = assignProfile(scores);

    // 프로파일 설명
    const description = getProfileDescription(profile, scores);

    // 인사이트 생성
    const insights = generateInsights(scores);

    // 결과 저장
    const result = {
      scores,
      profile,
      description,
      insights,
      completedAt: new Date()
    };

    setResult(result);

    // Firebase 저장
    saveInsightSession(result);

    // Context 업데이트
    setUserProfile(result);
  };

  // ... 렌더링
};
```

---

## 💾 4. Firebase 데이터 저장 전략

### 4.1 세션 데이터 저장

```javascript
// utils/firebaseHelpers.js

import { db } from '../firebase/config';
import { collection, addDoc, updateDoc, doc, arrayUnion } from 'firebase/firestore';

/**
 * Insight Session 저장
 *
 * @param {string} userId - 사용자 ID
 * @param {Object} sessionData - 세션 데이터
 * @returns {Promise<Object>} 저장 결과
 */
export const saveInsightSession = async (userId, sessionData) => {
  try {
    const docRef = await addDoc(collection(db, 'insightSessions'), {
      userId: userId,
      completedAt: new Date(),
      selections: sessionData.selections,
      profileScores: sessionData.scores,
      assignedProfile: sessionData.profile
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Insight Session 저장 실패:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Therapy Session 시작 (문서 생성)
 *
 * @param {string} userId - 사용자 ID
 * @param {string} profile - 프로파일 타입
 * @returns {Promise<Object>} 저장 결과 (세션 ID 포함)
 */
export const startTherapySession = async (userId, profile) => {
  try {
    const docRef = await addDoc(collection(db, 'therapySessions'), {
      userId: userId,
      profile: profile,
      date: new Date(),
      sentences: [],
      totalDuration: 0
    });

    return { success: true, sessionId: docRef.id };
  } catch (error) {
    console.error('Therapy Session 시작 실패:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Therapy Session에 문장 결과 추가
 *
 * @param {string} sessionId - 세션 ID
 * @param {Object} sentenceData - 문장 타이핑 데이터
 * @returns {Promise<Object>} 저장 결과
 */
export const addSentenceToSession = async (sessionId, sentenceData) => {
  try {
    const sessionRef = doc(db, 'therapySessions', sessionId);

    await updateDoc(sessionRef, {
      sentences: arrayUnion(sentenceData)
    });

    return { success: true };
  } catch (error) {
    console.error('문장 결과 추가 실패:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Therapy Session 완료 (총 시간 업데이트)
 *
 * @param {string} sessionId - 세션 ID
 * @param {number} totalDuration - 총 소요 시간 (ms)
 * @returns {Promise<Object>} 저장 결과
 */
export const completeTherapySession = async (sessionId, totalDuration) => {
  try {
    const sessionRef = doc(db, 'therapySessions', sessionId);

    await updateDoc(sessionRef, {
      totalDuration: totalDuration,
      completedAt: new Date()
    });

    return { success: true };
  } catch (error) {
    console.error('Therapy Session 완료 실패:', error);
    return { success: false, error: error.message };
  }
};
```

### 4.2 로컬 스토리지 vs Firebase 전략

```javascript
// utils/storageStrategy.js

/**
 * 로컬 스토리지에 임시 저장 (오프라인 지원)
 */
export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('LocalStorage 저장 실패:', error);
    return false;
  }
};

/**
 * 로컬 스토리지에서 불러오기
 */
export const loadFromLocalStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('LocalStorage 불러오기 실패:', error);
    return null;
  }
};

/**
 * 로컬 데이터를 Firebase에 동기화
 */
export const syncToFirebase = async (userId) => {
  // 로컬에 저장된 미동기화 데이터 확인
  const pendingSessions = loadFromLocalStorage('pending_sessions') || [];

  if (pendingSessions.length === 0) return;

  // Firebase에 순차 저장
  for (const session of pendingSessions) {
    const result = await saveTherapySession(userId, session);

    if (result.success) {
      // 성공 시 로컬에서 제거
      const remaining = pendingSessions.filter(s => s.id !== session.id);
      saveToLocalStorage('pending_sessions', remaining);
    }
  }
};

/**
 * 전략: 즉시 Firebase 저장 시도, 실패 시 로컬 저장
 */
export const saveWithFallback = async (userId, data, saveFunction) => {
  // Firebase 저장 시도
  const result = await saveFunction(userId, data);

  if (result.success) {
    return result;
  }

  // 실패 시 로컬 저장
  const pendingSessions = loadFromLocalStorage('pending_sessions') || [];
  pendingSessions.push({ ...data, id: Date.now(), userId });
  saveToLocalStorage('pending_sessions', pendingSessions);

  return { success: true, local: true };
};
```

---

## 📈 5. 대시보드 데이터 집계

### 5.1 최근 세션 조회

```javascript
// utils/dashboardData.js

import { db } from '../firebase/config';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

/**
 * 최근 7일 Therapy 세션 조회
 *
 * @param {string} userId - 사용자 ID
 * @returns {Promise<Array>} 세션 배열
 */
export const getRecentTherapySessions = async (userId) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const q = query(
      collection(db, 'therapySessions'),
      where('userId', '==', userId),
      where('date', '>=', sevenDaysAgo),
      orderBy('date', 'asc')
    );

    const snapshot = await getDocs(q);
    const sessions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate() // Timestamp → Date
    }));

    return sessions;
  } catch (error) {
    console.error('세션 조회 실패:', error);
    return [];
  }
};

/**
 * 최신 Insight 프로파일 조회
 *
 * @param {string} userId - 사용자 ID
 * @returns {Promise<Object|null>} 프로파일 데이터
 */
export const getLatestInsightProfile = async (userId) => {
  try {
    const q = query(
      collection(db, 'insightSessions'),
      where('userId', '==', userId),
      orderBy('completedAt', 'desc'),
      limit(1)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
      completedAt: doc.data().completedAt.toDate()
    };
  } catch (error) {
    console.error('프로파일 조회 실패:', error);
    return null;
  }
};

/**
 * 연속 사용 일수 (Streak) 계산
 *
 * @param {string} userId - 사용자 ID
 * @returns {Promise<number>} 연속 일수
 */
export const calculateStreak = async (userId) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const q = query(
      collection(db, 'therapySessions'),
      where('userId', '==', userId),
      where('date', '>=', thirtyDaysAgo),
      orderBy('date', 'desc')
    );

    const snapshot = await getDocs(q);
    const sessions = snapshot.docs.map(doc => doc.data().date.toDate());

    if (sessions.length === 0) return 0;

    // 날짜별로 그룹화 (같은 날 여러 세션 가능)
    const uniqueDates = [...new Set(sessions.map(date =>
      date.toDateString()
    ))];

    // 연속성 확인
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const dateString of uniqueDates) {
      const sessionDate = new Date(dateString);
      const daysDiff = Math.floor(
        (currentDate - sessionDate) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff === streak) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  } catch (error) {
    console.error('Streak 계산 실패:', error);
    return 0;
  }
};

/**
 * 마스터한 문장 수 계산
 * 기준: 3회 이상 연습 && 평균 정확도 95% 이상
 *
 * @param {Array} sessions - 세션 배열
 * @returns {number} 마스터한 문장 수
 */
export const countMasteredSentences = (sessions) => {
  const sentenceStats = {};

  // 문장별 시도 기록 집계
  sessions.forEach(session => {
    session.sentences.forEach(sentence => {
      if (!sentenceStats[sentence.sentenceId]) {
        sentenceStats[sentence.sentenceId] = {
          attempts: 0,
          totalAccuracy: 0
        };
      }

      sentenceStats[sentence.sentenceId].attempts++;
      sentenceStats[sentence.sentenceId].totalAccuracy += sentence.accuracy;
    });
  });

  // 마스터 기준 충족 여부 확인
  let masteredCount = 0;

  Object.values(sentenceStats).forEach(stats => {
    const avgAccuracy = stats.totalAccuracy / stats.attempts;

    if (stats.attempts >= 3 && avgAccuracy >= 95) {
      masteredCount++;
    }
  });

  return masteredCount;
};

/**
 * 대시보드 종합 데이터 조회
 *
 * @param {string} userId - 사용자 ID
 * @returns {Promise<Object>} 대시보드 데이터
 */
export const getDashboardData = async (userId) => {
  try {
    // 병렬 조회
    const [therapySessions, insightProfile] = await Promise.all([
      getRecentTherapySessions(userId),
      getLatestInsightProfile(userId)
    ]);

    const streak = await calculateStreak(userId);
    const masteredCount = countMasteredSentences(therapySessions);

    // WPM 추이 데이터
    const wpmTrend = therapySessions.map(session => {
      const avgWpm = session.sentences.reduce(
        (sum, s) => sum + s.wpm, 0
      ) / (session.sentences.length || 1);

      return {
        date: session.date.toLocaleDateString('ko-KR', {
          month: 'short',
          day: 'numeric'
        }),
        wpm: Math.round(avgWpm)
      };
    });

    return {
      therapySessions,
      insightProfile,
      streak,
      masteredCount,
      wpmTrend,
      totalSessions: therapySessions.length
    };
  } catch (error) {
    console.error('대시보드 데이터 조회 실패:', error);
    return null;
  }
};
```

### 5.2 대시보드 컴포넌트에서 사용

```javascript
// pages/Dashboard.js

import React, { useState, useEffect } from 'react';
import { getDashboardData } from '../utils/dashboardData';
import { useAuth } from '../contexts/UserContext';
import SpeedChart from '../components/dashboard/SpeedChart';
import ProfileRadar from '../components/dashboard/ProfileRadar';
import StatCard from '../components/dashboard/StatCard';
import Loading from '../components/common/Loading';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const dashboardData = await getDashboardData(currentUser.uid);
      setData(dashboardData);
      setLoading(false);
    };

    fetchData();
  }, [currentUser.uid]);

  if (loading) return <Loading />;

  if (!data) {
    return (
      <div className="error-container">
        <p>데이터를 불러오지 못했습니다.</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h1>대시보드</h1>

      {/* 통계 카드 */}
      <div className="stats-grid">
        <StatCard
          icon="🔥"
          title="연속 사용"
          value={`${data.streak}일`}
          trend="up"
        />
        <StatCard
          icon="⭐"
          title="마스터한 문장"
          value={`${data.masteredCount}개`}
        />
        <StatCard
          icon="📊"
          title="총 세션"
          value={`${data.totalSessions}회`}
        />
      </div>

      {/* 타이핑 속도 추이 */}
      <div className="chart-section">
        <h2>타이핑 속도 추이</h2>
        <SpeedChart data={data.wpmTrend} />
      </div>

      {/* 프로파일 레이더 차트 */}
      {data.insightProfile && (
        <div className="chart-section">
          <h2>나의 프로파일</h2>
          <ProfileRadar scores={data.insightProfile.profileScores} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
```

---

**문서 버전**: 1.0
**최종 수정**: 2025-01-30
**작성자**: Implementation Lead
**다음 문서**: testing_plan.md

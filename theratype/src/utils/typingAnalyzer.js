/**
 * 타이핑 분석 유틸리티
 *
 * @description WPM, 정확도, 망설임 패턴 등을 분석하는 함수들
 */

/**
 * WPM (Words Per Minute) 계산
 * 한글 기준: 글자 수 / 5를 단어로 간주
 *
 * @param {number} charCount - 타이핑한 글자 수
 * @param {number} timeMs - 경과 시간 (밀리초)
 * @returns {number} WPM 값 (소수점 첫째 자리)
 */
export const calculateWPM = (charCount, timeMs) => {
  if (timeMs === 0) return 0;
  const minutes = timeMs / 60000; // ms to minutes
  const words = charCount / 5; // 한글 기준
  return Math.round((words / minutes) * 10) / 10;
};

/**
 * 정확도 계산 (간소화된 Levenshtein)
 *
 * @param {string} target - 목표 문장
 * @param {string} typed - 타이핑한 문장
 * @returns {number} 정확도 (0-100%)
 */
export const calculateAccuracy = (target, typed) => {
  if (!target || target.length === 0) return 100;

  const targetLen = target.length;
  const typedLen = typed.length;
  const maxLen = Math.max(targetLen, typedLen);

  let matches = 0;
  const minLen = Math.min(targetLen, typedLen);

  // 글자별 비교 (위치 기반)
  for (let i = 0; i < minLen; i++) {
    if (target[i] === typed[i]) {
      matches++;
    }
  }

  const accuracy = (matches / targetLen) * 100;
  return Math.round(accuracy * 10) / 10; // 소수점 첫째 자리
};

/**
 * 실시간 정확도 피드백 (글자별 상태)
 *
 * @param {string} target - 목표 문장
 * @param {string} typed - 타이핑한 문장
 * @returns {Array} 각 글자의 상태 배열 ['correct', 'incorrect', 'pending']
 */
export const getCharacterFeedback = (target, typed) => {
  const feedback = [];

  for (let i = 0; i < target.length; i++) {
    if (i >= typed.length) {
      feedback.push('pending'); // 아직 입력 안 함
    } else if (target[i] === typed[i]) {
      feedback.push('correct'); // 정확함
    } else {
      feedback.push('incorrect'); // 틀림
    }
  }

  return feedback;
};

/**
 * 망설임 패턴 분석
 * 2초 이상 멈춘 구간을 망설임으로 간주
 *
 * @param {Array} keystrokeLogs - 키스트로크 로그 배열
 *   예: [{ timestamp: 1234567890, key: 'a' }, ...]
 * @returns {Object} { hesitationCount, avgHesitationTime, totalPauseTime }
 */
export const analyzeHesitation = (keystrokeLogs) => {
  if (!keystrokeLogs || keystrokeLogs.length < 2) {
    return {
      hesitationCount: 0,
      avgHesitationTime: 0,
      totalPauseTime: 0,
    };
  }

  const HESITATION_THRESHOLD = 2000; // 2초
  let hesitationCount = 0;
  let totalPauseTime = 0;

  for (let i = 1; i < keystrokeLogs.length; i++) {
    const timeDiff = keystrokeLogs[i].timestamp - keystrokeLogs[i - 1].timestamp;

    if (timeDiff >= HESITATION_THRESHOLD) {
      hesitationCount++;
      totalPauseTime += timeDiff;
    }
  }

  const avgHesitationTime = hesitationCount > 0
    ? Math.round(totalPauseTime / hesitationCount)
    : 0;

  return {
    hesitationCount,
    avgHesitationTime,
    totalPauseTime,
  };
};

/**
 * 타이핑 리듬 분석 (일관성)
 * 키 간격의 표준편차를 계산하여 리듬의 일관성 평가
 *
 * @param {Array} keystrokeLogs - 키스트로크 로그 배열
 * @returns {Object} { rhythm, consistency }
 *   - rhythm: 평균 키 간격 (ms)
 *   - consistency: 일관성 점수 (0-100, 높을수록 일관적)
 */
export const analyzeTypingRhythm = (keystrokeLogs) => {
  if (!keystrokeLogs || keystrokeLogs.length < 3) {
    return { rhythm: 0, consistency: 0 };
  }

  // 키 간격 배열 계산
  const intervals = [];
  for (let i = 1; i < keystrokeLogs.length; i++) {
    const interval = keystrokeLogs[i].timestamp - keystrokeLogs[i - 1].timestamp;
    // 이상치 제거 (10초 이상은 제외)
    if (interval < 10000) {
      intervals.push(interval);
    }
  }

  if (intervals.length === 0) {
    return { rhythm: 0, consistency: 0 };
  }

  // 평균 계산
  const avgInterval = intervals.reduce((sum, val) => sum + val, 0) / intervals.length;

  // 표준편차 계산
  const variance = intervals.reduce((sum, val) => {
    return sum + Math.pow(val - avgInterval, 2);
  }, 0) / intervals.length;
  const stdDev = Math.sqrt(variance);

  // 일관성 점수: 표준편차가 작을수록 높은 점수
  // 표준편차가 평균의 50% 이하면 일관적으로 간주
  const consistency = Math.max(0, Math.min(100, 100 - (stdDev / avgInterval) * 100));

  return {
    rhythm: Math.round(avgInterval),
    consistency: Math.round(consistency * 10) / 10,
  };
};

/**
 * 비정상 WPM 감지 (복붙 방지)
 *
 * @param {number} wpm - 계산된 WPM
 * @param {Array} keystrokeLogs - 키스트로크 로그 배열
 * @returns {boolean} true면 비정상, false면 정상
 */
export const detectAbnormalWPM = (wpm, keystrokeLogs) => {
  // 한국인 평균 타이핑 속도: 200-300 타/분 → 40-60 WPM
  // 전문가: 400-500 타/분 → 80-100 WPM
  const MAX_REASONABLE_WPM = 150; // 과도하게 빠른 경우

  if (wpm > MAX_REASONABLE_WPM) {
    return true; // 복붙 의심
  }

  // 모든 키 간격이 50ms 미만이면 복붙 의심
  if (keystrokeLogs && keystrokeLogs.length > 2) {
    const allTooFast = keystrokeLogs.every((log, i) => {
      if (i === 0) return true;
      return log.timestamp - keystrokeLogs[i - 1].timestamp < 50;
    });

    if (allTooFast) {
      return true;
    }
  }

  return false;
};

/**
 * 세션 요약 통계 생성
 *
 * @param {Object} sessionData - 세션 데이터
 *   { target, typed, startTime, endTime, keystrokeLogs }
 * @returns {Object} 세션 요약 통계
 */
export const generateSessionSummary = (sessionData) => {
  const { target, typed, startTime, endTime, keystrokeLogs } = sessionData;

  const timeMs = endTime - startTime;
  const charCount = typed.length;

  const wpm = calculateWPM(charCount, timeMs);
  const accuracy = calculateAccuracy(target, typed);
  const hesitation = analyzeHesitation(keystrokeLogs);
  const rhythm = analyzeTypingRhythm(keystrokeLogs);
  const isAbnormal = detectAbnormalWPM(wpm, keystrokeLogs);

  return {
    wpm,
    accuracy,
    timeMs,
    charCount,
    hesitationCount: hesitation.hesitationCount,
    avgHesitationTime: hesitation.avgHesitationTime,
    rhythm: rhythm.rhythm,
    consistency: rhythm.consistency,
    isAbnormal,
    completedAt: new Date(endTime).toISOString(),
  };
};

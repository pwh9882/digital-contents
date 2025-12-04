/**
 * 타이핑 분석 유틸리티
 *
 * @description WPM, 정확도, 망설임 패턴 등을 분석하는 함수들
 * 한글 조합 특성을 고려한 정확도 계산 및 타/분 속도 측정
 */

// ============================================
// 한글 자모 관련 상수 및 유틸리티
// ============================================

// 초성 19개
const CHOSEONG = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
// 중성 21개
const JUNGSEONG = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
// 종성 28개 (첫 번째는 종성 없음)
const JONGSEONG = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

// 호환용 자모 → 초성 인덱스 매핑 (ㄱ=U+3131 시작)
const COMPAT_JAMO_TO_CHOSEONG = {
  'ㄱ': 0, 'ㄲ': 1, 'ㄴ': 2, 'ㄷ': 3, 'ㄸ': 4, 'ㄹ': 5, 'ㅁ': 6, 'ㅂ': 7, 'ㅃ': 8,
  'ㅅ': 9, 'ㅆ': 10, 'ㅇ': 11, 'ㅈ': 12, 'ㅉ': 13, 'ㅊ': 14, 'ㅋ': 15, 'ㅌ': 16, 'ㅍ': 17, 'ㅎ': 18
};

// 복합 모음 → 구성 요소 매핑 (IME 입력 순서)
const COMPOUND_JUNGSEONG = {
  'ㅘ': ['ㅗ', 'ㅏ'],
  'ㅙ': ['ㅗ', 'ㅐ'],
  'ㅚ': ['ㅗ', 'ㅣ'],
  'ㅝ': ['ㅜ', 'ㅓ'],
  'ㅞ': ['ㅜ', 'ㅔ'],
  'ㅟ': ['ㅜ', 'ㅣ'],
  'ㅢ': ['ㅡ', 'ㅣ'],
};

// 복합 받침 → 구성 요소 매핑 (IME 입력 순서)
const COMPOUND_JONGSEONG = {
  'ㄳ': ['ㄱ', 'ㅅ'],
  'ㄵ': ['ㄴ', 'ㅈ'],
  'ㄶ': ['ㄴ', 'ㅎ'],
  'ㄺ': ['ㄹ', 'ㄱ'],
  'ㄻ': ['ㄹ', 'ㅁ'],
  'ㄼ': ['ㄹ', 'ㅂ'],
  'ㄽ': ['ㄹ', 'ㅅ'],
  'ㄾ': ['ㄹ', 'ㅌ'],
  'ㄿ': ['ㄹ', 'ㅍ'],
  'ㅀ': ['ㄹ', 'ㅎ'],
  'ㅄ': ['ㅂ', 'ㅅ'],
};

/**
 * 완성형 한글인지 확인
 */
const isCompleteHangul = (char) => {
  const code = char.charCodeAt(0);
  return code >= 0xAC00 && code <= 0xD7A3;
};

/**
 * 호환용 자모(ㄱㄴㄷ...)인지 확인
 */
const isCompatJamo = (char) => {
  const code = char.charCodeAt(0);
  return code >= 0x3131 && code <= 0x3163;
};

// 자음/모음 구분 함수 (향후 확장용으로 유지)
// const isCompatConsonant = (char) => {
//   const code = char.charCodeAt(0);
//   return code >= 0x3131 && code <= 0x314E;
// };
// const isCompatVowel = (char) => {
//   const code = char.charCodeAt(0);
//   return code >= 0x314F && code <= 0x3163;
// };

/**
 * 완성형 한글을 자모 배열로 분해
 * @param {string} char - 한글 글자 1개
 * @returns {string[]} 자모 배열 (예: "안" → ["ㅇ", "ㅏ", "ㄴ"])
 */
export const decomposeHangul = (char) => {
  if (!char || char.length === 0) return [];

  const code = char.charCodeAt(0);

  // 완성형 한글 (가~힣)
  if (isCompleteHangul(char)) {
    const syllableIndex = code - 0xAC00;
    const choseongIndex = Math.floor(syllableIndex / 588);
    const jungseongIndex = Math.floor((syllableIndex % 588) / 28);
    const jongseongIndex = syllableIndex % 28;

    const result = [CHOSEONG[choseongIndex], JUNGSEONG[jungseongIndex]];
    if (jongseongIndex > 0) {
      result.push(JONGSEONG[jongseongIndex]);
    }
    return result;
  }

  // 호환용 자모 (ㄱ, ㅏ 등 단독 자모)
  if (isCompatJamo(char)) {
    return [char];
  }

  // 그 외 문자는 그대로 반환
  return [char];
};

/**
 * 텍스트의 총 자모 수 계산 (타수 기준)
 * @param {string} text - 텍스트
 * @returns {number} 자모 수
 */
export const countJamo = (text) => {
  if (!text) return 0;

  let count = 0;
  for (const char of text) {
    const jamo = decomposeHangul(char);
    count += jamo.length;
  }
  return count;
};

/**
 * 타/분 (타수/분) 계산 - 한국식 타이핑 속도
 * @param {string} text - 타이핑한 텍스트
 * @param {number} timeMs - 경과 시간 (밀리초)
 * @returns {number} 타/분 값 (정수)
 */
export const calculateTypingSpeed = (text, timeMs) => {
  if (timeMs === 0) return 0;
  const jamoCount = countJamo(text);
  const minutes = timeMs / 60000;
  return Math.round(jamoCount / minutes);
};

/**
 * WPM (Words Per Minute) 계산 - 영어 기준 (하위 호환성 유지)
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
 * 자모 배열을 IME 입력 순서대로 완전히 분해
 * 복합 모음/받침을 구성 요소로 분해
 * 예: [ㅁ, ㅝ] → [ㅁ, ㅜ, ㅓ]
 * 예: [ㅅ, ㅏ, ㄻ] → [ㅅ, ㅏ, ㄹ, ㅁ]
 * @param {string[]} jamo - 기본 자모 배열
 * @returns {string[]} 완전 분해된 자모 배열
 */
const expandCompoundJamo = (jamo) => {
  const result = [];
  for (const j of jamo) {
    if (COMPOUND_JUNGSEONG[j]) {
      result.push(...COMPOUND_JUNGSEONG[j]);
    } else if (COMPOUND_JONGSEONG[j]) {
      result.push(...COMPOUND_JONGSEONG[j]);
    } else {
      result.push(j);
    }
  }
  return result;
};

/**
 * 두 자모 배열이 접두사 관계인지 확인 (복합 자모 확장 적용)
 * @param {string[]} prefix - 접두사 후보
 * @param {string[]} full - 전체 자모 배열
 * @returns {boolean} prefix가 full의 접두사이면 true
 */
const isJamoPrefix = (prefix, full) => {
  // 복합 자모를 구성요소로 확장
  const expandedPrefix = expandCompoundJamo(prefix);
  const expandedFull = expandCompoundJamo(full);

  if (expandedPrefix.length > expandedFull.length) return false;
  for (let i = 0; i < expandedPrefix.length; i++) {
    if (expandedPrefix[i] !== expandedFull[i]) return false;
  }
  return true;
};

/**
 * 한글 조합을 고려한 정확도 계산
 * - 완성된 글자들은 글자 단위로 비교
 * - 마지막 조합 중인 글자는 자모 접두사로 비교
 *
 * 예: 타겟 "안녕", 입력 "ㅇ" → "안"의 자모 [ㅇ,ㅏ,ㄴ]과 [ㅇ] 비교 → 접두사 일치 → 100%
 *
 * @param {string} target - 목표 문장
 * @param {string} typed - 타이핑한 문장
 * @param {boolean} isComposing - 현재 조합 중인지 여부
 * @returns {number} 정확도 (0-100%)
 */
export const calculateAccuracy = (target, typed, isComposing = false) => {
  if (!target || target.length === 0) return 100;
  if (!typed || typed.length === 0) return 100;

  const typedLen = typed.length;
  const targetLen = target.length;

  let correctCount = 0;
  let totalCount = 0;

  for (let i = 0; i < typedLen; i++) {
    const typedChar = typed[i];
    const targetChar = target[i];

    // 타겟을 초과해서 입력한 경우 → 오류
    if (i >= targetLen) {
      totalCount++;
      continue;
    }

    const typedJamo = decomposeHangul(typedChar);
    const targetJamo = decomposeHangul(targetChar);

    // 마지막 글자이고 조합 중일 수 있는 경우 → 자모 접두사 비교
    const isLastChar = i === typedLen - 1;
    const mightBeComposing = isLastChar && (isComposing || isCompatJamo(typedChar) || isCompleteHangul(typedChar));

    if (mightBeComposing && isJamoPrefix(typedJamo, targetJamo)) {
      // 조합 중인 글자가 타겟의 자모 접두사와 일치 → 정확
      correctCount += typedJamo.length;
      totalCount += typedJamo.length;
    } else if (typedChar === targetChar) {
      // 완전히 동일한 글자
      correctCount += typedJamo.length;
      totalCount += typedJamo.length;
    } else {
      // 다른 글자 → 자모 단위로 부분 점수
      let matching = 0;
      const minLen = Math.min(typedJamo.length, targetJamo.length);
      for (let j = 0; j < minLen; j++) {
        if (typedJamo[j] === targetJamo[j]) {
          matching++;
        } else {
          break; // 순서대로 일치해야 함
        }
      }
      correctCount += matching;
      totalCount += Math.max(typedJamo.length, targetJamo.length);
    }
  }

  if (totalCount === 0) return 100;

  const accuracy = (correctCount / totalCount) * 100;
  return Math.round(accuracy * 10) / 10;
};

/**
 * 실시간 정확도 피드백 (글자별 상태)
 * 한글 조합을 고려하여 정확한 피드백 제공
 *
 * 핵심 로직:
 * - 입력 자모가 목표 자모와 완전히 같으면 → 'correct'
 * - 입력 자모가 목표 자모의 접두사이면 → 'composing' (조합 진행 중)
 * - 입력 자모가 목표 자모보다 많거나 다르면 → 'incorrect'
 *
 * @param {string} target - 목표 문장
 * @param {string} typed - 타이핑한 문장
 * @returns {Array} 각 글자의 상태 배열 ['correct', 'incorrect', 'pending', 'composing']
 */
export const getCharacterFeedback = (target, typed) => {
  const feedback = [];
  const typedLen = typed.length;
  const targetLen = target.length;

  if (typedLen === 0) {
    return target.split('').map(() => 'pending');
  }

  for (let charIdx = 0; charIdx < targetLen; charIdx++) {
    if (charIdx >= typedLen) {
      // 아직 입력하지 않은 글자
      feedback.push('pending');
      continue;
    }

    const targetChar = target[charIdx];
    const typedChar = typed[charIdx];

    // 완전히 동일한 글자
    if (targetChar === typedChar) {
      feedback.push('correct');
      continue;
    }

    // 자모 단위 비교 (복합 자모 확장 적용)
    const targetCharJamo = decomposeHangul(targetChar);
    const typedCharJamo = decomposeHangul(typedChar);

    // 복합 자모 확장 (ㅝ→[ㅜ,ㅓ], ㄻ→[ㄹ,ㅁ] 등)
    const expandedTarget = expandCompoundJamo(targetCharJamo);
    const expandedTyped = expandCompoundJamo(typedCharJamo);

    const isLastTypedChar = charIdx === typedLen - 1;

    // 입력 자모가 목표 자모의 접두사인지 확인
    const isTypedPrefixOfTarget = isJamoPrefix(typedCharJamo, targetCharJamo);

    // 피드백 결정 (각 글자 독립 평가 - 이전 글자 상태에 의존하지 않음)
    if (isLastTypedChar && isTypedPrefixOfTarget) {
      // 마지막 글자이고, 입력이 목표의 접두사 → 조합 중
      feedback.push('composing');
    } else if (expandedTyped.length > expandedTarget.length) {
      // 입력 자모가 목표보다 많음 (초과 입력)
      feedback.push('incorrect');
    } else if (!isTypedPrefixOfTarget) {
      // 접두사 관계가 아님 → 틀림
      feedback.push('incorrect');
    } else {
      // 마지막 글자가 아닌데 접두사 관계 (중간 글자가 미완성)
      // 이 경우도 incorrect로 처리 (이전 글자가 완성되지 않은 상태)
      feedback.push('incorrect');
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

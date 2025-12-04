/**
 * StorageManager - 타이핑 세션 데이터 저장 및 관리
 *
 * 기능:
 * - 세션 데이터 저장 (자동 로테이션)
 * - 최근 50세션은 전체 데이터 보관
 * - 이전 세션은 요약만 보관 (keystroke 제거)
 * - 집계 통계 관리
 * - 향후 백엔드 연동을 위한 export 기능
 */

import { average } from './keystrokeCollector';

// ============================================
// Storage Keys
// ============================================

export const STORAGE_KEYS = {
  SESSIONS_RECENT: 'theratype_sessions_recent',      // 최근 50세션 (전체 데이터)
  SESSIONS_ARCHIVED: 'theratype_sessions_archived',  // 이전 세션 (요약만)
  USER_AGGREGATE: 'theratype_user_aggregate',        // 집계 통계
  USER_ID: 'theratype_user_id',                      // 익명 사용자 ID
  DATA_VERSION: 'theratype_data_version',            // 스키마 버전
  // 기존 키 (하위 호환성)
  LEGACY_THERAPY_SESSIONS: 'therapySessions',
  LEGACY_INSIGHT_RESULTS: 'insightResults',
};

const MAX_RECENT_SESSIONS = 50;  // 전체 데이터 보관 세션 수
const DATA_VERSION = '2.0.0';

// ============================================
// 사용자 ID 관리
// ============================================

/**
 * 익명 사용자 ID 가져오기 (없으면 생성)
 * @returns {string} UUID 형식의 사용자 ID
 */
export function getUserId() {
  let userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEYS.USER_ID, userId);
  }
  return userId;
}

// ============================================
// 세션 저장
// ============================================

/**
 * 세션 데이터 저장 (자동 로테이션)
 * @param {Object} sessionData - 세션 데이터
 * @returns {Object} 저장된 세션 (sessionId 포함)
 */
export function saveSession(sessionData) {
  // 세션 ID 생성 (없으면)
  const session = {
    sessionId: sessionData.sessionId || crypto.randomUUID(),
    userId: getUserId(),
    savedAt: new Date().toISOString(),
    dataVersion: DATA_VERSION,
    ...sessionData,
  };

  // 현재 recent 세션 로드
  const recentSessions = getRecentSessions();

  // 새 세션 추가
  recentSessions.push(session);

  // 로테이션: 50개 초과 시 오래된 것 archive로 이동
  if (recentSessions.length > MAX_RECENT_SESSIONS) {
    const toArchive = recentSessions.splice(0, recentSessions.length - MAX_RECENT_SESSIONS);
    archiveSessions(toArchive);
  }

  // recent 저장
  localStorage.setItem(STORAGE_KEYS.SESSIONS_RECENT, JSON.stringify(recentSessions));

  // 집계 업데이트
  updateUserAggregate(session);

  return session;
}

/**
 * 세션을 archive로 이동 (keystroke 제거)
 * @param {Array} sessions - 아카이브할 세션 배열
 */
function archiveSessions(sessions) {
  const archived = getArchivedSessions();

  // 세션 압축 (keystroke 배열 제거)
  const compressed = sessions.map(compressSession);
  archived.push(...compressed);

  localStorage.setItem(STORAGE_KEYS.SESSIONS_ARCHIVED, JSON.stringify(archived));
}

/**
 * 세션 압축 (keystroke 배열 제거)
 * @param {Object} session - 원본 세션
 * @returns {Object} 압축된 세션
 */
function compressSession(session) {
  const { keystrokes, keystrokeLogs, ...rest } = session;
  return {
    ...rest,
    isArchived: true,
    keystrokeCount: keystrokes?.length || keystrokeLogs?.length || 0,
  };
}

// ============================================
// 세션 조회
// ============================================

/**
 * 최근 세션 조회
 * @returns {Array} 최근 세션 배열
 */
export function getRecentSessions() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SESSIONS_RECENT);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to parse recent sessions:', e);
    return [];
  }
}

/**
 * 아카이브 세션 조회
 * @returns {Array} 아카이브된 세션 배열
 */
export function getArchivedSessions() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SESSIONS_ARCHIVED);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to parse archived sessions:', e);
    return [];
  }
}

/**
 * 세션 조회 (필터링 옵션)
 * @param {Object} options - 조회 옵션
 * @param {boolean} options.includeArchived - 아카이브 포함 여부
 * @param {string} options.mode - 'insight' | 'therapy' 필터
 * @param {string} options.profileKey - 프로필 키 필터
 * @param {number} options.limit - 최대 개수
 * @returns {Array} 필터링된 세션 배열
 */
export function getSessions(options = {}) {
  const {
    includeArchived = false,
    mode,
    profileKey,
    limit,
  } = options;

  let sessions = [...getRecentSessions()];

  if (includeArchived) {
    sessions = [...getArchivedSessions(), ...sessions];
  }

  // 필터링
  if (mode) {
    sessions = sessions.filter(s => s.mode === mode);
  }
  if (profileKey) {
    sessions = sessions.filter(s => s.profileKey === profileKey);
  }

  // 정렬 (최신순)
  sessions.sort((a, b) => {
    const dateA = new Date(a.completedAt || a.savedAt).getTime();
    const dateB = new Date(b.completedAt || b.savedAt).getTime();
    return dateB - dateA;
  });

  // 제한
  if (limit && limit > 0) {
    sessions = sessions.slice(0, limit);
  }

  return sessions;
}

/**
 * 특정 모드의 세션만 조회 (기존 코드 호환용)
 * @param {string} mode - 'insight' | 'therapy'
 * @returns {Array} 해당 모드의 세션 배열
 */
export function getSessionsByMode(mode) {
  return getSessions({ mode, includeArchived: true });
}

// ============================================
// 집계 통계 관리
// ============================================

/**
 * 사용자 집계 데이터 가져오기
 * @returns {Object} 집계 데이터
 */
export function getUserAggregate() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER_AGGREGATE);
    return data ? JSON.parse(data) : getDefaultAggregate();
  } catch (e) {
    console.error('Failed to parse user aggregate:', e);
    return getDefaultAggregate();
  }
}

/**
 * 기본 집계 데이터 구조
 * @returns {Object} 기본 집계 객체
 */
function getDefaultAggregate() {
  return {
    userId: getUserId(),
    totalSessions: 0,
    insightSessions: 0,
    therapySessions: 0,
    // 성능 통계
    avgTypingSpeed: 0,
    avgAccuracy: 0,
    avgHesitationCount: 0,
    avgRhythm: 0,
    avgConsistency: 0,
    // 확장 통계
    avgDwellTime: 0,
    avgFlightTime: 0,
    totalErrorCount: 0,
    totalBackspaceCount: 0,
    // 시간 정보
    firstSessionAt: null,
    lastSessionAt: null,
    updatedAt: null,
    dataVersion: DATA_VERSION,
  };
}

/**
 * 집계 데이터 업데이트
 * @param {Object} newSession - 새 세션 데이터
 */
function updateUserAggregate(newSession) {
  const aggregate = getUserAggregate();
  const n = aggregate.totalSessions;

  // 세션 수 증가
  aggregate.totalSessions = n + 1;
  if (newSession.mode === 'insight') {
    aggregate.insightSessions++;
  } else if (newSession.mode === 'therapy') {
    aggregate.therapySessions++;
  }

  // 이동 평균 업데이트 (점진적 평균)
  aggregate.avgTypingSpeed = updateAverage(aggregate.avgTypingSpeed, newSession.typingSpeed || newSession.wpm, n);
  aggregate.avgAccuracy = updateAverage(aggregate.avgAccuracy, newSession.accuracy, n);

  // analytics 필드가 있는 경우
  if (newSession.analytics) {
    aggregate.avgHesitationCount = updateAverage(
      aggregate.avgHesitationCount,
      newSession.analytics.hesitationCount || 0,
      n
    );
    aggregate.avgRhythm = updateAverage(
      aggregate.avgRhythm,
      newSession.analytics.rhythm || 0,
      n
    );
    aggregate.avgConsistency = updateAverage(
      aggregate.avgConsistency,
      newSession.analytics.consistency || 0,
      n
    );
    aggregate.avgDwellTime = updateAverage(
      aggregate.avgDwellTime,
      newSession.analytics.avgDwellTime || 0,
      n
    );
    aggregate.avgFlightTime = updateAverage(
      aggregate.avgFlightTime,
      newSession.analytics.avgFlightTime || 0,
      n
    );
    aggregate.totalErrorCount += newSession.analytics.errorCount || 0;
    aggregate.totalBackspaceCount += newSession.analytics.backspaceCount || 0;
  }

  // 시간 정보
  const sessionTime = newSession.completedAt || newSession.savedAt;
  if (!aggregate.firstSessionAt) {
    aggregate.firstSessionAt = sessionTime;
  }
  aggregate.lastSessionAt = sessionTime;
  aggregate.updatedAt = new Date().toISOString();

  // 저장
  localStorage.setItem(STORAGE_KEYS.USER_AGGREGATE, JSON.stringify(aggregate));
}

/**
 * 이동 평균 업데이트
 * @param {number} oldAvg - 기존 평균
 * @param {number} newValue - 새 값
 * @param {number} n - 기존 데이터 개수
 * @returns {number} 새 평균
 */
function updateAverage(oldAvg, newValue, n) {
  if (newValue === undefined || newValue === null || isNaN(newValue)) {
    return oldAvg;
  }
  if (n === 0) {
    return newValue;
  }
  return Math.round(((oldAvg * n + newValue) / (n + 1)) * 100) / 100;
}

/**
 * 집계 데이터 재계산 (전체 세션 기반)
 * 마이그레이션이나 데이터 복구 시 사용
 */
export function recalculateAggregate() {
  const sessions = getSessions({ includeArchived: true });
  const aggregate = getDefaultAggregate();

  sessions.forEach((session, index) => {
    aggregate.totalSessions++;
    if (session.mode === 'insight') {
      aggregate.insightSessions++;
    } else if (session.mode === 'therapy') {
      aggregate.therapySessions++;
    }

    aggregate.avgTypingSpeed = updateAverage(
      aggregate.avgTypingSpeed,
      session.typingSpeed || session.wpm,
      index
    );
    aggregate.avgAccuracy = updateAverage(aggregate.avgAccuracy, session.accuracy, index);

    if (session.analytics) {
      aggregate.avgHesitationCount = updateAverage(
        aggregate.avgHesitationCount,
        session.analytics.hesitationCount || 0,
        index
      );
      aggregate.avgDwellTime = updateAverage(
        aggregate.avgDwellTime,
        session.analytics.avgDwellTime || 0,
        index
      );
    }

    const sessionTime = session.completedAt || session.savedAt;
    if (!aggregate.firstSessionAt || sessionTime < aggregate.firstSessionAt) {
      aggregate.firstSessionAt = sessionTime;
    }
    if (!aggregate.lastSessionAt || sessionTime > aggregate.lastSessionAt) {
      aggregate.lastSessionAt = sessionTime;
    }
  });

  aggregate.updatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEYS.USER_AGGREGATE, JSON.stringify(aggregate));

  return aggregate;
}

// ============================================
// 데이터 내보내기 (백엔드 연동용)
// ============================================

/**
 * 전체 데이터 내보내기
 * 향후 백엔드 전송 시 이 함수 사용
 * @returns {Object} 전체 데이터
 */
export function exportAllData() {
  return {
    userId: getUserId(),
    recentSessions: getRecentSessions(),
    archivedSessions: getArchivedSessions(),
    aggregate: getUserAggregate(),
    // 기존 데이터 (하위 호환성)
    legacyTherapySessions: getLegacyData(STORAGE_KEYS.LEGACY_THERAPY_SESSIONS),
    legacyInsightResults: getLegacyData(STORAGE_KEYS.LEGACY_INSIGHT_RESULTS),
    exportedAt: new Date().toISOString(),
    dataVersion: DATA_VERSION,
  };
}

/**
 * 기존 데이터 읽기
 * @param {string} key - localStorage 키
 * @returns {any} 파싱된 데이터
 */
function getLegacyData(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

/**
 * 데이터를 JSON 파일로 다운로드
 */
export function downloadDataAsJson() {
  const data = exportAllData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `theratype-data-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ============================================
// 데이터 삭제
// ============================================

/**
 * 모든 데이터 삭제 (PIPA 준수)
 */
export function clearAllData() {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}

/**
 * 최근 세션만 삭제 (아카이브 유지)
 */
export function clearRecentSessions() {
  localStorage.removeItem(STORAGE_KEYS.SESSIONS_RECENT);
}

// ============================================
// 스토리지 사용량
// ============================================

/**
 * 스토리지 사용량 추정
 * @returns {Object} { usedBytes, usedKB, usedMB, percentUsed }
 */
export function estimateStorageUsage() {
  let totalBytes = 0;

  Object.values(STORAGE_KEYS).forEach(key => {
    const data = localStorage.getItem(key);
    if (data) {
      totalBytes += new Blob([data]).size;
    }
  });

  const maxBytes = 5 * 1024 * 1024; // 5MB localStorage limit

  return {
    usedBytes: totalBytes,
    usedKB: Math.round(totalBytes / 1024 * 10) / 10,
    usedMB: Math.round(totalBytes / (1024 * 1024) * 100) / 100,
    percentUsed: Math.round(totalBytes / maxBytes * 100 * 10) / 10,
  };
}

// ============================================
// 마이그레이션 (기존 데이터 → 새 형식)
// ============================================

/**
 * 기존 localStorage 데이터를 새 형식으로 마이그레이션
 * 앱 시작 시 한 번 호출
 */
export function migrateIfNeeded() {
  const currentVersion = localStorage.getItem(STORAGE_KEYS.DATA_VERSION);

  if (currentVersion === DATA_VERSION) {
    return; // 이미 최신 버전
  }

  // 기존 therapySessions 마이그레이션
  const legacyTherapy = getLegacyData(STORAGE_KEYS.LEGACY_THERAPY_SESSIONS);
  if (legacyTherapy && legacyTherapy.sessions) {
    const migratedSessions = legacyTherapy.sessions.map(session => ({
      ...session,
      mode: 'therapy',
      profileKey: session.profileKey || legacyTherapy.profileKey,
      sessionId: session.sessionId || crypto.randomUUID(),
    }));

    // 기존 recent에 추가 (중복 방지)
    const currentRecent = getRecentSessions();
    const existingIds = new Set(currentRecent.map(s => s.sessionId));
    const newSessions = migratedSessions.filter(s => !existingIds.has(s.sessionId));

    if (newSessions.length > 0) {
      const merged = [...currentRecent, ...newSessions];
      localStorage.setItem(STORAGE_KEYS.SESSIONS_RECENT, JSON.stringify(merged));
    }
  }

  // 기존 insightResults 마이그레이션
  const legacyInsight = getLegacyData(STORAGE_KEYS.LEGACY_INSIGHT_RESULTS);
  if (legacyInsight && legacyInsight.selections) {
    const migratedSelections = legacyInsight.selections.map((selection, index) => ({
      ...selection,
      mode: 'insight',
      sessionId: `insight_${index}_${Date.now()}`,
      completedAt: selection.completedAt || legacyInsight.completedAt,
    }));

    const currentRecent = getRecentSessions();
    const merged = [...migratedSelections, ...currentRecent];
    localStorage.setItem(STORAGE_KEYS.SESSIONS_RECENT, JSON.stringify(merged));
  }

  // 버전 업데이트
  localStorage.setItem(STORAGE_KEYS.DATA_VERSION, DATA_VERSION);

  // 집계 재계산
  recalculateAggregate();
}

export default {
  saveSession,
  getSessions,
  getSessionsByMode,
  getRecentSessions,
  getArchivedSessions,
  getUserAggregate,
  recalculateAggregate,
  exportAllData,
  downloadDataAsJson,
  clearAllData,
  estimateStorageUsage,
  migrateIfNeeded,
  getUserId,
  STORAGE_KEYS,
};

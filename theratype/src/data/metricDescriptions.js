/**
 * 타이핑 메트릭 설명
 * 각 통계 항목에 대한 한글 설명
 */

export const METRIC_DESCRIPTIONS = {
  // 기본 성능 메트릭
  typingSpeed: '분당 타수 (자모 기준). 한글 타이핑 속도를 측정합니다.',
  wpm: '분당 단어 수 (Words Per Minute). 영문 기준 타이핑 속도입니다.',
  accuracy: '정확도. 올바르게 입력한 글자의 비율입니다.',

  // 세션 관련
  totalSessions: '지금까지 완료한 전체 세션 수입니다.',
  todaySessions: '오늘 완료한 세션 수입니다.',
  completedSentences: '현재 세션에서 완료한 문장 수입니다.',

  // 헬스케어 분석 메트릭
  hesitationCount: '망설임 횟수. 2초 이상 멈춘 횟수로, 내적 갈등이나 집중력 저하를 나타낼 수 있습니다.',
  totalHesitation: '총 망설임. 세션 동안 2초 이상 멈춘 총 횟수입니다.',
  avgHesitationTime: '평균 망설임 시간. 멈춤이 발생했을 때의 평균 지속 시간입니다.',

  // 타이핑 패턴 분석
  rhythm: '타이핑 리듬. 키 입력 간 평균 간격(ms)입니다. 낮을수록 빠릅니다.',
  consistency: '타이핑 일관성. 키 입력 간격의 균일함을 나타냅니다. 높을수록 일정한 리듬입니다.',

  // 키스트로크 다이내믹스 (헬스케어 연구용)
  dwellTime: '키 누름 시간. 키를 누르고 있는 평균 시간(ms)입니다. 타이핑 스타일과 감정 상태를 반영합니다.',
  flightTime: '키 전환 시간. 이전 키에서 손을 뗀 후 다음 키를 누르기까지의 시간(ms)입니다.',

  // 오류 관련
  errorCount: '오류 횟수. 잘못 입력한 키의 총 개수입니다.',
  backspaceCount: '백스페이스 횟수. 수정을 위해 백스페이스를 누른 횟수입니다.',
  errorRate: '오류율. 전체 키 입력 중 오류의 비율(%)입니다.',

  // 전체 통계
  avgTypingSpeed: '평균 타/분. 모든 세션의 평균 타이핑 속도입니다.',
  avgAccuracy: '평균 정확도. 모든 세션의 평균 정확도입니다.',
  avgHesitation: '평균 망설임. 세션당 평균 망설임 횟수입니다.',
  avgConsistency: '평균 일관성. 모든 세션의 평균 타이핑 일관성입니다.',
  avgDwellTime: '평균 키 누름 시간. 모든 세션의 평균 dwell time입니다.',
  avgFlightTime: '평균 키 전환 시간. 모든 세션의 평균 flight time입니다.',
};

/**
 * 짧은 설명 (툴팁용)
 */
export const METRIC_TOOLTIPS = {
  // 기본
  typingSpeed: '분당 타수 (자모 기준)',
  accuracy: '올바르게 입력한 비율',

  // 세션
  totalSessions: '완료한 전체 세션 수',
  todaySessions: '오늘 완료한 세션 수',

  // 분석
  hesitation: '2초 이상 멈춘 횟수',
  totalHesitation: '총 망설임 횟수 (2초+ 멈춤)',
  rhythm: '키 입력 간 평균 간격',
  consistency: '타이핑 리듬의 균일함 (높을수록 일정)',

  // 키스트로크
  dwellTime: '키를 누르고 있는 평균 시간',
  flightTime: '키 간 전환에 걸리는 시간',

  // 집계
  avgWpm: '전체 세션 평균 타/분',
  avgAccuracy: '전체 세션 평균 정확도',
  avgHesitation: '세션당 평균 망설임 횟수',
  avgConsistency: '전체 세션 평균 일관성',
  avgDwellTime: '전체 세션 평균 키 누름 시간',
  avgFlightTime: '전체 세션 평균 키 전환 시간',
};

export default METRIC_DESCRIPTIONS;

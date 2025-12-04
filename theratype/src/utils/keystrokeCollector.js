/**
 * KeystrokeCollector - 확장 키스트로크 데이터 수집 클래스
 *
 * 헬스케어 연구용 타이핑 패턴 분석을 위해 다음을 수집:
 * - dwellTime: 키를 누르고 있는 시간 (keydown → keyup)
 * - flightTime: 이전 키 뗌 → 현재 키 누름 시간
 * - 오류 및 백스페이스 패턴
 * - 문자 위치 정보
 */

export class KeystrokeCollector {
  constructor() {
    this.keystrokes = [];
    this.pendingKeydown = new Map(); // key -> { timestamp, characterIndex, targetChar }
    this.lastKeyupTime = null;
    this.startTime = null;
    this.isActive = false;
  }

  /**
   * 수집 시작
   */
  start() {
    this.keystrokes = [];
    this.pendingKeydown.clear();
    this.lastKeyupTime = null;
    this.startTime = Date.now();
    this.isActive = true;
  }

  /**
   * 수집 중지
   */
  stop() {
    this.isActive = false;
  }

  /**
   * 초기화
   */
  reset() {
    this.keystrokes = [];
    this.pendingKeydown.clear();
    this.lastKeyupTime = null;
    this.startTime = null;
    this.isActive = false;
  }

  /**
   * keydown 이벤트 처리
   * @param {KeyboardEvent} e - 키보드 이벤트
   * @param {number} characterIndex - 현재 입력 위치 (문장 내 인덱스)
   * @param {string} targetChar - 목표 문자
   * @param {string} currentTyped - 현재까지 입력된 텍스트
   */
  onKeyDown(e, characterIndex, targetChar, currentTyped = '') {
    if (!this.isActive) return;

    const timestamp = Date.now();
    const key = e.key;

    // 첫 입력이면 시작 시간 설정
    if (!this.startTime) {
      this.startTime = timestamp;
    }

    // flight time 계산 (이전 keyup → 현재 keydown)
    const flightTime = this.lastKeyupTime
      ? timestamp - this.lastKeyupTime
      : 0;

    // pending에 저장 (keyup 시 dwell time 계산용)
    // 같은 키가 이미 pending에 있으면 덮어씀 (키 반복 등)
    this.pendingKeydown.set(key, {
      timestamp,
      characterIndex,
      targetChar,
      flightTime,
      currentTyped,
    });
  }

  /**
   * keyup 이벤트 처리
   * @param {KeyboardEvent} e - 키보드 이벤트
   * @param {string} _currentTyped - 현재까지 입력된 텍스트 (향후 확장용)
   */
  onKeyUp(e, _currentTyped = '') {
    if (!this.isActive) return;

    const timestamp = Date.now();
    const key = e.key;

    // pending에서 해당 키의 keydown 정보 찾기
    const keydownInfo = this.pendingKeydown.get(key);

    if (keydownInfo) {
      // dwell time 계산 (keydown → keyup)
      const dwellTime = timestamp - keydownInfo.timestamp;

      // 오류 여부 판단
      const isBackspace = key === 'Backspace';
      let isError = false;

      if (!isBackspace && keydownInfo.targetChar) {
        // 입력한 키와 목표 문자 비교 (단순 비교, 한글은 조합 후 판단)
        // 실제 오류는 조합 완료 후 정확히 판단해야 하지만,
        // 여기서는 대략적인 추정만 수행
        isError = key.length === 1 && key !== keydownInfo.targetChar;
      }

      // 키스트로크 기록
      const keystroke = {
        timestamp: keydownInfo.timestamp,
        key,
        dwellTime,
        flightTime: keydownInfo.flightTime,
        characterIndex: keydownInfo.characterIndex,
        isBackspace,
        isError,
        targetChar: keydownInfo.targetChar || '',
      };

      this.keystrokes.push(keystroke);

      // pending에서 제거
      this.pendingKeydown.delete(key);
    }

    // 마지막 keyup 시간 업데이트
    this.lastKeyupTime = timestamp;
  }

  /**
   * IME 조합 시작 시 호출
   * 한글 입력 시 조합 상태 추적용
   */
  onCompositionStart() {
    // 조합 시작 시 특별한 처리 필요 시 여기에 추가
  }

  /**
   * IME 조합 종료 시 호출
   * @param {string} _composedText - 조합 완료된 텍스트 (향후 확장용)
   */
  onCompositionEnd(_composedText) {
    // 조합 완료 시 특별한 처리 필요 시 여기에 추가
  }

  /**
   * 수집된 키스트로크 배열 반환
   * @returns {Array} 키스트로크 배열
   */
  getKeystrokes() {
    return [...this.keystrokes];
  }

  /**
   * 세션 메트릭 계산
   * @returns {Object} 확장 분석 결과
   */
  getSessionMetrics() {
    const keystrokes = this.keystrokes;

    if (keystrokes.length === 0) {
      return {
        totalKeystrokes: 0,
        avgDwellTime: 0,
        avgFlightTime: 0,
        dwellTimeStdDev: 0,
        flightTimeStdDev: 0,
        errorCount: 0,
        backspaceCount: 0,
        errorRate: 0,
      };
    }

    // dwell/flight time 배열 추출
    const dwellTimes = keystrokes
      .map(k => k.dwellTime)
      .filter(d => d > 0 && d < 2000); // 이상치 제거 (2초 이상은 제외)

    const flightTimes = keystrokes
      .map(k => k.flightTime)
      .filter(f => f > 0 && f < 5000); // 이상치 제거 (5초 이상은 제외)

    // 통계 계산
    const avgDwellTime = average(dwellTimes);
    const avgFlightTime = average(flightTimes);
    const dwellTimeStdDev = stdDev(dwellTimes);
    const flightTimeStdDev = stdDev(flightTimes);

    // 오류 및 백스페이스 카운트
    const errorCount = keystrokes.filter(k => k.isError).length;
    const backspaceCount = keystrokes.filter(k => k.isBackspace).length;
    const errorRate = keystrokes.length > 0
      ? (errorCount / keystrokes.length) * 100
      : 0;

    return {
      totalKeystrokes: keystrokes.length,
      avgDwellTime: Math.round(avgDwellTime),
      avgFlightTime: Math.round(avgFlightTime),
      dwellTimeStdDev: Math.round(dwellTimeStdDev),
      flightTimeStdDev: Math.round(flightTimeStdDev),
      errorCount,
      backspaceCount,
      errorRate: Math.round(errorRate * 10) / 10,
    };
  }

  /**
   * 시작 시간 반환
   * @returns {number|null} 시작 타임스탬프
   */
  getStartTime() {
    return this.startTime;
  }
}

// ============================================
// 통계 헬퍼 함수
// ============================================

/**
 * 배열 평균 계산
 * @param {number[]} arr - 숫자 배열
 * @returns {number} 평균값
 */
export function average(arr) {
  if (!arr || arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

/**
 * 배열 표준편차 계산
 * @param {number[]} arr - 숫자 배열
 * @returns {number} 표준편차
 */
export function stdDev(arr) {
  if (!arr || arr.length < 2) return 0;
  const avg = average(arr);
  const squareDiffs = arr.map(v => Math.pow(v - avg, 2));
  return Math.sqrt(average(squareDiffs));
}

/**
 * KeystrokeCollector 인스턴스 생성 팩토리
 * @returns {KeystrokeCollector} 새 인스턴스
 */
export function createKeystrokeCollector() {
  return new KeystrokeCollector();
}

export default KeystrokeCollector;

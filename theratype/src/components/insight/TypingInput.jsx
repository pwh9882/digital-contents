import { useState, useEffect, useCallback, useRef } from 'react';
import {
  calculateTypingSpeed,
  calculateAccuracy,
  getCharacterFeedback,
  analyzeHesitation,
  analyzeTypingRhythm,
  detectAbnormalWPM,
} from '../../utils/typingAnalyzer';
import { KeystrokeCollector } from '../../utils/keystrokeCollector';
import Tooltip from '../common/Tooltip';
import { METRIC_TOOLTIPS } from '../../data/metricDescriptions';

const TypingInput = ({ targetSentence, onComplete }) => {
  const [typedText, setTypedText] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [keystrokeLogs, setKeystrokeLogs] = useState([]);
  const [typingSpeed, setTypingSpeed] = useState(0); // 타/분
  const [accuracy, setAccuracy] = useState(100);
  const [isComposing, setIsComposing] = useState(false);
  const inputRef = useRef(null);

  // KeystrokeCollector 인스턴스
  const collectorRef = useRef(new KeystrokeCollector());

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // 컴포넌트 마운트 시 collector 초기화
  useEffect(() => {
    collectorRef.current.reset();
    return () => {
      collectorRef.current.stop();
    };
  }, [targetSentence]);

  // 타이핑 시작 시간 설정 및 완료 체크
  useEffect(() => {
    if (typedText.length === 0) {
      setStartTime(null);
      setKeystrokeLogs([]);
      setTypingSpeed(0);
      setAccuracy(100);
      collectorRef.current.reset();
      return;
    }

    if (!startTime) {
      setStartTime(Date.now());
      collectorRef.current.start();
    }

    if (typedText === targetSentence) {
      // 완료 시 최종 통계 계산
      const elapsed = Date.now() - (startTime || Date.now());
      const finalSpeed = calculateTypingSpeed(typedText, elapsed);
      const finalAccuracy = calculateAccuracy(targetSentence, typedText, false);
      setTypingSpeed(finalSpeed);
      setAccuracy(finalAccuracy);
      collectorRef.current.stop();
      handleComplete();
    }
  }, [typedText, targetSentence, startTime]);

  // typedText 변경 시 즉시 통계 갱신
  useEffect(() => {
    if (!startTime || typedText.length === 0) return;

    const elapsed = Date.now() - startTime;
    const currentSpeed = calculateTypingSpeed(typedText, elapsed);
    const currentAccuracy = calculateAccuracy(targetSentence, typedText, isComposing);

    setTypingSpeed(currentSpeed);
    setAccuracy(currentAccuracy);
  }, [startTime, typedText, targetSentence, isComposing]);

  // 타이핑 안 할 때도 시간 경과에 따른 WPM 감소 반영 (1초마다)
  useEffect(() => {
    if (!startTime || typedText.length === 0) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentSpeed = calculateTypingSpeed(typedText, elapsed);
      setTypingSpeed(currentSpeed);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, typedText]);

  const handleComplete = useCallback(() => {
    if (!startTime) return;

    const endTime = Date.now();
    const duration = endTime - startTime;

    // 최종 통계를 여기서 직접 계산 (state는 비동기 업데이트라 신뢰할 수 없음)
    const finalTypingSpeed = calculateTypingSpeed(typedText, duration);
    const finalAccuracy = calculateAccuracy(targetSentence, typedText, false);

    // 확장 keystroke 데이터 가져오기
    const enhancedKeystrokes = collectorRef.current.getKeystrokes();
    const keystrokeMetrics = collectorRef.current.getSessionMetrics();

    // 기존 분석 함수 활용
    const hesitation = analyzeHesitation(keystrokeLogs);
    const rhythm = analyzeTypingRhythm(keystrokeLogs);
    const isAbnormal = detectAbnormalWPM(finalTypingSpeed, keystrokeLogs);

    // 통합 analytics 객체
    const analytics = {
      // 기존 분석 결과
      hesitationCount: hesitation.hesitationCount,
      avgHesitationTime: hesitation.avgHesitationTime,
      totalPauseTime: hesitation.totalPauseTime,
      rhythm: rhythm.rhythm,
      consistency: rhythm.consistency,
      isAbnormal,
      // 확장 분석 결과 (KeystrokeCollector)
      avgDwellTime: keystrokeMetrics.avgDwellTime,
      avgFlightTime: keystrokeMetrics.avgFlightTime,
      dwellTimeStdDev: keystrokeMetrics.dwellTimeStdDev,
      flightTimeStdDev: keystrokeMetrics.flightTimeStdDev,
      errorCount: keystrokeMetrics.errorCount,
      backspaceCount: keystrokeMetrics.backspaceCount,
      errorRate: keystrokeMetrics.errorRate,
      totalKeystrokes: keystrokeMetrics.totalKeystrokes,
    };

    const sessionData = {
      target: targetSentence,
      typed: typedText,
      startTime,
      endTime,
      duration,
      // 기존 호환용 keystroke logs
      keystrokeLogs,
      // 확장 keystroke 데이터
      keystrokes: enhancedKeystrokes,
      // 성능 메트릭 (직접 계산한 값 사용)
      typingSpeed: finalTypingSpeed,
      wpm: finalTypingSpeed,
      accuracy: finalAccuracy,
      // 통합 분석 결과
      analytics,
    };

    onComplete(sessionData);
  }, [targetSentence, typedText, startTime, keystrokeLogs, onComplete]);

  const handleKeyDown = (e) => {
    if (isComposing) return;

    if (e.key === 'Enter') {
      e.preventDefault();
      return;
    }

    const currentIndex = typedText.length;
    const targetChar = targetSentence[currentIndex] || '';

    // KeystrokeCollector에 keydown 기록
    collectorRef.current.onKeyDown(e, currentIndex, targetChar, typedText);

    // 기존 keystrokeLogs도 유지 (하위 호환성)
    setKeystrokeLogs(prev => [
      ...prev,
      {
        timestamp: Date.now(),
        key: e.key,
      },
    ]);
  };

  const handleKeyUp = (e) => {
    if (isComposing) return;

    // KeystrokeCollector에 keyup 기록
    collectorRef.current.onKeyUp(e, typedText);
  };

  const handleChange = (e) => {
    setTypedText(e.target.value);
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
    collectorRef.current.onCompositionStart();
  };

  const handleCompositionEnd = (e) => {
    setIsComposing(false);
    collectorRef.current.onCompositionEnd(e.data);
  };

  const feedback = getCharacterFeedback(targetSentence, typedText);

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div
      className="space-y-8 w-full max-w-3xl mx-auto cursor-text"
      onClick={handleContainerClick}
    >
      {/* Target Sentence Display */}
      <div className="relative p-8 bg-bg-surface rounded-2xl shadow-soft border border-border-base text-center">
        <div className="text-2xl md:text-3xl font-display font-medium leading-relaxed">
          {targetSentence.split('').map((char, index) => {
            // Current cursor position indicator
            const isCurrent = index === typedText.length;
            const isComposingChar = index === typedText.length - 1 && typedText.length > 0;
            const charFeedback = feedback[index];
            const isSpace = char === ' ';

            let colorClass = 'text-text-muted/40'; // 미입력 글자
            let bgClass = '';

            if (charFeedback === 'correct') {
              colorClass = 'text-text-main';
            } else if (charFeedback === 'composing') {
              // 조합 중이며 올바른 방향으로 진행 중 - 더 눈에 띄게
              colorClass = 'text-primary-main font-semibold';
              bgClass = 'bg-primary-main/20 rounded-sm';
            } else if (charFeedback === 'incorrect') {
              colorClass = 'text-error font-semibold';
              bgClass = 'bg-error/15 rounded-sm';
            } else if (isCurrent) {
              // 다음에 입력할 글자 강조
              colorClass = 'text-text-main/70';
              bgClass = 'bg-primary-main/10 rounded-sm';
            }

            return (
              <span
                key={index}
                className={`relative inline-block transition-all duration-150 ${colorClass} ${bgClass}`}
                style={{ minWidth: isSpace ? '0.5em' : undefined }}
              >
                {/* 공백은 특수 문자로 표시 */}
                {isSpace ? '\u00A0' : char}
                {/* 현재 커서 위치 - 더 눈에 띄는 애니메이션 */}
                {isCurrent && (
                  <span className="absolute -bottom-1 left-0 w-full h-1 bg-primary-main rounded-full animate-pulse shadow-lg shadow-primary-main/50" />
                )}
                {/* 조합 중인 글자 하단 표시 */}
                {isComposingChar && charFeedback === 'composing' && (
                  <span className="absolute -bottom-1 left-0 w-full h-1 bg-primary-main rounded-full" />
                )}
              </span>
            );
          })}
        </div>
        {/* 입력 진행 상태 표시 */}
        <div className="mt-4 flex justify-center items-center gap-2 text-xs text-text-muted">
          <span className="font-mono">{typedText.length}</span>
          <span>/</span>
          <span className="font-mono">{targetSentence.length}</span>
          <span>글자</span>
        </div>
      </div>

      {/* Input Field */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={typedText}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          className="w-full px-6 py-4 text-xl text-center bg-transparent border-b-2 border-border-base focus:border-primary transition-colors placeholder-text-muted/50 font-medium text-text-main"
          placeholder="Type the sentence above..."
          autoComplete="off"
          spellCheck="false"
        />
      </div>

      {/* Stats */}
      <div className="flex justify-center gap-12 pt-4">
        <Tooltip content={METRIC_TOOLTIPS.typingSpeed} position="bottom">
          <div className="text-center cursor-help">
            <div className="text-3xl font-bold text-primary font-mono">{typingSpeed}</div>
            <div className="text-xs uppercase tracking-wider text-text-muted font-medium mt-1">타/분</div>
          </div>
        </Tooltip>
        <div className="w-px bg-border-base h-12" />
        <Tooltip content={METRIC_TOOLTIPS.accuracy} position="bottom">
          <div className="text-center cursor-help">
            <div className="text-3xl font-bold text-secondary font-mono">{accuracy}%</div>
            <div className="text-xs uppercase tracking-wider text-text-muted font-medium mt-1">정확도</div>
          </div>
        </Tooltip>
      </div>
    </div>
  );
};

export default TypingInput;

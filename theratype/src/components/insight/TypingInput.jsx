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
    const collector = collectorRef.current;
    collector.reset();
    return () => {
      collector.stop();
    };
  }, [targetSentence]);

  // 최신 값을 ref로 유지 (무한 루프 방지)
  const stateRef = useRef({ typedText, keystrokeLogs, startTime });
  stateRef.current = { typedText, keystrokeLogs, startTime };

  // 완료 처리 함수 (안정적인 참조 유지)
  const handleComplete = useCallback(() => {
    const { typedText: currentTyped, keystrokeLogs: currentLogs, startTime: currentStart } = stateRef.current;
    if (!currentStart) return;

    const endTime = Date.now();
    const duration = endTime - currentStart;

    const finalTypingSpeed = calculateTypingSpeed(currentTyped, duration);
    const finalAccuracy = calculateAccuracy(targetSentence, currentTyped, false);

    const enhancedKeystrokes = collectorRef.current.getKeystrokes();
    const keystrokeMetrics = collectorRef.current.getSessionMetrics();

    const hesitation = analyzeHesitation(currentLogs);
    const rhythm = analyzeTypingRhythm(currentLogs);
    const isAbnormal = detectAbnormalWPM(finalTypingSpeed, currentLogs);

    const analytics = {
      hesitationCount: hesitation.hesitationCount,
      avgHesitationTime: hesitation.avgHesitationTime,
      totalPauseTime: hesitation.totalPauseTime,
      rhythm: rhythm.rhythm,
      consistency: rhythm.consistency,
      isAbnormal,
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
      typed: currentTyped,
      startTime: currentStart,
      endTime,
      duration,
      keystrokeLogs: currentLogs,
      keystrokes: enhancedKeystrokes,
      typingSpeed: finalTypingSpeed,
      wpm: finalTypingSpeed,
      accuracy: finalAccuracy,
      analytics,
    };

    onComplete(sessionData);
  }, [targetSentence, onComplete]);

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
      const elapsed = Date.now() - (startTime || Date.now());
      const finalSpeed = calculateTypingSpeed(typedText, elapsed);
      const finalAccuracy = calculateAccuracy(targetSentence, typedText, false);
      setTypingSpeed(finalSpeed);
      setAccuracy(finalAccuracy);
      collectorRef.current.stop();
      handleComplete();
    }
  }, [typedText, targetSentence, startTime, handleComplete]);

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
          {(() => {
            // 단어별로 그룹화하여 단어 중간에서 줄바꿈 방지
            const words = targetSentence.split(' ');
            let charIndex = 0;

            return words.map((word, wordIdx) => (
              <span key={wordIdx} className="inline-block whitespace-nowrap">
                {word.split('').map((char) => {
                  const index = charIndex++;
                  const isCurrent = index === typedText.length;
                  const isComposingChar = index === typedText.length - 1 && typedText.length > 0;
                  const charFeedback = feedback[index];

                  let colorClass = 'text-text-muted/40';
                  let bgClass = '';

                  if (charFeedback === 'correct') {
                    colorClass = 'text-text-main';
                  } else if (charFeedback === 'composing') {
                    colorClass = 'text-primary-main font-semibold';
                    bgClass = 'bg-primary-main/20 rounded-sm';
                  } else if (charFeedback === 'incorrect') {
                    colorClass = 'text-error font-semibold';
                    bgClass = 'bg-error/15 rounded-sm';
                  } else if (isCurrent) {
                    colorClass = 'text-text-main/70';
                    bgClass = 'bg-primary-main/10 rounded-sm';
                  }

                  return (
                    <span
                      key={index}
                      className={`relative inline-block transition-all duration-150 ${colorClass} ${bgClass}`}
                    >
                      {char}
                      {isCurrent && (
                        <span className="absolute -bottom-1 left-0 w-full h-1 bg-primary-main rounded-full animate-pulse shadow-lg shadow-primary-main/50" />
                      )}
                      {isComposingChar && charFeedback === 'composing' && (
                        <span className="absolute -bottom-1 left-0 w-full h-1 bg-primary-main rounded-full" />
                      )}
                    </span>
                  );
                })}
                {/* 단어 사이 공백 (마지막 단어 제외) */}
                {wordIdx < words.length - 1 && (() => {
                  const spaceIndex = charIndex++;
                  const isCurrent = spaceIndex === typedText.length;
                  const charFeedback = feedback[spaceIndex];

                  let colorClass = 'text-text-muted/40';
                  if (charFeedback === 'correct') colorClass = 'text-text-main';
                  else if (charFeedback === 'incorrect') colorClass = 'text-error';
                  else if (isCurrent) colorClass = 'text-text-main/70';

                  return (
                    <span
                      key={`space-${spaceIndex}`}
                      className={`relative inline-block transition-all duration-150 ${colorClass}`}
                      style={{ minWidth: '0.5em' }}
                    >
                      {'\u00A0'}
                      {isCurrent && (
                        <span className="absolute -bottom-1 left-0 w-full h-1 bg-primary-main rounded-full animate-pulse shadow-lg shadow-primary-main/50" />
                      )}
                    </span>
                  );
                })()}
              </span>
            ));
          })()}
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
        <Tooltip content={METRIC_TOOLTIPS.typingSpeed} position="bottom" inline>
          <div className="text-center cursor-help">
            <div className="text-3xl font-bold text-primary font-mono">{typingSpeed}</div>
            <div className="text-xs uppercase tracking-wider text-text-muted font-medium mt-1">타/분</div>
          </div>
        </Tooltip>
        <div className="w-px bg-border-base h-12" />
        <Tooltip content={METRIC_TOOLTIPS.accuracy} position="bottom" inline>
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

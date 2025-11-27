import { useState, useEffect, useCallback, useRef } from 'react';
import { calculateTypingSpeed, calculateAccuracy, getCharacterFeedback } from '../../utils/typingAnalyzer';

const TypingInput = ({ targetSentence, onComplete }) => {
  const [typedText, setTypedText] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [keystrokeLogs, setKeystrokeLogs] = useState([]);
  const [typingSpeed, setTypingSpeed] = useState(0); // 타/분
  const [accuracy, setAccuracy] = useState(100);
  const [isComposing, setIsComposing] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (typedText.length === 0) {
      setStartTime(null);
      setKeystrokeLogs([]);
      setTypingSpeed(0);
      setAccuracy(100);
      return;
    }

    if (!startTime) {
      setStartTime(Date.now());
    }

    const elapsed = Date.now() - (startTime || Date.now());
    const currentSpeed = calculateTypingSpeed(typedText, elapsed);
    const currentAccuracy = calculateAccuracy(targetSentence, typedText, isComposing);

    setTypingSpeed(currentSpeed);
    setAccuracy(currentAccuracy);

    if (typedText === targetSentence) {
      handleComplete();
    }
  }, [typedText, targetSentence, startTime, isComposing]);

  const handleComplete = useCallback(() => {
    if (!startTime) return;

    const endTime = Date.now();
    const sessionData = {
      target: targetSentence,
      typed: typedText,
      startTime,
      endTime,
      keystrokeLogs,
      typingSpeed, // 타/분
      wpm: typingSpeed, // 하위 호환성
      accuracy,
    };

    onComplete(sessionData);
  }, [targetSentence, typedText, startTime, keystrokeLogs, typingSpeed, accuracy, onComplete]);

  const handleKeyDown = (e) => {
    if (isComposing) return;

    if (e.key === 'Enter') {
      e.preventDefault();
      return;
    }

    setKeystrokeLogs(prev => [
      ...prev,
      {
        timestamp: Date.now(),
        key: e.key,
      },
    ]);
  };

  const handleChange = (e) => {
    setTypedText(e.target.value);
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
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
        <div className="text-center">
          <div className="text-3xl font-bold text-primary font-mono">{typingSpeed}</div>
          <div className="text-xs uppercase tracking-wider text-text-muted font-medium mt-1">타/분</div>
        </div>
        <div className="w-px bg-border-base h-12" />
        <div className="text-center">
          <div className="text-3xl font-bold text-secondary font-mono">{accuracy}%</div>
          <div className="text-xs uppercase tracking-wider text-text-muted font-medium mt-1">정확도</div>
        </div>
      </div>
    </div>
  );
};

export default TypingInput;

import { useState, useEffect, useCallback, useRef } from 'react';
import { calculateWPM, calculateAccuracy, getCharacterFeedback } from '../../utils/typingAnalyzer';

const TypingInput = ({ targetSentence, onComplete }) => {
  const [typedText, setTypedText] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [keystrokeLogs, setKeystrokeLogs] = useState([]);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (typedText.length === 0) {
      setStartTime(null);
      setKeystrokeLogs([]);
      return;
    }

    if (!startTime) {
      setStartTime(Date.now());
    }

    const elapsed = Date.now() - (startTime || Date.now());
    const currentWpm = calculateWPM(typedText.length, elapsed);
    const currentAccuracy = calculateAccuracy(targetSentence, typedText);

    setWpm(currentWpm);
    setAccuracy(currentAccuracy);

    if (typedText === targetSentence) {
      handleComplete();
    }
  }, [typedText, targetSentence, startTime]);

  const handleComplete = useCallback(() => {
    if (!startTime) return;

    const endTime = Date.now();
    const sessionData = {
      target: targetSentence,
      typed: typedText,
      startTime,
      endTime,
      keystrokeLogs,
      wpm,
      accuracy,
    };

    onComplete(sessionData);
  }, [targetSentence, typedText, startTime, keystrokeLogs, wpm, accuracy, onComplete]);

  const handleKeyDown = (e) => {
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

  const feedback = getCharacterFeedback(targetSentence, typedText);

  return (
    <div className="space-y-8 w-full max-w-3xl mx-auto">
      {/* Target Sentence Display */}
      <div className="relative p-8 bg-bg-surface rounded-2xl shadow-soft border border-border-base text-center">
        <div className="text-2xl md:text-3xl font-display font-medium leading-relaxed tracking-tight">
          {targetSentence.split('').map((char, index) => {
            let colorClass = 'text-text-muted/50';
            let borderClass = '';

            // Current cursor position indicator
            const isCurrent = index === typedText.length;

            if (feedback[index] === 'correct') {
              colorClass = 'text-text-main transition-colors duration-200';
            } else if (feedback[index] === 'incorrect') {
              colorClass = 'text-error bg-red-50 rounded';
            }

            return (
              <span key={index} className={`relative ${colorClass}`}>
                {char}
                {isCurrent && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary-500 animate-pulse" />
                )}
              </span>
            );
          })}
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
          className="w-full px-6 py-4 text-xl text-center bg-transparent border-b-2 border-border-base focus:border-primary transition-colors placeholder-text-muted/50 font-medium text-text-main"
          placeholder="Type the sentence above..."
          autoComplete="off"
          spellCheck="false"
        />
      </div>

      {/* Stats */}
      <div className="flex justify-center gap-12 pt-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-primary font-mono">{wpm}</div>
          <div className="text-xs uppercase tracking-wider text-text-muted font-medium mt-1">WPM</div>
        </div>
        <div className="w-px bg-border-base h-12" />
        <div className="text-center">
          <div className="text-3xl font-bold text-secondary font-mono">{accuracy}%</div>
          <div className="text-xs uppercase tracking-wider text-text-muted font-medium mt-1">Accuracy</div>
        </div>
      </div>
    </div>
  );
};

export default TypingInput;

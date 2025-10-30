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
    <div className="space-y-6">
      <div className="bg-neutral-50 p-6 rounded-lg border-2 border-neutral-200">
        <div className="text-2xl font-mono leading-relaxed">
          {targetSentence.split('').map((char, index) => {
            let colorClass = 'text-neutral-400';
            if (feedback[index] === 'correct') {
              colorClass = 'text-green-600';
            } else if (feedback[index] === 'incorrect') {
              colorClass = 'text-red-600';
            }

            return (
              <span key={index} className={colorClass}>
                {char}
              </span>
            );
          })}
        </div>
      </div>

      <div>
        <input
          ref={inputRef}
          type="text"
          value={typedText}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="w-full px-4 py-3 text-lg border-2 border-primary-300 rounded-lg focus:outline-none focus:border-primary-500"
          placeholder="위 문장을 입력하세요..."
          autoComplete="off"
          spellCheck="false"
        />
      </div>

      <div className="flex justify-around text-center">
        <div>
          <div className="text-3xl font-bold text-primary-600">{wpm}</div>
          <div className="text-sm text-neutral-600">WPM</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-secondary-600">{accuracy}%</div>
          <div className="text-sm text-neutral-600">정확도</div>
        </div>
      </div>
    </div>
  );
};

export default TypingInput;

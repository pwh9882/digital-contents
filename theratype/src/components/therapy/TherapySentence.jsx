import { useState, useEffect, useRef } from 'react';
import TypingInput from '../insight/TypingInput';
import Button from '../common/Button';
import Card from '../common/Card';

const TherapySentence = ({ sentence, onComplete }) => {
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const resultRef = useRef(null);

  const handleComplete = (sessionData) => {
    // 타/분 기준: 최소 100타/분 이상이면 성공
    const isSuccess = sessionData.accuracy >= 90 && sessionData.typingSpeed >= 100;

    setLastResult({
      ...sessionData,
      isSuccess
    });
    setShowResult(true);

    onComplete({
      sentenceId: sentence.id,
      typingSpeed: sessionData.typingSpeed,
      wpm: sessionData.wpm,
      accuracy: sessionData.accuracy,
      keystrokeLogs: sessionData.keystrokeLogs,
      completedAt: new Date().toISOString()
    });
  };

  const handleNext = () => {
    setShowResult(false);
    setLastResult(null);
  };

  // 결과 화면에서 키보드로 다음 진행
  useEffect(() => {
    if (!showResult) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // 결과 화면에 포커스
    resultRef.current?.focus();

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showResult]);

  // 문장 변경 시 결과 초기화
  useEffect(() => {
    setShowResult(false);
    setLastResult(null);
  }, [sentence.id]);

  if (showResult && lastResult) {
    const timeInSeconds = Math.round((lastResult.endTime - lastResult.startTime) / 1000);

    return (
      <div
        ref={resultRef}
        tabIndex={-1}
        className="flex flex-col items-center justify-center min-h-[400px] animate-fade-in outline-none"
      >
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce">
            {lastResult.isSuccess ? '🌿' : '🌱'}
          </div>
          <h3 className="text-3xl font-bold text-text-main mb-2">
            {lastResult.isSuccess ? '훌륭해요!' : '조금만 더!'}
          </h3>
          <p className="text-text-muted">
            {lastResult.isSuccess
              ? '이 긍정적인 생각을 내면화하고 있어요.'
              : '매 타이핑이 당신을 성장시키고 있어요.'}
          </p>
        </div>

        {/* 상세 결과 */}
        <div className="grid grid-cols-3 gap-4 mb-8 w-full max-w-lg">
          <Card variant="flat" className="bg-bg-highlight text-center p-4">
            <div className={`text-2xl font-bold font-mono ${lastResult.typingSpeed >= 100 ? 'text-primary' : 'text-text-muted'}`}>
              {lastResult.typingSpeed}
            </div>
            <div className="text-xs text-text-muted mt-1">타/분</div>
          </Card>
          <Card variant="flat" className="bg-bg-highlight text-center p-4">
            <div className={`text-2xl font-bold font-mono ${lastResult.accuracy >= 90 ? 'text-secondary' : 'text-text-muted'}`}>
              {lastResult.accuracy}%
            </div>
            <div className="text-xs text-text-muted mt-1">정확도</div>
          </Card>
          <Card variant="flat" className="bg-bg-highlight text-center p-4">
            <div className="text-2xl font-bold font-mono text-text-main">
              {timeInSeconds}초
            </div>
            <div className="text-xs text-text-muted mt-1">소요시간</div>
          </Card>
        </div>

        {/* 성공 기준 안내 */}
        <div className="text-xs text-text-muted mb-6 text-center">
          <span className={lastResult.typingSpeed >= 100 ? 'text-primary' : ''}>100타/분 이상</span>
          {' + '}
          <span className={lastResult.accuracy >= 90 ? 'text-secondary' : ''}>90% 정확도</span>
          {' 달성 시 마스터'}
        </div>

        <Button
          variant={lastResult.isSuccess ? 'primary' : 'outline'}
          size="lg"
          onClick={handleNext}
          className="min-w-[200px]"
        >
          {lastResult.isSuccess ? '다음 문장' : '다시 도전'}
        </Button>

        {/* 키보드 힌트 */}
        <p className="text-xs text-text-muted mt-4">
          <kbd className="px-2 py-1 bg-bg-highlight rounded text-text-main font-mono">Enter</kbd>
          {' 또는 '}
          <kbd className="px-2 py-1 bg-bg-highlight rounded text-text-main font-mono">Space</kbd>
          {' 를 눌러 계속'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Context Header */}
      <div className="text-center space-y-2">
        <span className="inline-block px-3 py-1 bg-primary-50 text-primary rounded-full text-xs font-bold uppercase tracking-wider dark:bg-primary-900/30">
          치료적 초점
        </span>
        <h2 className="text-lg font-medium text-text-muted">
          {sentence.therapeuticIntent}
        </h2>
      </div>

      {/* Typing Area */}
      <div className="bg-bg-surface rounded-3xl shadow-sm border border-border-base p-6 md:p-10">
        <TypingInput
          targetSentence={sentence.text}
          onComplete={handleComplete}
        />
      </div>

      {/* Scientific Basis */}
      <div className="text-center max-w-2xl mx-auto px-4">
        <p className="text-xs text-text-muted leading-relaxed">
          <span className="font-semibold text-text-main">과학적 근거:</span> {sentence.scientificBasis}
        </p>
      </div>
    </div>
  );
};

export default TherapySentence;

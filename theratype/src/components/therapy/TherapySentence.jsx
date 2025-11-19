import { useState } from 'react';
import TypingInput from '../insight/TypingInput';
import Button from '../common/Button';
import Card from '../common/Card';

const TherapySentence = ({ sentence, onComplete }) => {
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  const handleComplete = (sessionData) => {
    const isSuccess = sessionData.accuracy >= 90 && sessionData.wpm >= 20;

    setLastResult({
      ...sessionData,
      isSuccess
    });
    setShowResult(true);

    onComplete({
      sentenceId: sentence.id,
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

  if (showResult && lastResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] animate-fade-in">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce">
            {lastResult.isSuccess ? '🌿' : '🌱'}
          </div>
          <h3 className="text-3xl font-bold text-neutral-800 mb-2">
            {lastResult.isSuccess ? 'Excellent Flow' : 'Growing Stronger'}
          </h3>
          <p className="text-neutral-500">
            {lastResult.isSuccess
              ? 'You have mastered this thought pattern.'
              : 'Every keystroke brings you closer to mastery.'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8 w-full max-w-md">
          <Card variant="flat" className="bg-neutral-50 text-center p-4">
            <div className={`text-3xl font-bold font-mono ${lastResult.wpm >= 20 ? 'text-primary-600' : 'text-neutral-600'
              }`}>
              {lastResult.wpm}
            </div>
            <div className="text-xs text-neutral-400 uppercase tracking-wider mt-1">WPM</div>
          </Card>
          <Card variant="flat" className="bg-neutral-50 text-center p-4">
            <div className={`text-3xl font-bold font-mono ${lastResult.accuracy >= 90 ? 'text-secondary-600' : 'text-neutral-600'
              }`}>
              {lastResult.accuracy}%
            </div>
            <div className="text-xs text-neutral-400 uppercase tracking-wider mt-1">Accuracy</div>
          </Card>
        </div>

        <Button
          variant={lastResult.isSuccess ? 'primary' : 'outline'}
          size="lg"
          onClick={handleNext}
          className="min-w-[200px]"
        >
          {lastResult.isSuccess ? 'Next Reflection' : 'Try Again'}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Context Header */}
      <div className="text-center space-y-2">
        <span className="inline-block px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-xs font-bold uppercase tracking-wider">
          Therapeutic Focus
        </span>
        <h2 className="text-xl font-medium text-neutral-600">
          {sentence.therapeuticIntent}
        </h2>
      </div>

      {/* Typing Area */}
      <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 p-8 md:p-12">
        <TypingInput
          targetSentence={sentence.text}
          onComplete={handleComplete}
        />
      </div>

      {/* Scientific Basis (Subtle) */}
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-xs text-neutral-400 leading-relaxed">
          <span className="font-bold text-neutral-500">Scientific Basis:</span> {sentence.scientificBasis}
        </p>
      </div>
    </div>
  );
};

export default TherapySentence;

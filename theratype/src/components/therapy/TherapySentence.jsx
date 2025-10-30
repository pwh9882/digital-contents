import { useState } from 'react';
import TypingInput from '../insight/TypingInput';

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

    // 결과를 부모 컴포넌트로 전달
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
      <div className="space-y-6">
        <div className={`p-8 rounded-lg text-center ${
          lastResult.isSuccess ? 'bg-green-50 border-2 border-green-500' : 'bg-yellow-50 border-2 border-yellow-500'
        }`}>
          <div className="text-6xl mb-4">
            {lastResult.isSuccess ? '🎉' : '💪'}
          </div>
          <h3 className="text-2xl font-bold mb-2">
            {lastResult.isSuccess ? '마스터 성공!' : '좋은 시도!'}
          </h3>
          <p className="text-neutral-700 mb-6">
            {lastResult.isSuccess
              ? '이 문장을 성공적으로 완료했습니다!'
              : '조금만 더 연습하면 마스터할 수 있어요!'}
          </p>

          <div className="flex justify-center gap-8 mb-6">
            <div>
              <div className={`text-4xl font-bold ${
                lastResult.wpm >= 20 ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {lastResult.wpm}
              </div>
              <div className="text-sm text-neutral-600">WPM {lastResult.wpm >= 20 && '✓'}</div>
            </div>
            <div>
              <div className={`text-4xl font-bold ${
                lastResult.accuracy >= 90 ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {lastResult.accuracy}%
              </div>
              <div className="text-sm text-neutral-600">정확도 {lastResult.accuracy >= 90 && '✓'}</div>
            </div>
          </div>

          <button
            onClick={handleNext}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            다음 문장 연습하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 문장 표시 */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-neutral-800 mb-4 leading-relaxed">
          {sentence.text}
        </h2>
        <div className="space-y-2">
          <p className="text-sm text-neutral-600">
            <strong>치료적 목적:</strong> {sentence.therapeuticIntent}
          </p>
          <p className="text-xs text-neutral-500">
            <strong>과학적 근거:</strong> {sentence.scientificBasis}
          </p>
        </div>
      </div>

      {/* 타이핑 입력 */}
      <TypingInput
        targetSentence={sentence.text}
        onComplete={handleComplete}
      />

      {/* 성공 기준 안내 */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 className="text-sm font-bold text-blue-800 mb-2">
          마스터 목표
        </h4>
        <div className="flex gap-4 text-xs text-blue-700">
          <span>✓ 정확도 90% 이상</span>
          <span>✓ 속도 20 WPM 이상</span>
          <span>✓ 3회 성공</span>
        </div>
      </div>
    </div>
  );
};

export default TherapySentence;

import { therapySentences, calculateMasteryProgress } from '../../data/therapySentences';

const ProgressTracker = ({ profileKey, sessionHistory }) => {
  const profile = therapySentences[profileKey];

  if (!profile) {
    return null;
  }

  const masteryData = calculateMasteryProgress(sessionHistory, profileKey);
  const { masteredSentences, masteredCount, totalCount, progress } = masteryData;

  // 각 문장의 시도 횟수 계산
  const getSentenceAttempts = (sentenceId) => {
    return sessionHistory.filter(s => s.sentenceId === sentenceId);
  };

  const getSuccessfulAttempts = (sentenceId) => {
    return sessionHistory.filter(
      s => s.sentenceId === sentenceId && s.accuracy >= 90 && s.wpm >= 20
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg border-2 border-neutral-200">
      <h3 className="text-xl font-bold text-neutral-800 mb-4">
        마스터 진행도
      </h3>

      {/* 전체 진행률 */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-neutral-700">
            {masteredCount} / {totalCount} 문장 마스터
          </span>
          <span className="text-sm font-bold" style={{ color: profile.color }}>
            {progress}%
          </span>
        </div>
        <div className="w-full h-3 bg-neutral-200 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-500 rounded-full"
            style={{
              width: `${progress}%`,
              backgroundColor: profile.color
            }}
          />
        </div>
      </div>

      {/* 개별 문장 상태 */}
      <div className="space-y-3">
        {profile.sentences.map((sentence) => {
          const isMastered = masteredSentences.includes(sentence.id);
          const attempts = getSentenceAttempts(sentence.id);
          const successfulAttempts = getSuccessfulAttempts(sentence.id);

          return (
            <div
              key={sentence.id}
              className="flex items-center justify-between p-3 rounded-lg border"
              style={{
                borderColor: isMastered ? profile.color : '#E5E7EB',
                backgroundColor: isMastered ? `${profile.color}10` : '#FFFFFF'
              }}
            >
              <div className="flex-1">
                <div className="text-sm font-medium text-neutral-800 truncate">
                  {sentence.text}
                </div>
                <div className="text-xs text-neutral-500 mt-1">
                  {successfulAttempts.length} / 3 성공
                  {attempts.length > 0 && ` (총 ${attempts.length}회 시도)`}
                </div>
              </div>
              <div className="ml-4">
                {isMastered ? (
                  <span className="text-2xl">✓</span>
                ) : (
                  <span className="text-lg text-neutral-400">
                    {successfulAttempts.length}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 마스터 기준 안내 */}
      <div className="mt-6 p-4 bg-neutral-50 rounded-lg">
        <h4 className="text-sm font-bold text-neutral-700 mb-2">
          마스터 기준
        </h4>
        <ul className="text-xs text-neutral-600 space-y-1">
          <li>• 정확도 90% 이상</li>
          <li>• 타이핑 속도 20 WPM 이상</li>
          <li>• 3회 이상 성공적으로 완료</li>
        </ul>
      </div>
    </div>
  );
};

export default ProgressTracker;

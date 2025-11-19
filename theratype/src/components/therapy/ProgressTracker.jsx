import { therapySentences, calculateMasteryProgress } from '../../data/therapySentences';
import Card from '../common/Card';

const ProgressTracker = ({ profileKey, sessionHistory }) => {
  const profile = therapySentences[profileKey];

  if (!profile) {
    return null;
  }

  const masteryData = calculateMasteryProgress(sessionHistory, profileKey);
  const { masteredSentences, masteredCount, totalCount, progress } = masteryData;

  const getSuccessfulAttempts = (sentenceId) => {
    return sessionHistory.filter(
      s => s.sentenceId === sentenceId && s.accuracy >= 90 && s.wpm >= 20
    );
  };

  return (
    <Card variant="outlined" className="h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-neutral-800">
          Journey Progress
        </h3>
        <span className="text-sm font-bold px-2 py-1 rounded bg-neutral-100 text-neutral-600">
          {progress}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-1000 ease-out rounded-full"
            style={{
              width: `${progress}%`,
              backgroundColor: profile.color
            }}
          />
        </div>
        <p className="text-xs text-neutral-400 mt-2 text-right">
          {masteredCount} of {totalCount} completed
        </p>
      </div>

      {/* Sentence List */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
        {profile.sentences.map((sentence, index) => {
          const isMastered = masteredSentences.includes(sentence.id);
          const successfulAttempts = getSuccessfulAttempts(sentence.id);
          const successCount = successfulAttempts.length;

          return (
            <div
              key={sentence.id}
              className={`p-3 rounded-xl border transition-all duration-200 ${isMastered
                  ? 'bg-neutral-50 border-neutral-200 opacity-70'
                  : 'bg-white border-neutral-100 hover:border-primary-200 hover:shadow-sm'
                }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${isMastered
                    ? 'bg-green-100 text-green-600'
                    : 'bg-neutral-100 text-neutral-400'
                  }`}>
                  {isMastered ? '✓' : index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${isMastered ? 'text-neutral-500 line-through' : 'text-neutral-700'}`}>
                    {sentence.text}
                  </p>

                  {/* Mini Progress Dots */}
                  <div className="flex gap-1 mt-2">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full ${i < successCount
                            ? 'bg-primary-400'
                            : 'bg-neutral-200'
                          }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-6 border-t border-neutral-100">
        <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider mb-2">
          Mastery Criteria
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-neutral-50 text-neutral-500 text-xs rounded border border-neutral-100">
            90% Accuracy
          </span>
          <span className="px-2 py-1 bg-neutral-50 text-neutral-500 text-xs rounded border border-neutral-100">
            20+ WPM
          </span>
          <span className="px-2 py-1 bg-neutral-50 text-neutral-500 text-xs rounded border border-neutral-100">
            3x Success
          </span>
        </div>
      </div>
    </Card>
  );
};

export default ProgressTracker;

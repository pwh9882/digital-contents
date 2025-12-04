import { useState, useEffect, useMemo } from 'react';
import { insightSentences } from '../data/insightSentences';
import { assignProfile } from '../data/therapySentences';
import { saveSession } from '../utils/storageManager';
import { METRIC_TOOLTIPS } from '../data/metricDescriptions';
import SentencePair from '../components/insight/SentencePair';
import TypingInput from '../components/insight/TypingInput';
import InsightResult from '../components/insight/InsightResult';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Tooltip from '../components/common/Tooltip';

const InsightMode = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSentence, setSelectedSentence] = useState(null);
  const [selectedSide, setSelectedSide] = useState(null); // 'A' or 'B'
  const [selections, setSelections] = useState([]);
  const [isComplete, setIsComplete] = useState(false);

  const currentPair = insightSentences[currentIndex];
  const progress = ((currentIndex) / insightSentences.length) * 100;

  // 현재까지의 누적 통계 계산
  const sessionStats = useMemo(() => {
    if (selections.length === 0) return null;

    const totalWpm = selections.reduce((sum, s) => sum + (s.wpm || 0), 0);
    const totalAccuracy = selections.reduce((sum, s) => sum + (s.accuracy || 0), 0);

    // analytics 데이터가 있는 경우 확장 통계
    let totalHesitation = 0;
    let totalConsistency = 0;
    let analyticsCount = 0;

    selections.forEach(s => {
      if (s.sessionData?.analytics) {
        totalHesitation += s.sessionData.analytics.hesitationCount || 0;
        totalConsistency += s.sessionData.analytics.consistency || 0;
        analyticsCount++;
      }
    });

    return {
      count: selections.length,
      avgWpm: Math.round(totalWpm / selections.length),
      avgAccuracy: Math.round(totalAccuracy / selections.length * 10) / 10,
      totalHesitation,
      avgConsistency: analyticsCount > 0 ? Math.round(totalConsistency / analyticsCount) : null,
    };
  }, [selections]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedSentence) {
        if (e.key === 'Escape') {
          setSelectedSentence(null);
          setSelectedSide(null);
        }
        return;
      }

      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === '1') {
        e.preventDefault();
        handleSelect('A');
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === '2') {
        e.preventDefault();
        handleSelect('B');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedSentence]);

  const handleSelect = (side) => {
    setSelectedSide(side);
    const choice = side === 'A' ? currentPair.pairA : currentPair.pairB;
    setSelectedSentence(choice.text);
  };

  const handleTypingComplete = (sessionData) => {
    const choice = selectedSide === 'A' ? currentPair.pairA : currentPair.pairB;

    const newSelection = {
      pairId: currentPair.id,
      category: currentPair.category,
      categoryName: currentPair.categoryName,
      choice,
      wpm: sessionData.wpm,
      accuracy: sessionData.accuracy,
      sessionData,
    };

    // StorageManager를 통해 각 선택을 세션으로 저장
    saveSession({
      mode: 'insight',
      sentenceId: currentPair.id,
      sentence: choice.text,
      category: currentPair.category,
      categoryName: currentPair.categoryName,
      selectedSide,
      choice,
      // 성능 메트릭
      typingSpeed: sessionData.typingSpeed,
      wpm: sessionData.wpm,
      accuracy: sessionData.accuracy,
      duration: sessionData.duration,
      // keystroke 데이터
      keystrokeLogs: sessionData.keystrokeLogs,
      keystrokes: sessionData.keystrokes,
      // 분석 결과
      analytics: sessionData.analytics,
      // 타임스탬프
      startTime: sessionData.startTime,
      endTime: sessionData.endTime,
      completedAt: new Date().toISOString(),
    });

    const updatedSelections = [...selections, newSelection];
    setSelections(updatedSelections);

    if (currentIndex < insightSentences.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedSentence(null);
      setSelectedSide(null);
    } else {
      // 카테고리별 점수 계산
      const categoryScores = {};
      updatedSelections.forEach(selection => {
        const { category, choice } = selection;
        if (!categoryScores[category]) {
          categoryScores[category] = 0;
        }
        categoryScores[category] += choice.weight;
      });

      // 프로파일 할당
      const assignedProfile = assignProfile(categoryScores);

      setIsComplete(true);
      // 기존 localStorage도 업데이트 (하위 호환성)
      localStorage.setItem('insightResults', JSON.stringify({
        selections: updatedSelections,
        completedAt: new Date().toISOString(),
        assignedProfile: assignedProfile,
      }));
    }
  };

  if (isComplete) {
    return <InsightResult selections={selections} />;
  }

  return (
    <div className="max-w-6xl mx-auto min-h-[80vh] flex flex-col animate-fade-in">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-text-main">Insight Mode</h1>
            <p className="text-sm text-text-muted">Discover your inner voice</p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-primary-main">{currentIndex + 1}</span>
            <span className="text-text-muted text-lg"> / {insightSentences.length}</span>
          </div>
        </div>
        <div className="w-full bg-bg-highlight rounded-full h-2 overflow-hidden">
          <div
            className="bg-primary-main h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentIndex + 1) / insightSentences.length) * 100}%` }}
          />
        </div>
      </div>

      {/* 현재 세션 누적 통계 */}
      {sessionStats && (
        <div className="mb-8 animate-fade-in">
          <Card variant="flat" className="bg-bg-highlight/50 border-border-base">
            <div className="flex items-center justify-between gap-4 p-4">
              <div className="text-xs text-text-muted font-medium uppercase tracking-wider">
                현재 세션 ({sessionStats.count}문장 완료)
              </div>
              <div className="flex items-center gap-6">
                <Tooltip content={METRIC_TOOLTIPS.typingSpeed}>
                  <div className="text-center cursor-help">
                    <div className="text-lg font-bold text-primary font-mono">{sessionStats.avgWpm}</div>
                    <div className="text-xs text-text-muted">평균 타/분</div>
                  </div>
                </Tooltip>
                <div className="w-px bg-border-base h-8" />
                <Tooltip content={METRIC_TOOLTIPS.accuracy}>
                  <div className="text-center cursor-help">
                    <div className="text-lg font-bold text-secondary font-mono">{sessionStats.avgAccuracy}%</div>
                    <div className="text-xs text-text-muted">평균 정확도</div>
                  </div>
                </Tooltip>
                <div className="w-px bg-border-base h-8" />
                <Tooltip content={METRIC_TOOLTIPS.totalHesitation}>
                  <div className="text-center cursor-help">
                    <div className="text-lg font-bold text-orange-600 font-mono">{sessionStats.totalHesitation}</div>
                    <div className="text-xs text-text-muted">총 망설임</div>
                  </div>
                </Tooltip>
                {sessionStats.avgConsistency !== null && (
                  <>
                    <div className="w-px bg-border-base h-8" />
                    <Tooltip content={METRIC_TOOLTIPS.consistency}>
                      <div className="text-center cursor-help">
                        <div className="text-lg font-bold text-purple-600 font-mono">{sessionStats.avgConsistency}%</div>
                        <div className="text-xs text-text-muted">일관성</div>
                      </div>
                    </Tooltip>
                  </>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-center">
        {!selectedSentence ? (
          <SentencePair
            pairData={currentPair}
            onSelect={handleSelect}
            selectedChoice={selectedSide}
          />
        ) : (
          <div className="animate-fade-in-up">
            <div className="mb-8 text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedSentence(null);
                  setSelectedSide(null);
                }}
                className="mb-4 text-text-muted hover:text-primary-main"
              >
                ← Reselect Sentence
              </Button>
              <h3 className="text-xl font-medium text-text-main">
                Type the sentence to confirm your choice
              </h3>
            </div>
            <TypingInput
              targetSentence={selectedSentence}
              onComplete={handleTypingComplete}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default InsightMode;

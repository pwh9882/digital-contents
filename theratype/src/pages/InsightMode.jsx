import { useState, useEffect } from 'react';
import { insightSentences } from '../data/insightSentences';
import { assignProfile } from '../data/therapySentences';
import SentencePair from '../components/insight/SentencePair';
import TypingInput from '../components/insight/TypingInput';
import InsightResult from '../components/insight/InsightResult';
import Button from '../components/common/Button';

const InsightMode = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSentence, setSelectedSentence] = useState(null);
  const [selectedSide, setSelectedSide] = useState(null); // 'A' or 'B'
  const [selections, setSelections] = useState([]);
  const [isComplete, setIsComplete] = useState(false);

  const currentPair = insightSentences[currentIndex];
  const progress = ((currentIndex) / insightSentences.length) * 100;

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
    const newSelection = {
      pairId: currentPair.id,
      category: currentPair.category,
      categoryName: currentPair.categoryName,
      choice: selectedSide === 'A' ? currentPair.pairA : currentPair.pairB,
      wpm: sessionData.wpm,
      accuracy: sessionData.accuracy,
      sessionData,
    };

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
      <div className="mb-12">
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

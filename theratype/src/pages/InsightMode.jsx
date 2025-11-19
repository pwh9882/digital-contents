import { useState, useEffect } from 'react';
import { insightSentences } from '../data/insightSentences';
import { assignProfile } from '../data/therapySentences';
import SentencePair from '../components/insight/SentencePair';
import TypingInput from '../components/insight/TypingInput';
import InsightResult from '../components/insight/InsightResult';

const InsightMode = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSentence, setSelectedSentence] = useState(null);
  const [selectedSide, setSelectedSide] = useState(null); // 'A' or 'B'
  const [selections, setSelections] = useState([]);
  const [isComplete, setIsComplete] = useState(false);

  const currentPair = insightSentences[currentIndex];
  const progress = ((currentIndex + 1) / insightSentences.length) * 100;

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

      if (e.key === 'ArrowLeft' || e.key === '1') {
        handleSelect('A');
      } else if (e.key === 'ArrowRight' || e.key === '2') {
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

      // 프로파일 할당 (therapySentences.js의 assignProfile 함수 사용)
      const assignedProfile = assignProfile(categoryScores);
      console.log('Category Scores:', categoryScores);
      console.log('Assigned Profile:', assignedProfile);
      console.log('Selections:', updatedSelections);

      setIsComplete(true);
      localStorage.setItem('insightResults', JSON.stringify({
        selections: updatedSelections,
        completedAt: new Date().toISOString(),
        assignedProfile: assignedProfile,
      }));
    }
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 p-6">
        <InsightResult selections={selections} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-primary-700">Insight Mode</h1>
            <div className="text-neutral-600">
              {currentIndex + 1} / {insightSentences.length}
            </div>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-3">
            <div
              className="bg-primary-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {!selectedSentence ? (
          <SentencePair
            pairData={currentPair}
            onSelect={handleSelect}
            selectedChoice={selectedSide}
          />
        ) : (
          <div className="bg-white rounded-xl p-8 shadow-lg animate-fade-in-up">
            <div className="mb-6 text-center">
              <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-2">
                선택한 문장을 입력하여 확정하세요
              </span>
              <p className="text-neutral-500 text-sm">
                (다른 문장을 선택하려면 ESC를 누르세요)
              </p>
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

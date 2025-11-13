import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { recommendNextSentence, calculateMasteryProgress } from '../data/therapySentences';
import ProfileBadge from '../components/therapy/ProfileBadge';
import TherapySentence from '../components/therapy/TherapySentence';
import ProgressTracker from '../components/therapy/ProgressTracker';

const TherapyMode = () => {
  const navigate = useNavigate();
  const [profileKey, setProfileKey] = useState(null);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [currentSentence, setCurrentSentence] = useState(null);
  const [masteryProgress, setMasteryProgress] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // localStorage에서 프로파일 및 세션 기록 로드
  useEffect(() => {
    const insightResults = localStorage.getItem('insightResults');
    let profile = null;

    if (insightResults) {
      try {
        const results = JSON.parse(insightResults);
        profile = results.assignedProfile;
      } catch (error) {
        console.error('Failed to load insight results:', error);
      }
    }

    // 프로필이 없으면 demo 모드 사용
    if (!profile) {
      profile = 'demo';
      setIsDemoMode(true);
    }

    setProfileKey(profile);

    // 세션 기록 로드
    const savedSessions = localStorage.getItem('therapySessions');
    if (savedSessions) {
      try {
        const sessions = JSON.parse(savedSessions);
        if (sessions.profileKey === profile) {
          setSessionHistory(sessions.sessions || []);
        }
      } catch (error) {
        console.error('Failed to load therapy sessions:', error);
        setSessionHistory([]);
      }
    }
  }, [navigate]);

  // 다음 문장 추천
  useEffect(() => {
    if (profileKey && sessionHistory !== null) {
      const nextSentence = recommendNextSentence(sessionHistory, profileKey);
      setCurrentSentence(nextSentence);

      const progress = calculateMasteryProgress(sessionHistory, profileKey);
      setMasteryProgress(progress);
    }
  }, [profileKey, sessionHistory]);

  // 세션 완료 처리
  const handleSessionComplete = (sessionData) => {
    const newSession = {
      ...sessionData,
      profileKey
    };

    const updatedHistory = [...sessionHistory, newSession];
    setSessionHistory(updatedHistory);

    // localStorage에 저장
    localStorage.setItem('therapySessions', JSON.stringify({
      profileKey,
      sessions: updatedHistory
    }));

    // 진행도 업데이트
    const progress = calculateMasteryProgress(updatedHistory, profileKey);
    setMasteryProgress(progress);
  };

  if (!profileKey || !currentSentence) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-4">로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-8 px-6">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-800 mb-2">
              Therapy Mode
            </h1>
            <p className="text-neutral-600">
              {isDemoMode ? '체험 모드로 TheraType을 경험해보세요' : '맞춤형 긍정 자극 타이핑 훈련'}
            </p>
          </div>
          <ProfileBadge profileKey={profileKey} />
        </div>

        {/* 데모 모드 안내 배너 */}
        {isDemoMode && (
          <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6 shadow-md">
            <div className="flex items-start gap-4">
              <div className="text-4xl">💡</div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-blue-900 mb-2">
                  체험 모드로 시작하셨습니다
                </h3>
                <p className="text-blue-800 mb-3 text-sm leading-relaxed">
                  현재 기본 긍정 문장으로 연습하고 있습니다.
                  <strong className="font-semibold"> Insight Mode를 완료하면</strong>
                  당신에게 딱 맞는 맞춤형 문장을 추천받을 수 있어요!
                </p>
                <button
                  onClick={() => navigate('/insight')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm"
                >
                  Insight Mode 시작하기 →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 메인 그리드 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽: 타이핑 연습 영역 */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-neutral-200">
              <TherapySentence
                sentence={currentSentence}
                onComplete={handleSessionComplete}
              />
            </div>
          </div>

          {/* 오른쪽: 진행도 트래커 */}
          <div className="lg:col-span-1">
            <ProgressTracker
              profileKey={profileKey}
              sessionHistory={sessionHistory}
            />

            {/* 전체 완료 축하 */}
            {masteryProgress && masteryProgress.masteredCount === masteryProgress.totalCount && (
              <div className="mt-6 bg-gradient-to-r from-green-400 to-blue-500 p-6 rounded-lg text-white text-center">
                <div className="text-4xl mb-2">🎊</div>
                <h3 className="text-xl font-bold mb-2">
                  모든 문장 마스터!
                </h3>
                <p className="text-sm mb-4">
                  축하합니다! 모든 치료적 문장을 마스터했습니다.
                </p>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-4 py-2 bg-white text-primary-600 rounded-lg hover:bg-neutral-100 transition-colors font-medium"
                >
                  대시보드로 이동
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 네비게이션 */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-white text-neutral-700 rounded-lg border-2 border-neutral-300 hover:border-neutral-400 transition-colors"
          >
            ← 홈으로 돌아가기
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            진행도 대시보드 보기
          </button>
        </div>
      </div>
    </div>
  );
};

export default TherapyMode;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { recommendNextSentence, calculateMasteryProgress } from '../data/therapySentences';
import ProfileBadge from '../components/therapy/ProfileBadge';
import TherapySentence from '../components/therapy/TherapySentence';
import ProgressTracker from '../components/therapy/ProgressTracker';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

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
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-primary-400 font-medium">Preparing your session...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">
            Therapy Session
          </h1>
          <p className="text-neutral-500">
            {isDemoMode ? 'Experience the healing power of typing.' : 'Your personalized daily practice.'}
          </p>
        </div>
        <ProfileBadge profileKey={profileKey} />
      </div>

      {/* Demo Mode Banner */}
      {isDemoMode && (
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-100 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-xl">
              💡
            </div>
            <div>
              <h3 className="font-bold text-primary-900">Demo Mode Active</h3>
              <p className="text-sm text-primary-700">
                Complete the Insight Mode to unlock your personalized therapeutic profile.
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/insight')}
            className="whitespace-nowrap"
          >
            Start Insight Mode
          </Button>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Typing Area */}
        <div className="lg:col-span-2">
          <TherapySentence
            sentence={currentSentence}
            onComplete={handleSessionComplete}
          />
        </div>

        {/* Right: Progress Tracker */}
        <div className="lg:col-span-1">
          <ProgressTracker
            profileKey={profileKey}
            sessionHistory={sessionHistory}
          />

          {/* Celebration Card */}
          {masteryProgress && masteryProgress.masteredCount === masteryProgress.totalCount && (
            <div className="mt-6 animate-fade-in-up">
              <Card className="bg-gradient-to-br from-secondary-400 to-primary-500 text-white border-none">
                <div className="text-center p-4">
                  <div className="text-4xl mb-2">🎉</div>
                  <h3 className="text-xl font-bold mb-2">
                    Journey Complete!
                  </h3>
                  <p className="text-white/90 text-sm mb-4">
                    You have mastered all sentences in this profile.
                  </p>
                  <Button
                    variant="ghost"
                    className="bg-white/20 text-white hover:bg-white/30 border-none w-full"
                    onClick={() => navigate('/dashboard')}
                  >
                    View Dashboard
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TherapyMode;

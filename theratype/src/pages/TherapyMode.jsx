import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { recommendNextSentence, calculateMasteryProgress } from '../data/therapySentences';
import { saveSession, getSessions, migrateIfNeeded } from '../utils/storageManager';
import { METRIC_TOOLTIPS } from '../data/metricDescriptions';
import ProfileBadge from '../components/therapy/ProfileBadge';
import TherapySentence from '../components/therapy/TherapySentence';
import ProgressTracker from '../components/therapy/ProgressTracker';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Tooltip from '../components/common/Tooltip';

const TherapyMode = () => {
  const navigate = useNavigate();
  const [profileKey, setProfileKey] = useState(null);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [currentSentence, setCurrentSentence] = useState(null);
  const [masteryProgress, setMasteryProgress] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // localStorage에서 프로파일 및 세션 기록 로드
  useEffect(() => {
    // 기존 데이터 마이그레이션 (최초 1회)
    migrateIfNeeded();

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

    // StorageManager에서 therapy 세션 로드
    const therapySessions = getSessions({ mode: 'therapy', includeArchived: true });
    // 현재 프로필에 맞는 세션만 필터링
    const profileSessions = therapySessions.filter(s => s.profileKey === profile);
    setSessionHistory(profileSessions);
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
      mode: 'therapy',
      profileKey,
      isDemoMode,
    };

    // StorageManager를 통해 저장 (자동 로테이션 + 집계 업데이트)
    const savedSession = saveSession(newSession);

    // 로컬 상태 업데이트
    const updatedHistory = [...sessionHistory, savedSession];
    setSessionHistory(updatedHistory);

    // 기존 localStorage도 업데이트 (하위 호환성)
    localStorage.setItem('therapySessions', JSON.stringify({
      profileKey,
      sessions: updatedHistory
    }));

    // 진행도 업데이트
    const progress = calculateMasteryProgress(updatedHistory, profileKey);
    setMasteryProgress(progress);
  };

  // 오늘의 세션 필터링 및 통계 계산
  const todayStats = useMemo(() => {
    const today = new Date().toDateString();
    const todaySessions = sessionHistory.filter(s =>
      new Date(s.completedAt).toDateString() === today
    );

    if (todaySessions.length === 0) {
      return { count: 0 };
    }

    const totalWpm = todaySessions.reduce((sum, s) => sum + (s.typingSpeed || s.wpm || 0), 0);
    const totalAccuracy = todaySessions.reduce((sum, s) => sum + (s.accuracy || 0), 0);

    // analytics 데이터가 있는 경우 확장 통계
    let totalHesitation = 0;
    let totalConsistency = 0;
    let totalDwellTime = 0;
    let totalFlightTime = 0;
    let analyticsCount = 0;

    todaySessions.forEach(s => {
      if (s.analytics) {
        totalHesitation += s.analytics.hesitationCount || 0;
        totalConsistency += s.analytics.consistency || 0;
        totalDwellTime += s.analytics.avgDwellTime || 0;
        totalFlightTime += s.analytics.avgFlightTime || 0;
        analyticsCount++;
      }
    });

    return {
      count: todaySessions.length,
      avgWpm: Math.round(totalWpm / todaySessions.length),
      avgAccuracy: Math.round(totalAccuracy / todaySessions.length * 10) / 10,
      totalHesitation,
      avgConsistency: analyticsCount > 0 ? Math.round(totalConsistency / analyticsCount) : null,
      avgDwellTime: analyticsCount > 0 ? Math.round(totalDwellTime / analyticsCount) : null,
      avgFlightTime: analyticsCount > 0 ? Math.round(totalFlightTime / analyticsCount) : null,
    };
  }, [sessionHistory]);

  const todaySessionCount = todayStats.count;

  if (!profileKey || !currentSentence) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-primary-400 font-medium">세션을 준비하고 있어요...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-main">
            테라피 세션
          </h1>
          <p className="text-text-muted">
            {isDemoMode ? '타이핑의 치유 효과를 경험해보세요.' : '맞춤형 일일 연습을 시작하세요.'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* 오늘의 세션 카운터 */}
          <div className="text-center px-4 py-2 bg-bg-surface rounded-xl border border-border-base">
            <div className="text-2xl font-bold text-primary font-mono">{todaySessionCount}</div>
            <div className="text-xs text-text-muted">오늘 완료</div>
          </div>
          <ProfileBadge profileKey={profileKey} />
        </div>
      </div>

      {/* Demo Mode Banner */}
      {isDemoMode && (
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-100 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 dark:from-primary-900/20 dark:to-secondary-900/20 dark:border-primary-800">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-bg-surface rounded-full flex items-center justify-center shadow-sm text-xl dark:bg-bg-base dark:text-primary-400">
              💡
            </div>
            <div>
              <h3 className="font-bold text-primary-main">체험 모드</h3>
              <p className="text-sm text-text-muted">
                Insight 모드를 완료하면 맞춤형 테라피 프로필이 생성됩니다.
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/insight')}
            className="whitespace-nowrap"
          >
            Insight 모드 시작
          </Button>
        </div>
      )}

      {/* 오늘의 세션 통계 */}
      {todayStats.count > 0 && (
        <Card variant="flat" className="bg-bg-highlight/50 border-border-base animate-fade-in">
          <div className="p-4 space-y-3">
            <div className="text-xs text-text-muted font-medium uppercase tracking-wider text-center md:text-left">
              오늘의 기록 ({todayStats.count}세션)
            </div>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              <Tooltip content={METRIC_TOOLTIPS.typingSpeed} inline>
                <div className="text-center cursor-help">
                  <div className="text-lg font-bold text-primary font-mono">{todayStats.avgWpm}</div>
                  <div className="text-xs text-text-muted whitespace-nowrap">타/분</div>
                </div>
              </Tooltip>
              <Tooltip content={METRIC_TOOLTIPS.accuracy} inline>
                <div className="text-center cursor-help">
                  <div className="text-lg font-bold text-secondary font-mono">{todayStats.avgAccuracy}%</div>
                  <div className="text-xs text-text-muted whitespace-nowrap">정확도</div>
                </div>
              </Tooltip>
              <Tooltip content={METRIC_TOOLTIPS.totalHesitation} inline>
                <div className="text-center cursor-help">
                  <div className="text-lg font-bold text-orange-600 font-mono">{todayStats.totalHesitation}</div>
                  <div className="text-xs text-text-muted whitespace-nowrap">망설임</div>
                </div>
              </Tooltip>
              {todayStats.avgConsistency !== null && (
                <Tooltip content={METRIC_TOOLTIPS.consistency} inline>
                  <div className="text-center cursor-help">
                    <div className="text-lg font-bold text-purple-600 font-mono">{todayStats.avgConsistency}%</div>
                    <div className="text-xs text-text-muted whitespace-nowrap">일관성</div>
                  </div>
                </Tooltip>
              )}
              {todayStats.avgDwellTime !== null && (
                <Tooltip content={METRIC_TOOLTIPS.dwellTime} inline>
                  <div className="text-center cursor-help">
                    <div className="text-lg font-bold text-teal-600 font-mono">{todayStats.avgDwellTime}ms</div>
                    <div className="text-xs text-text-muted whitespace-nowrap">키누름</div>
                  </div>
                </Tooltip>
              )}
            </div>
          </div>
        </Card>
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
                    모든 문장 마스터!
                  </h3>
                  <p className="text-white/90 text-sm mb-4">
                    이 프로필의 모든 문장을 완료했어요.
                  </p>
                  <Button
                    variant="ghost"
                    className="bg-white/20 text-white hover:bg-white/30 border-none w-full"
                    onClick={() => navigate('/dashboard')}
                  >
                    대시보드 보기
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

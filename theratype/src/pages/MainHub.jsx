import { useEffect, useState } from 'react';
import { modesConfig } from '../data/modesConfig';
import ModeCard from '../components/hub/ModeCard';

/**
 * MainHub Page
 *
 * TheraType의 중앙 허브 페이지
 * 모든 모드를 선택할 수 있는 메인 화면
 */
const MainHub = () => {
  const [progressData, setProgressData] = useState({});

  useEffect(() => {
    // localStorage에서 진행 상태 확인
    const insightResults = localStorage.getItem('insightResults');
    const therapySessions = localStorage.getItem('therapySessions');

    const progress = {};

    // Insight Mode 진행도 계산
    if (insightResults) {
      try {
        const results = JSON.parse(insightResults);
        if (results.selections && Array.isArray(results.selections)) {
          const completionRate = (results.selections.length / 10) * 100;
          progress.insight = {
            progress: completionRate,
            completed: completionRate === 100,
          };
        }
      } catch (e) {
        console.error('Error parsing insightResults:', e);
      }
    }

    // Therapy Mode 사용 여부 확인
    if (therapySessions) {
      try {
        const sessions = JSON.parse(therapySessions);
        if (sessions.sessions && sessions.sessions.length > 0) {
          progress.therapy = {
            hasUsed: true,
          };
        }
      } catch (e) {
        console.error('Error parsing therapySessions:', e);
      }
    }

    setProgressData(progress);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-primary-700 mb-4 tracking-tight">
            TheraType
          </h1>
          <p className="text-xl text-neutral-600 mb-2">
            타이핑으로 시작하는 마음 케어
          </p>
          <p className="text-sm text-neutral-500">
            Therapeutic Typing Platform
          </p>
        </header>

        {/* Welcome Message */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-6 mb-12 max-w-3xl mx-auto border border-primary-100">
          <p className="text-center text-neutral-700 leading-relaxed">
            원하는 모드를 선택해서 시작해보세요.{' '}
            <span className="font-semibold text-primary-600">
              Insight Mode
            </span>
            로 나를 이해하고,{' '}
            <span className="font-semibold text-green-600">Therapy Mode</span>로
            마음을 치유하세요.
          </p>
        </div>

        {/* Modes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {modesConfig.map((mode) => {
            // Get progress data for this mode
            const modeProgress = progressData[mode.id] || {};

            return (
              <ModeCard
                key={mode.id}
                title={mode.title}
                description={mode.description}
                longDescription={mode.longDescription}
                icon={mode.icon}
                route={mode.route}
                enabled={mode.enabled}
                comingSoon={mode.comingSoon}
                color={mode.color}
                progress={modeProgress.progress || 0}
                completed={modeProgress.completed || false}
                requiresProfile={mode.requiresProfile}
              />
            );
          })}
        </div>

        {/* Footer Info */}
        <footer className="text-center text-neutral-500 text-sm">
          <p className="mb-2">
            🚀 새로운 모드가 곧 추가될 예정입니다
          </p>
          <p className="text-xs text-neutral-400">
            TheraType • Digital Healthcare Platform • 2025
          </p>
        </footer>
      </div>
    </div>
  );
};

export default MainHub;

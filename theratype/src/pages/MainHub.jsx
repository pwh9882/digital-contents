import { useEffect, useState } from 'react';
import { modesConfig } from '../data/modesConfig';
import ModeCard from '../components/hub/ModeCard';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { Link } from 'react-router-dom';

/**
 * MainHub Page
 *
 * TheraType의 중앙 허브 페이지
 * "Your Personal Growth Space" 컨셉으로 재설계
 */
const MainHub = () => {
  const [progressData, setProgressData] = useState({});
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    // 시간대에 따른 인사말 설정
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

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
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-bold text-neutral-900 mb-2">
            {greeting}, Traveler
          </h1>
          <p className="text-neutral-500 text-lg">
            오늘도 당신의 마음을 들여다볼 준비가 되었나요?
          </p>
        </div>
        <div className="hidden md:block">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-primary-500 mr-2 animate-pulse"></span>
            System Operational
          </span>
        </div>
      </div>

      {/* Daily Quote / Mood Section */}
      <Card variant="elevated" className="bg-gradient-to-r from-primary-500 to-primary-600 text-white border-none relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary-400 opacity-20 rounded-full -ml-10 -mb-10 blur-2xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3 opacity-90">
              <span className="text-xl">✨</span>
              <span className="font-medium tracking-wide text-sm uppercase">Daily Inspiration</span>
            </div>
            <blockquote className="text-2xl md:text-3xl font-display font-bold leading-tight mb-4">
              "The only journey is the one within."
            </blockquote>
            <cite className="not-italic opacity-80 font-medium">- Rainer Maria Rilke</cite>
          </div>
          <div className="flex-shrink-0">
            <Link to="/therapy">
              <Button className="bg-white text-primary-600 hover:bg-primary-50 border-none shadow-lg">
                Start Daily Session
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Modes Grid */}
      <div>
        <h2 className="text-xl font-bold text-neutral-800 mb-6 flex items-center">
          <span className="w-1.5 h-6 bg-secondary-500 rounded-full mr-3"></span>
          Available Modules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modesConfig.map((mode) => {
            const modeProgress = progressData[mode.id] || {};

            return (
              <ModeCard
                key={mode.id}
                {...mode}
                progress={modeProgress.progress || 0}
                completed={modeProgress.completed || false}
              />
            );
          })}

          {/* Coming Soon Card */}
          <Card variant="flat" className="border-dashed border-2 border-neutral-200 flex flex-col items-center justify-center text-center p-8 min-h-[240px] group hover:border-neutral-300 transition-colors">
            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-2xl mb-4 text-neutral-400 group-hover:scale-110 transition-transform">
              🚀
            </div>
            <h3 className="text-lg font-bold text-neutral-500 mb-2">New Mode</h3>
            <p className="text-neutral-400 text-sm">
              More therapeutic modules are currently under development.
            </p>
          </Card>
        </div>
      </div>

      {/* Recent Activity / Stats Preview (Placeholder) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Weekly Progress">
          <div className="h-32 flex items-center justify-center text-neutral-400 bg-neutral-50 rounded-xl border border-neutral-100">
            Chart Placeholder
          </div>
        </Card>
        <Card title="Recent Insights">
          <div className="space-y-3">
            {[1, 2].map((_, i) => (
              <div key={i} className="flex items-center p-3 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600 mr-3">
                  📝
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-800">Completed Insight Session</p>
                  <p className="text-xs text-neutral-500">2 days ago</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MainHub;

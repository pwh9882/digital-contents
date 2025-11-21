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
    if (hour < 12) {
      setGreeting('Good Morning');
    } else if (hour < 18) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }

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
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold text-text-main mb-2">
            {greeting}, Traveler.
          </h1>
          <p className="text-lg text-text-muted">
            Your journey to mental clarity continues.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm" className="shadow-soft">Daily Check-in</Button>
          <Link to="/dashboard">
            <Button variant="primary" size="sm" className="shadow-soft">View Progress</Button>
          </Link>
        </div>
      </div>

      {/* Daily Inspiration / Hero Card */}
      <Card
        variant="elevated"
        className="relative overflow-hidden border-none bg-gradient-to-br from-primary-600 via-indigo-600 to-teal-600 text-white shadow-[0_24px_70px_-34px_rgba(37,99,235,0.6)]"
      >
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.4),transparent_40%),radial-gradient(circle_at_82%_8%,rgba(56,189,248,0.3),transparent_38%)]" />
        <div className="relative z-10 p-4 md:p-6 lg:p-8">
          <span className="inline-block px-3 py-1 rounded-full bg-white/15 text-xs font-bold mb-4 backdrop-blur-sm border border-white/30 tracking-wide">
            Daily Wisdom
          </span>
          <blockquote className="text-2xl md:text-3xl font-display font-medium leading-relaxed mb-6">
            "The only way out is through."
          </blockquote>
          <div className="flex items-center justify-between">
            <cite className="text-primary-100 not-italic text-sm">- Robert Frost</cite>
            <Link to="/therapy">
              <Button variant="secondary" size="sm" className="shadow-lg shadow-black/20 border-none">
                Reflect on this
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Modes Grid */}
      <div>
        <h2 className="text-xl font-bold text-text-main mb-6 flex items-center gap-2">
          <span className="w-2 h-8 bg-secondary-main rounded-full"></span>
          Choose Your Path
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ModeCard
            title="Insight Mode"
            description="Discover your psychological profile through typing patterns."
            longDescription="Analyze your subconscious tendencies using Jungian archetypes and Big Five personality traits."
            icon="🧠"
            route="/insight"
            enabled={true}
            color="from-blue-400 to-indigo-500"
            requiresProfile={false}
          />
          <ModeCard
            title="Therapy Mode"
            description="Heal and grow with personalized typing therapy."
            longDescription="Practice typing sentences tailored to your emotional needs to reinforce positive neural pathways."
            icon="🌿"
            route="/therapy"
            enabled={true}
            color="from-teal-400 to-emerald-500"
            requiresProfile={true}
            progress={0}
          />
          <ModeCard
            title="Journal Mode"
            description="Free-form writing with AI-powered emotional analysis."
            icon="✍️"
            route="/journal"
            enabled={false}
            comingSoon={true}
            color="from-amber-400 to-orange-500"
          />
        </div>
      </div>

      {/* Secondary Content Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card title="Weekly Progress" variant="outlined">
          <div className="h-32 flex items-center justify-center text-text-muted bg-bg-highlight rounded-xl border border-dashed border-border-base">
            Chart Placeholder
          </div>
        </Card>
        <Card title="Recent Insights" variant="outlined">
          <div className="space-y-3">
            <div className="p-3 bg-bg-highlight rounded-lg border border-border-base">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-bold text-text-main">The Caregiver</span>
                <span className="text-xs text-text-muted">2 days ago</span>
              </div>
              <p className="text-xs text-text-muted">High empathy detected in recent sessions.</p>
            </div>
            <div className="p-3 bg-bg-highlight rounded-lg border border-border-base">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-bold text-text-main">Focus Improved</span>
                <span className="text-xs text-text-muted">5 days ago</span>
              </div>
              <p className="text-xs text-text-muted">Typing accuracy increased by 12%.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MainHub;

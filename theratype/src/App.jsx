/**
 * TheraType - Main App Component
 *
 * @description 메인 애플리케이션 컴포넌트
 * React Router를 사용하여 페이지 라우팅 관리
 */

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Button from './components/common/Button';
import Card from './components/common/Card';
import InsightMode from './pages/InsightMode';

// 임시 페이지 컴포넌트들 (추후 실제 페이지로 교체)
const LandingPage = () => (
  <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-6">
    <Card variant="elevated" className="max-w-2xl">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary-700 mb-4">
          TheraType
        </h1>
        <p className="text-xl text-neutral-600 mb-6">
          Therapeutic Typing Platform
        </p>
        <p className="text-neutral-700 mb-8">
          타이핑 실력 향상과 정신 건강 증진을 동시에 달성하는 디지털 헬스케어 플랫폼
        </p>
        <div className="space-x-4">
          <Link to="/insight">
            <Button variant="primary" size="lg">
              시작하기
            </Button>
          </Link>
          <Button variant="outline" size="lg">
            더 알아보기
          </Button>
        </div>
      </div>
    </Card>
  </div>
);

const TherapyModePage = () => (
  <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
    <Card title="Therapy Mode" className="max-w-3xl">
      <p className="text-neutral-700">
        개인 맞춤형 긍정 자극 타이핑 훈련 (구현 예정)
      </p>
    </Card>
  </div>
);

const DashboardPage = () => (
  <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
    <Card title="Dashboard" className="max-w-4xl">
      <p className="text-neutral-700">
        진행 추적 대시보드 (구현 예정)
      </p>
    </Card>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/insight" element={<InsightMode />} />
        <Route path="/therapy" element={<TherapyModePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </Router>
  );
}

export default App;

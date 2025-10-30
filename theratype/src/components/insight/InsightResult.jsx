import { Link } from 'react-router-dom';
import Button from '../common/Button';
import Card from '../common/Card';
import { assignProfile, therapySentences } from '../../data/therapySentences';

const InsightResult = ({ selections }) => {
  const categoryScores = {};
  let totalWpm = 0;
  let totalAccuracy = 0;
  const count = selections.length;

  selections.forEach(selection => {
    const { category, choice, wpm, accuracy } = selection;

    if (!categoryScores[category]) {
      categoryScores[category] = 0;
    }
    categoryScores[category] += choice.weight;

    totalWpm += wpm;
    totalAccuracy += accuracy;
  });

  const avgWpm = Math.round(totalWpm / count);
  const avgAccuracy = Math.round(totalAccuracy / count);

  const profileKey = assignProfile(categoryScores);
  const profile = therapySentences[profileKey];

  const categoryCounts = {};
  selections.forEach(selection => {
    const cat = selection.categoryName;
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary-700 mb-2">
          분석 완료
        </h2>
        <p className="text-neutral-600">
          당신의 심리 프로파일을 분석했습니다
        </p>
      </div>

      <Card variant="elevated" className="text-center">
        <div className="space-y-4">
          <div className="text-6xl">{profile.icon}</div>
          <h3 className="text-2xl font-bold" style={{ color: profile.color }}>
            {profile.profileName}
          </h3>
          <p className="text-neutral-700 text-lg">
            {profile.profileDescription}
          </p>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card variant="outlined">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600">{avgWpm}</div>
            <div className="text-sm text-neutral-600 mt-2">평균 WPM</div>
          </div>
        </Card>
        <Card variant="outlined">
          <div className="text-center">
            <div className="text-4xl font-bold text-secondary-600">{avgAccuracy}%</div>
            <div className="text-sm text-neutral-600 mt-2">평균 정확도</div>
          </div>
        </Card>
      </div>

      <Card title="카테고리별 선택">
        <div className="space-y-2">
          {Object.entries(categoryCounts).map(([category, count]) => (
            <div key={category} className="flex justify-between items-center py-2 border-b border-neutral-100">
              <span className="text-neutral-700">{category}</span>
              <span className="text-primary-600 font-medium">{count}개</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="text-center">
        <Link to="/therapy">
          <Button variant="primary" size="lg">
            Therapy Mode 시작하기
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default InsightResult;

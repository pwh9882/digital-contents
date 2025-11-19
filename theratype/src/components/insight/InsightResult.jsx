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
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in-up pb-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-neutral-900">
          Analysis Complete
        </h2>
        <p className="text-xl text-neutral-500">
          Here is your personalized therapeutic profile.
        </p>
      </div>

      {/* Profile Card */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-100 to-secondary-100 transform -skew-y-2 rounded-3xl opacity-50" />
        <Card variant="elevated" className="relative z-10 overflow-hidden border-none shadow-xl">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 bg-neutral-50 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-neutral-100">
              <div className="text-8xl mb-6 filter drop-shadow-lg transform hover:scale-110 transition-transform duration-300">
                {profile.icon}
              </div>
              <h3 className="text-2xl font-bold text-center" style={{ color: profile.color }}>
                {profile.profileName}
              </h3>
            </div>
            <div className="md:w-2/3 p-8 md:p-12 flex flex-col justify-center">
              <h4 className="text-lg font-semibold text-neutral-400 uppercase tracking-wide mb-4">
                Profile Description
              </h4>
              <p className="text-xl text-neutral-700 leading-relaxed">
                {profile.profileDescription}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card variant="outlined" className="p-6">
          <h4 className="text-sm font-bold text-neutral-400 uppercase tracking-wide mb-6">
            Performance Metrics
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-neutral-50 rounded-xl">
              <div className="text-3xl font-bold text-primary-600 font-mono">{avgWpm}</div>
              <div className="text-xs text-neutral-500 mt-1">Avg WPM</div>
            </div>
            <div className="text-center p-4 bg-neutral-50 rounded-xl">
              <div className="text-3xl font-bold text-secondary-600 font-mono">{avgAccuracy}%</div>
              <div className="text-xs text-neutral-500 mt-1">Avg Accuracy</div>
            </div>
          </div>
        </Card>

        <Card variant="outlined" className="p-6">
          <h4 className="text-sm font-bold text-neutral-400 uppercase tracking-wide mb-6">
            Category Breakdown
          </h4>
          <div className="space-y-3">
            {Object.entries(categoryCounts).map(([category, count]) => (
              <div key={category} className="flex justify-between items-center">
                <span className="text-neutral-700 font-medium">{category}</span>
                <div className="flex items-center">
                  <div className="w-32 h-2 bg-neutral-100 rounded-full mr-3 overflow-hidden">
                    <div
                      className="h-full bg-primary-500 rounded-full"
                      style={{ width: `${(count / selections.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-neutral-500 w-6 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Action Area */}
      <div className="flex justify-center pt-8">
        <Link to="/therapy">
          <Button variant="primary" size="xl" className="shadow-xl shadow-primary-500/20 hover:shadow-primary-500/40 transform hover:-translate-y-1 transition-all">
            Start Therapy Session
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default InsightResult;

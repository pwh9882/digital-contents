import { Link } from 'react-router-dom';
import Card from '../common/Card';

/**
 * ModeCard Component
 *
 * MainHub에서 사용되는 각 모드 선택 카드 컴포넌트
 */
const ModeCard = ({
  title,
  description,
  longDescription,
  icon,
  route,
  enabled,
  comingSoon,
  color,
  progress = 0,
  completed = false,
  requiresProfile = false,
}) => {
  const CardContent = (
    <Card
      variant="elevated"
      className={`
        relative h-72 flex flex-col justify-between overflow-hidden group
        transition-all duration-500
        ${enabled ? 'hover:-translate-y-2 hover:shadow-xl border-transparent' : 'opacity-60 cursor-not-allowed'}
      `}
    >
      {/* Background Gradient & Decoration */}
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
      <div className={`absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br ${color} opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`} />

      {/* Badges */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
        {comingSoon && (
          <span className="px-3 py-1 bg-neutral-100 text-neutral-500 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border border-neutral-200">
            Coming Soon
          </span>
        )}
        {completed && !comingSoon && (
          <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border border-green-100 flex items-center gap-1">
            Completed <span className="text-lg">✓</span>
          </span>
        )}
        {requiresProfile && !completed && !comingSoon && (
          <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border border-blue-100 flex items-center gap-1">
            Personalized
          </span>
        )}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col p-2">
        <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300 origin-left">
          {icon}
        </div>

        <h3 className="text-2xl font-display font-bold text-neutral-800 mb-2 group-hover:text-primary-700 transition-colors">
          {title}
        </h3>

        <p className="text-sm text-neutral-600 mb-4 leading-relaxed">
          {description}
        </p>

        {longDescription && (
          <p className="text-xs text-neutral-400 mt-auto line-clamp-2">
            {longDescription}
          </p>
        )}
      </div>

      {/* Footer / Action Area */}
      <div className="relative z-10 mt-6 pt-4 border-t border-neutral-100/50">
        {progress > 0 && progress < 100 ? (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-medium text-neutral-500">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
              <div
                className={`bg-gradient-to-r ${color} h-full rounded-full transition-all duration-500`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            {enabled ? (
              <span className="text-sm font-bold text-primary-600 group-hover:translate-x-1 transition-transform flex items-center gap-2">
                Start Session <span className="text-lg">→</span>
              </span>
            ) : (
              <span className="text-sm font-medium text-neutral-400">
                Under Development
              </span>
            )}
          </div>
        )}
      </div>
    </Card>
  );

  if (!enabled) {
    return <div className="filter grayscale contrast-75">{CardContent}</div>;
  }

  return <Link to={route} className="block h-full">{CardContent}</Link>;
};

export default ModeCard;

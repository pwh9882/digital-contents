import { Link } from 'react-router-dom';
import Card from '../common/Card';

/**
 * ModeCard Component
 *
 * MainHub에서 사용되는 각 모드 선택 카드 컴포넌트
 *
 * @param {Object} props
 * @param {string} props.title - 모드 제목
 * @param {string} props.description - 짧은 설명
 * @param {string} props.longDescription - 긴 설명 (선택)
 * @param {string} props.icon - 이모지 아이콘
 * @param {string} props.route - 라우팅 경로
 * @param {boolean} props.enabled - 활성화 여부
 * @param {boolean} props.comingSoon - Coming Soon 표시 여부
 * @param {string} props.color - 그라데이션 색상 (Tailwind classes)
 * @param {number} props.progress - 진행도 (0-100, 선택)
 * @param {boolean} props.completed - 완료 여부 (선택)
 * @param {boolean} props.requiresProfile - 프로필 필요 여부 (선택)
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
      className={`
        relative h-64 flex flex-col justify-between overflow-hidden
        transition-all duration-300
        ${
          enabled
            ? 'hover:shadow-2xl hover:-translate-y-2 cursor-pointer border-2 border-transparent hover:border-primary-400'
            : 'opacity-60 cursor-not-allowed'
        }
      `}
    >
      {/* 배경 그라데이션 */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${color} opacity-10 pointer-events-none`}
      />

      {/* Coming Soon Badge */}
      {comingSoon && (
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <span className="px-3 py-1 bg-neutral-200 text-neutral-600 rounded-full text-xs font-semibold shadow-sm">
            Soon
          </span>
          <span className="text-2xl">🔒</span>
        </div>
      )}

      {/* Completed Badge */}
      {completed && !comingSoon && (
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold shadow-sm flex items-center gap-1">
            <span>완료</span>
            <span>✓</span>
          </span>
        </div>
      )}

      {/* Profile Required Badge */}
      {requiresProfile && !completed && !comingSoon && (
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold shadow-sm flex items-center gap-1">
            <span>맞춤형</span>
            <span>✨</span>
          </span>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Icon */}
        <div className="text-6xl mb-4">{icon}</div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-neutral-800 mb-2">{title}</h3>

        {/* Description */}
        <p className="text-sm text-neutral-600 mb-2">{description}</p>

        {/* Long Description */}
        {longDescription && (
          <p className="text-xs text-neutral-500 italic">{longDescription}</p>
        )}
      </div>

      {/* Progress Bar */}
      {progress > 0 && progress < 100 && (
        <div className="relative z-10 mt-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-neutral-600 font-medium">진행도</span>
            <span className="text-xs text-neutral-600 font-semibold">
              {progress}%
            </span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
            <div
              className={`bg-gradient-to-r ${color} h-2 rounded-full transition-all duration-500`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="relative z-10 mt-4">
        {enabled ? (
          <div className="flex items-center justify-between text-primary-600 font-medium">
            <span>시작하기</span>
            <span className="text-xl">→</span>
          </div>
        ) : (
          <div className="text-neutral-400 font-medium text-center">
            곧 만나요
          </div>
        )}
      </div>
    </Card>
  );

  // Disabled cards are not clickable
  if (!enabled) {
    return <div className="filter grayscale">{CardContent}</div>;
  }

  // Enabled cards navigate to the route
  return <Link to={route}>{CardContent}</Link>;
};

export default ModeCard;

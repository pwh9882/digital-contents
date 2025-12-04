import { useState } from 'react';

/**
 * Tooltip 컴포넌트
 * 마우스 호버 시 설명을 표시하는 툴팁
 */
const Tooltip = ({ children, content, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  if (!content) {
    return children;
  }

  // 위치별 클래스
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  // 화살표 위치별 클래스
  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-bg-surface border-x-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-bg-surface border-x-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-bg-surface border-y-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-bg-surface border-y-transparent border-l-transparent',
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}

      {/* Tooltip */}
      <div
        className={`
          absolute z-50 px-3 py-2
          bg-bg-surface text-text-main text-xs
          rounded-lg shadow-lg border border-border-base
          whitespace-nowrap
          transition-all duration-200
          ${positionClasses[position]}
          ${isVisible ? 'opacity-100 visible' : 'opacity-0 invisible'}
        `}
      >
        {content}
        {/* Arrow */}
        <div
          className={`
            absolute w-0 h-0
            border-4
            ${arrowClasses[position]}
          `}
        />
      </div>
    </div>
  );
};

/**
 * 메트릭 설명을 포함한 StatCard 컴포넌트
 * 통계 값과 라벨, 툴팁 설명을 함께 표시
 */
export const StatWithTooltip = ({
  value,
  label,
  description,
  colorClass = 'text-primary',
  position = 'top'
}) => {
  return (
    <Tooltip content={description} position={position}>
      <div className="text-center cursor-help">
        <div className={`text-lg font-bold font-mono ${colorClass}`}>
          {value}
        </div>
        <div className="text-xs text-text-muted">{label}</div>
      </div>
    </Tooltip>
  );
};

/**
 * 대시보드용 큰 StatCard
 */
export const DashboardStatWithTooltip = ({
  value,
  label,
  description,
  colorClass = 'text-primary',
}) => {
  return (
    <Tooltip content={description} position="bottom">
      <div className="text-center cursor-help w-full">
        <div className={`text-3xl font-bold mb-1 ${colorClass}`}>{value}</div>
        <div className="text-xs text-text-muted uppercase tracking-wider">{label}</div>
      </div>
    </Tooltip>
  );
};

export default Tooltip;

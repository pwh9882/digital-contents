/**
 * Card 컴포넌트
 *
 * @description 콘텐츠를 담는 카드 컴포넌트
 * @param {ReactNode} children - 카드 내용
 * @param {string} title - 카드 제목
 * @param {string} variant - 'default' | 'elevated' | 'outlined'
 * @param {function} onClick - 클릭 핸들러 (선택적, 있으면 hover 효과 추가)
 */

const Card = ({
  children,
  title,
  variant = 'default',
  onClick,
  className = '',
  ...props
}) => {
  // Variant별 스타일
  const variantStyles = {
    default: 'bg-white border border-neutral-200',
    elevated: 'bg-white shadow-md hover:shadow-lg',
    outlined: 'bg-white border-2 border-primary-200',
  };

  // 클릭 가능한 경우 추가 스타일
  const interactiveStyles = onClick
    ? 'cursor-pointer hover:scale-[1.02] transition-transform duration-200'
    : '';

  const cardClassName = [
    'rounded-xl p-6',
    variantStyles[variant],
    interactiveStyles,
    className,
  ].join(' ');

  return (
    <div className={cardClassName} onClick={onClick} {...props}>
      {title && (
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

export default Card;

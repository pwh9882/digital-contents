/**
 * Input 컴포넌트
 *
 * @description 재사용 가능한 입력 필드 컴포넌트
 * @param {string} type - input type (text, email, password 등)
 * @param {string} label - 라벨 텍스트
 * @param {string} placeholder - placeholder 텍스트
 * @param {string} value - 입력값
 * @param {function} onChange - 변경 핸들러
 * @param {string} error - 에러 메시지
 * @param {boolean} required - 필수 입력 여부
 */

const Input = ({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const inputId = `input-${label?.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-neutral-700 mb-1"
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`
          w-full px-3 py-2
          border rounded-lg
          text-neutral-900 placeholder-neutral-400
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          disabled:bg-neutral-100 disabled:cursor-not-allowed
          transition-all duration-200
          ${error ? 'border-error' : 'border-neutral-300'}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
};

export default Input;

# TheraType UI 컴포넌트 명세

**문서 목적**: 재사용 가능한 UI 컴포넌트 정의 및 구현 가이드

---

## 컴포넌트 아키텍처

### 컴포넌트 분류

| 카테고리 | 컴포넌트 수 | 용도 |
|---------|-----------|------|
| **기본 요소** | 7개 | Button, Input, Card 등 |
| **타이핑 관련** | 3개 | TypingInput, SentenceDisplay 등 |
| **데이터 시각화** | 4개 | LineChart, RadarChart 등 |
| **레이아웃** | 3개 | Navbar, Container 등 |
| **피드백** | 4개 | Toast, Modal, Loading 등 |
| **총계** | **21개** | - |

---

## 1. 기본 요소 (Basic Components)

### 1.1 Button

**목적**: 모든 클릭 가능한 행동

**Props**:
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'tertiary' | 'danger';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;  // 아이콘 (선택)
  loading?: boolean;  // 로딩 상태
}
```

**스타일 가이드**:
```css
/* Primary Button */
.button-primary {
  background-color: #4F46E5;  /* Indigo 600 */
  color: #FFFFFF;
  padding: 12px 24px;  /* md 크기 */
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s;
}

.button-primary:hover {
  background-color: #4338CA;  /* Indigo 700 */
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
}

.button-primary:active {
  transform: translateY(0);
}

.button-primary:disabled {
  background-color: #9CA3AF;  /* Gray 400 */
  cursor: not-allowed;
}

/* Secondary Button */
.button-secondary {
  background-color: transparent;
  color: #4F46E5;
  border: 2px solid #4F46E5;
}

/* Tertiary Button (text only) */
.button-tertiary {
  background-color: transparent;
  color: #6B7280;  /* Gray 500 */
  text-decoration: underline;
}

/* Danger Button */
.button-danger {
  background-color: #EF4444;  /* Red 500 */
  color: #FFFFFF;
}
```

**사용 예시**:
```jsx
<Button variant="primary" size="md" onClick={handleStart}>
  시작하기 →
</Button>

<Button variant="secondary" size="sm" onClick={handleCancel}>
  취소
</Button>

<Button variant="primary" loading={true}>
  저장 중...
</Button>
```

---

### 1.2 Input

**목적**: 텍스트 입력 필드

**Props**:
```typescript
interface InputProps {
  type: 'text' | 'email' | 'password';
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;  // 에러 메시지
  label?: string;
  disabled?: boolean;
  icon?: React.ReactNode;  // 좌측 아이콘
  helperText?: string;  // 도움말 텍스트
}
```

**스타일 가이드**:
```css
.input-field {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #E5E7EB;  /* Gray 200 */
  border-radius: 8px;
  font-size: 16px;  /* 모바일 자동 줌 방지 */
  transition: border-color 0.2s;
}

.input-field:focus {
  outline: none;
  border-color: #4F46E5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.input-field.error {
  border-color: #EF4444;
}

.input-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #1F2937;
}

.input-error-message {
  margin-top: 4px;
  font-size: 14px;
  color: #EF4444;
}

.input-helper-text {
  margin-top: 4px;
  font-size: 14px;
  color: #6B7280;
}
```

**사용 예시**:
```jsx
<Input
  type="email"
  label="이메일"
  placeholder="user@example.com"
  value={email}
  onChange={setEmail}
  error={emailError}
/>
```

---

### 1.3 Card

**목적**: 콘텐츠 그룹화 및 시각적 계층 구조

**Props**:
```typescript
interface CardProps {
  children: React.ReactNode;
  variant: 'default' | 'outlined' | 'elevated';
  padding?: 'sm' | 'md' | 'lg';
  hoverable?: boolean;  // 호버 효과
  onClick?: () => void;
}
```

**스타일 가이드**:
```css
.card {
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 24px;  /* md */
}

.card.outlined {
  border: 1px solid #E5E7EB;
}

.card.elevated {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1),
              0 1px 2px rgba(0, 0, 0, 0.06);
}

.card.hoverable {
  cursor: pointer;
  transition: all 0.2s;
}

.card.hoverable:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}
```

**사용 예시**:
```jsx
<Card variant="elevated" padding="lg" hoverable onClick={handleClick}>
  <h3>Insight Mode</h3>
  <p>자기인식 탐색하기</p>
</Card>
```

---

### 1.4 Checkbox

**목적**: 동의, 선택 항목

**Props**:
```typescript
interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
  required?: boolean;
}
```

**사용 예시**:
```jsx
<Checkbox
  checked={agreedToTerms}
  onChange={setAgreedToTerms}
  label="개인정보 수집 및 이용 동의 (필수)"
  required
/>
```

---

### 1.5 ProgressBar

**목적**: 진행 상태 시각화

**Props**:
```typescript
interface ProgressBarProps {
  current: number;  // 현재 값
  total: number;    // 전체 값
  label?: string;   // "3/10" 같은 레이블
  showPercentage?: boolean;
  color?: string;
}
```

**스타일 가이드**:
```css
.progress-bar-container {
  width: 100%;
  height: 8px;
  background-color: #E5E7EB;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background-color: #4F46E5;
  transition: width 0.3s ease;
}

.progress-bar-label {
  margin-top: 8px;
  font-size: 14px;
  color: #6B7280;
  text-align: center;
}
```

**사용 예시**:
```jsx
<ProgressBar
  current={3}
  total={10}
  label="3/10"
  showPercentage
/>
// 표시: "진행: 30%" + 막대
```

---

### 1.6 Badge

**목적**: 난이도, 카테고리, 상태 표시

**Props**:
```typescript
interface BadgeProps {
  children: React.ReactNode;
  variant: 'info' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
}
```

**스타일 가이드**:
```css
.badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.badge.info {
  background-color: #DBEAFE;  /* Blue 100 */
  color: #1E40AF;  /* Blue 800 */
}

.badge.success {
  background-color: #D1FAE5;  /* Green 100 */
  color: #065F46;  /* Green 800 */
}

.badge.warning {
  background-color: #FEF3C7;  /* Amber 100 */
  color: #92400E;  /* Amber 800 */
}
```

**사용 예시**:
```jsx
<Badge variant="info">초급</Badge>
<Badge variant="success">스트레스 관리</Badge>
```

---

### 1.7 Chip (선택 가능한 버튼 그룹)

**목적**: 나이대, 성별, 타이핑 실력 선택

**Props**:
```typescript
interface ChipProps {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}
```

**스타일 가이드**:
```css
.chip {
  padding: 12px 20px;
  border: 2px solid #E5E7EB;
  border-radius: 8px;
  background-color: #FFFFFF;
  cursor: pointer;
  transition: all 0.2s;
}

.chip.selected {
  border-color: #4F46E5;
  background-color: #EEF2FF;  /* Indigo 50 */
  color: #4F46E5;
  font-weight: 600;
}

.chip:hover:not(.selected) {
  border-color: #9CA3AF;
}
```

**사용 예시**:
```jsx
<ChipGroup>
  <Chip selected={ageGroup === '19-25'} onClick={() => setAgeGroup('19-25')}>
    19-25
  </Chip>
  <Chip selected={ageGroup === '26-35'} onClick={() => setAgeGroup('26-35')}>
    26-35
  </Chip>
</ChipGroup>
```

---

## 2. 타이핑 관련 (Typing Components)

### 2.1 TypingInput

**목적**: 실시간 타이핑 입력 및 검증

**Props**:
```typescript
interface TypingInputProps {
  targetSentence: string;  // 목표 문장
  onComplete: (metrics: TypingMetrics) => void;
  onKeyPress?: (key: string) => void;  // 키스트로크 로깅
  realTimeFeedback?: boolean;  // 실시간 피드백 표시
}

interface TypingMetrics {
  wpm: number;
  accuracy: number;
  timeMs: number;
  errorPositions: number[];
  keystrokeLog: KeystrokeEvent[];
}
```

**기능**:
- 실시간 문자 매칭 (정확: 검은색, 오류: 빨간색)
- WPM/정확도 실시간 계산
- 키스트로크 로깅 (시간, 키, 이벤트)
- 오타 시 자동 커서 복귀 (선택적)

**스타일 가이드**:
```css
.typing-input {
  width: 100%;
  padding: 16px;
  border: 2px solid #E5E7EB;
  border-radius: 8px;
  font-family: 'D2Coding', monospace;
  font-size: 18px;
  line-height: 1.6;
}

.typing-input:focus {
  outline: none;
  border-color: #4F46E5;
}

.typing-char {
  position: relative;
}

.typing-char.correct {
  color: #000000;
}

.typing-char.incorrect {
  color: #EF4444;
  background-color: #FEE2E2;
}

.typing-cursor {
  display: inline-block;
  width: 2px;
  height: 24px;
  background-color: #4F46E5;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
```

**내부 로직**:
```javascript
function TypingInput({ targetSentence, onComplete }) {
  const [typedText, setTypedText] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [keystrokeLog, setKeystrokeLog] = useState([]);

  const handleKeyPress = (e) => {
    if (!startTime) setStartTime(Date.now());

    // 키스트로크 로깅
    const keystroke = {
      key: e.key,
      timestamp: Date.now() - startTime,
      event: 'keydown'
    };
    setKeystrokeLog([...keystrokeLog, keystroke]);

    // 문자 추가
    setTypedText(typedText + e.key);

    // 완료 확인
    if (typedText + e.key === targetSentence) {
      const metrics = calculateMetrics(
        targetSentence,
        typedText + e.key,
        Date.now() - startTime,
        keystrokeLog
      );
      onComplete(metrics);
    }
  };

  const calculateMetrics = (target, typed, timeMs, log) => {
    const wpm = Math.round((typed.length / 5) / (timeMs / 60000));
    const accuracy = calculateAccuracy(target, typed);
    const errorPositions = findErrorPositions(target, typed);

    return { wpm, accuracy, timeMs, errorPositions, keystrokeLog: log };
  };

  // ... 렌더링
}
```

**사용 예시**:
```jsx
<TypingInput
  targetSentence="나는 이 순간을 견딜 수 있다"
  onComplete={handleTypingComplete}
  realTimeFeedback={true}
/>
```

---

### 2.2 SentenceDisplay

**목적**: 타이핑할 문장 표시

**Props**:
```typescript
interface SentenceDisplayProps {
  sentence: string;
  highlight?: boolean;  // 강조 표시
  size?: 'md' | 'lg';
}
```

**스타일 가이드**:
```css
.sentence-display {
  padding: 24px;
  background-color: #F9FAFB;
  border-radius: 8px;
  text-align: center;
}

.sentence-display.lg {
  font-size: 24px;
  line-height: 1.5;
}

.sentence-display.highlight {
  background-color: #EEF2FF;  /* Indigo 50 */
  border: 2px solid #4F46E5;
}
```

---

### 2.3 TypingMetrics (실시간 지표 표시)

**목적**: WPM, 정확도 실시간 표시

**Props**:
```typescript
interface TypingMetricsProps {
  wpm: number;
  accuracy: number;
  timeElapsed?: number;  // 초 단위
}
```

**스타일 가이드**:
```css
.typing-metrics {
  display: flex;
  justify-content: space-around;
  padding: 16px;
  background-color: #F9FAFB;
  border-radius: 8px;
  margin-top: 16px;
}

.metric-item {
  text-align: center;
}

.metric-icon {
  font-size: 24px;
  margin-bottom: 4px;
}

.metric-value {
  font-size: 20px;
  font-weight: 700;
  color: #1F2937;
}

.metric-label {
  font-size: 12px;
  color: #6B7280;
  margin-top: 4px;
}
```

**사용 예시**:
```jsx
<TypingMetrics wpm={45} accuracy={96} timeElapsed={12} />
// 표시: ⚡ 45 WPM | 🎯 96% | ⏱️ 12초
```

---

## 3. 데이터 시각화 (Visualization Components)

### 3.1 LineChart

**목적**: 타이핑 속도 추이 그래프

**Props**:
```typescript
interface LineChartProps {
  data: Array<{ date: string; value: number }>;
  xLabel?: string;
  yLabel?: string;
  color?: string;
}
```

**라이브러리**: Chart.js 또는 Recharts

**사용 예시**:
```jsx
<LineChart
  data={[
    { date: '월', value: 40 },
    { date: '화', value: 42 },
    { date: '수', value: 43 },
    { date: '목', value: 45 },
    { date: '금', value: 44 },
    { date: '토', value: 46 },
    { date: '일', value: 48 }
  ]}
  yLabel="WPM"
  color="#4F46E5"
/>
```

**커스터마이제이션**:
- 데이터 포인트 호버 시 툴팁 표시
- 애니메이션: 왼쪽에서 오른쪽으로 그려짐
- 반응형: 모바일에서 축 레이블 생략

---

### 3.2 RadarChart

**목적**: 심리 프로파일 5개 영역 시각화

**Props**:
```typescript
interface RadarChartProps {
  data: {
    self_perception: number;
    stress_response: number;
    social_energy: number;
    emotion_regulation: number;
    future_orientation: number;
  };
  previousData?: object;  // 이전 결과 (점선 표시)
}
```

**사용 예시**:
```jsx
<RadarChart
  data={{
    self_perception: 60,
    stress_response: 30,
    social_energy: 80,
    emotion_regulation: 50,
    future_orientation: 70
  }}
  previousData={{
    self_perception: 50,
    stress_response: 35,
    // ...
  }}
/>
```

---

### 3.3 ScoreBar (카테고리별 점수 막대)

**목적**: Insight 결과 화면 점수 표시

**Props**:
```typescript
interface ScoreBarProps {
  label: string;
  score: number;  // 0-100
  color: string;
  icon?: string;  // 이모지
  warning?: boolean;  // 50 미만 시 경고 표시
}
```

**스타일 가이드**:
```css
.score-bar-container {
  margin-bottom: 16px;
}

.score-bar-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.score-bar-track {
  width: 100%;
  height: 12px;
  background-color: #E5E7EB;
  border-radius: 6px;
  overflow: hidden;
}

.score-bar-fill {
  height: 100%;
  background-color: var(--score-color);
  transition: width 0.5s ease;
}

.score-bar-warning {
  color: #F59E0B;
  margin-left: 8px;
}
```

**사용 예시**:
```jsx
<ScoreBar
  label="스트레스 대응"
  score={30}
  color="#EF4444"
  icon="⚠️"
  warning={true}
/>
// 표시: 스트레스 대응 ███░░░░░░░ 30% ⚠️
```

---

### 3.4 BadgeGrid (배지 컬렉션)

**목적**: 획득한 배지 표시

**Props**:
```typescript
interface Badge {
  id: string;
  name: string;
  icon: string;
  earned: boolean;
  earnedAt?: Date;
  condition: string;
}

interface BadgeGridProps {
  badges: Badge[];
  onClick?: (badge: Badge) => void;
}
```

**스타일 가이드**:
```css
.badge-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 16px;
}

.badge-item {
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.badge-item:hover {
  transform: scale(1.1);
}

.badge-icon {
  font-size: 48px;
  margin-bottom: 8px;
}

.badge-icon.locked {
  filter: grayscale(100%);
  opacity: 0.3;
}

.badge-name {
  font-size: 12px;
  color: #6B7280;
}
```

**사용 예시**:
```jsx
<BadgeGrid
  badges={[
    { id: '1', name: '첫 걸음', icon: '🌱', earned: true },
    { id: '2', name: '연속 3일', icon: '🔥', earned: true },
    { id: '3', name: '연속 7일', icon: '⭐', earned: false }
  ]}
  onClick={handleBadgeClick}
/>
```

---

## 4. 레이아웃 (Layout Components)

### 4.1 Navbar

**목적**: 상단 네비게이션 바

**Props**:
```typescript
interface NavbarProps {
  currentPage: 'home' | 'insight' | 'therapy' | 'dashboard' | 'settings';
  onNavigate: (page: string) => void;
  userAvatar?: string;
}
```

**데스크톱 레이아웃**:
```
[로고] [홈] [Insight] [Therapy] [대시보드]        [프로필 아이콘]
```

**모바일 레이아웃** (하단 탭):
```
[홈 아이콘] [Insight] [Therapy] [대시보드] [설정]
```

**스타일 가이드**:
```css
/* 데스크톱 */
.navbar-desktop {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  background-color: #FFFFFF;
  border-bottom: 1px solid #E5E7EB;
  position: sticky;
  top: 0;
  z-index: 1000;
}

/* 모바일 하단 탭 */
.navbar-mobile {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #FFFFFF;
  border-top: 1px solid #E5E7EB;
  padding: 8px 0;
}

@media (max-width: 768px) {
  .navbar-desktop { display: none; }
  .navbar-mobile { display: flex; }
}

.navbar-item {
  padding: 8px 16px;
  color: #6B7280;
  text-decoration: none;
  transition: color 0.2s;
}

.navbar-item.active {
  color: #4F46E5;
  font-weight: 600;
  border-bottom: 2px solid #4F46E5;
}

.navbar-item:hover {
  color: #4F46E5;
}
```

---

### 4.2 Container

**목적**: 콘텐츠 최대 너비 및 가운데 정렬

**Props**:
```typescript
interface ContainerProps {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  padding?: boolean;
}
```

**스타일 가이드**:
```css
.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 16px;
}

.container.sm { max-width: 640px; }
.container.md { max-width: 768px; }
.container.lg { max-width: 1024px; }
.container.xl { max-width: 1280px; }
```

---

### 4.3 PageHeader

**목적**: 페이지 제목 및 부제목

**Props**:
```typescript
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backButton?: boolean;
  onBack?: () => void;
  actions?: React.ReactNode;  // 우측 액션 버튼
}
```

**스타일 가이드**:
```css
.page-header {
  margin-bottom: 32px;
}

.page-header-title {
  font-size: 32px;
  font-weight: 700;
  color: #1F2937;
  margin-bottom: 8px;
}

.page-header-subtitle {
  font-size: 16px;
  color: #6B7280;
}

.page-header-back {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  color: #4F46E5;
  cursor: pointer;
}
```

**사용 예시**:
```jsx
<PageHeader
  title="Insight Mode"
  subtitle="자기인식 탐색하기"
  backButton
  onBack={handleBack}
/>
```

---

## 5. 피드백 (Feedback Components)

### 5.1 Toast (알림 메시지)

**목적**: 간단한 성공/에러 메시지

**Props**:
```typescript
interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;  // ms, 기본 3000
  onClose?: () => void;
}
```

**스타일 가이드**:
```css
.toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.toast.success {
  background-color: #10B981;
  color: #FFFFFF;
}

.toast.error {
  background-color: #EF4444;
  color: #FFFFFF;
}

.toast.info {
  background-color: #3B82F6;
  color: #FFFFFF;
}
```

**사용 예시**:
```jsx
<Toast
  message="저장되었습니다!"
  type="success"
  duration={3000}
/>
```

---

### 5.2 Modal (팝업 다이얼로그)

**목적**: 중요한 알림, 확인 요청

**Props**:
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;  // 하단 버튼
  size?: 'sm' | 'md' | 'lg';
}
```

**스타일 가이드**:
```css
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9998;
}

.modal-content {
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 24px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
}

.modal-close {
  cursor: pointer;
  color: #6B7280;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}
```

**사용 예시**:
```jsx
<Modal
  isOpen={showDeleteConfirm}
  onClose={() => setShowDeleteConfirm(false)}
  title="계정 삭제"
  actions={
    <>
      <Button variant="secondary" onClick={handleCancel}>취소</Button>
      <Button variant="danger" onClick={handleDelete}>삭제</Button>
    </>
  }
>
  <p>정말 계정을 삭제하시겠어요? 이 작업은 되돌릴 수 없습니다.</p>
</Modal>
```

---

### 5.3 Loading (로딩 인디케이터)

**목적**: 데이터 로딩 중 표시

**Props**:
```typescript
interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullscreen?: boolean;
}
```

**스타일 가이드**:
```css
.loading-spinner {
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 4px solid #E5E7EB;
  border-top-color: #4F46E5;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-text {
  margin-top: 16px;
  color: #6B7280;
}
```

**사용 예시**:
```jsx
<Loading fullscreen text="저장 중..." />

// 또는 인라인
<Loading size="sm" />
```

---

### 5.4 EmptyState (빈 상태)

**목적**: 데이터 없을 때 표시

**Props**:
```typescript
interface EmptyStateProps {
  icon: string;  // 이모지 또는 아이콘
  title: string;
  description?: string;
  action?: React.ReactNode;  // CTA 버튼
}
```

**스타일 가이드**:
```css
.empty-state {
  text-align: center;
  padding: 64px 24px;
}

.empty-state-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state-title {
  font-size: 20px;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 8px;
}

.empty-state-description {
  font-size: 14px;
  color: #6B7280;
  margin-bottom: 24px;
}
```

**사용 예시**:
```jsx
<EmptyState
  icon="📊"
  title="아직 데이터가 없어요"
  description="첫 Insight Mode를 완료하면 프로파일을 확인할 수 있어요"
  action={<Button onClick={handleStart}>시작하기</Button>}
/>
```

---

## 6. 특수 컴포넌트

### 6.1 ConfettiAnimation (축하 애니메이션)

**목적**: 배지 획득, 마일스톤 달성 시

**사용 예시**:
```jsx
<ConfettiAnimation
  active={showConfetti}
  duration={3000}
/>
```

**라이브러리**: react-confetti

---

### 6.2 Tooltip (툴팁)

**목적**: 추가 정보 제공

**Props**:
```typescript
interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}
```

**사용 예시**:
```jsx
<Tooltip content="자기인식 점수는 자존감 및 자기수용 수준을 나타냅니다" position="top">
  <span>자기인식 ⓘ</span>
</Tooltip>
```

---

## 7. 컴포넌트 사용 우선순위 (MVP)

### 필수 컴포넌트 (Week 1-2)
1. Button
2. Input
3. Card
4. ProgressBar
5. TypingInput
6. SentenceDisplay
7. TypingMetrics
8. Navbar
9. Container
10. Loading

### 권장 컴포넌트 (Week 3)
11. LineChart
12. RadarChart
13. ScoreBar
14. BadgeGrid
15. Toast
16. Modal

### 선택적 컴포넌트 (시간 여유 시)
17. Tooltip
18. ConfettiAnimation
19. EmptyState
20. Checkbox
21. Chip

---

## 8. 개발 가이드

### 8.1 컴포넌트 작성 원칙

**재사용성**:
- Props로 모든 변수 제어
- 하드코딩 금지
- 합성(composition) 우선

**접근성**:
- ARIA 레이블 추가
- 키보드 네비게이션 지원
- 색상 대비 4.5:1 이상

**성능**:
- React.memo() 사용 (필요 시)
- useCallback, useMemo로 최적화
- 큰 리스트는 가상화(virtualization)

---

### 8.2 테스트 전략

**단위 테스트** (Jest + React Testing Library):
```javascript
// Button.test.js
test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});

test('calls onClick when clicked', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click</Button>);
  fireEvent.click(screen.getByText('Click'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

**스냅샷 테스트**:
- 주요 컴포넌트의 렌더링 결과 저장
- 의도치 않은 UI 변경 감지

---

### 8.3 Storybook 활용 (선택적)

**설치**:
```bash
npx storybook init
```

**스토리 작성 예시**:
```javascript
// Button.stories.js
export default {
  title: 'Components/Button',
  component: Button,
};

export const Primary = () => (
  <Button variant="primary">Primary Button</Button>
);

export const Secondary = () => (
  <Button variant="secondary">Secondary Button</Button>
);

export const Disabled = () => (
  <Button disabled>Disabled Button</Button>
);
```

---

## 9. 디자인 토큰 (공통 스타일 변수)

### 색상
```css
:root {
  /* Primary */
  --color-primary-50: #EEF2FF;
  --color-primary-500: #4F46E5;
  --color-primary-700: #4338CA;

  /* Gray */
  --color-gray-50: #F9FAFB;
  --color-gray-200: #E5E7EB;
  --color-gray-500: #6B7280;
  --color-gray-800: #1F2937;

  /* Semantic */
  --color-success: #10B981;
  --color-error: #EF4444;
  --color-warning: #F59E0B;
}
```

### 간격 (Spacing)
```css
:root {
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
}
```

### 타이포그래피
```css
:root {
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;
  --font-size-2xl: 24px;
  --font-size-3xl: 32px;
}
```

---

## 10. 구현 우선순위 및 일정

| 주차 | 컴포넌트 | 비고 |
|------|---------|------|
| **Week 1** | Button, Input, Card, Container, Navbar | 기본 레이아웃 |
| **Week 2** | TypingInput, SentenceDisplay, ProgressBar, Loading | 핵심 기능 |
| **Week 3** | LineChart, RadarChart, ScoreBar, Toast, Modal | 데이터 시각화 |
| **Week 4** | BadgeGrid, Tooltip, 기타 (필요 시) | 부가 기능 |

---

**문서 버전**: 1.0
**작성일**: 2025-01-30
**작성자**: Product Manager (Sub-Agent)
**검토 필요**: Implementation Lead (구현 가능성), UX Designer (일관성)
**다음 단계**: 컴포넌트 라이브러리 선택 및 개발 착수

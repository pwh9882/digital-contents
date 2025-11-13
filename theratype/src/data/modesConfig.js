/**
 * TheraType Modes Configuration
 *
 * 모든 모드의 메타데이터를 중앙 관리합니다.
 * MainHub에서 이 설정을 기반으로 ModeCard를 렌더링합니다.
 */

export const modesConfig = [
  // 활성화된 모드들
  {
    id: 'insight',
    title: 'Insight Mode',
    description: '자기인식 및 선호도 탐색',
    longDescription: '두 가지 문장 중 더 공감되는 것을 선택하며 나를 이해해요',
    icon: '🔍',
    route: '/insight',
    enabled: true,
    category: 'assessment',
    color: 'from-blue-400 to-blue-600',
    progressKey: 'insightResults', // localStorage key to check completion
  },
  {
    id: 'therapy',
    title: 'Therapy Mode',
    description: '맞춤형 긍정 자극 타이핑',
    longDescription: '긍정적인 문장을 타이핑하며 마음을 치유해요',
    icon: '💚',
    route: '/therapy',
    enabled: true,
    category: 'practice',
    color: 'from-green-400 to-green-600',
    requiresProfile: true, // 프로필 권장 (없어도 데모 모드 가능)
  },
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: '진행 현황 및 통계',
    longDescription: '나의 타이핑 실력과 성장 과정을 확인해요',
    icon: '📊',
    route: '/dashboard',
    enabled: true,
    category: 'analytics',
    color: 'from-purple-400 to-purple-600',
  },

  // Coming Soon 모드들
  {
    id: 'journal',
    title: 'Journal Mode',
    description: '감정 일기 작성',
    longDescription: '오늘 하루를 돌아보며 자유롭게 글을 써요',
    icon: '📔',
    route: '/journal',
    enabled: false,
    category: 'writing',
    color: 'from-amber-400 to-amber-600',
    comingSoon: true,
  },
  {
    id: 'freewriting',
    title: 'Free Writing',
    description: '자유로운 타이핑 연습',
    longDescription: '생각나는 대로 자유롭게 타이핑해요',
    icon: '✍️',
    route: '/freewriting',
    enabled: false,
    category: 'writing',
    color: 'from-pink-400 to-pink-600',
    comingSoon: true,
  },
  {
    id: 'challenge',
    title: 'Challenge Mode',
    description: '타이핑 챌린지',
    longDescription: '다양한 미션과 챌린지로 실력을 향상시켜요',
    icon: '🎯',
    route: '/challenge',
    enabled: false,
    category: 'game',
    color: 'from-red-400 to-red-600',
    comingSoon: true,
  },
];

/**
 * 특정 모드 정보 가져오기
 */
export const getModeById = (id) => {
  return modesConfig.find(mode => mode.id === id);
};

/**
 * 활성화된 모드만 가져오기
 */
export const getEnabledModes = () => {
  return modesConfig.filter(mode => mode.enabled);
};

/**
 * Coming Soon 모드만 가져오기
 */
export const getComingSoonModes = () => {
  return modesConfig.filter(mode => mode.comingSoon);
};

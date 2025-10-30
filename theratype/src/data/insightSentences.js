/**
 * Insight Mode 문장 쌍 데이터
 *
 * @description 사용자 심리 프로파일을 파악하기 위한 10개 문장 쌍
 * 각 쌍은 대조되는 가치관/태도를 측정
 *
 * 출처: AGENTS.md 프로젝트 개요 참고
 * 과학적 근거: Insight Mode 심리 측정 프레임워크
 */

export const insightSentences = [
  // 1. Self-Perception (자기인식) - 낙관성 vs 자기비판
  {
    id: 'insight_01',
    category: 'self_perception',
    categoryName: '자기인식',
    pairA: {
      text: '오늘 하루도 잘 버텨냈다',
      score: 'optimistic', // 긍정적 자기인식
      weight: +1,
    },
    pairB: {
      text: '오늘은 별로 생산적이지 못했다',
      score: 'self_critical', // 자기비판적
      weight: -1,
    },
  },

  // 2. Self-Worth (자존감)
  {
    id: 'insight_02',
    category: 'self_worth',
    categoryName: '자존감',
    pairA: {
      text: '나는 충분히 가치 있는 사람이다',
      score: 'high_self_esteem',
      weight: +1,
    },
    pairB: {
      text: '나는 항상 부족한 것 같다',
      score: 'low_self_esteem',
      weight: -1,
    },
  },

  // 3. Stress Response (스트레스 대응)
  {
    id: 'insight_03',
    category: 'stress_response',
    categoryName: '스트레스 대응',
    pairA: {
      text: '어려움은 성장의 기회다',
      score: 'adaptive_coping',
      weight: +1,
    },
    pairB: {
      text: '문제가 생기면 압도당하는 느낌이다',
      score: 'overwhelmed',
      weight: -1,
    },
  },

  // 4. Social Energy (사회적 에너지)
  {
    id: 'insight_04',
    category: 'social_energy',
    categoryName: '사회적 에너지',
    pairA: {
      text: '혼자 있는 시간이 나를 회복시킨다',
      score: 'introverted',
      weight: 0, // 중립 (성향 차이)
    },
    pairB: {
      text: '사람들과 함께 있을 때 에너지를 얻는다',
      score: 'extroverted',
      weight: 0, // 중립 (성향 차이)
    },
  },

  // 5. Emotion Regulation (감정 조절)
  {
    id: 'insight_05',
    category: 'emotion_regulation',
    categoryName: '감정 조절',
    pairA: {
      text: '내 감정을 있는 그대로 받아들인다',
      score: 'accepting',
      weight: +1,
    },
    pairB: {
      text: '부정적인 감정은 숨기려고 노력한다',
      score: 'suppressing',
      weight: -1,
    },
  },

  // 6. Future Orientation (미래 지향성)
  {
    id: 'insight_06',
    category: 'future_orientation',
    categoryName: '미래 지향성',
    pairA: {
      text: '앞으로 좋은 일이 생길 거라 믿는다',
      score: 'hopeful',
      weight: +1,
    },
    pairB: {
      text: '미래가 불확실하고 불안하다',
      score: 'anxious',
      weight: -1,
    },
  },

  // 7. Perfectionism (완벽주의)
  {
    id: 'insight_07',
    category: 'perfectionism',
    categoryName: '완벽주의',
    pairA: {
      text: '실수는 배움의 과정이다',
      score: 'flexible',
      weight: +1,
    },
    pairB: {
      text: '완벽하지 않으면 의미가 없다',
      score: 'perfectionistic',
      weight: -1,
    },
  },

  // 8. Self-Compassion (자기 연민)
  {
    id: 'insight_08',
    category: 'self_compassion',
    categoryName: '자기 연민',
    pairA: {
      text: '힘들 때 스스로를 다독인다',
      score: 'compassionate',
      weight: +1,
    },
    pairB: {
      text: '실패하면 나 자신을 탓한다',
      score: 'self_blaming',
      weight: -1,
    },
  },

  // 9. Autonomy (자율성)
  {
    id: 'insight_09',
    category: 'autonomy',
    categoryName: '자율성',
    pairA: {
      text: '내 선택에 대한 확신이 있다',
      score: 'autonomous',
      weight: +1,
    },
    pairB: {
      text: '다른 사람의 기대에 맞춰 살고 있다',
      score: 'dependent',
      weight: -1,
    },
  },

  // 10. Growth Mindset (성장 마인드셋)
  {
    id: 'insight_10',
    category: 'growth_mindset',
    categoryName: '성장 마인드셋',
    pairA: {
      text: '노력하면 충분히 발전할 수 있다',
      score: 'growth_oriented',
      weight: +1,
    },
    pairB: {
      text: '타고난 재능이 전부를 결정한다',
      score: 'fixed_mindset',
      weight: -1,
    },
  },
];

/**
 * 카테고리별 설명
 */
export const categoryDescriptions = {
  self_perception: {
    name: '자기인식',
    description: '자신에 대한 전반적인 인식과 태도',
    positiveIndicator: '낙관적 자기인식',
    negativeIndicator: '자기비판적 경향',
  },
  self_worth: {
    name: '자존감',
    description: '자신의 가치에 대한 믿음',
    positiveIndicator: '건강한 자존감',
    negativeIndicator: '낮은 자존감',
  },
  stress_response: {
    name: '스트레스 대응',
    description: '어려운 상황에 대처하는 방식',
    positiveIndicator: '적응적 대처',
    negativeIndicator: '압도되는 경향',
  },
  social_energy: {
    name: '사회적 에너지',
    description: '대인관계에서 에너지를 얻는 방식',
    positiveIndicator: '내향성',
    negativeIndicator: '외향성',
    note: '이 카테고리는 성향 차이이며, 좋고 나쁨이 없음',
  },
  emotion_regulation: {
    name: '감정 조절',
    description: '감정을 다루는 방식',
    positiveIndicator: '수용적 태도',
    negativeIndicator: '감정 억압 경향',
  },
  future_orientation: {
    name: '미래 지향성',
    description: '미래에 대한 태도',
    positiveIndicator: '희망적',
    negativeIndicator: '불안 경향',
  },
  perfectionism: {
    name: '완벽주의',
    description: '실수와 불완전함에 대한 태도',
    positiveIndicator: '유연한 태도',
    negativeIndicator: '완벽주의 경향',
  },
  self_compassion: {
    name: '자기 연민',
    description: '자신을 대하는 방식',
    positiveIndicator: '자기 연민적',
    negativeIndicator: '자기 비난 경향',
  },
  autonomy: {
    name: '자율성',
    description: '자기 결정 능력',
    positiveIndicator: '자율적',
    negativeIndicator: '의존적 경향',
  },
  growth_mindset: {
    name: '성장 마인드셋',
    description: '능력의 변화 가능성에 대한 믿음',
    positiveIndicator: '성장 지향적',
    negativeIndicator: '고정 마인드셋',
  },
};

/**
 * 헬퍼 함수: 랜덤으로 문장 쌍 순서 섞기
 */
export const shuffleInsightSentences = () => {
  return [...insightSentences].sort(() => Math.random() - 0.5);
};

/**
 * 헬퍼 함수: 특정 카테고리 문장만 가져오기
 */
export const getSentencesByCategory = (category) => {
  return insightSentences.filter((pair) => pair.category === category);
};

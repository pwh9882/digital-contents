/**
 * Therapy Mode 문장 데이터
 *
 * @description 프로파일별 치료적 문장 (Self-Affirmation)
 * 4개 프로파일 × 5개 문장 = 총 20개
 *
 * 출처: AGENTS.md 프로젝트 개요 참고
 * 과학적 근거: Self-Affirmation Theory (Steele, 1988; Cohen & Sherman, 2014)
 */

export const therapySentences = {
  // 프로파일 1: 자존감 향상형 (Self-Esteem Enhancement)
  self_esteem: {
    profileName: '자존감 향상',
    profileDescription: '자신의 가치를 인정하고 긍정적 자아상을 구축합니다',
    color: '#9C27B0', // Purple
    icon: '💜',
    sentences: [
      {
        id: 'self_esteem_01',
        text: '나는 충분히 노력하고 있으며, 그것만으로도 가치 있다',
        difficulty: 'beginner',
        therapeuticIntent: '노력 자체의 가치 인정 (과정 중심적 사고)',
        scientificBasis: 'Growth Mindset (Dweck, 2006)',
      },
      {
        id: 'self_esteem_02',
        text: '나는 나만의 속도로 성장하고 있다',
        difficulty: 'beginner',
        therapeuticIntent: '비교 없는 자기 수용',
        scientificBasis: 'Self-Compassion (Neff, 2003)',
      },
      {
        id: 'self_esteem_03',
        text: '내 존재 자체가 의미 있고 소중하다',
        difficulty: 'intermediate',
        therapeuticIntent: '무조건적 자기 가치 인정',
        scientificBasis: 'Unconditional Positive Regard (Rogers, 1957)',
      },
      {
        id: 'self_esteem_04',
        text: '나는 실수할 권리가 있으며, 그것이 나를 정의하지 않는다',
        difficulty: 'intermediate',
        therapeuticIntent: '실수와 자아 분리',
        scientificBasis: 'Cognitive Defusion (ACT)',
      },
      {
        id: 'self_esteem_05',
        text: '나는 나의 가장 든든한 지지자가 될 수 있다',
        difficulty: 'advanced',
        therapeuticIntent: '내면의 지원 시스템 구축',
        scientificBasis: 'Internal Working Model (Bowlby, 1969)',
      },
    ],
  },

  // 프로파일 2: 스트레스 관리형 (Stress Management)
  stress_management: {
    profileName: '스트레스 관리',
    profileDescription: '어려운 상황을 적응적으로 대처하고 회복력을 키웁니다',
    color: '#2196F3', // Blue
    icon: '💙',
    sentences: [
      {
        id: 'stress_01',
        text: '이 순간의 어려움도 지나갈 것이다',
        difficulty: 'beginner',
        therapeuticIntent: '일시성 인식 (영구성 편향 교정)',
        scientificBasis: 'Cognitive Restructuring (Beck, 1976)',
      },
      {
        id: 'stress_02',
        text: '나는 이전에도 어려움을 극복한 경험이 있다',
        difficulty: 'beginner',
        therapeuticIntent: '과거 성공 경험 회상 (자기효능감)',
        scientificBasis: 'Self-Efficacy (Bandura, 1977)',
      },
      {
        id: 'stress_03',
        text: '스트레스는 나를 무너뜨리는 것이 아니라, 더 강하게 만드는 과정이다',
        difficulty: 'intermediate',
        therapeuticIntent: '스트레스 재해석 (위협 → 도전)',
        scientificBasis: 'Stress-is-Enhancing Mindset (Crum et al., 2013)',
      },
      {
        id: 'stress_04',
        text: '한 번에 하나씩, 지금 할 수 있는 것에 집중한다',
        difficulty: 'intermediate',
        therapeuticIntent: '압도감 감소 (작은 단계로 분해)',
        scientificBasis: 'Problem-Focused Coping (Lazarus & Folkman, 1984)',
      },
      {
        id: 'stress_05',
        text: '나는 쉼이 필요할 때 쉴 수 있는 지혜를 가졌다',
        difficulty: 'advanced',
        therapeuticIntent: '자기돌봄의 중요성 인식',
        scientificBasis: 'Self-Care as Resilience (Neff & Germer, 2018)',
      },
    ],
  },

  // 프로파일 3: 감정 조절형 (Emotion Regulation)
  emotion_control: {
    profileName: '감정 조절',
    profileDescription: '감정을 건강하게 인식하고 표현하는 방법을 배웁니다',
    color: '#4CAF50', // Green
    icon: '💚',
    sentences: [
      {
        id: 'emotion_01',
        text: '오늘 내가 느끼는 감정을 있는 그대로 받아들인다',
        difficulty: 'beginner',
        therapeuticIntent: '감정 수용 (억압 방지)',
        scientificBasis: 'Emotional Acceptance (Hayes et al., 1999)',
      },
      {
        id: 'emotion_02',
        text: '불편한 감정도 내 일부이며, 나를 보호하려는 신호다',
        difficulty: 'beginner',
        therapeuticIntent: '감정의 기능 이해',
        scientificBasis: 'Emotion as Information (Schwarz, 2012)',
      },
      {
        id: 'emotion_03',
        text: '나는 감정에 휩쓸리지 않고, 관찰할 수 있다',
        difficulty: 'intermediate',
        therapeuticIntent: '감정과 거리두기 (탈동일시)',
        scientificBasis: 'Mindful Observation (Kabat-Zinn, 1990)',
      },
      {
        id: 'emotion_04',
        text: '감정을 억누르는 대신, 건강한 방식으로 표현한다',
        difficulty: 'intermediate',
        therapeuticIntent: '적응적 감정 표현',
        scientificBasis: 'Emotional Expression (Pennebaker, 1997)',
      },
      {
        id: 'emotion_05',
        text: '나는 감정의 파도를 타는 법을 배우고 있다',
        difficulty: 'advanced',
        therapeuticIntent: '감정 조절 역량 자신감',
        scientificBasis: 'Emotion Regulation Skills (Gratz & Roemer, 2004)',
      },
    ],
  },

  // 프로파일 4: 동기부여형 (Motivation Enhancement)
  motivation: {
    profileName: '동기부여',
    profileDescription: '목표를 향한 내적 동기와 끈기를 강화합니다',
    color: '#FF9800', // Orange
    icon: '🧡',
    sentences: [
      {
        id: 'motivation_01',
        text: '작은 시작이 큰 변화를 만든다',
        difficulty: 'beginner',
        therapeuticIntent: '행동 활성화 (완벽주의 극복)',
        scientificBasis: 'Behavioral Activation (Martell et al., 2001)',
      },
      {
        id: 'motivation_02',
        text: '나는 오늘도 한 걸음 앞으로 나아가고 있다',
        difficulty: 'beginner',
        therapeuticIntent: '진행 과정 인식 (정체감 극복)',
        scientificBasis: 'Progress Principle (Amabile & Kramer, 2011)',
      },
      {
        id: 'motivation_03',
        text: '실패는 끝이 아니라, 배움의 시작이다',
        difficulty: 'intermediate',
        therapeuticIntent: '실패 재구성 (성장 기회)',
        scientificBasis: 'Failure Tolerance (Dweck, 2006)',
      },
      {
        id: 'motivation_04',
        text: '나는 내가 원하는 미래를 만들어갈 힘이 있다',
        difficulty: 'intermediate',
        therapeuticIntent: '통제감 및 주도성 강화',
        scientificBasis: 'Locus of Control (Rotter, 1966)',
      },
      {
        id: 'motivation_05',
        text: '어제의 나보다 나은 사람이 되는 것, 그것으로 충분하다',
        difficulty: 'advanced',
        therapeuticIntent: '자기 중심적 기준 (타인 비교 탈피)',
        scientificBasis: 'Self-Determination Theory (Deci & Ryan, 1985)',
      },
    ],
  },

  // 프로파일 5: 데모/체험 모드 (Demo Mode)
  // Insight Mode를 완료하지 않은 사용자를 위한 중립적 긍정 문장
  demo: {
    profileName: '체험 모드',
    profileDescription: '다양한 긍정 문장으로 TheraType을 경험해보세요',
    color: '#607D8B', // Blue Grey
    icon: '✨',
    sentences: [
      {
        id: 'demo_01',
        text: '오늘 하루도 잘 버텨냈다',
        difficulty: 'beginner',
        therapeuticIntent: '일상의 노력 인정',
        scientificBasis: 'Self-Affirmation Theory (Steele, 1988)',
      },
      {
        id: 'demo_02',
        text: '나는 나만의 속도로 나아간다',
        difficulty: 'beginner',
        therapeuticIntent: '자기 수용',
        scientificBasis: 'Self-Compassion (Neff, 2003)',
      },
      {
        id: 'demo_03',
        text: '어려운 순간도 성장의 기회가 될 수 있다',
        difficulty: 'intermediate',
        therapeuticIntent: '긍정적 재해석',
        scientificBasis: 'Cognitive Reframing (Beck, 1976)',
      },
      {
        id: 'demo_04',
        text: '나는 충분히 잘하고 있다',
        difficulty: 'intermediate',
        therapeuticIntent: '자기 긍정',
        scientificBasis: 'Positive Psychology (Seligman, 2002)',
      },
      {
        id: 'demo_05',
        text: '지금 이 순간을 소중히 여긴다',
        difficulty: 'beginner',
        therapeuticIntent: '현재 순간 집중',
        scientificBasis: 'Mindfulness (Kabat-Zinn, 1990)',
      },
    ],
  },
};

/**
 * 프로파일 점수 기반 매칭 로직
 * Insight Mode 결과에서 가장 낮은 점수의 카테고리를 프로파일로 할당
 *
 * @param {Object} insightScores - Insight Mode 점수
 *   예: { self_worth: 45, stress_response: 60, emotion_regulation: 55, ... }
 * @returns {string} 할당된 프로파일 키 ('self_esteem', 'stress_management', 등)
 */
export const assignProfile = (insightScores) => {
  // 카테고리 → 프로파일 매핑
  const categoryToProfile = {
    self_perception: 'self_esteem',
    self_worth: 'self_esteem',
    self_compassion: 'self_esteem',
    stress_response: 'stress_management',
    future_orientation: 'stress_management',
    emotion_regulation: 'emotion_control',
    perfectionism: 'emotion_control',
    autonomy: 'motivation',
    growth_mindset: 'motivation',
  };

  // 가장 낮은 점수의 카테고리 찾기
  let lowestCategory = null;
  let lowestScore = 100;

  for (const [category, score] of Object.entries(insightScores)) {
    if (score < lowestScore) {
      lowestScore = score;
      lowestCategory = category;
    }
  }

  // 매핑된 프로파일 반환 (기본값: self_esteem)
  return categoryToProfile[lowestCategory] || 'self_esteem';
};

/**
 * 프로파일별 문장 가져오기
 *
 * @param {string} profileKey - 프로파일 키
 * @returns {Object} 프로파일 데이터 (name, sentences 등)
 */
export const getSentencesByProfile = (profileKey) => {
  // profileKey가 없거나 유효하지 않으면 demo 프로파일 사용
  return therapySentences[profileKey] || therapySentences.demo;
};

/**
 * 난이도별 문장 필터링
 *
 * @param {string} profileKey - 프로파일 키
 * @param {string} difficulty - 'beginner' | 'intermediate' | 'advanced'
 * @returns {Array} 해당 난이도 문장 배열
 */
export const getSentencesByDifficulty = (profileKey, difficulty) => {
  const profile = therapySentences[profileKey];
  if (!profile) return [];

  return profile.sentences.filter((s) => s.difficulty === difficulty);
};

/**
 * 마스터 진행도 계산
 * 문장을 3번 이상 정확도 90% 이상으로 완료하면 "마스터"로 간주
 *
 * @param {Array} sessionHistory - 세션 기록 배열
 *   예: [{ sentenceId: 'self_esteem_01', accuracy: 95, wpm: 45 }, ...]
 * @returns {Object} { masteredCount, totalCount, masteredSentences }
 */
export const calculateMasteryProgress = (sessionHistory, profileKey) => {
  const profile = therapySentences[profileKey];
  if (!profile) return { masteredCount: 0, totalCount: 0, masteredSentences: [] };

  const totalCount = profile.sentences.length;
  const masteredSentences = [];

  profile.sentences.forEach((sentence) => {
    const attempts = sessionHistory.filter((s) => s.sentenceId === sentence.id);
    const successfulAttempts = attempts.filter(
      (s) => s.accuracy >= 90 && s.wpm >= 20 // 정확도 90% 이상, WPM 20 이상
    );

    if (successfulAttempts.length >= 3) {
      masteredSentences.push(sentence.id);
    }
  });

  return {
    masteredCount: masteredSentences.length,
    totalCount,
    masteredSentences,
    progress: Math.round((masteredSentences.length / totalCount) * 100),
  };
};

/**
 * 다음 연습 문장 추천
 * 마스터하지 못한 문장 중 가장 시도 횟수가 적은 문장 우선
 *
 * @param {Array} sessionHistory - 세션 기록 배열
 * @param {string} profileKey - 프로파일 키
 * @returns {Object} 추천 문장
 */
export const recommendNextSentence = (sessionHistory, profileKey) => {
  const profile = therapySentences[profileKey];
  if (!profile) return null;

  const { masteredSentences } = calculateMasteryProgress(sessionHistory, profileKey);

  // 마스터하지 못한 문장들
  const unmastered = profile.sentences.filter(
    (s) => !masteredSentences.includes(s.id)
  );

  if (unmastered.length === 0) {
    // 모두 마스터했으면 가장 오래된 것 복습
    return profile.sentences[0];
  }

  // 시도 횟수가 가장 적은 문장 찾기
  const sentenceAttempts = unmastered.map((sentence) => {
    const attempts = sessionHistory.filter((s) => s.sentenceId === sentence.id).length;
    return { sentence, attempts };
  });

  sentenceAttempts.sort((a, b) => a.attempts - b.attempts);

  return sentenceAttempts[0].sentence;
};

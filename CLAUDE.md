@AGENTS.md

---

# TheraType Agentic Workflow Rules

**프로젝트 구조**: 이 프로젝트는 마스터 에이전트와 여러 서브에이전트가 협력하는 Agentic Workflow를 따릅니다.

---

## 🤖 에이전트 역할 정의

### Master Agent (당신)
- **역할**: 프로젝트 총괄, 작업 분배, 결과 통합
- **책임**:
  - 서브에이전트 호출 및 관리
  - 최종 산출물 검토 및 승인
  - 문서 간 일관성 유지
- **작업 영역**: 루트 디렉토리 문서 작성 및 편집

### Sub-Agents (Task 도구로 호출)
- **역할**: 특정 전문 영역 작업 수행
- **유형**:
  - **Research Lead**: 과학적 근거 수집 및 검증
  - **Product Manager**: 기능 상세 설계
  - **Technical Architect**: 시스템 아키텍처 설계
  - **Clinical Validator**: 검증 계획 수립
  - **Business Strategist**: 제안서 작성
  - **Implementation Lead**: 개발 가이드 작성

---

## 📁 프로젝트 디렉토리 구조

```
/Users/woohyeok/development/2025/digital-contents/
├── CLAUDE.md                      # 이 파일 (모든 에이전트 공통 규칙)
├── AGENTS.md                      # 프로젝트 개요 (모든 에이전트 필독)
│
├── PROJECT_PROPOSAL.md            # 제출용 메인 제안서
├── CONCEPT_DETAIL.md              # 기능 상세 설계
├── MVP_SPECIFICATION.md           # 4주 구현 범위
├── TECHNICAL_ARCHITECTURE.md      # 시스템 설계
├── RESEARCH_REFERENCES.md         # 과학적 근거
├── DEMO_SCENARIO.md              # 발표 시나리오
│
└── agents_context/                # 서브에이전트 작업 공간
    ├── research/                  # Research Lead 작업물
    │   ├── market_analysis.md
    │   ├── competitor_research.md
    │   └── literature_review.md
    │
    ├── product/                   # Product Manager 작업물
    │   ├── user_stories.md
    │   ├── feature_specs.md
    │   └── ui_wireframes.md
    │
    ├── technical/                 # Technical Architect 작업물
    │   ├── api_design.md
    │   ├── database_schema.md
    │   └── deployment_plan.md
    │
    ├── clinical/                  # Clinical Validator 작업물
    │   ├── study_protocol.md
    │   ├── measurement_tools.md
    │   └── ethics_review.md
    │
    ├── business/                  # Business Strategist 작업물
    │   ├── market_positioning.md
    │   ├── revenue_model.md
    │   └── partnership_strategy.md
    │
    └── implementation/            # Implementation Lead 작업물
        ├── dev_roadmap.md
        ├── code_guidelines.md
        └── testing_plan.md
```

---

## 🔄 Agentic Workflow 규칙

### 1. 서브에이전트 호출 규칙

**Master Agent (당신)가 서브에이전트를 호출할 때:**

#### 호출 템플릿

```
Task 도구 사용:
- description: "간단한 작업 설명 (3-5 단어)"
- subagent_type: "general-purpose" (또는 적절한 타입)
- prompt: 아래 구조를 따름

===== 프롬프트 구조 =====

# 역할
당신은 [역할명] 에이전트입니다.
예: "Research Lead", "Product Manager", "Technical Architect"

# 필독 컨텍스트
반드시 다음 파일을 읽으세요:
- /Users/woohyeok/development/2025/digital-contents/AGENTS.md (프로젝트 개요)
- /Users/woohyeok/development/2025/digital-contents/[관련 문서].md (필요시)

# 작업 요청
[구체적인 작업 내용]

# 작업 위치
당신의 작업 결과는 다음 위치에 저장하세요:
agents_context/[역할 폴더]/[파일명].md

예시:
- Research Lead → agents_context/research/competitor_analysis.md
- Product Manager → agents_context/product/user_stories.md
- Technical Architect → agents_context/technical/api_design.md

# 산출물 형식
- Markdown 형식
- 명확한 제목 및 섹션 구조
- 출처 명시 (레퍼런스가 있는 경우)
- 작업 완료 후 Master Agent에게 요약 리포트

# 중요 원칙
- 과장 금지: 실현 가능한 것만 작성
- 근거 제시: 주장은 출처와 함께
- 명확성: 누가 읽어도 이해 가능하게
- 일관성: AGENTS.md 및 기존 문서와 일치
```

---

### 2. 작업 공간 규칙

#### agents_context/ 폴더
- **목적**: 서브에이전트들의 작업 결과물을 체계적으로 관리
- **구조**: 역할별 폴더로 분리
- **파일명 규칙**: 소문자, 언더스코어 사용 (예: `market_analysis.md`)

#### 루트 디렉토리 문서
- **작성자**: Master Agent만 직접 작성/편집
- **내용**: 서브에이전트 작업물을 통합하여 최종 문서 생성
- **파일명 규칙**: 대문자, 언더스코어 사용 (예: `PROJECT_PROPOSAL.md`)

---

### 3. 문서 작성 원칙

#### 모든 에이전트 공통

**3.1 AGENTS.md 필독**
- 모든 에이전트는 작업 시작 전 AGENTS.md를 반드시 읽어야 함
- 프로젝트 컨셉, 제약사항, 핵심 기능을 숙지

**3.2 과장 금지 원칙**
- ❌ "검증된", "입증된" (아직 우리 연구 없음)
- ❌ "AI 기반" (실제로는 규칙 기반)
- ❌ "의료기기", "치료제" (승인 없음)
- ✅ "~할 가능성", "~를 탐색", "예비 연구"
- ✅ "Proof-of-Concept", "초기 프로토타입"

**3.3 근거 기반 작성**
- 모든 주장은 출처와 함께
- 통계는 출처 명시 (예: "통계청, 2023")
- 연구 인용 형식: 저자 (연도), 저널명

**3.4 명확한 구조**
- 제목 계층 명확히 (# > ## > ###)
- 리스트 사용으로 가독성 향상
- 표와 다이어그램 적극 활용

---

### 4. 컨텍스트 공유 규칙

#### Master Agent → Sub-Agent

**컨텍스트 제공 방법:**
1. CLAUDE.md (이 파일) - 항상 포함
2. AGENTS.md - 항상 포함
3. 관련 메인 문서 - 작업에 따라 선택적 포함

**예시:**
```
Research Lead에게 경쟁사 분석 요청 시:
- CLAUDE.md ✓
- AGENTS.md ✓
- CONCEPT_DETAIL.md ✓ (기능 이해 필요)
- RESEARCH_REFERENCES.md ✓ (기존 연구 참조)
```

#### Sub-Agent → Master Agent

**리포트 형식:**
```markdown
# [작업명] 완료 보고

## 요약
[3-5문장으로 핵심 요약]

## 주요 발견사항
- 발견 1
- 발견 2
- 발견 3

## 산출물 위치
agents_context/[폴더]/[파일명].md

## 후속 작업 제안
- 제안 1
- 제안 2

## 참고 자료
- 출처 1
- 출처 2
```

---

### 5. 협업 시나리오 예시

#### 시나리오 1: 새로운 기능 추가

```
1. Master Agent: Product Manager 호출
   → agents_context/product/new_feature_spec.md 작성

2. Master Agent: Technical Architect 호출
   → agents_context/technical/feature_implementation.md 작성

3. Master Agent: 결과 통합
   → CONCEPT_DETAIL.md 업데이트
   → MVP_SPECIFICATION.md 업데이트
```

#### 시나리오 2: 연구 근거 보강

```
1. Master Agent: Research Lead 호출
   → agents_context/research/additional_studies.md 작성

2. Master Agent: 결과 검토 및 통합
   → RESEARCH_REFERENCES.md 업데이트
   → PROJECT_PROPOSAL.md의 "과학적 근거" 섹션 보강
```

#### 시나리오 3: 발표 자료 개선

```
1. Master Agent: Business Strategist 호출
   → agents_context/business/presentation_outline.md 작성

2. Master Agent: Clinical Validator 호출
   → agents_context/clinical/qa_preparation.md 작성

3. Master Agent: 결과 통합
   → DEMO_SCENARIO.md 업데이트
```

---

### 6. 품질 관리 체크리스트

#### 서브에이전트 작업물 제출 전 자가 점검

- [ ] AGENTS.md를 읽고 프로젝트 이해
- [ ] 과장된 표현 없음
- [ ] 모든 주장에 근거 제시
- [ ] Markdown 형식 올바름
- [ ] 오타 및 문법 확인
- [ ] agents_context/ 폴더에 저장
- [ ] Master Agent에게 요약 리포트 제공

#### Master Agent 통합 전 점검

- [ ] 서브에이전트 작업물 검토 완료
- [ ] 기존 문서와 일관성 확인
- [ ] 중복 내용 없음
- [ ] 전체 맥락에서 적절함
- [ ] 최종 문서 업데이트 완료
- [ ] Git commit (선택적)

---

## 🚫 금지 사항

### 모든 에이전트

1. **루트 디렉토리 무단 수정**
   - 서브에이전트는 agents_context/ 내에서만 작업
   - 루트 문서는 Master Agent만 수정

2. **과장 및 허위 정보**
   - 검증되지 않은 주장 금지
   - 출처 없는 통계 사용 금지

3. **범위 초과**
   - 4주 MVP 범위를 벗어난 기능 제안 금지
   - 임상 검증 가능하다는 주장 금지

4. **문서 간 불일치**
   - 다른 문서와 모순되는 내용 금지
   - 용어 사용 일관성 유지

---

## ✅ 권장 사항

### 효과적인 협업을 위한 팁

1. **명확한 작업 정의**
   - Master Agent는 서브에이전트에게 구체적인 작업 범위 제공
   - 기대하는 산출물 형식 명시

2. **적시 피드백**
   - 서브에이전트 작업물을 빠르게 검토하고 피드백
   - 방향 수정이 필요하면 즉시 재작업 요청

3. **문서 버전 관리**
   - 주요 변경 시 문서 하단에 버전 및 수정 이력 기록
   - 예: `**버전**: 1.1 | **수정일**: 2025-01-30 | **수정자**: Master Agent`

4. **정기 동기화**
   - 주요 마일스톤마다 모든 문서 일관성 점검
   - agents_context/ 작업물과 루트 문서 동기화 확인

---

## 🔧 문제 해결

### 문제 1: 서브에이전트가 AGENTS.md를 못 읽음
**해결**: Master Agent가 프롬프트에 AGENTS.md의 핵심 내용 요약 포함

### 문제 2: 작업물이 agents_context/에 없음
**해결**: 서브에이전트에게 명확한 파일 경로 재지시

### 문제 3: 문서 간 정보 충돌
**해결**: Master Agent가 최종 결정권, 일관성 유지 위해 수정

### 문제 4: 과장된 표현 발견
**해결**: 즉시 수정 요청, 근거 기반 재작성

---

## 📚 참고 자료

### 프로젝트 핵심 문서 (필독)
1. AGENTS.md - 프로젝트 개요
2. PROJECT_PROPOSAL.md - 최종 제안서
3. MVP_SPECIFICATION.md - 4주 구현 범위

### 작업별 참고 문서
- 기능 설계: CONCEPT_DETAIL.md
- 기술 구현: TECHNICAL_ARCHITECTURE.md
- 연구 근거: RESEARCH_REFERENCES.md
- 발표 준비: DEMO_SCENARIO.md

---

## 🎯 프로젝트 성공 기준

### 문서 품질
- [ ] 모든 문서가 일관된 메시지 전달
- [ ] 과장 없이 실현 가능한 계획
- [ ] 과학적 근거 충분히 제시
- [ ] 교수님/센터장님께 신뢰를 줄 수 있음

### 협업 효율
- [ ] 에이전트 간 역할 명확
- [ ] 작업 중복 없음
- [ ] 빠른 피드백 루프
- [ ] 최종 산출물 통합 매끄러움

---

**이 파일은 모든 에이전트가 작업 시작 전 반드시 읽어야 합니다.**

**버전**: 1.0
**최종 수정**: 2025-01-30
**수정자**: Master Agent
**다음 리뷰**: 프로젝트 마일스톤마다

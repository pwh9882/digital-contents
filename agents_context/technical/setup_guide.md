# TheraType 개발 환경 구축 가이드

**작성자**: Technical Architect Agent
**작성일**: 2025-01-30
**문서 목적**: 팀원이 로컬 개발 환경을 구축하기 위한 단계별 가이드

---

## 사전 요구사항

### 필수 소프트웨어

| 소프트웨어 | 최소 버전 | 권장 버전 | 설치 확인 명령어 |
|-----------|----------|----------|----------------|
| **Node.js** | 18.0.0 | 20.x LTS | `node -v` |
| **npm** | 8.0.0 | 10.x | `npm -v` |
| **Git** | 2.30.0 | 최신 | `git --version` |
| **VS Code** | 1.80.0 | 최신 | (GUI 확인) |

### Node.js 설치

**macOS** (Homebrew 사용):
```bash
brew install node@20
```

**Windows** (공식 인스톨러):
1. https://nodejs.org/en 접속
2. "20.x LTS" 다운로드
3. 설치 프로그램 실행

**설치 확인**:
```bash
node -v
# 출력: v20.11.0 (또는 유사 버전)

npm -v
# 출력: 10.2.4 (또는 유사 버전)
```

---

## 1단계: 프로젝트 생성

### 1.1 Vite + React 프로젝트 초기화

```bash
# 프로젝트 생성
npm create vite@latest theratype -- --template react

# 디렉토리 이동
cd theratype

# 의존성 설치
npm install
```

**예상 출력**:
```
✔ Select a framework: › React
✔ Select a variant: › JavaScript

Scaffolding project in /Users/.../theratype...

Done. Now run:

  cd theratype
  npm install
  npm run dev
```

---

### 1.2 Git 저장소 초기화

```bash
# Git 초기화
git init

# .gitignore 생성 (이미 존재하면 스킵)
cat > .gitignore << 'EOF'
# Dependencies
node_modules/

# Build output
dist/

# Environment variables
.env.local
.env.production

# Firebase
.firebase/
firebase-debug.log

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*

# Testing
coverage/
EOF

# 초기 커밋
git add .
git commit -m "Initial commit: Vite + React setup"
```

---

### 1.3 GitHub 저장소 연결

**옵션 A: GitHub CLI 사용** (권장):
```bash
# GitHub CLI 설치 (없으면)
brew install gh  # macOS
# 또는 https://cli.github.com/

# GitHub 로그인
gh auth login

# 저장소 생성 및 푸시
gh repo create theratype-mvp --private --source=. --push
```

**옵션 B: 수동 연결**:
```bash
# GitHub 웹에서 저장소 생성 후
git remote add origin https://github.com/YOUR_USERNAME/theratype-mvp.git
git branch -M main
git push -u origin main
```

---

## 2단계: 의존성 설치

### 2.1 프론트엔드 라이브러리

```bash
# React Router (라우팅)
npm install react-router-dom

# Chart.js (데이터 시각화)
npm install chart.js react-chartjs-2

# Firebase (백엔드)
npm install firebase
```

**설치 확인**:
```bash
npm list react-router-dom chart.js firebase
# 각 패키지 버전 출력 확인
```

---

### 2.2 Tailwind CSS 설정

```bash
# Tailwind 설치
npm install -D tailwindcss postcss autoprefixer

# 설정 파일 생성
npx tailwindcss init -p
```

**tailwind.config.js 수정**:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5',
          dark: '#4338CA',
          light: '#6366F1',
        },
        secondary: {
          DEFAULT: '#10B981',
          dark: '#059669',
          light: '#34D399',
        },
        accent: '#F59E0B',
      },
      fontFamily: {
        sans: ['Pretendard', '-apple-system', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

**src/index.css 수정** (Tailwind import 추가):
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 커스텀 스타일은 여기 아래에 추가 */
body {
  font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
}
```

---

### 2.3 개발 도구 설치

```bash
# ESLint (코드 품질)
npm install -D eslint eslint-plugin-react

# Prettier (코드 포매팅)
npm install -D prettier

# Vitest (테스팅, 선택적)
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

---

### 2.4 ESLint 설정

**.eslintrc.json 생성**:
```bash
cat > .eslintrc.json << 'EOF'
{
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime"
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "react/prop-types": "off",
    "no-unused-vars": "warn"
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
EOF
```

---

### 2.5 Prettier 설정

**.prettierrc 생성**:
```bash
cat > .prettierrc << 'EOF'
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80
}
EOF
```

---

### 2.6 package.json 스크립트 추가

**package.json 수정** (scripts 섹션):
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext js,jsx",
    "lint:fix": "eslint . --ext js,jsx --fix",
    "format": "prettier --write \"src/**/*.{js,jsx,css}\"",
    "test": "vitest",
    "deploy": "npm run build && firebase deploy"
  }
}
```

---

## 3단계: Firebase 설정

### 3.1 Firebase 프로젝트 생성

1. **Firebase Console 접속**: https://console.firebase.google.com/
2. **"프로젝트 추가"** 클릭
3. 프로젝트 이름: `theratype-mvp`
4. Google Analytics: **선택 해제** (MVP에 불필요)
5. "프로젝트 만들기" 클릭

---

### 3.2 Firebase 앱 등록

1. Firebase Console에서 "웹 앱 추가" (</> 아이콘)
2. 앱 닉네임: `TheraType Web`
3. Firebase Hosting: **체크**
4. "앱 등록" 클릭
5. **Firebase 설정 정보 복사** (나중에 사용)

```javascript
// 예시 (실제 값은 Firebase Console에서 확인)
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "theratype-mvp.firebaseapp.com",
  projectId: "theratype-mvp",
  storageBucket: "theratype-mvp.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijk123456"
};
```

---

### 3.3 Firebase CLI 설치

```bash
# Firebase CLI 설치 (글로벌)
npm install -g firebase-tools

# 버전 확인
firebase --version
# 출력: 13.0.0 (또는 유사)

# Firebase 로그인
firebase login
# 브라우저에서 Google 계정으로 로그인
```

---

### 3.4 Firebase 프로젝트 초기화

```bash
# Firebase 초기화 (프로젝트 루트에서 실행)
firebase init

# 선택 사항:
# ◉ Firestore
# ◉ Hosting
# (Space로 선택, Enter로 다음)

# Firestore 설정:
# - firestore.rules: 기본 파일명 사용
# - firestore.indexes.json: 기본 파일명 사용

# Hosting 설정:
# - What do you want to use as your public directory? → dist
# - Configure as a single-page app? → Yes
# - Set up automatic builds with GitHub? → No (지금은 수동)
```

**생성된 파일들**:
- `firebase.json`
- `firestore.rules`
- `firestore.indexes.json`
- `.firebaserc`

---

### 3.5 환경 변수 설정

**.env.example 생성** (Git에 포함):
```bash
cat > .env.example << 'EOF'
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdefg
EOF
```

**.env.local 생성** (Git에 미포함, 실제 값 입력):
```bash
cat > .env.local << 'EOF'
# Firebase Configuration (Development)
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=theratype-mvp.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=theratype-mvp
VITE_FIREBASE_STORAGE_BUCKET=theratype-mvp.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdefghijk123456
EOF
```

**중요**: `.env.local`에 실제 Firebase 설정 값을 입력하세요!

---

### 3.6 Firebase 서비스 활성화

**Firebase Console에서 수동 설정**:

1. **Authentication 설정**:
   - 좌측 메뉴 → "Authentication"
   - "시작하기" 클릭
   - "Sign-in method" 탭
   - "이메일/비밀번호" 활성화
   - "저장"

2. **Firestore 생성**:
   - 좌측 메뉴 → "Firestore Database"
   - "데이터베이스 만들기" 클릭
   - 위치: `asia-northeast3` (서울)
   - 보안 규칙: **테스트 모드로 시작** (나중에 프로덕션 모드로 변경)
   - "완료"

---

### 3.7 Firebase 초기화 코드 작성

**src/services/firebase.js 생성**:
```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// 서비스 export
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
```

---

## 4단계: 프로젝트 디렉토리 구조 생성

```bash
# src 하위 디렉토리 생성
mkdir -p src/{components,pages,contexts,hooks,utils,services,data,styles}
mkdir -p src/components/{common,layout,auth,insight,therapy,dashboard}

# 디렉토리 확인
tree src -L 2
```

**예상 출력**:
```
src
├── components
│   ├── auth
│   ├── common
│   ├── dashboard
│   ├── insight
│   ├── layout
│   └── therapy
├── contexts
├── data
├── hooks
├── pages
├── services
├── styles
└── utils
```

---

## 5단계: 개발 서버 실행

### 5.1 첫 실행

```bash
npm run dev
```

**예상 출력**:
```
VITE v5.0.10  ready in 450 ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

**브라우저에서 확인**: http://localhost:3000

---

### 5.2 기본 테스트 컴포넌트 작성

**src/App.jsx 수정**:
```javascript
import React from 'react';
import { auth } from './services/firebase';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-primary">
          TheraType MVP
        </h1>
        <p className="mt-4 text-gray-600">
          개발 환경 구축 완료!
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Firebase 연결 상태: {auth ? '✅ 연결됨' : '❌ 연결 안 됨'}
        </p>
      </div>
    </div>
  );
}

export default App;
```

**브라우저 새로고침**: "TheraType MVP" 화면 확인

---

## 6단계: VS Code 확장 설치

### 추천 확장

**필수 확장**:
1. **ESLint** (`dbaeumer.vscode-eslint`)
2. **Prettier** (`esbenp.prettier-vscode`)
3. **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`)

**선택적 확장**:
4. **ES7+ React Snippets** (`dsznajder.es7-react-js-snippets`)
5. **Firebase Explorer** (`firebase.vscode-firebase-explorer`)
6. **GitLens** (`eamodio.gitlens`)

**설치 방법**:
```bash
# 명령어로 일괄 설치
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
code --install-extension dsznajder.es7-react-js-snippets
```

---

### VS Code 설정

**.vscode/settings.json 생성**:
```bash
mkdir .vscode
cat > .vscode/settings.json << 'EOF'
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "css.validate": false,
  "tailwindCSS.experimental.classRegex": [
    ["className\\s*=\\s*['\"]([^'\"]*)['\"]", "([^'\"]*)"]
  ]
}
EOF
```

---

## 7단계: 첫 배포 (Firebase Hosting)

### 7.1 빌드

```bash
npm run build
```

**예상 출력**:
```
vite v5.0.10 building for production...
✓ 125 modules transformed.
dist/index.html                   0.46 kB │ gzip: 0.30 kB
dist/assets/index-a1b2c3d4.css    5.21 kB │ gzip: 1.42 kB
dist/assets/index-a1b2c3d4.js   143.21 kB │ gzip: 46.32 kB
✓ built in 1.85s
```

---

### 7.2 배포

```bash
firebase deploy --only hosting
```

**예상 출력**:
```
=== Deploying to 'theratype-mvp'...

✔  hosting: preparing dist directory for upload...
✔  hosting: uploading files...
✔  hosting: Deploy complete!

Project Console: https://console.firebase.google.com/project/theratype-mvp
Hosting URL: https://theratype-mvp.web.app
```

**브라우저에서 확인**: `https://theratype-mvp.web.app`

---

## 8단계: 팀원 온보딩

### 새로운 팀원이 합류했을 때

**팀원이 실행할 명령어**:

```bash
# 1. 저장소 클론
git clone https://github.com/YOUR_USERNAME/theratype-mvp.git
cd theratype-mvp

# 2. 의존성 설치
npm install

# 3. 환경 변수 설정 (.env.local 생성 필요)
cp .env.example .env.local
# .env.local 파일을 열어서 실제 Firebase 값 입력 (팀장에게 요청)

# 4. 개발 서버 실행
npm run dev
```

**환경 변수 공유 방법** (보안):
- **방법 1**: 1Password, LastPass 등 팀 비밀번호 관리 도구
- **방법 2**: 암호화된 Google Drive 문서
- **절대 금지**: GitHub에 커밋, Slack에 평문 전송

---

## 문제 해결 (Troubleshooting)

### 문제 1: `npm install` 실패

**증상**:
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**해결책**:
```bash
# 1. node_modules 및 lock 파일 삭제
rm -rf node_modules package-lock.json

# 2. npm 캐시 정리
npm cache clean --force

# 3. 재설치
npm install
```

---

### 문제 2: Firebase 연결 오류

**증상**:
```
FirebaseError: Firebase: Error (auth/configuration-not-found)
```

**원인**: `.env.local` 파일 누락 또는 잘못된 설정

**해결책**:
```bash
# 1. .env.local 파일 존재 확인
ls -la .env.local

# 2. 환경 변수 확인 (개발 서버 재시작 필요)
npm run dev

# 3. Firebase Console에서 설정 값 재확인
```

---

### 문제 3: Tailwind 스타일 적용 안 됨

**증상**: `className`에 Tailwind 클래스 작성했는데 스타일 미적용

**해결책**:
```bash
# 1. tailwind.config.js의 content 경로 확인
cat tailwind.config.js
# content: ["./index.html", "./src/**/*.{js,jsx}"] 확인

# 2. src/index.css에 Tailwind import 확인
cat src/index.css
# @tailwind base; 등 3줄 확인

# 3. 개발 서버 재시작
npm run dev
```

---

### 문제 4: 포트 충돌

**증상**:
```
Port 3000 is already in use
```

**해결책**:
```bash
# 옵션 1: 다른 포트 사용
npm run dev -- --port 3001

# 옵션 2: 기존 프로세스 종료 (macOS/Linux)
lsof -ti:3000 | xargs kill -9
```

---

## 다음 단계

1. ✅ 개발 환경 구축 완료
2. 다음: **Database Schema 상세 설계** (`database_schema.md`)
3. 다음: **첫 컴포넌트 개발** (Button, Input 등)

---

## 체크리스트

- [ ] Node.js 20.x 설치 확인
- [ ] Vite + React 프로젝트 생성
- [ ] Git 초기화 및 GitHub 연결
- [ ] 의존성 설치 (React Router, Chart.js, Firebase)
- [ ] Tailwind CSS 설정
- [ ] ESLint, Prettier 설정
- [ ] Firebase 프로젝트 생성
- [ ] Firebase CLI 설치 및 로그인
- [ ] Firebase 초기화 (Firestore, Hosting)
- [ ] .env.local 설정 (Firebase 값 입력)
- [ ] 개발 서버 실행 확인 (http://localhost:3000)
- [ ] Firebase 연결 확인 (App.jsx 테스트)
- [ ] VS Code 확장 설치
- [ ] 첫 배포 성공 (Firebase Hosting)

---

**문서 버전**: 1.0
**최종 수정**: 2025-01-30
**작성자**: Technical Architect Agent

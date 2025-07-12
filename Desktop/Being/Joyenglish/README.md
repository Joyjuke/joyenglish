# Joy English Dance Studio

Movement Studios 웹사이트에서 영감을 받아 만든 모던한 댄스 스튜디오 웹사이트입니다.

## 🎯 주요 기능

- **반응형 디자인**: 모바일, 태블릿, 데스크톱 모든 기기에서 최적화
- **모던한 UI/UX**: 깔끔하고 세련된 다크 테마 디자인
- **부드러운 애니메이션**: Framer Motion을 활용한 인터랙티브한 애니메이션
- **클래스 예약 시스템**: 다양한 댄스 클래스 정보와 예약 기능
- **연락처 폼**: 문의사항을 쉽게 전달할 수 있는 폼

## 🛠 기술 스택

- **React 18** - 사용자 인터페이스 구축
- **TypeScript** - 타입 안전성 보장
- **Tailwind CSS** - 스타일링
- **Framer Motion** - 애니메이션
- **Lucide React** - 아이콘
- **Vite** - 빌드 도구

## 🚀 시작하기

### 필수 요구사항

- Node.js 16.0 이상
- npm 또는 yarn

### 설치 및 실행

1. 의존성 설치:
```bash
npm install
```

2. 개발 서버 실행:
```bash
npm run dev
```

3. 브라우저에서 `http://localhost:3000` 열기

### 빌드

프로덕션 빌드를 생성하려면:

```bash
npm run build
```

## 📁 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── Navbar.tsx     # 네비게이션 바
│   ├── Hero.tsx       # 메인 히어로 섹션
│   ├── Classes.tsx    # 클래스 목록
│   ├── About.tsx      # 소개 섹션
│   ├── Contact.tsx    # 연락처 섹션
│   └── Footer.tsx     # 푸터
├── App.tsx            # 메인 앱 컴포넌트
├── main.tsx           # 앱 진입점
└── index.css          # 전역 스타일
```

## 🎨 디자인 특징

- **다크 테마**: 눈의 피로를 줄이는 다크 모드
- **그라데이션**: 브랜드 아이덴티티를 강조하는 그라데이션 효과
- **카드 디자인**: 정보를 명확하게 구분하는 카드 레이아웃
- **호버 효과**: 사용자 상호작용을 향상시키는 호버 애니메이션

## 📱 반응형 디자인

- **모바일**: 320px - 768px
- **태블릿**: 768px - 1024px
- **데스크톱**: 1024px 이상

## 🔧 커스터마이징

### 색상 변경

`tailwind.config.js`에서 색상 팔레트를 수정할 수 있습니다:

```javascript
colors: {
  primary: {
    // 브랜드 색상
  },
  dark: {
    // 다크 테마 색상
  }
}
```

### 애니메이션 조정

`src/index.css`에서 애니메이션 타이밍을 조정할 수 있습니다.

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🤝 기여하기

1. 이 저장소를 포크합니다
2. 새로운 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요. 
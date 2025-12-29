# 📑 PROJECT TAPN : Master Plan

## 1. 서비스 개요 (Service Overview)

**"Make your interactive."**

**TAPN(탭앤)**은 누구나 쉽게 '게이미피케이션(Gamification) 비디오'를 창작하고 소비할 수 있는 인터랙티브 영상 플랫폼입니다.

우리는 단순히 영상을 '보는' 것을 넘어, 시청자가 영상 속에 물리적으로 개입하여 스토리를 바꾸는 **몰입형 경험(Immersive Experience)**을 제공합니다.

* **Core Identity**: YouTube(오픈 플랫폼) + Detroit: Become Human(인터랙티브 스토리텔링)
* **Target**: 숏폼/롱폼 크리에이터, 인터랙티브 스토리텔러, 게임 같은 영상을 만들고 싶은 유저
* **Key Cycle**: `Studio(창작)` ↔ `Home(게시/공유)` ↔ `Player(소비)`

---

## 2. Ver 1.0 : The Foundation (구현 완료)

**목표**: 서비스의 기본 골격 완성 및 창작-배포 사이클 검증 (MVP Model)

### ✅ A. 보안 및 관문 (Gate System)
* **데모 보안**: 서비스 진입 시 암호(`1111`) 입력 강제
* **안내**: 데모 버전임을 명시하고, 개발 스펙(Tech Stack) 및 GitHub 리포지토리 접근성 확보

### ✅ B. 크리에이티브 스튜디오 (Dashboard & Editor)
* **프로젝트 관리**: '내 보관함(Draft)'에서 작업물 생성, 수정, 삭제
* **노드 기반 에디터**: ReactFlow를 활용한 직관적인 씬(Scene) 연결 구조
* **하이브리드 미디어**: YouTube URL(iframe) 및 로컬 비디오 파일(HTML5) 모두 지원
* **Preview**: 작업 도중 즉시 결과물을 확인하고 에디터로 복귀하는 테스트 환경

### ✅ C. 배포 및 관리 (Publishing Workflow)
* **Publishing**: 작업 중인 프로젝트를 '홈 화면'으로 내보내기
* **Sync Logic**: 스튜디오에서 제목을 수정하거나 삭제하면, 게시된 영상에도 실시간 반영(동기화)
* **데이터 관리**: LocalStorage를 활용한 클라이언트 사이드 데이터 영속성 구현

### ✅ D. 플레이어 (Viewer)
* **Overlay UI**: 영상 위에 선택지 버튼이 오버레이되는 전용 플레이어
* **Seamless Play**: 선택 시 끊김 없이 다음 노드의 영상으로 전환

---

## 3. Ver 2.0 : Beyond the Tap (기획 및 구현 예정)

**목표**: 크리에이터 생산성 향상 및 게이미피케이션 인터랙션 강화

### 🚀 A. Linear 편집 모드 (Timeline Editor)

기존 영상을 자르고 분기점을 추가하는 타임라인 기반 편집 기능

1. **Video Trimming**
   - 긴 영상을 구간별로 자르기
   - 타임라인에서 드래그로 구간 설정
   - 프레임 단위 정밀 편집

2. **Branch Point Insertion**
   - 타임라인 상에서 원하는 지점에 분기점 추가
   - 분기점마다 선택지 설정
   - 자동 씬 생성 및 연결

3. **Multi-Track Support**
   - 여러 영상 트랙 관리
   - 분기별 타임라인 시각화
   - 전체 플로우 미리보기

**활용 예시:**
- 기존 10분 브이로그를 구간별로 잘라 인터랙티브 버전 제작
- 유튜브 영상에 선택지 삽입하여 재활용

### 🚀 B. AI 생성 기능 (AI-Powered Creation)

각 편집 기능에서 AI 기반 자동 생성 지원

1. **AI 선택지 제안**
   - 영상 내용 분석 후 자연스러운 선택지 자동 생성
   - 장르별 템플릿 제공 (로맨스, 스릴러, 코미디 등)
   - "AI 제안" 버튼 클릭 → 2-3개 선택지 즉시 생성

2. **AI 질문/대사 생성**
   - 씬 맥락에 맞는 질문 자동 작성
   - 톤앤매너 선택 가능 (친근함, 긴장감, 유머 등)
   - 다국어 지원 (한/영 자동 번역)

3. **AI 스토리 분기 추천**
   - 현재 플롯 분석 후 흥미로운 분기점 제안
   - 엔딩 다양성 자동 체크
   - 사용자 선택 패턴 기반 최적화

4. **AI 썸네일 생성**
   - 영상 내 베스트 프레임 자동 추출
   - 텍스트 오버레이 자동 디자인
   - 클릭률 높은 구도 추천

**기술 스택 예정:**
- OpenAI GPT-4 / Claude API
- 영상 분석: FFmpeg + Vision AI
- 프롬프트 엔지니어링 최적화

### 🚀 C. 인터랙션 모듈 확장 (Action Modules)

시청자가 화면을 조작하는 물리적 재미(Physicality)를 강화합니다.

1. **TAP** (기존)
   - 단순 클릭
   - 활용 예: 대화 선택, 장소 이동

2. **SLIDE / SWIPE** (신규)
   - 화면을 좌우/상하로 미는 액션
   - 활용 예: 도덕적 딜레마(Left vs Right), 문 열기, 게이지 조절

3. **HOLD** (신규)
   - 화면을 꾹 누르고 버티는 액션
   - 활용 예: 숨 참기, 기 모으기, 힌트 보기(누르는 동안만 보임)

4. **DRAG & DROP** (신규)
   - 아이템을 끌어 특정 영역에 놓는 액션
   - 활용 예: 열쇠로 문따기, 증거물 제시, 아이템 조합

### 🚀 D. 에디터 UX 고도화 (Advanced Studio)
* **Action Selector**: 노드 생성 시 `Tap`, `Slide`, `Hold` 중 어떤 액션을 쓸지 선택하는 UI 추가
* **Config Panel**: 각 액션별 세부 설정(슬라이드 임계값, 홀드 시간 등) 패널 개발
* **Dual Mode Toggle**: 노드 기반 / 타임라인 모드 전환 기능

---

## 4. MVP 미구현 스코프

플랫폼의 안정성 확보 및 커뮤니티 생태계 구축 필요

### 1: 인프라 구축 (Backend & Data)
* **Database**: Supabase/Firebase 연동을 통한 데이터 영구 저장 (현재 LocalStorage 대체)
* **Storage**: 영상 및 썸네일 이미지의 클라우드(AWS S3) 호스팅
* **Auth**: 구글, 이메일 등 실제 유저 로그인/회원가입 시스템

### 2: 소셜 & 커뮤니티 (Social)
* **Creator Profile**: 크리에이터별 채널 페이지 및 구독 시스템
* **Engagement**: 영상 단위 좋아요, 댓글, 공유하기(Share Link) 기능
* **Analytics**: 내 영상의 선택 통계(몇 %가 A를 선택했는지) 제공

### 3: 성능 최적화 (Performance)
* **Pre-loading**: 다음 이어질 영상들을 미리 로딩하여 버퍼링 없는 'Zero-Latency' 경험 제공
* **Mobile Optimization**: 모바일 터치 환경에 최적화된 제스처 및 반응형 UI 강화

---

**Last Updated**: December 26, 2025  
**Version**: 1.0.0  
**Status**: Foundation Complete ✅

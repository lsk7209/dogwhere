# 🚀 배포 가이드

## 📋 개요

이 프로젝트는 Cloudflare Pages를 통해 자동 배포됩니다. GitHub에 푸시하면 자동으로 빌드 및 배포가 진행됩니다.

## 🔧 사전 준비

### 1. GitHub 저장소 생성

```bash
# 로컬 저장소 초기화 (아직 안 했다면)
git init
git add .
git commit -m "Initial commit"

# GitHub에 저장소 생성 후
git remote add origin https://github.com/your-username/dogwhere.git
git branch -M main
git push -u origin main
```

### 2. Cloudflare 계정 설정

1. [Cloudflare Dashboard](https://dash.cloudflare.com)에 로그인
2. Pages 섹션으로 이동
3. "Create a project" 클릭

### 3. GitHub 연동

1. **Connect to Git** 선택
2. GitHub 계정 인증
3. `dogwhere` 저장소 선택
4. **프로젝트 설정**:
   - **Project name**: `dogwhere`
   - **Production branch**: `main`
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
   - **Root directory**: `/` (기본값)

### 4. 환경변수 설정

Cloudflare Pages 대시보드에서 환경변수 설정:

**Settings → Environment variables**에서 다음 변수 추가:

```
# API 키
GOOGLE_PLACES_KEY=your_google_places_api_key
KAKAO_API_KEY=your_kakao_api_key
OPENAI_API_KEY=your_openai_api_key

# 내부 토큰
INTERNAL_TOKEN=your_internal_token

# 공개 API URL
NEXT_PUBLIC_API_URL=https://your-domain.pages.dev
NEXT_PUBLIC_SITE_URL=https://your-domain.pages.dev
```

### 5. D1 데이터베이스 바인딩

**Settings → Functions → D1 Database bindings**에서:

- **Variable name**: `DB`
- **D1 Database**: `dogwhere-db` 선택

### 6. GitHub Secrets 설정 (선택사항)

GitHub Actions를 사용하는 경우:

**Repository → Settings → Secrets and variables → Actions**에서:

- `CLOUDFLARE_API_TOKEN`: Cloudflare API 토큰
- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare Account ID

API 토큰 생성:
1. Cloudflare Dashboard → My Profile → API Tokens
2. "Create Token" 클릭
3. "Edit Cloudflare Workers" 템플릿 사용
4. 권한 설정:
   - Account: Cloudflare Pages:Edit
   - Zone: 필요시 설정

## 🚀 배포 프로세스

### 자동 배포 (권장)

1. **코드 변경 후 커밋**:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

2. **자동 배포 시작**:
   - GitHub에 푸시하면 자동으로 Cloudflare Pages가 빌드 시작
   - Cloudflare Dashboard에서 배포 상태 확인 가능

3. **배포 완료**:
   - 빌드 성공 시 자동으로 프로덕션에 배포
   - 배포 URL: `https://dogwhere.pages.dev`

### 수동 배포

```bash
# 빌드
npm run build

# 배포
npm run deploy
```

## 📊 배포 상태 확인

### Cloudflare Dashboard

1. Cloudflare Dashboard → Pages → dogwhere
2. **Deployments** 탭에서 배포 상태 확인
3. 각 배포의 로그 확인 가능

### GitHub Actions (사용하는 경우)

1. GitHub 저장소 → **Actions** 탭
2. 워크플로우 실행 상태 확인
3. 빌드 로그 확인

## 🔄 브랜치 전략

### 프로덕션 배포
- `main` 브랜치에 푸시 → 자동 배포

### 프리뷰 배포
- 다른 브랜치에 푸시 → 프리뷰 URL 생성
- Pull Request 생성 시 프리뷰 배포

## 🛠 빌드 설정

### 빌드 명령어
```bash
npm run build
```

### 빌드 출력 디렉토리
```
out/
```

### Node.js 버전
- Cloudflare Pages 기본: Node.js 18
- 필요시 `package.json`에 `engines` 필드 추가 가능

## 🔍 문제 해결

### 빌드 실패

1. **로컬에서 빌드 테스트**:
   ```bash
   npm run build
   ```

2. **빌드 로그 확인**:
   - Cloudflare Dashboard → Deployments → 실패한 배포 → Logs

3. **일반적인 문제**:
   - 환경변수 누락
   - 의존성 문제
   - 빌드 타임아웃 (기본 15분)

### 배포는 되지만 동작하지 않음

1. **D1 데이터베이스 바인딩 확인**:
   - Settings → Functions → D1 Database bindings

2. **환경변수 확인**:
   - Settings → Environment variables

3. **함수 로그 확인**:
   - Cloudflare Dashboard → Workers & Pages → dogwhere → Logs

## 📝 배포 체크리스트

배포 전 확인사항:

- [ ] 코드 커밋 및 푸시 완료
- [ ] 로컬 빌드 성공 (`npm run build`)
- [ ] 환경변수 설정 완료
- [ ] D1 데이터베이스 바인딩 설정 완료
- [ ] 스키마 적용 완료 (`npm run db:setup:prod`)
- [ ] GitHub 저장소 연결 완료
- [ ] Cloudflare Pages 프로젝트 생성 완료

## 🎯 자동 배포 설정 확인

### Cloudflare Pages 설정

1. **Builds & deployments**:
   - ✅ Automatic deployments enabled
   - ✅ Production branch: `main`

2. **Custom domains**:
   - 커스텀 도메인 설정 (선택사항)

3. **Environment variables**:
   - 프로덕션 환경변수 설정 확인

## 🔗 유용한 링크

- [Cloudflare Pages 문서](https://developers.cloudflare.com/pages/)
- [Cloudflare D1 문서](https://developers.cloudflare.com/d1/)
- [GitHub Actions 문서](https://docs.github.com/en/actions)

## 📞 지원

문제가 발생하면:
1. Cloudflare Dashboard 로그 확인
2. GitHub Actions 로그 확인 (사용하는 경우)
3. 로컬 빌드 테스트

---

**마지막 업데이트**: 2025년 1월


# 🚀 빠른 배포 가이드

## GitHub 저장소: https://github.com/lsk7209/dogwhere

## 1단계: Cloudflare Pages 프로젝트 생성

### 방법 A: Cloudflare Dashboard에서 설정 (권장)

1. **Cloudflare Dashboard 접속**
   - https://dash.cloudflare.com 접속
   - 로그인

2. **Pages 프로젝트 생성**
   - 왼쪽 메뉴에서 **Workers & Pages** 클릭
   - **Create application** → **Pages** → **Connect to Git** 클릭

3. **GitHub 연동**
   - **GitHub** 선택
   - GitHub 계정 인증
   - 저장소 선택: `lsk7209/dogwhere`

4. **프로젝트 설정**
   ```
   Project name: dogwhere
   Production branch: main
   Framework preset: Next.js (Static HTML Export)
   Build command: npm run build
   Build output directory: out
   Root directory: / (기본값)
   ```

5. **환경변수 설정** (Settings → Environment variables)
   ```
   GOOGLE_PLACES_KEY=your_key
   KAKAO_API_KEY=your_key
   OPENAI_API_KEY=your_key
   INTERNAL_TOKEN=your_token
   NEXT_PUBLIC_SITE_URL=https://dogwhere.pages.dev
   ```

6. **D1 데이터베이스 바인딩** (Settings → Functions → D1 Database bindings)
   ```
   Variable name: DB
   D1 Database: dogwhere-db 선택
   ```

7. **저장 및 첫 배포**
   - **Save and Deploy** 클릭
   - 자동으로 첫 배포 시작!

### 방법 B: GitHub Actions 사용 (선택사항)

GitHub Actions를 사용하려면 Secrets 설정 필요:

1. **GitHub Secrets 설정**
   - 저장소 → Settings → Secrets and variables → Actions
   - **New repository secret** 클릭
   - 다음 Secrets 추가:
     - `CLOUDFLARE_API_TOKEN`: Cloudflare API 토큰
     - `CLOUDFLARE_ACCOUNT_ID`: Cloudflare Account ID

2. **API 토큰 생성**
   - Cloudflare Dashboard → My Profile → API Tokens
   - **Create Token** 클릭
   - **Edit Cloudflare Workers** 템플릿 사용
   - 권한 설정:
     - Account: Cloudflare Pages:Edit
     - Zone: 필요시 설정

3. **Account ID 확인**
   - Cloudflare Dashboard 우측 사이드바에서 확인

## 2단계: D1 데이터베이스 스키마 적용

```bash
# 프로덕션 D1에 스키마 적용
npm run db:setup:prod

# 또는 직접 실행
wrangler d1 execute dogwhere-db --file=./schema.sql
```

## 3단계: 자동 배포 확인

### Cloudflare Pages 자동 배포 (권장)

**설정 완료 후**:
- `main` 브랜치에 푸시하면 자동 배포
- Pull Request 생성 시 프리뷰 배포

```bash
git add .
git commit -m "Setup auto deployment"
git push origin main

# 자동으로 배포 시작! 🚀
```

### 배포 상태 확인

1. **Cloudflare Dashboard**
   - Pages → dogwhere → Deployments
   - 배포 상태 및 로그 확인

2. **GitHub Actions** (사용하는 경우)
   - 저장소 → Actions 탭
   - 워크플로우 실행 상태 확인

## 4단계: 배포 URL 확인

배포 완료 후:
- **프로덕션 URL**: `https://dogwhere.pages.dev`
- **프리뷰 URL**: Pull Request마다 자동 생성

## 🔧 문제 해결

### 빌드 실패

1. **로컬 빌드 테스트**
   ```bash
   npm run build
   ```

2. **빌드 로그 확인**
   - Cloudflare Dashboard → Deployments → 실패한 배포 → Logs

3. **일반적인 문제**
   - 환경변수 누락
   - 의존성 문제
   - 빌드 타임아웃 (기본 15분)

### D1 데이터베이스 연결 실패

1. **바인딩 확인**
   - Settings → Functions → D1 Database bindings
   - Variable name이 `DB`인지 확인

2. **스키마 적용 확인**
   ```bash
   npm run db:check
   ```

## ✅ 체크리스트

배포 전 확인:

- [ ] Cloudflare Pages 프로젝트 생성 완료
- [ ] GitHub 저장소 연결 완료
- [ ] 환경변수 설정 완료
- [ ] D1 데이터베이스 바인딩 설정 완료
- [ ] 스키마 적용 완료 (`npm run db:setup:prod`)
- [ ] 로컬 빌드 성공 (`npm run build`)
- [ ] 코드 푸시 완료

## 🎉 완료!

설정이 완료되면:
- ✅ `main` 브랜치에 푸시할 때마다 자동 배포
- ✅ Pull Request마다 프리뷰 배포
- ✅ 배포 상태는 Cloudflare Dashboard에서 확인

---

**도움이 필요하신가요?**
- [DEPLOYMENT.md](./DEPLOYMENT.md) - 상세 배포 가이드
- [CLOUDFLARE_D1_GUIDE.md](./CLOUDFLARE_D1_GUIDE.md) - D1 설정 가이드


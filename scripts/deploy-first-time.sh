#!/bin/bash

# 첫 배포 스크립트
# 사용법: bash scripts/deploy-first-time.sh

echo "🚀 첫 배포 준비 시작..."
echo ""

# 1. 빌드 테스트
echo "1️⃣ 빌드 테스트 중..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 빌드 실패! 빌드 오류를 수정해주세요."
    exit 1
fi

echo "✅ 빌드 성공!"
echo ""

# 2. D1 스키마 확인
echo "2️⃣ D1 데이터베이스 스키마 확인 중..."
echo "프로덕션 D1에 스키마를 적용하시겠습니까? (y/n)"
read -r response

if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo "스키마 적용 중..."
    npm run db:setup:prod
    
    if [ $? -eq 0 ]; then
        echo "✅ 스키마 적용 완료!"
    else
        echo "⚠️ 스키마 적용 실패. 수동으로 실행해주세요: npm run db:setup:prod"
    fi
else
    echo "⏭️ 스키마 적용 건너뜀"
fi

echo ""

# 3. Git 상태 확인
echo "3️⃣ Git 상태 확인 중..."
if [ -z "$(git status --porcelain)" ]; then
    echo "✅ 변경사항 없음"
else
    echo "📝 변경사항 발견:"
    git status --short
    echo ""
    echo "변경사항을 커밋하시겠습니까? (y/n)"
    read -r commit_response
    
    if [[ "$commit_response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        echo "커밋 메시지를 입력하세요:"
        read -r commit_message
        git add .
        git commit -m "$commit_message"
        echo "✅ 커밋 완료!"
    fi
fi

echo ""

# 4. 배포 안내
echo "4️⃣ 배포 안내"
echo ""
echo "다음 단계:"
echo ""
echo "1. Cloudflare Pages 프로젝트 생성:"
echo "   - https://dash.cloudflare.com → Pages → Create a project"
echo "   - GitHub 저장소 연결: lsk7209/dogwhere"
echo "   - 설정:"
echo "     * Build command: npm run build"
echo "     * Build output directory: out"
echo ""
echo "2. 환경변수 설정 (Settings → Environment variables)"
echo ""
echo "3. D1 바인딩 설정 (Settings → Functions → D1 Database bindings)"
echo "   - Variable name: DB"
echo "   - D1 Database: dogwhere-db"
echo ""
echo "4. 코드 푸시:"
echo "   git push origin main"
echo ""
echo "5. 자동 배포 확인:"
echo "   - Cloudflare Dashboard → Pages → dogwhere → Deployments"
echo ""
echo "📚 자세한 가이드: QUICK_DEPLOY.md"
echo ""
echo "✅ 준비 완료!"


#!/bin/bash

# D1 데이터베이스 설정 스크립트
# 사용법: bash scripts/setup-d1.sh

echo "🚀 D1 데이터베이스 설정 시작..."

# 데이터베이스 정보
DB_NAME="dogwhere-db"
DB_ID="7284cd81-bb1c-4d09-a7b0-4cbdd257b7d5"
SCHEMA_FILE="./schema.sql"

echo "📦 데이터베이스: $DB_NAME"
echo "🆔 ID: $DB_ID"

# 스키마 파일 확인
if [ ! -f "$SCHEMA_FILE" ]; then
    echo "❌ 스키마 파일을 찾을 수 없습니다: $SCHEMA_FILE"
    exit 1
fi

echo ""
echo "1️⃣ 로컬 D1에 스키마 적용 중..."
wrangler d1 execute $DB_NAME --file=$SCHEMA_FILE --local

if [ $? -eq 0 ]; then
    echo "✅ 로컬 D1 스키마 적용 완료"
else
    echo "❌ 로컬 D1 스키마 적용 실패"
    exit 1
fi

echo ""
echo "2️⃣ 프로덕션 D1에 스키마 적용 중..."
wrangler d1 execute $DB_NAME --file=$SCHEMA_FILE

if [ $? -eq 0 ]; then
    echo "✅ 프로덕션 D1 스키마 적용 완료"
else
    echo "❌ 프로덕션 D1 스키마 적용 실패"
    exit 1
fi

echo ""
echo "3️⃣ 데이터베이스 상태 확인 중..."
wrangler d1 info $DB_NAME

echo ""
echo "✅ D1 데이터베이스 설정 완료!"
echo ""
echo "다음 단계:"
echo "1. 로컬 개발: npm run dev"
echo "2. 프로덕션 배포: npm run deploy"
echo "3. 데이터 확인: wrangler d1 execute $DB_NAME --command='SELECT COUNT(*) FROM places'"


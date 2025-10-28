# 블로그 템플릿 SEO/GEO/AEO 최적화 규칙문서

## 개요
어서오개 블로그 템플릿의 SEO, GEO, AEO 최적화를 위한 규칙과 가이드라인을 정의합니다.

## 1. 데이터 구조 최적화

### 1.1 블로그 포스트 데이터 타입
```typescript
interface BlogPost {
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  category: string
  readTime: string
  image: string
  tags: string[]
  // SEO/GEO/AEO 최적화 필드
  location?: string
  lastModified?: string
  seoKeywords?: string[]
  geoLocation?: {
    latitude: number
    longitude: number
    address: string
  }
}
```

### 1.2 필수 필드 규칙
- **location**: 포스트와 관련된 지역 정보 (예: "제주도", "서울 강남구", "전국", "해외")
- **lastModified**: 콘텐츠 수정 날짜 (YYYY.MM.DD 형식)
- **seoKeywords**: 검색 의도별 키워드 배열 (5개 이하 권장)
- **geoLocation**: 정확한 위도/경도 좌표와 주소 정보

## 2. SEO 최적화 규칙

### 2.1 메타데이터 구조
```typescript
const metadata = {
  title: `${post.title} | 어서오개 블로그`,
  description: post.excerpt,
  keywords: post.seoKeywords?.join(', ') || post.tags.join(', '),
  authors: [{ name: post.author }],
  creator: post.author,
  publisher: '어서오개',
  canonical: `https://eoseo-ogae.com/blog/${slug}`,
  // ... 기타 필드
}
```

### 2.2 Open Graph 최적화
- **title**: 포스트 제목 (60자 이하)
- **description**: 포스트 요약 (160자 이하)
- **image**: 1200x630px 이미지
- **type**: "article"
- **locale**: "ko_KR"
- **siteName**: "어서오개"
- **publishedTime**: 발행 날짜
- **modifiedTime**: 수정 날짜
- **authors**: 작성자 배열
- **section**: 카테고리
- **tags**: 태그 배열

### 2.3 Twitter Cards
- **card**: "summary_large_image"
- **creator**: "@eoseo_ogae"
- **site**: "@eoseo_ogae"

### 2.4 Robots 설정
```typescript
robots: {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    'max-video-preview': -1,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
}
```

## 3. GEO 최적화 규칙

### 3.1 지역 정보 표시
- 포스트 헤더에 지도 아이콘과 함께 지역 표시
- `MapPin` 아이콘 사용
- 지역명은 간결하고 명확하게 표기

### 3.2 지리적 좌표 데이터
```typescript
geoLocation: {
  latitude: 33.4996,    // 정확한 위도
  longitude: 126.5312,  // 정확한 경도
  address: "제주특별자치도"  // 표준 주소명
}
```

### 3.3 지역별 키워드 전략
- 지역명 + 핵심 키워드 조합
- 예: "제주도 강아지 여행", "강남구 강아지 카페"
- 지역 검색 의도에 맞는 키워드 설정

## 4. AEO 최적화 규칙

### 4.1 콘텐츠 구조화
- 명확한 헤딩 구조 (H1 → H2 → H3)
- 질문-답변 형태의 콘텐츠 구성
- 단계별 가이드와 체크리스트 활용

### 4.2 키워드 최적화
- `seoKeywords` 배열에 검색 의도별 키워드 설정
- 자연스러운 키워드 밀도 유지 (2-3%)
- 롱테일 키워드 포함

### 4.3 답변 엔진 친화적 구조
- FAQ 스타일 섹션 포함
- 명확한 답변과 설명 제공
- 단계별 가이드로 사용자 질문에 직접 답변

## 5. JSON-LD 구조화된 데이터

### 5.1 BlogPosting 스키마
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "포스트 제목",
  "description": "포스트 요약",
  "image": "이미지 URL",
  "author": {
    "@type": "Person",
    "name": "작성자명"
  },
  "publisher": {
    "@type": "Organization",
    "name": "어서오개",
    "logo": {
      "@type": "ImageObject",
      "url": "https://eoseo-ogae.com/logo.png"
    }
  },
  "datePublished": "발행일",
  "dateModified": "수정일",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "페이지 URL"
  },
  "articleSection": "카테고리",
  "keywords": "키워드",
  "wordCount": "단어수",
  "timeRequired": "읽기시간",
  "contentLocation": {
    "@type": "Place",
    "name": "지역명",
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "위도",
      "longitude": "경도"
    }
  }
}
```

## 6. UI/UX 최적화

### 6.1 메타 정보 표시
- 작성자, 발행일, 수정일 표시
- 읽기 시간과 지역 정보 표시
- 카테고리와 태그 시각적 구분

### 6.2 사용자 인터랙션
- 좋아요, 북마크, 공유 버튼
- 관련 포스트 추천
- 태그 클릭 가능

## 7. 성능 최적화

### 7.1 이미지 최적화
- OG 이미지: 1200x630px
- WebP 형식 권장
- 적절한 압축률 적용

### 7.2 메타데이터 캐싱
- 정적 메타데이터는 빌드 타임에 생성
- 동적 메타데이터는 ISR 활용

## 8. 검증 및 모니터링

### 8.1 검증 도구
- Google Search Console
- Google Rich Results Test
- Schema.org Validator
- Open Graph Debugger

### 8.2 모니터링 지표
- 검색 노출 순위
- 클릭률 (CTR)
- 지역별 검색 성과
- 답변 엔진 노출률

## 9. 구현 체크리스트

### 9.1 필수 구현 사항
- [ ] 메타데이터 완전 구현
- [ ] Open Graph 태그 설정
- [ ] Twitter Cards 설정
- [ ] JSON-LD 구조화된 데이터
- [ ] 지역 정보 표시
- [ ] 지리적 좌표 데이터
- [ ] SEO 키워드 최적화
- [ ] Robots 설정

### 9.2 권장 구현 사항
- [ ] 검증 코드 설정
- [ ] 사이트맵 최적화
- [ ] 내부 링크 구조
- [ ] 이미지 최적화
- [ ] 성능 모니터링

## 10. 업데이트 가이드

### 10.1 새로운 포스트 작성 시
1. 필수 메타데이터 필드 모두 입력
2. 지역 정보와 좌표 정확히 설정
3. SEO 키워드 검색 의도별로 설정
4. JSON-LD 데이터 검증
5. 미리보기로 메타데이터 확인

### 10.2 기존 포스트 업데이트 시
1. `lastModified` 날짜 업데이트
2. 변경된 내용에 맞는 키워드 수정
3. 지역 정보 변경 시 좌표 업데이트
4. 메타데이터 재검증

---

**문서 버전**: 1.0  
**최종 업데이트**: 2024.10.28  
**작성자**: 어서오개 개발팀

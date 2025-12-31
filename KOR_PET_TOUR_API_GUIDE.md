# 한국관광공사 반려동물 동반여행 서비스 API 가이드

## 📋 개요

한국관광공사 반려동물 동반여행 서비스 API를 통합하여 반려동물과 함께 여행할 수 있는 전국의 관광지, 숙소, 음식점, 쇼핑시설 등의 정보를 수집합니다.

**Base URL**: `https://apis.data.go.kr/B551011/KorPetTourService`

## 🔑 필수 파라미터

모든 API 호출에 필수:
- `serviceKey`: 공공데이터포털 인증키
- `MobileOS`: IOS, AND, WIN, ETC
- `MobileApp`: 서비스명(어플명)
- `_type`: json (JSON 응답 형식)

## 📡 주요 엔드포인트

### 1. 지역기반 관광정보조회 (`/areaBasedList`)

**용도**: 지역 및 시군구를 기반으로 관광정보 목록 조회

**주요 파라미터:**
- `contentTypeId`: 관광타입 (12:관광지, 32:숙박, 39:음식점 등)
- `areaCode`: 지역코드
- `sigunguCode`: 시군구코드
- `arrange`: 정렬 (A=제목순, C=수정일순, D=생성일순)
- `listYN`: Y=목록, N=개수
- `modifiedtime`: 수정일(YYYYMMDD) - 증분 수집용

**사용 예시:**
```typescript
const config = {
  apiKey: process.env.PUBLIC_DATA_API_KEY,
  baseUrl: 'https://apis.data.go.kr/B551011/KorPetTourService',
  endpoint: '/areaBasedList',
  mobileOS: 'ETC',
  mobileApp: 'dogwhere',
  params: {
    listYN: 'Y',
    arrange: 'C', // 수정일순
    contentTypeId: '39', // 음식점
  },
}
```

### 2. 공통정보조회 (`/detailCommon`)

**용도**: 각 장소의 상세 공통정보 조회

**필수 파라미터:**
- `contentId`: 콘텐츠ID

**사용 예시:**
```typescript
const config = {
  apiKey: process.env.PUBLIC_DATA_API_KEY,
  baseUrl: 'https://apis.data.go.kr/B551011/KorPetTourService',
  endpoint: '/detailCommon',
  mobileOS: 'ETC',
  mobileApp: 'dogwhere',
  params: {
    contentId: '123456',
    defaultYN: 'Y',
    overviewYN: 'Y',
  },
}
```

### 3. 반려동물 동반여행 조회 (`/detailPetTour`)

**용도**: 반려동물 동반 관련 상세 정보 조회

**필수 파라미터:**
- `contentId`: 콘텐츠ID

**응답 필드:**
- `acmpyTypeCd`: 동반 유형 코드
- `acmpyPsblCpam`: 동반 가능 인원
- `acmpyNeedMtr`: 동반 필요 사항
- `relaPosesFclty`: 반려동물 포즈 시설
- `relaFrnshPrdlst`: 반려동물 용품 판매 목록
- `etcAcmpyInfo`: 기타 동반 정보

### 4. 동기화 목록 조회 (`/petTourSyncList`)

**용도**: 증분 수집용 - 수정일 기준으로 변경된 데이터만 조회

**주요 파라미터:**
- `modifiedtime`: 수정일(YYYYMMDD)
- `showflag`: 표출 여부 (1=표출, 0=비표출)

## 🔄 수집 전략

### 초기 전체 수집

1. **지역별 수집**
   - 각 시/도별로 `areaBasedList` 호출
   - `contentTypeId`별로 분류하여 수집
   - 최대 페이지까지 순회

2. **상세 정보 수집**
   - 목록에서 `contentid` 추출
   - `detailCommon`으로 기본 정보 수집
   - `detailPetTour`로 반려동물 관련 정보 수집

### 증분 수집

1. **동기화 목록 사용**
   - `petTourSyncList`의 `modifiedtime` 파라미터 활용
   - 마지막 수집 시간 이후 데이터만 조회

2. **수정일 기준 필터링**
   - `areaBasedList`의 `modifiedtime` 파라미터 사용
   - `arrange: 'C'` (수정일순) 정렬

## 📊 데이터 매핑

### API 응답 → PublicDataPlace

```typescript
{
  publicDataId: item.contentid,        // contentid
  sourceApi: 'kor-pet-tour',
  name: item.title,                    // title
  category: getCategoryFromContentType(item.contenttypeid),
  address: item.addr1,                 // addr1
  sido: extractSido(item.addr1),
  sigungu: extractSigungu(item.addr1),
  phone: item.tel,                     // tel
  website: item.homepage,              // homepage
  latitude: convertMapy(item.mapy),    // mapy (좌표 변환 필요)
  longitude: convertMapx(item.mapx),   // mapx (좌표 변환 필요)
}
```

### 관광타입 매핑

| contentTypeId | 카테고리 |
|--------------|---------|
| 12 | 관광지 |
| 14 | 문화시설 |
| 15 | 축제공연행사 |
| 25 | 여행코스 |
| 28 | 레포츠 |
| 32 | 숙박 |
| 38 | 쇼핑 |
| 39 | 음식점 |

## 🗺️ 지역코드

### 주요 지역코드 (areaCode)

- 1: 서울
- 2: 인천
- 3: 대전
- 4: 대구
- 5: 광주
- 6: 부산
- 7: 울산
- 8: 세종
- 31: 경기
- 32: 강원
- 33: 충북
| 34: 충남
- 35: 경북
- 36: 경남
- 37: 전북
- 38: 전남
- 39: 제주

## ⚠️ 주의사항

### 1. 좌표 변환

한국관광공사 API는 **KATEC 좌표계**를 사용합니다. WGS84로 변환이 필요합니다.

**간단한 변환 공식** (근사치):
```typescript
latitude = mapy / 1000000
longitude = mapx / 1000000
```

**정확한 변환**은 좌표 변환 라이브러리 사용 권장.

### 2. API 제한

- 일일 호출 제한 확인 필요
- 페이지당 최대 100개 (numOfRows)
- API 호출 간 대기 시간 권장 (1초)

### 3. 에러 처리

**주요 에러 코드:**
- `0000`: 성공
- `10`: 잘못된 요청 파라미터
- `11`: 필수 요청 파라미터 없음
- `21`: 일시적으로 사용할 수 없는 서비스키
- `33`: 서명되지 않은 호출
- `03`: 데이터 없음

### 4. 응답 형식

- 기본: XML
- JSON: `_type=json` 파라미터 추가
- 응답 구조: `response.body.items.item` (단일 객체 또는 배열)

## 📝 사용 예시

### 초기 수집 스크립트

```typescript
import { collectAllPages } from '@/lib/public-data/collector'

const config = {
  apiKey: process.env.PUBLIC_DATA_API_KEY!,
  serviceKey: process.env.PUBLIC_DATA_API_KEY!,
  baseUrl: 'https://apis.data.go.kr/B551011/KorPetTourService',
  endpoint: '/areaBasedList',
  mobileOS: 'ETC',
  mobileApp: 'dogwhere',
  sourceApi: 'kor-pet-tour',
  params: {
    listYN: 'Y',
    arrange: 'C',
  },
}

const places = await collectAllPages(config, 100)
```

### 증분 수집

```typescript
const config = {
  // ... 기본 설정
  params: {
    listYN: 'Y',
    arrange: 'C',
    modifiedtime: '20250128', // 마지막 수집일
  },
}
```

## 🔗 관련 파일

- `src/lib/public-data/collector.ts`: 공통 수집기
- `src/lib/public-data/kor-pet-tour.ts`: 한국관광공사 API 전용 클라이언트
- `scripts/initial-public-data-collect.ts`: 초기 수집 스크립트

---

**작성일**: 2025-01-28  
**버전**: 1.0.0


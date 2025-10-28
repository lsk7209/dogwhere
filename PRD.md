# 어서오개(EOSEO-O-GAE) 통합 PRD v3.2

## 0) 요약

* 목적: "강아지 동반 장소/행사/가이드" 전국 자동 수집·보강·발행·색인.
* 핵심 KPI(런칭 D+30): 일 500+ PV, 재방문율 22%+, RPM 3–5 USD, 인덱스 1.5k+, LCP<2.5s.
* 비범위: 회원·리뷰 작성·결제 없음(MVP).

## 1) 아키텍처

* Monorepo: `apps/web`(Next.js 14, App Router) + `apps/worker`(Cloudflare Workers + Hono, D1/KV/R2옵션).
* 데이터 흐름: 공공데이터 → 정규화/중복제거 → 퍼플렉시티 스니펫 → ChatGPT 보강 → Make.com → `/api/publish` → D1 반영 → 분할 사이트맵 증분.

## 2) 라우팅(한국 전용)

```
/                                 홈(오늘의 추천 3)
/{sido}/{sig?}/{category?}        지역 허브·클러스터(리스트/지도)
/events                           행사(이번주/다음주/달력)
/blog/{slug}                      블로그(공유형)
/place/{slug}                     장소 상세
/event/{slug}                     행사 상세
/sitemap.xml, /sitemaps/*         색인(분할·증분)
/api/*                            공개/발행/배치 API
```

* sido: seoul, gyeonggi, busan, jeju …
* sig: mapo-gu, dongjak-gu, gapyeong-gun, yangpyeong-gun …
* category(MVP): `dog-cafe | dog-park | dog-hotel | restaurant`
* 허브 사전 구축: `/{sido}`, `/{sido}/{sig}`는 콘텐츠 없어도 생성(허브는 항상 index).
* 클러스터 Thin 게이트: `/{sido}/{sig}/{category}` 유효 장소 ≥ 6(초기)~10(성장)일 때 index.

## 3) 프론트엔드 요구사항

* 스택: Next 14 + TS + Tailwind + shadcn/ui + React Query.
* 페이지별:
  * 홈: 추천 3(이름/점수/O-Dog/안전배지/2문장 카피), 내부링크 CTA, 광고 3슬롯(고정 높이).
  * 지역탐색: 필터(평점/영업중/규칙태그), 정렬 기본=O-Dog, 리스트↔지도 토글, 상·중·하 내부링크.
  * 행사: 이번주/다음주/달력 탭, 카드(기간/지역/반려견 가능/하이라이트).
  * 블로그: TopN/초행가이드/산책코스 템플릿, 관련 3건.
  * 상세: 장소 기본정보+요약(100–150자)+규칙태그+인근3 / 행사 기본정보+공유 1문장.
* 성능 예산: 모바일 LCP<2.5s, CLS<0.1, TTFB<800ms.
* SEO/AEO 자동 출력:
  * Title: `{지역} {카테고리} 추천 | 어서오개`
  * H1: `{지역} {키워드} 베스트 N (업데이트: YYYY-MM-DD)`
  * JSON-LD: 리스트=ItemList+Place/LocalBusiness(+AggregateRating+OpeningHours+PostalAddress)+BreadcrumbList, 행사=Event, FAQ 2~3.
  * OG/Twitter: `/api/og?title=...&region={sido}&badge={safe|new|top}` + Top3 카드(정사각/9:16).

## 4) 백엔드 요구사항

* 스택: Cloudflare Workers(Hono) + D1(SQLite) + KV(캐시) + R2(이미지/OG 캐시 선택).
* 크론 파이프라인(UTC 기준 예시):
  * 05:30 regions 큐 정렬(대도시→미갱신→신규)
  * 06:00 ingest:places(일1)
  * 06:10 ingest:weather(일1, 체감/PM2.5)
  * 월 05:00 ingest:events(주1)
  * 07:00 generate:content(일1, 2문장/요약/FAQ 생성, 프롬프트 캐시)
  * 07:40 publish(일1, 빌드·사이트맵 증분)
* 캐시: JSON s-maxage=300 + swr=60, KV TTL 24–72h 가변, HTML swr=60.
* 페이지네이션: keyset cursor(score,id).

## 5) 점수·게이트

* O-Dog(0–100) = 0.30*rating + 0.20*recency + 0.20*safety(체감·PM2.5) + 0.15*review_trust + 0.15*variance/혼잡.
* CQS(0~1) = Coverage 0.25 + Freshness 0.20 + Structure 0.20 + Originality 0.20 + GEO-Accuracy 0.15.
  CQS<0.85 → noindex,follow + 허브 요약만.

## 6) 데이터 스키마(D1)

* regions(code PK, sido, sig, slug_sido, slug_sig, aliases_json, updated_at…)
* region_alias(alias, region_code)
* places(id PK, slug UNIQUE, name, address, lat, lng, region_code, sido, sig, category, phone, opening_hours_json, features_json, rating, review_count, policy_level, policy_evidence_json, source, canonical_key, updated_at, created_at)
* events(id PK, slug UNIQUE, title, start_date, end_date, region_code, venue, address, lat, lng, ticket_info, pet_allowed, source, updated_at, created_at)
* recommendations(id PK, place_id, date, o_dog_score, safety_flag, copy_2lines, reason_json)
* posts(id PK, slug UNIQUE, title, excerpt, region_code, tags, html, og_image_url, created_at)
* prompt_cache / jobs_logs / crawl_schedule / redirects
  인덱스: `idx_places_region_cat(region_code,category)`, `idx_events_region_date(region_code,start_date)`.

## 7) 공개 API(읽기)

```
GET /api/recommendations/today?region={sido|sig|kr}
GET /api/places?sido=seoul&sig=mapo-gu&category=dog-cafe&sort=score&openNow=true&cursor=...
GET /api/places/{slug}
GET /api/events?region=kr&sido=...&sig=...&range=this-week
GET /api/events/{slug}
GET /api/posts?tag=seoul-dog-cafe
```

## 8) 발행/배치 API(보호)

* 발행(외부=Make.com)
```
POST /api/publish
Headers: Authorization: Bearer <token>
         Idempotency-Key: <hash(sourceId+updated_at)>
         X-Content-Version: 1
Body(type=place|event|post): {
  "id":"ext_abc123","name":"카페 포우즈","category":"dog-cafe",
  "address":"서울 마포구 ...","lat":37.55,"lng":126.91,
  "opening_hours":[...],"features":["대형견가능","물그릇","그늘","주차"],
  "rating":4.6,"review_count":213,"source":"data.go.kr:dataset_xxx","updated_at":"2025-10-28T07:00:00Z"
}
Resp: { "ok":true, "slug":"cafe-paws-seoul", "region":{"sido":"seoul","sig":"mapo-gu"}, "routed":["/seoul/mapo-gu/dog-cafe"] }
```

* 배치/크론(내부)
```
POST /api/jobs/ingest/{places|events|weather}
POST /api/jobs/generate/content
```

## 9) 콘텐츠 템플릿(균일 발행, Make.com 변수 호환)

* Place(250±30자): Intro / 동반정책 / 시설·분위기 / 접근 / FAQ 2~3 / 내부링크.
  JSON-LD: LocalBusiness/Place + AggregateRating + OpeningHours + PostalAddress + FAQPage.
* Event: 기본정보 + 하이라이트≤40자, JSON-LD Event(+FAQ 선택).
* Area: 허브는 항상 index, 클러스터는 Thin 충족 시 index. 본문은 현황표 + 내부링크.
* Blog: TopN/초행가이드/산책코스. FAQ 2, 관련 3.

## 10) SEO/AEO/GEO 규칙

* 허브-클러스터 3계층 내부링크(상·중·하), 브레드크럼.
* 정답형: FAQ 2~3(대형견/실내·그늘/주차·물그릇 조건부).
* 엔티티 정규화: region_alias, 500m 클러스터 canonical place.
* Canonical: 한글·동의어 → 영문 슬러그 수렴.
* 사이트맵:
  * `/sitemap.xml` (인덱스)
  * `/sitemaps/hub-sido.xml`
  * `/sitemaps/hub-sig-{sido}.xml`
  * `/sitemaps/cluster-{sido}-{category}-{n}.xml` (5,000 URL 분할, gz 권장)
  * `/sitemaps/posts.xml`
    증분 갱신: 변경 묶음만 lastmod 업데이트.

## 11) 성능·광고

* CLS-세이프 광고: 고정 높이 예약 + 70% 스크롤 이후 로딩.
* 이미지/폰트: next/image(AVIF/LQIP), 폰트 서브세팅/프리로드.
* 광고 A/B 14일: 승자 = RPM × 가시도(≥70%) × LCP 영향.

## 12) 보안·운영

* 보호 API: Bearer + Cloudflare Access, 발행 IP 제한.
* QPS 제한: Places≤8, 지수 백오프/서킷브레이커.
* 모니터링: 실패율>2%, 응답>2s, RPM 급변, CWV 악화 → Slack 알림.
* 프리뷰 빌드 noindex, 프로덕션만 index.
* 301 리디렉트 테이블 운영.

## 13) ENV(샘플)

```
GOOGLE_PLACES_KEY, KMA_API_KEY, TOURAPI_KEY, OPENAI_API_KEY
INTERNAL_TOKEN, CF_KV_NAMESPACE, CF_D1_BINDING, SLACK_WEBHOOK_URL
NEXT_PUBLIC_API_URL
```

## 14) Cursor 작업 순서(실행 지시)

1. 라우팅 스캐폴드 생성: `/`, `/{sido}/[[...seg]]`, `/events`, `/blog/[slug]`, `/place/[slug]`, `/event/[slug]`.
2. 공통 컴포넌트: PlaceCard/EventCard/TagIcons/ScoreBadge/SafetyBadge/AdSlot/MapCluster.
3. D1 마이그레이션·KV 바인딩·ENV 연결.
4. 공개 GET API/발행 POST/배치 POST 구현, keyset cursor.
5. O-Dog 점수·안전모드·CQS 게이트·프롬프트 캐시.
6. `/api/og` + Top3 카드 생성기.
7. 분할 사이트맵 생성기(허브/클러스터/포스트) + 증분 lastmod.
8. 프리뷰 noindex 드라이런 → 품질 샘플링 → 공개 전환.

## 15) 수용 기준(AC)

* 발행 후 정확한 허브/클러스터 자동 분류, 10분 내 사이트맵 lastmod 반영.
* Thin 충족 시 즉시 index 전환, 허브는 상시 index.
* 모든 페이지 JSON-LD/FAQ/OG/브레드크럼 자동 삽입, 404 없음.
* 성능: LCP<2.5s, CLS<0.1, TTFB<800ms, API 실패율<1%.
* 광고 A/B 동작, 승자 자동 고정.

---

# ② 체크리스트(개발·런칭)

* [ ] regions/region_alias 시드 적재, 슬러그 표준화
* [ ] `/api/publish` 멱등키·스키마 버전·검증 로직
* [ ] keyset 페이지네이션·캐시·에러 핸들링
* [ ] CQS 계산·로그 저장, 임계<0.85 noindex
* [ ] Thin 게이트(6→10) 자동 전환
* [ ] 분할 사이트맵(gz) 증분 갱신 및 lastmod 정확성
* [ ] OG 카드/Top3 이미지 생성, 공유 테스트
* [ ] 광고 슬롯 고정 높이, A/B 14일 설정
* [ ] Slack 알림(실패율/지연/RPM/CWV) 활성화
* [ ] 프리뷰 noindex → 공개 전환 체크

---

# ③ 대체안(저비용·속도)

* 퍼플렉시티 생략, ChatGPT만 보강. Thin≥4, CQS 임계 0.80.
* 이미지/R2 보류, OG만 서버렌더.
* 발행은 Place 중심, 행사/블로그는 주1회 배치.

---

# ④ 근거(짧게)

* 허브 상시 index + 클러스터 조건부 index로 크롤 예산을 확보하고 확장성을 유지.
* Programmatic 템플릿 + AEO 스키마 + 내부링크 그래프가 대량 발행에서도 품질 일관성과 정답형 노출을 보장.
* CQS 품질게이트·증분 사이트맵·멱등 발행·keyset 페이징으로 1만→100만 스케일 안정화.

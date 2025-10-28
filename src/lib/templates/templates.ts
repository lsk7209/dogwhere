/**
 * Place 템플릿 정의
 */
export const placeTemplate = {
  mdx: `---
slug: "{{slug}}"
title: "{{name}} | {{sido_ko}} {{sig_ko}} {{category_ko}} 추천"
excerpt: "{{sido_ko}} {{sig_ko}}에서 {{category_ko}} 찾는다면 {{name}}{{josa name '은/는'}} 좋은 선택입니다. {{features_summary}}"
tags: ["{{sido_en}}","{{sig_en}}","{{category_en}}","반려견동반"]
regionCode: "{{region_code}}"
category: "{{category_en}}"
updated: "{{updated_at}}"
source: "{{source_label}}"
readingMinutes: 2
---

## 반려견 동반 정보

{{pet_policy_text}} {{#if policy_evidence.0}}(근거: {{policy_evidence.0.snippet}}){{/if}}

## 시설과 분위기

{{facility_ambience_text}}

## 위치와 접근성

주소: {{address}}

{{#if access_tip}}{{access_tip}}{{/if}}

{{#if best_time_tip}}
## 혼잡·시간대 팁

{{best_time_tip}}
{{/if}}

{{#if safety_badge}}
> 안전 배지: **{{safety_badge}}** — 상황에 따라 실내 좌석/그늘 자리를 우선 추천합니다.
{{/if}}

### FAQ

- **대형견도 가능한가요?**  
  {{faq_large_dog}}

- **영업시간은 어떻게 되나요?**  
  {{opening_hours_summary}}

{{#if has_parking}}
- **주차가 가능한가요?**  
  {{parking_text}}
{{/if}}

### 더 보기

- 같은 지역 다른 카테고리: /{{sido_en}}/{{sig_en}}/{{related_category1}}
- 인접 지역 같은 카테고리: /{{adjacent_sido_en}}/{{adjacent_sig_en}}/{{category_en}}
- 관련 글: /blog/{{related_post_slug}}

{{> source_licensing}}
{{> changelog}}`,

  jsonld: `{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Place","LocalBusiness"],
      "name": "{{name}}",
      {{#if address}}
      "address": { 
        "@type": "PostalAddress", 
        "streetAddress": "{{address}}", 
        "addressLocality": "{{sig_ko}}", 
        "addressRegion": "{{sido_ko}}", 
        "addressCountry": "KR" 
      },
      {{/if}}
      {{#if lat}}
      "geo": { 
        "@type": "GeoCoordinates", 
        "latitude": {{lat}}, 
        "longitude": {{lng}} 
      },
      {{/if}}
      {{#if phone}}"telephone": "{{phone}}",{{/if}}
      {{#if opening_hours_json}}"openingHours": {{opening_hours_json}},{{/if}}
      {{#if rating}}"aggregateRating": { 
        "@type": "AggregateRating", 
        "ratingValue": {{rating}}, 
        "reviewCount": {{review_count}} 
      },{{/if}}
      "amenityFeature": [
        { "@type":"LocationFeatureSpecification","name":"대형견 가능","value": {{feature_large_dog}} },
        { "@type":"LocationFeatureSpecification","name":"실내 좌석","value": {{feature_indoor}} },
        { "@type":"LocationFeatureSpecification","name":"주차","value": {{feature_parking}} }
      ],
      "publicAccess": true,
      "areaServed": "KR",
      "url": "{{canonical_url}}"
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        { 
          "@type":"Question",
          "name":"대형견도 가능한가요?",
          "acceptedAnswer":{"@type":"Answer","text":"{{faq_large_dog}}"} 
        },
        { 
          "@type":"Question",
          "name":"영업시간은 어떻게 되나요?",
          "acceptedAnswer":{"@type":"Answer","text":"{{opening_hours_summary}}"} 
        }
        {{#if has_parking}}, { 
          "@type":"Question",
          "name":"주차가 가능한가요?",
          "acceptedAnswer":{"@type":"Answer","text":"{{parking_text}}"} 
        }{{/if}}
      ]
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type":"ListItem","position":1,"name":"홈","item":"{{origin}}/" },
        { "@type":"ListItem","position":2,"name":"{{sido_ko}}","item":"{{origin}}/{{sido_en}}" },
        { "@type":"ListItem","position":3,"name":"{{sig_ko}}","item":"{{origin}}/{{sido_en}}/{{sig_en}}" },
        { "@type":"ListItem","position":4,"name":"{{category_ko}}","item":"{{origin}}/{{sido_en}}/{{sig_en}}/{{category_en}}" }
      ]
    }
  ]
}`
}

/**
 * Event 템플릿 정의
 */
export const eventTemplate = {
  mdx: `---
slug: "{{slug}}"
title: "{{title}} | {{region_label}} 반려견 행사"
excerpt: "{{title}}{{josa title '은/는'}} {{date_range}} {{venue}}{{josa venue '에서/에서'}} 열립니다. {{highlight_40}}"
tags: ["행사","{{sido_en}}","{{sig_en}}","반려견동반"]
regionCode: "{{region_code}}"
startDate: "{{start_date}}"
endDate: "{{end_date}}"
petAllowed: {{pet_allowed_bool}}
updated: "{{updated_at}}"
source: "{{source_label}}"
readingMinutes: 2
---

## 행사 안내

기간: {{date_range}}  
장소: {{venue}} ({{address}})  
반려견 동반: {{pet_allowed_text}}  
{{#if ticket_info_line}}요금: {{ticket_info_line}}{{/if}}

## 관람 포인트

{{highlights_text}}

{{#if policy_evidence.0}}
> 참고: 동반 규정 출처 — {{policy_evidence.0.url}}
{{/if}}

{{#if weather_notice}}
> **우천/폭염 시 공지 확인 필요:** {{weather_notice}}
{{/if}}

### 더 보기

- 같은 지역 인기 장소: /{{sido_en}}/{{sig_en}}/{{popular_category}}
- 다음 주 행사: /events?range=next-week&region={{sido_en}}

{{> source_licensing}}
{{> changelog}}`,

  jsonld: `{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "{{title}}",
  "startDate": "{{start_date}}",
  "endDate": "{{end_date}}",
  "eventStatus": "{{event_status}}",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "location": {
    "@type": "Place",
    "name": "{{venue}}",
    "address": { 
      "@type":"PostalAddress", 
      "streetAddress":"{{address}}", 
      "addressLocality":"{{sig_ko}}", 
      "addressRegion":"{{sido_ko}}", 
      "addressCountry":"KR" 
    },
    {{#if lat}}"geo": { 
      "@type":"GeoCoordinates", 
      "latitude": {{lat}}, 
      "longitude": {{lng}} 
    }{{/if}}
  },
  "isAccessibleForFree": {{is_free}},
  {{#if organizer}}"organizer": { "@type":"Organization", "name": "{{organizer}}" },{{/if}}
  {{#if ticket_url}}"offers": { 
    "@type":"Offer", 
    "url": "{{ticket_url}}", 
    "price": "{{ticket_price}}", 
    "priceCurrency": "KRW" 
  },{{/if}}
  "description": "{{highlight_40}}",
  "url": "{{canonical_url}}"
}`
}

/**
 * Area Hub 템플릿 정의
 */
export const areaHubTemplate = {
  mdx: `---
slug: "{{sido_en}}"
title: "{{sido_ko}} 반려견 동반 가이드"
excerpt: "{{sido_ko}}의 시·군·구별 {{category_count_summary}}"
readingMinutes: 3
---

## 지역 개요

{{sido_overview}}

## 시·군·구 바로가기

{{#each sig_list}}
- /{{../sido_en}}/{{sig_en}} — {{sig_ko}} ({{cluster_status_summary}})
{{/each}}

## 최신 업데이트

- {{latest_1}}
- {{latest_2}}
- {{latest_3}}

{{> source_licensing}}
{{> changelog}}`,

  jsonld: `{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "{{sido_ko}} 반려견 동반 장소",
  "description": "{{sido_ko}} 지역의 반려견 동반 가능한 장소 목록",
  "url": "{{canonical_url}}",
  "itemListElement": [
    {{#each sig_list}}
    {
      "@type": "ListItem",
      "position": {{@index}},
      "item": {
        "@type": "Place",
        "name": "{{sig_ko}}",
        "url": "{{origin}}/{{../sido_en}}/{{sig_en}}"
      }
    }{{#unless @last}},{{/unless}}
    {{/each}}
  ]
}`
}

/**
 * Area Cluster 템플릿 정의
 */
export const areaClusterTemplate = {
  mdx: `---
slug: "{{sido_en}}/{{sig_en}}/{{category_en}}"
title: "{{sig_ko}} {{category_ko}} 베스트 {{topn}} (업데이트: {{updated_date}})"
excerpt: "{{sig_ko}}에서 추천하는 {{category_ko}} 리스트. {{safety_or_weather_badge}}"
readingMinutes: 4
robotsIndex: "{{robots_index}}"
---

## 요약

{{summary_three_lines}}

## 베스트 {{category_ko}}

{{#each places}}
- {{rank}}. **{{name}}** — {{one_liner}}
  - 주소: {{address}} / 평점: {{rating}} ({{review_count}})
  - 포인트: {{features_top3}}
{{/each}}

### 자주 묻는 질문

- **대형견 가능한 곳이 있나요?**  
  {{faq_large_dog_cluster}}

- **주차 편한 곳은 어디인가요?**  
  {{faq_parking_cluster}}

### 더 보기

- 같은 지역 다른 카테고리: /{{sido_en}}/{{sig_en}}/{{related_category1}}
- 인접 지역 같은 카테고리: /{{adjacent_sido_en}}/{{adjacent_sig_en}}/{{category_en}}
- 행사: /events?region={{sido_en}}&sig={{sig_en}}

{{> source_licensing}}
{{> changelog}}`,

  jsonld: `{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "{{sig_ko}} {{category_ko}} 베스트 {{topn}}",
  "description": "{{sig_ko}}에서 추천하는 {{category_ko}} 목록",
  "url": "{{canonical_url}}",
  "itemListElement": [
    {{#each places}}
    {
      "@type": "ListItem",
      "position": {{rank}},
      "item": {
        "@type": "Place",
        "name": "{{name}}",
        "address": "{{address}}",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": {{rating}},
          "reviewCount": {{review_count}}
        },
        "url": "{{origin}}/place/{{slug}}"
      }
    }{{#unless @last}},{{/unless}}
    {{/each}}
  ]
}`
}

/**
 * Blog TopN 템플릿 정의
 */
export const blogTopNTemplate = {
  mdx: `---
slug: "{{slug}}"
title: "{{sido_ko}} {{sig_ko}} {{topic}} Top {{n}}"
excerpt: "{{sig_ko}}에서 {{topic}} 찾는다면 이 글 하나로 정리됩니다."
tags: ["가이드","{{sido_en}}","{{sig_en}}","{{topic_en}}"]
readingMinutes: 5
---

## 요약

{{summary_two_sentences}}

## 선정 기준

{{criteria_text}}

## Top {{n}}

{{#each items}}
- {{rank}}. **{{name}}** — {{reason_line}} (주소: {{address}})
{{/each}}

## 팁

{{tips_text}}

### FAQ

- **처음 가는 분이 주의할 점은?**  
  {{faq_beginner}}

- **비 오는 날은 어디가 좋은가요?**  
  {{faq_rainy}}

{{> source_licensing}}
{{> changelog}}`,

  jsonld: `{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{{sido_ko}} {{sig_ko}} {{topic}} Top {{n}}",
  "description": "{{sig_ko}}에서 {{topic}} 찾는다면 이 글 하나로 정리됩니다.",
  "author": {
    "@type": "Organization",
    "name": "어서오개"
  },
  "publisher": {
    "@type": "Organization",
    "name": "어서오개",
    "logo": {
      "@type": "ImageObject",
      "url": "{{origin}}/logo.png"
    }
  },
  "datePublished": "{{updated_at}}",
  "dateModified": "{{updated_at}}",
  "url": "{{canonical_url}}"
}`
}

/**
 * 모든 템플릿을 포함한 객체
 */
export const templates = {
  place: placeTemplate,
  event: eventTemplate,
  areaHub: areaHubTemplate,
  areaCluster: areaClusterTemplate,
  blogTopN: blogTopNTemplate
} as const

export type TemplateType = keyof typeof templates

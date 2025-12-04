'use client'

import Link from 'next/link'
import { Hero } from '@/components/home/Hero'
import { PlaceCard } from '@/components/home/PlaceCard'
import { RegionCard } from '@/components/home/RegionCard'
import { EventCard } from '@/components/home/EventCard'
import { SectionHeader } from '@/components/home/SectionHeader'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <Hero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* 오늘의 추천 */}
        <section>
          <SectionHeader title="오늘의 추천" href="/recommendations/today" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "애견동반 카페 '멍스'",
                rating: "4.8",
                reviewCount: 124,
                odogIndex: 9.2,
                img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
                category: "카페"
              },
              {
                title: '댕댕이 수영장',
                rating: "4.9",
                reviewCount: 210,
                odogIndex: 9.5,
                img: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80',
                category: "액티비티"
              },
              {
                title: '달려라멍멍 운동장',
                rating: "4.7",
                reviewCount: 88,
                odogIndex: 9.0,
                img: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=800&q=80',
                category: "운동장"
              }
            ].map((c) => (
              <PlaceCard
                key={c.title}
                title={c.title}
                rating={c.rating}
                reviewCount={c.reviewCount}
                odogIndex={c.odogIndex}
                imageUrl={c.img}
                category={c.category}
              />
            ))}
          </div>
        </section>

        {/* 지역 탐색 */}
        <section>
          <SectionHeader title="지역 탐색" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: '서울', href: '/seoul', img: 'https://images.unsplash.com/photo-1544989164-31dc3c645987?auto=format&fit=crop&w=1200&q=80' },
              { name: '경기', href: '/seoul/cluster/gangnam-cluster', img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80' },
              { name: '부산', href: '/seoul/cluster/hongdae-cluster', img: 'https://images.unsplash.com/photo-1513623954575-263b061498b5?auto=format&fit=crop&w=1200&q=80' },
              { name: '제주', href: '/seoul/cluster/myeongdong-cluster', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80' }
            ].map((r) => (
              <RegionCard
                key={r.name}
                name={r.name}
                href={r.href}
                imageUrl={r.img}
              />
            ))}
          </div>
        </section>

        {/* 이번 주 행사 */}
        <section>
          <SectionHeader title="이번 주 행사" href="/events" linkText="행사 전체 보기" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: '서울 펫 페스티벌',
                date: '11.26 (일)',
                location: '서울숲',
                badge: '반려견 가능',
                img: 'https://images.unsplash.com/photo-1525253013412-55c1a69a5738?auto=format&fit=crop&w=1200&q=80'
              },
              {
                title: '유기견 입양 캠페인',
                date: '11.25 (토)',
                location: '댕댕이 운동장',
                badge: '참여 무료',
                img: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80'
              }
            ].map((e) => (
              <EventCard
                key={e.title}
                title={e.title}
                date={e.date}
                location={e.location}
                badge={e.badge}
                imageUrl={e.img}
              />
            ))}
          </div>
        </section>

        {/* 블로그 / 가이드 */}
        <section>
          <SectionHeader title="블로그 / 가이드" href="/blog" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: '초보 견주를 위한 필수 준비물 5가지', img: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1200&q=80', desc: '새로운 가족을 맞이하기 전 꼭 확인해야 할 체크리스트.' },
              { title: '강아지와 첫 여행, 이것만은!', img: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80', desc: '안전하고 즐거운 반려견 동반 여행을 위한 팁.' },
              { title: '반려견 분리불안, 이렇게 대처해요', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80', desc: '원인과 해결 방법을 전문가의 조언과 함께.' }
            ].map((b) => (
              <Link key={b.title} href="/blog" className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
                <div className="h-48 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${b.img})` }} />
                <div className="p-6 flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">{b.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{b.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 서비스 안내 & CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">어서오개 | DogsWhere 서비스 안내</h2>
            <div className="text-sm text-gray-600 space-y-3 leading-relaxed">
              <p>어서오개는 전국의 반려견 동반 가능 장소(카페, 식당, 숙소, 관광지 등) 정보를 제공하여 반려인들의 즐거운 외출을 돕는 서비스입니다.</p>
              <p>장소 정책은 예고 없이 변경될 수 있으니 방문 전 반드시 직접 확인해주세요.</p>
              <p>잘못된 정보 제보는 <Link href="/report" className="text-emerald-600 font-semibold hover:underline">정보 수정/제보하기</Link>에서 요청해 주세요.</p>
            </div>
          </section>

          <section className="bg-emerald-900 p-8 rounded-3xl text-white flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-3">우리 동네 반려견 명소를 제보해주세요!</h2>
              <p className="text-emerald-100 mb-6">아직 등록되지 않은 멋진 장소를 알고 계신가요? 함께 만들어가는 어서오개!</p>
              <Link href="/report" className="inline-block bg-white text-emerald-900 font-bold py-3 px-8 rounded-full hover:bg-emerald-50 transition-colors">
                제보하기
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
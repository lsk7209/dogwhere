'use client'

import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="flex min-h-[480px] items-center justify-center bg-cover bg-center px-6 text-center" style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.55)), url('https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1600&q=80')"
        }}>
          <div className="max-w-2xl">
            <h1 className="text-white text-4xl md:text-5xl font-extrabold tracking-tight">오늘 강아지와 어디 갈까?</h1>
            <p className="mt-3 text-gray-200">반려견과 함께할 수 있는 장소를 손쉽게 찾아보세요. 오늘의 추천과 지역별 명소를 탐색할 수 있어요.</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link href="/recommendations/today" className="h-11 px-5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700">오늘의 추천</Link>
              <Link href="/seoul" className="h-11 px-5 rounded-lg bg-white/90 text-gray-900 font-semibold hover:bg-white">지역별 탐색</Link>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 오늘의 추천 */}
        <section className="py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[22px] font-bold text-gray-900">오늘의 추천</h2>
            <Link href="/recommendations/today" className="text-emerald-700 text-sm font-medium hover:underline">더 보기 →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { title: "애견동반 카페 '멍스'", sub: '⭐ 4.8 (124) | O-Dog 9.2', img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80' },
              { title: '댕댕이 수영장', sub: '⭐ 4.9 (210) | O-Dog 9.5', img: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80' },
              { title: '달려라멍멍 운동장', sub: '⭐ 4.7 (88) | O-Dog 9.0', img: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=800&q=80' }
            ].map((c) => (
              <div key={c.title} className="flex flex-col gap-3">
                <div className="aspect-video rounded-lg bg-cover bg-center shadow" style={{ backgroundImage: `url(${c.img})` }} />
                <div>
                  <p className="text-gray-900 font-medium">{c.title}</p>
                  <p className="text-emerald-700 text-sm">{c.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 지역 탐색 */}
        <section className="py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[22px] font-bold text-gray-900">지역 탐색</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: '서울', href: '/seoul', img: 'https://images.unsplash.com/photo-1544989164-31dc3c645987?auto=format&fit=crop&w=1200&q=80' },
              { name: '경기', href: '/seoul/cluster/gangnam-cluster', img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80' },
              { name: '부산', href: '/seoul/cluster/hongdae-cluster', img: 'https://images.unsplash.com/photo-1513623954575-263b061498b5?auto=format&fit=crop&w=1200&q=80' },
              { name: '제주', href: '/seoul/cluster/myeongdong-cluster', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80' }
            ].map((r) => (
              <Link key={r.name} href={r.href} className="relative group rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url(${r.img})` }} />
                <div className="relative aspect-[4/3]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5 text-white">
                  <h3 className="text-2xl font-bold">{r.name}</h3>
                  <span className="text-sm font-semibold">탐색하기 →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 이번 주 행사 */}
        <section className="py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[22px] font-bold text-gray-900">이번 주 행사</h2>
            <Link href="/events" className="text-emerald-700 text-sm font-medium hover:underline">행사 전체 보기 →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: '서울 펫 페스티벌', date: '~ 11.26 (일) | 서울숲', badge: '반려견 가능', img: 'https://images.unsplash.com/photo-1525253013412-55c1a69a5738?auto=format&fit=crop&w=1200&q=80' },
              { title: '유기견 입양 캠페인', date: '11.25 (토) | 댕댕이 운동장', badge: '반려견 가능', img: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80' }
            ].map((e) => (
              <div key={e.title} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${e.img})` }} />
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-500">{e.date}</p>
                      <h3 className="mt-1 text-lg font-bold text-gray-900">{e.title}</h3>
                    </div>
                    <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 rounded-full px-2 py-1">{e.badge}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 블로그 / 가이드 */}
        <section className="py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[22px] font-bold text-gray-900">블로그 / 가이드</h2>
            <Link href="/blog" className="text-emerald-700 text-sm font-medium hover:underline">더 보기 →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: '초보 견주를 위한 필수 준비물 5가지', img: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1200&q=80', desc: '새로운 가족을 맞이하기 전 꼭 확인해야 할 체크리스트.' },
              { title: '강아지와 첫 여행, 이것만은!', img: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80', desc: '안전하고 즐거운 반려견 동반 여행을 위한 팁.' },
              { title: '반려견 분리불안, 이렇게 대처해요', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80', desc: '원인과 해결 방법을 전문가의 조언과 함께.' }
            ].map((b) => (
              <div key={b.title} className="bg-white rounded-lg shadow overflow-hidden flex flex-col">
                <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${b.img})` }} />
                <div className="p-4 flex-grow">
                  <h3 className="text-lg font-bold text-gray-900">{b.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 서비스 안내 */}
        <section className="py-8">
          <div className="bg-gray-100 p-8 rounded-lg">
            <h2 className="text-lg font-bold text-gray-900 mb-4">어서오개 | DogsWhere 서비스 안내</h2>
            <div className="text-sm text-gray-700 space-y-3 leading-relaxed">
              <p>어서오개는 전국의 반려견 동반 가능 장소(카페, 식당, 숙소, 관광지 등) 정보를 제공하여 반려인들의 즐거운 외출을 돕는 서비스입니다. 공공데이터, 사용자 제보, 제휴사의 정보를 바탕으로 수집하며 정기적으로 업데이트합니다.</p>
              <p>장소 정책은 예고 없이 변경될 수 있으니 방문 전 반드시 직접 확인해주세요. 제공 정보의 정확성을 100% 보증하지 않습니다.</p>
              <p>잘못된 정보 제보는 <Link href="/report" className="text-emerald-700 font-semibold hover:underline">정보 수정/제보하기</Link>에서 요청해 주세요.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-8">
          <div className="bg-emerald-100 p-8 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div>
              <h2 className="text-xl font-bold text-gray-900">우리 동네 반려견 명소를 제보해주세요!</h2>
              <p className="mt-2 text-gray-700">아직 등록되지 않은 멋진 장소를 알고 계신가요? 함께 만들어가는 어서오개!</p>
            </div>
            <Link href="/report" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg">제보하기</Link>
          </div>
        </section>
      </div>
    </div>
  )
}
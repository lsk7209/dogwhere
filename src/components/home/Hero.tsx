'use client'

import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import Link from 'next/link'

export function Hero() {
    return (
        <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
            {/* Background Image with Parallax-like effect */}
            <div
                className="absolute inset-0 bg-cover bg-center z-0 scale-105"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=2000&q=80')"
                }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60 z-10" />

            {/* Content */}
            <div className="relative z-20 container mx-auto px-4 text-center text-white">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 drop-shadow-lg">
                        오늘 강아지와 <br className="md:hidden" />
                        <span className="text-emerald-400">어디 갈까?</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-100 mb-10 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md">
                        반려견과 함께할 수 있는 최고의 장소를 찾아보세요.<br />
                        카페부터 여행지까지, 모든 순간이 특별해집니다.
                    </p>
                </motion.div>

                {/* Search Bar (Visual Only for now) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="max-w-md mx-auto mb-10 relative"
                >
                    <div className="relative group">
                        <div className="absolute inset-0 bg-emerald-500 blur opacity-20 group-hover:opacity-30 transition-opacity rounded-full"></div>
                        <div className="relative flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 shadow-2xl transition-all hover:bg-white/20">
                            <Search className="w-5 h-5 text-gray-200 mr-3" />
                            <input
                                type="text"
                                placeholder="지역, 카페, 숙소 검색..."
                                className="bg-transparent border-none outline-none text-white placeholder-gray-300 w-full font-medium"
                            />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    className="flex flex-wrap items-center justify-center gap-4"
                >
                    <Link
                        href="/recommendations/today"
                        className="px-8 py-3.5 rounded-full bg-emerald-600 text-white font-bold text-lg shadow-lg shadow-emerald-900/20 hover:bg-emerald-500 hover:scale-105 transition-all duration-300"
                    >
                        오늘의 추천
                    </Link>
                    <Link
                        href="/seoul"
                        className="px-8 py-3.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 text-white font-bold text-lg hover:bg-white/20 hover:scale-105 transition-all duration-300"
                    >
                        지역별 탐색
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}

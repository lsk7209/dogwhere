'use client'

import { Star } from 'lucide-react'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface PlaceCardProps {
    title: string
    rating: string
    reviewCount: number
    odogIndex: number
    imageUrl: string
    category?: string
}

export function PlaceCard({ title, rating, reviewCount, odogIndex, imageUrl, category = "카페" }: PlaceCardProps) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
        >
            <div className="relative aspect-[4/3] overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${imageUrl})` }}
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm">
                    {category}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
                        {title}
                    </h3>
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                    <div className="flex items-center text-amber-400 font-bold">
                        <Star className="w-4 h-4 fill-current mr-1" />
                        {rating}
                        <span className="text-gray-400 font-normal ml-1">({reviewCount})</span>
                    </div>
                    <div className="w-px h-3 bg-gray-300" />
                    <div className="text-emerald-600 font-semibold">
                        O-Dog {odogIndex}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

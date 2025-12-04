'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

interface RegionCardProps {
    name: string
    href: string
    imageUrl: string
}

export function RegionCard({ name, href, imageUrl }: RegionCardProps) {
    return (
        <Link href={href} className="block h-full">
            <motion.div
                whileHover={{ scale: 0.98 }}
                className="relative h-full min-h-[240px] rounded-2xl overflow-hidden group cursor-pointer shadow-md"
            >
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${imageUrl})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity group-hover:opacity-90" />

                <div className="absolute bottom-0 left-0 p-6 w-full">
                    <h3 className="text-2xl font-bold text-white mb-2 transform group-hover:-translate-y-1 transition-transform duration-300">{name}</h3>
                    <div className="flex items-center text-emerald-300 text-sm font-semibold opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        <span>탐색하기</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                </div>
            </motion.div>
        </Link>
    )
}

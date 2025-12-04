'use client'

import { Calendar } from 'lucide-react'
import { motion } from 'framer-motion'

interface EventCardProps {
    title: string
    date: string
    location: string
    badge: string
    imageUrl: string
}

export function EventCard({ title, date, location, badge, imageUrl }: EventCardProps) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full"
        >
            <div className="relative h-48 bg-cover bg-center" style={{ backgroundImage: `url(${imageUrl})` }}>
                <div className="absolute top-3 right-3 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
                    {badge}
                </div>
            </div>
            <div className="p-5 flex-grow flex flex-col">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Calendar className="w-4 h-4 mr-1.5" />
                    <span>{date}</span>
                    <span className="mx-2">•</span>
                    <span>{location}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{title}</h3>
            </div>
        </motion.div>
    )
}

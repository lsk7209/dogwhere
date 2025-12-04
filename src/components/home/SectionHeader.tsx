'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface SectionHeaderProps {
    title: string
    href?: string
    linkText?: string
}

export function SectionHeader({ title, href, linkText = "더 보기" }: SectionHeaderProps) {
    return (
        <div className="flex items-end justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                {title}
            </h2>
            {href && (
                <Link
                    href={href}
                    className="group flex items-center text-emerald-600 font-semibold text-sm hover:text-emerald-700 transition-colors"
                >
                    {linkText}
                    <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                </Link>
            )}
        </div>
    )
}

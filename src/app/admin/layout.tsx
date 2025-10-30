'use client'

import { ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LogOut, LayoutDashboard, MapPin, Calendar, FileText, Code } from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

const menu = [
  { name: '대시보드', href: '/admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { name: '장소 관리', href: '/admin/places', icon: <MapPin className="w-5 h-5" /> },
  { name: '행사 관리', href: '/admin/events', icon: <Calendar className="w-5 h-5" /> },
  { name: '포스트 관리', href: '/admin/posts', icon: <FileText className="w-5 h-5" /> },
  { name: '템플릿 관리', href: '/admin/templates', icon: <Code className="w-5 h-5" /> },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  // 인증 체크는 생략(기존 유지)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-gray-900 text-white h-16 flex items-center px-8 shadow-sm z-10">
        <div className="flex items-center space-x-4 flex-1">
          <span className="font-black tracking-wide text-xl mr-3">어서오개 Admin</span>
          <div className="flex gap-2">
            {menu.map((m) => (
              <button key={m.href} onClick={() => router.push(m.href)} className={`flex items-center px-3 py-2 rounded ${pathname===m.href ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white'}`}>{m.icon}<span className="ml-1 text-sm">{m.name}</span></button>
            ))}
          </div>
        </div>
        <button onClick={() => { localStorage.removeItem('admin_token'); router.push('/admin/login'); }} className="flex items-center space-x-1 text-gray-300 hover:text-red-500 ml-3">
          <LogOut className="w-5 h-5" /> <span className="hidden sm:inline text-sm">로그아웃</span>
        </button>
      </header>
      <main className="flex-1 px-6 py-8">
        {children}
      </main>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    // 마크다운에서 헤딩 추출 (h2만)
    const headingRegex = /^(#{2})\s+(.+)$/gm;
    const headings: TOCItem[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      headings.push({ id, text, level });
    }

    setTocItems(headings);
  }, [content]);

  useEffect(() => {
    const handleScroll = () => {
      const headingElements = tocItems.map(item => 
        document.getElementById(item.id)
      ).filter(Boolean);

      const scrollPosition = window.scrollY + 100;

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const element = headingElements[i];
        if (element && element.offsetTop <= scrollPosition) {
          setActiveId(element.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tocItems]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (tocItems.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-50 rounded-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">목차</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
      
      {isExpanded && (
        <nav className="space-y-1">
          {tocItems.map((item, index) => (
            <button
              key={index}
              onClick={() => scrollToHeading(item.id)}
              className={`block w-full text-left py-2 px-3 rounded-md transition-colors text-sm ${
                activeId === item.id
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              style={{ paddingLeft: `${(item.level - 1) * 16 + 12}px` }}
            >
              {item.text}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}

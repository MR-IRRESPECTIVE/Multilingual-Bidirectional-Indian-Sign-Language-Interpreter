'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/conversation', label: 'Conversation' },
    { href: '/translate', label: 'Translate' },
    { href: '/dictionary', label: 'Dictionary' },
    { href: '/settings', label: 'Settings' },
  ];

  const getLinkClass = (href: string) => {
    const isActive = pathname === href || (href !== '/' && pathname?.startsWith(href));
    return `font-medium px-2 py-1 rounded-md transition-colors ${
      isActive ? 'text-blue-700 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
    }`;
  };

  return (
    <header className="bg-white shadow-sm border-b px-4 py-3 flex flex-col md:flex-row md:items-center justify-between sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="material-symbols-outlined text-blue-600 text-3xl group-hover:scale-110 transition-transform">sign_language</span>
          <h1 className="text-xl font-semibold tracking-tight text-gray-900 group-hover:text-blue-700 transition-colors">ISL Interpreter</h1>
        </Link>
        <div className="md:hidden">
          <button 
            className="p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Navigation"
          >
            <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>
      
      <nav className={`${mobileOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row gap-2 md:gap-6 mt-4 md:mt-0 pb-2 md:pb-0`}>
        {links.map((link) => (
          <Link key={link.href} href={link.href} className={getLinkClass(link.href)} onClick={() => setMobileOpen(false)}>
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

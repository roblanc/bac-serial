'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookOpen, Menu, X } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-paper-50/90 backdrop-blur-md border-b border-paper-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-sm bg-gradient-to-br from-bac-500 to-bac-700 flex items-center justify-center transition-transform group-hover:scale-105">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl font-semibold text-ink-900">
              BAC Serial
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/lecturi" className="nav-link">
              Lecturi
            </Link>
            <Link href="/despre" className="nav-link">
              Despre
            </Link>
            <Link href="/cont" className="btn-primary text-sm py-2">
              Contul meu
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-ink-700 hover:text-ink-900"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-paper-200 animate-fade-in">
            <div className="flex flex-col gap-4">
              <Link 
                href="/lecturi" 
                className="px-4 py-2 text-ink-700 hover:text-ink-900 hover:bg-paper-100 rounded-sm transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Lecturi
              </Link>
              <Link 
                href="/despre" 
                className="px-4 py-2 text-ink-700 hover:text-ink-900 hover:bg-paper-100 rounded-sm transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Despre
              </Link>
              <Link 
                href="/cont" 
                className="btn-primary mx-4"
                onClick={() => setIsMenuOpen(false)}
              >
                Contul meu
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

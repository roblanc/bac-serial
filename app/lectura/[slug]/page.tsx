'use client'

import { useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft, Mail, Clock, Calendar, CheckCircle } from 'lucide-react'
import { getBookBySlug, allBooks, getBooksByAuthor } from '@/lib/books'
import BookCard from '@/components/BookCard'

interface PageProps {
  params: { slug: string }
}

export default function BookPage({ params }: PageProps) {
  const book = getBookBySlug(params.slug)
  const [email, setEmail] = useState('')
  const [frequency, setFrequency] = useState('3x')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  if (!book) {
    notFound()
  }

  const otherBooksByAuthor = getBooksByAuthor(book.author).filter(b => b.slug !== book.slug)

  const weeksToFinish = Math.ceil(book.emailCount / 3)
  const finishDate = new Date()
  finishDate.setDate(finishDate.getDate() + weeksToFinish * 7)
  const formattedDate = finishDate.toLocaleDateString('ro-RO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, bookSlug: book.slug, frequency })
      })

      if (res.ok) {
        setIsSubscribed(true)
      }
    } catch (error) {
      console.error('Subscription error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Back Link */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Înapoi la lecturi
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Book Cover */}
          <div className="md:col-span-1">
            <div
              className="aspect-[3/4] rounded-lg overflow-hidden shadow-lg"
              style={{ backgroundColor: book.coverColor }}
            >
              <div className="w-full h-full flex items-center justify-center p-6">
                <span className="text-white text-xl font-bold text-center leading-tight">
                  {book.title}
                </span>
              </div>
            </div>
          </div>

          {/* Book Details */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <span className="inline-block px-3 py-1 bg-gray-200 text-gray-700 text-sm font-medium rounded-full mb-3">
                {book.genre}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {book.title}
              </h1>
              <p className="text-xl text-gray-600">
                de <Link href={`/?search=${encodeURIComponent(book.author)}`} className="underline hover:text-gray-900">
                  {book.author}
                </Link>
              </p>
            </div>

            <p className="text-gray-700 leading-relaxed">
              {book.description}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <Mail className="w-5 h-5 text-red-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{book.emailCount}</p>
                <p className="text-xs text-gray-500">emailuri</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <Clock className="w-5 h-5 text-red-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">~{book.readingTime}</p>
                <p className="text-xs text-gray-500">min/email</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <Calendar className="w-5 h-5 text-red-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{weeksToFinish}</p>
                <p className="text-xs text-gray-500">săptămâni</p>
              </div>
            </div>

            {/* Subscription Form */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              {isSubscribed ? (
                <div className="text-center py-4">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Te-ai abonat cu succes! 🎉</h3>
                  <p className="text-gray-600">
                    Vei primi primul email cu "{book.title}" în curând.
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Începe să citești gratuit
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Dacă te abonezi astăzi, vei termina până la <strong>{formattedDate}</strong>.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Adresa ta de email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="elev@email.com"
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">
                        Frecvența emailurilor
                      </label>
                      <select
                        id="frequency"
                        value={frequency}
                        onChange={(e) => setFrequency(e.target.value)}
                        className="input-field"
                      >
                        <option value="3x">De 3 ori pe săptămână (Luni, Miercuri, Vineri)</option>
                        <option value="daily">Zilnic</option>
                        <option value="weekly">O dată pe săptămână</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="btn-primary w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Se procesează...' : 'Abonează-te gratuit'}
                    </button>
                  </form>

                  <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      100% gratuit
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Fără spam
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Other books by author */}
        {otherBooksByAuthor.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Alte opere de {book.author}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {otherBooksByAuthor.map((otherBook) => (
                <BookCard key={otherBook.slug} book={otherBook} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Simple Footer */}
      <footer className="py-8 px-4 border-t border-gray-200 mt-8 bg-white">
        <div className="max-w-4xl mx-auto text-center text-sm text-gray-500">
          <p>© 2025 MicroLecturi. Creat cu ❤️ pentru elevii care se pregătesc pentru BAC.</p>
        </div>
      </footer>
    </main>
  )
}

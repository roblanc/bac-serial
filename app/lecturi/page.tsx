import Link from 'next/link'
import { Search, Filter, BookOpen } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BookCard from '@/components/BookCard'
import { allBooks, genres, authors } from '@/lib/books'

export const metadata = {
  title: 'Lecturi pentru BAC | BAC Serial',
  description: 'Toate operele literare obligatorii pentru Bacalaureat. Ion, Enigma Otiliei, Eminescu, Arghezi și multe altele.',
}

export default function LecturiPage() {
  return (
    <>
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="section-title mb-4">Găsește următoarea ta lectură</h1>
            <p className="text-lg text-ink-600 max-w-2xl mx-auto">
              Avem toate operele din programa de Bacalaureat, fiecare pregătită 
              să devină newsletter-ul tău personal.
            </p>
          </div>

          {/* Filters */}
          <div className="bg-paper-100 rounded-sm p-6 mb-10 border border-paper-300">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
                <input
                  type="text"
                  placeholder="Caută după titlu sau autor..."
                  className="input-field pl-10"
                />
              </div>

              {/* Genre Filter */}
              <div className="w-full md:w-48">
                <select className="input-field" defaultValue="">
                  <option value="">Toate genurile</option>
                  {genres.map((genre) => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>

              {/* Author Filter */}
              <div className="w-full md:w-56">
                <select className="input-field" defaultValue="">
                  <option value="">Toți autorii</option>
                  {authors.map((author) => (
                    <option key={author} value={author}>{author}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-ink-600">
              <span className="font-semibold text-ink-900">{allBooks.length}</span> lecturi disponibile
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-ink-500">Sortează după:</span>
              <select className="text-sm border-none bg-transparent text-ink-700 font-medium focus:outline-none cursor-pointer">
                <option>Recomandate</option>
                <option>Titlu (A-Z)</option>
                <option>Autor (A-Z)</option>
                <option>Lungime (scurt → lung)</option>
              </select>
            </div>
          </div>

          {/* Books Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allBooks.map((book) => (
              <BookCard key={book.slug} book={book} />
            ))}
          </div>

          {/* Empty State */}
          {allBooks.length === 0 && (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 text-ink-300 mx-auto mb-4" />
              <h3 className="font-display text-xl font-semibold text-ink-900 mb-2">
                Nu am găsit nicio lectură
              </h3>
              <p className="text-ink-600 mb-6">
                Încearcă să modifici filtrele sau să cauți altceva.
              </p>
              <button className="btn-secondary">
                Resetează filtrele
              </button>
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-12">
            <button className="px-4 py-2 text-ink-600 hover:text-ink-900 transition-colors">
              ← Înapoi
            </button>
            <button className="px-4 py-2 bg-ink-900 text-paper-50 rounded-sm">1</button>
            <button className="px-4 py-2 text-ink-700 hover:bg-paper-200 rounded-sm transition-colors">2</button>
            <button className="px-4 py-2 text-ink-600 hover:text-ink-900 transition-colors">
              Înainte →
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

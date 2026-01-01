'use client'

import { useState } from 'react'
import BookCard from '@/components/BookCard'
import { allBooks, genres, Book } from '@/lib/books'

export default function Home() {
  const [activeGenre, setActiveGenre] = useState<Book['genre'] | 'Toate'>('Toate')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredBooks = allBooks.filter(book => {
    const matchesGenre = activeGenre === 'Toate' || book.genre === activeGenre
    const matchesSearch = searchQuery === '' ||
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesGenre && matchesSearch
  })

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-16 pb-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Citește pentru BAC direct pe mail 📚
          </h1>
          <p className="text-lg text-gray-600">
            Lecturile pentru BAC, puțin câte puțin 📎 Le primești pe mail 🚀 Citești în metrou 🚃
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-6 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Search Bar */}
          <div className="flex gap-3 mb-6">
            <input
              type="text"
              placeholder="Caută o operă sau un autor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field flex-1"
            />
            <button className="btn-primary">
              Caută
            </button>
          </div>

          {/* Genre Filters */}
          <div className="flex flex-wrap gap-2 mb-2">
            <button
              onClick={() => setActiveGenre('Toate')}
              className={`genre-tab ${activeGenre === 'Toate' ? 'active' : ''}`}
            >
              Toate
            </button>
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setActiveGenre(genre)}
                className={`genre-tab ${activeGenre === genre ? 'active' : ''}`}
              >
                {genre}
              </button>
            ))}
            <span className="genre-tab cursor-default">🌵</span>
          </div>
        </div>
      </section>

      {/* Books Grid */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredBooks.map((book) => (
              <BookCard key={book.slug} book={book} />
            ))}
          </div>

          {filteredBooks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Nu am găsit nicio operă care să corespundă căutării.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-200 mt-8">
        <div className="max-w-6xl mx-auto text-center text-sm text-gray-500">
          <p>© 2025 MicroLecturi. Toate drepturile rezervate.</p>
          <p className="mt-2">
            Creat cu ❤️ pentru elevii care se pregătesc pentru BAC
          </p>
        </div>
      </footer>
    </main>
  )
}

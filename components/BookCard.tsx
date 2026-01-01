import Link from 'next/link'
import { Book } from '@/lib/books'

interface BookCardProps {
  book: Book
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <Link href={`/lectura/${book.slug}`} className="book-card group block">
      {/* Book Cover Placeholder */}
      <div
        className="aspect-[3/4] relative overflow-hidden"
        style={{ backgroundColor: book.coverColor }}
      >
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <span className="text-white/90 font-semibold text-lg text-center leading-tight">
            {book.title}
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Card Content */}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-gray-900 leading-tight group-hover:text-coral-500 transition-colors">
          {book.title}
        </h3>

        <Link
          href={`/autor/${encodeURIComponent(book.author)}`}
          className="text-sm text-gray-600 underline hover:text-gray-900 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          {book.author}
        </Link>

        <p className="text-xs text-gray-400">
          Read in {book.emailCount} emails
        </p>
      </div>
    </Link>
  )
}

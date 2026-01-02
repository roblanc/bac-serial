import Link from 'next/link'
import Image from 'next/image'
import { Book } from '@/lib/books'

interface BookCardProps {
  book: Book
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <Link href={`/lectura/${book.slug}`} className="book-card group block">
      {/* Book Cover - aspect ratio matches cover images (641:1024 ≈ 5:8) */}
      <div
        className="relative overflow-hidden rounded-lg"
        style={{
          aspectRatio: '641 / 1024',
          backgroundColor: book.coverColor
        }}
      >
        {book.coverImage ? (
          <Image
            src={book.coverImage}
            alt={book.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center p-4">
            <span className="text-white/90 font-semibold text-lg text-center leading-tight">
              {book.title}
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-gray-900 leading-tight group-hover:text-red-500 transition-colors">
          {book.title}
        </h3>

        <p className="text-sm text-gray-600">
          {book.author}
        </p>

        <p className="text-xs text-gray-400">
          Termini în {book.emailCount} emailuri
        </p>
      </div>
    </Link>
  )
}

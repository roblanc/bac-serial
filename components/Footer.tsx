import Link from 'next/link'
import { BookOpen, Mail, Github, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-ink-900 text-paper-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-sm bg-gradient-to-br from-bac-500 to-bac-700 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-xl font-semibold text-paper-50">
                BAC Serial
              </span>
            </Link>
            <p className="text-paper-400 max-w-sm mb-6">
              Lecturi obligatorii pentru Bacalaureat, livrate zilnic în inbox. 
              Citește în 10 minute pe zi și fii pregătit pentru examen.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://github.com/username/bac-serial" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-paper-400 hover:text-paper-50 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com/bacserial" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-paper-400 hover:text-paper-50 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="mailto:contact@bacserial.ro"
                className="text-paper-400 hover:text-paper-50 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-sans font-semibold text-paper-50 mb-4">Lecturi</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/lecturi?gen=proza" className="text-paper-400 hover:text-paper-50 transition-colors">
                  Proză
                </Link>
              </li>
              <li>
                <Link href="/lecturi?gen=poezie" className="text-paper-400 hover:text-paper-50 transition-colors">
                  Poezie
                </Link>
              </li>
              <li>
                <Link href="/lecturi?gen=dramaturgie" className="text-paper-400 hover:text-paper-50 transition-colors">
                  Dramaturgie
                </Link>
              </li>
              <li>
                <Link href="/lecturi" className="text-paper-400 hover:text-paper-50 transition-colors">
                  Toate lecturile
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-sans font-semibold text-paper-50 mb-4">Link-uri utile</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/despre" className="text-paper-400 hover:text-paper-50 transition-colors">
                  Despre noi
                </Link>
              </li>
              <li>
                <Link href="/confidentialitate" className="text-paper-400 hover:text-paper-50 transition-colors">
                  Politica de confidențialitate
                </Link>
              </li>
              <li>
                <Link href="/termeni" className="text-paper-400 hover:text-paper-50 transition-colors">
                  Termeni și condiții
                </Link>
              </li>
              <li>
                <a 
                  href="mailto:contact@bacserial.ro" 
                  className="text-paper-400 hover:text-paper-50 transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-ink-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-paper-500 text-sm">
            © {new Date().getFullYear()} BAC Serial. Creat cu ❤️ pentru elevii din România.
          </p>
          <p className="text-paper-500 text-sm">
            Textele operelor literare sunt în domeniul public.
          </p>
        </div>
      </div>
    </footer>
  )
}

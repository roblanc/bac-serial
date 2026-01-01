import Link from 'next/link'
import { BookOpen, Mail, Users, Heart, ChevronRight } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Despre BAC Serial | Lecturi pentru Bacalaureat',
  description: 'Află cum BAC Serial te ajută să citești operele literare obligatorii pentru Bacalaureat în doar 10 minute pe zi.',
}

export default function DesprePage() {
  return (
    <>
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 lg:py-24 bg-gradient-to-b from-paper-100 to-paper-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
            <span className="inline-block px-4 py-2 bg-bac-100 text-bac-700 rounded-full text-sm font-sans font-medium mb-6">
              Despre noi
            </span>
            <h1 className="section-title text-4xl md:text-5xl mb-6">
              De ce BAC Serial
            </h1>
            <p className="text-xl text-ink-600 leading-relaxed">
              Newsletterele au explodat în popularitate, dar să fim sinceri: 
              există literatură mult mai bună pe care să o citești.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div className="prose-romanian space-y-6 text-lg">
              <p>
                <strong className="font-display text-xl">Eminescu, Rebreanu, Caragiale.</strong> Cartea 
                potrivită la momentul potrivit îți poate schimba viața sau te poate expune 
                la idei pe care nu le-ai fi descoperit altfel. Și sunt mai multe cărți cu 
                acest potențial decât vom putea vreodată parcurge.
              </p>

              <p>
                Cei mai mulți dintre noi ne dorim să citim mai mult, dar viețile noastre 
                sunt atât de aglomerate încât rareori găsim timpul. Între timp, căsuțele 
                de email se umplu cu newslettere — cu nume precum "Rezumatul de Luni" și 
                "Trei Lucruri de Joi" — și le parcurgem săptămână de săptămână.
              </p>

              <p>
                Da, unele newslettere sunt fantastice, dar adevărul e că multe sunt de 
                calitate scăzută și puse la un loc în grabă. În multe cazuri, autorii 
                încep newslettere nu pentru a îmbogăți viețile cititorilor, ci pentru 
                a-și construi o audiență căreia să-i vândă ceva mai târziu.
              </p>

              <p>
                Totuși, newsletterele cresc și cresc pentru că, în ciuda dezavantajelor, 
                au câteva beneficii semnificative față de alte forme de scriere:
              </p>

              <ul className="list-disc pl-6 space-y-2">
                <li>Apar în căsuța de email — un loc pe care majoritatea îl verificăm regulat.</li>
                <li>Mesajele noi sunt marcate ca "necitite", făcându-le greu de ignorat.</li>
                <li>Sunt suficient de scurte pentru a fi citite dintr-o singură ședere.</li>
              </ul>

              <p>
                Acestea sunt motivatori psihologici puternici. Dar dacă le-am putea folosi 
                pentru a citi ceva <em>cu adevărat valoros?</em>
              </p>

              <p>
                <strong>Aici intervine BAC Serial.</strong> Acum poți citi opere clasice precum 
                Ion, Enigma Otiliei sau poeziile lui Eminescu în mai puțin de treizeci de 
                minute pe săptămână, ca newslettere prin email.
              </p>

              <p>
                Această cantitate de lectură poate părea minusculă, dar cu consistență, 
                se adună! Dacă citești newsletterele noastre de trei ori pe săptămână, 
                vei termina între trei și cinci opere clasice până la sfârșitul anului 
                (numărul exact depinde de lungimea operelor alese, desigur).
              </p>
            </div>

            <div className="mt-12 text-center">
              <Link href="/lecturi" className="btn-primary">
                Găsește o lectură
                <ChevronRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-ink-900 text-paper-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <h2 className="font-display text-3xl font-semibold text-center mb-12">
              Valorile noastre
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-bac-500/20 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-bac-400" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">Accesibilitate</h3>
                <p className="text-paper-300">
                  Facem literatura clasică accesibilă tuturor, indiferent de cât de ocupat ești.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-bac-500/20 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-bac-400" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">Comunitate</h3>
                <p className="text-paper-300">
                  Creăm o comunitate de cititori care își împărtășesc pasiunea pentru literatură.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-bac-500/20 flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-bac-400" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">Pasiune</h3>
                <p className="text-paper-300">
                  Credem în puterea literaturii de a transforma și îmbogăți viața.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <h2 className="section-title text-3xl text-center mb-4">
              Cine a creat BAC Serial?
            </h2>
            <p className="text-center text-ink-600 mb-12">
              BAC Serial este creat cu dragoste pentru elevii din România.
            </p>

            <div className="bg-paper-100 p-8 rounded-sm border border-paper-300 text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-bac-400 to-bac-600 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-white font-display font-bold">R</span>
              </div>
              <h3 className="font-display text-xl font-semibold text-ink-900 mb-1">
                Robert
              </h3>
              <p className="text-ink-600 mb-4">Creator</p>
              <p className="text-ink-600 max-w-md mx-auto">
                Inspirat de Modern Serial și de dorința de a ajuta elevii români 
                să se pregătească mai ușor pentru Bacalaureat.
              </p>
            </div>

            <div className="mt-8 text-center text-ink-600">
              <p>
                Textele operelor literare sunt în domeniul public în România. 
                Suntem recunoscători comunității care păstrează aceste opere vii.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-br from-bac-500 to-bac-700 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
              Gata să începi?
            </h2>
            <p className="text-xl text-bac-100 mb-8 max-w-xl mx-auto">
              Alege prima ta lectură și primește primul fragment chiar astăzi.
            </p>
            <Link 
              href="/lecturi" 
              className="inline-flex items-center justify-center px-8 py-4 
                         bg-white text-bac-700 font-sans font-semibold text-lg
                         rounded-sm transition-all duration-300
                         hover:bg-paper-100 hover:shadow-lg hover:-translate-y-0.5"
            >
              Explorează lecturile
              <ChevronRight className="w-6 h-6 ml-2" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

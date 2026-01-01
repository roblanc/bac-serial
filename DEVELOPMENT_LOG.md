# BAC Serial - Development Log

## Proiect: Replică Modern Serial pentru Bacalaureat România

**Data:** 1 Ianuarie 2025
**Inspirat de:** https://modernserial.com/

---

## 🎯 Obiectiv

Crearea unei platforme care trimite lecturile obligatorii pentru Bacalaureat ca newslettere zilnice, în fragmente de ~10 minute de citit.

---

## 📁 Structura Proiectului Creat

```
bac-serial/
├── app/                          # Next.js App Router
│   ├── globals.css              # Stiluri globale + Tailwind
│   ├── layout.tsx               # Root layout cu metadata
│   ├── page.tsx                 # Homepage complet
│   ├── lecturi/
│   │   └── page.tsx             # Lista tuturor lecturilor cu filtre
│   ├── lectura/
│   │   └── [slug]/
│   │       └── page.tsx         # Pagina individuală pentru fiecare operă
│   ├── despre/
│   │   └── page.tsx             # Pagina About
│   ├── cont/                    # (gol - de implementat)
│   └── api/
│       ├── subscribe/
│       │   └── route.ts         # API endpoint pentru abonare
│       └── webhook/             # (gol - pentru Resend webhooks)
├── components/
│   ├── Header.tsx               # Navbar responsive cu mobile menu
│   ├── Footer.tsx               # Footer cu links
│   └── BookCard.tsx             # Card pentru afișarea cărților
├── lib/
│   ├── books.ts                 # Date pentru toate operele literare
│   └── email.ts                 # Utilități Resend + template-uri HTML email
├── prisma/
│   └── schema.prisma            # Schema bază de date completă
├── content/
│   └── proza/
│       └── ion-cap1-fragment1.md  # Exemplu conținut - primul fragment din Ion
├── public/
│   └── images/                  # (gol - pentru assets)
├── styles/                      # (gol - stiluri adiționale dacă e nevoie)
├── .env.example                 # Variabile de mediu necesare
├── .gitignore                   
├── package.json                 
├── tsconfig.json                
├── tailwind.config.ts           # Config Tailwind cu culori custom
├── postcss.config.js            
├── next.config.js               
├── README.md                    
├── LICENSE                      # MIT License
└── CONTRIBUTING.md              # Ghid pentru contribuții
```

---

## 🛠️ Tech Stack Ales

| Categorie | Tehnologie | De ce |
|-----------|------------|-------|
| Framework | Next.js 14 | App Router, SSR, API routes |
| Limbaj | TypeScript | Type safety |
| Styling | Tailwind CSS | Rapid, customizabil |
| Database | PostgreSQL + Prisma | ORM modern, migrări |
| Email | Resend | API simplu, deliverability bun |
| Deployment | Vercel/Railway | Gratuit pentru start |

---

## 🎨 Design System Implementat

### Culori (tailwind.config.ts)
```
bac-*      : Orange/amber - accent principal (#e87516)
ink-*      : Gri închis - text (#1a1a1a)
paper-*    : Bej/cream - fundal (#fdfcfb)
tricolor   : Albastru, galben, roșu românesc
```

### Fonturi (Google Fonts în globals.css)
```
font-display : Playfair Display (titluri)
font-body    : Source Serif Pro (text)
font-sans    : DM Sans (UI elements)
```

### Componente CSS Custom (globals.css)
```
.btn-primary    - Buton principal negru
.btn-secondary  - Buton outline
.card-book      - Card pentru cărți
.book-cover     - Cover cu gradient și shadow
.email-preview  - Preview email pe homepage
.feature-card   - Card pentru features
.input-field    - Input styled
.nav-link       - Link cu underline animation
```

---

## 📚 Opere Literare Incluse (lib/books.ts)

### Proză (6 opere)
1. **Ion** - Liviu Rebreanu (45 emailuri)
2. **Enigma Otiliei** - George Călinescu (52 emailuri)
3. **Ultima noapte de dragoste, întâia noapte de război** - Camil Petrescu (48 emailuri)
4. **Moromeții** - Marin Preda (55 emailuri)
5. **Moara cu noroc** - Ioan Slavici (15 emailuri)
6. **Baltagul** - Mihail Sadoveanu (35 emailuri)

### Poezie (10 opere)
1. **Luceafărul** - Mihai Eminescu (8 emailuri)
2. **Floare albastră** - Mihai Eminescu (3 emailuri)
3. **Sara pe deal** - Mihai Eminescu (2 emailuri)
4. **Scrisoarea III** - Mihai Eminescu (10 emailuri)
5. **Testament** - Tudor Arghezi (2 emailuri)
6. **Flori de mucigai** - Tudor Arghezi (6 emailuri)
7. **Eu nu strivesc corola de minuni a lumii** - Lucian Blaga (2 emailuri)
8. **Plumb** - George Bacovia (2 emailuri)
9. **Lacustră** - George Bacovia (2 emailuri)
10. **Riga Crypto și lapona Enigel** - Ion Barbu (3 emailuri)

### Dramaturgie (1 operă)
1. **O scrisoare pierdută** - I.L. Caragiale (12 emailuri)

---

## 🗄️ Schema Bază de Date (prisma/schema.prisma)

### Modele
```
User          - utilizatori (email, name)
Book          - opere literare (title, author, genre, themes)
Chapter       - fragmente ale cărților (content, notes, readingTime)
Subscription  - abonamente utilizator-carte (frequency, status, deliveryDays)
EmailLog      - istoric emailuri trimise (status, openedAt, clickedAt)
```

### Enum-uri
```
Genre              : PROZA, POEZIE, DRAMATURGIE
DeliveryFrequency  : DAILY, THREE_PER_WEEK, WEEKLY
SubscriptionStatus : ACTIVE, PAUSED, COMPLETED, CANCELLED
EmailStatus        : PENDING, SENT, DELIVERED, OPENED, CLICKED, BOUNCED, FAILED
```

---

## 📧 Sistem Email (lib/email.ts)

### Funcții implementate:
1. `sendEmail()` - trimite email generic via Resend
2. `generateChapterEmail()` - template HTML pentru fragment
3. `generateWelcomeEmail()` - template HTML pentru bun venit

### Template email include:
- Header cu titlu carte și progress (X din Y)
- Badge timp de citit
- Conținut fragment
- Secțiune note și comentarii (opțional)
- Buton "Trimite-mi următorul fragment"
- Footer cu linkuri: Setări, Pauză, Dezabonare

---

## 🚀 Ce trebuie continuat în Antigravity

### Prioritate ÎNALTĂ:

1. **Autentificare utilizatori**
   - NextAuth.js sau Clerk
   - Magic links (fără parolă) - recomandat pentru simplitate
   - Pagina /cont pentru dashboard utilizator

2. **API complet pentru subscriptions**
   - POST /api/subscribe - creare abonament ✅ (parțial)
   - GET /api/subscriptions - lista abonamente user
   - PATCH /api/subscriptions/[id] - modifică frecvență/pauză
   - DELETE /api/subscriptions/[id] - dezabonare

3. **CRON job pentru trimitere emailuri**
   - Vercel Cron sau Railway cron
   - Verifică subscriptions active
   - Trimite următorul chapter
   - Actualizează currentChapterIdx

4. **Conținut literar**
   - Adaugă textele complete pentru toate operele
   - Împarte în fragmente de ~10 min
   - Adaugă note și comentarii pentru fiecare

### Prioritate MEDIE:

5. **Funcționalitate "Trimite-mi acum"**
   - API endpoint pentru next chapter imediat
   - Link în email care triggerează

6. **Pagina setări abonament**
   - Schimbă frecvență
   - Pune pe pauză
   - Derulează înapoi/înainte
   - Dezabonare

7. **Tracking emailuri**
   - Open tracking (pixel)
   - Click tracking
   - Dashboard cu statistici

### Prioritate SCĂZUTĂ:

8. **Search funcțional pe /lecturi**
   - Implementează filtering client-side sau server-side

9. **Sistem de plată** (dacă vrei monetizare)
   - Stripe integration
   - Model: per carte sau abonament lunar

10. **PWA / Mobile app**
    - Service worker pentru offline
    - Push notifications

---

## 💻 Comenzi pentru a începe

```bash
# 1. Navighează în folder
cd bac-serial

# 2. Instalează dependențele
npm install

# 3. Copiază env
cp .env.example .env.local

# 4. Editează .env.local cu:
#    - DATABASE_URL (Supabase/Railway/Neon)
#    - RESEND_API_KEY

# 5. Inițializează baza de date
npx prisma generate
npx prisma db push

# 6. Pornește dev server
npm run dev

# 7. Deschide http://localhost:3000
```

---

## 🔗 Resurse Utile

- **Modern Serial** (inspirație): https://modernserial.com/
- **Resend Docs**: https://resend.com/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Next.js App Router**: https://nextjs.org/docs/app
- **Texte domeniu public**: https://ro.wikisource.org/

---

## 📝 Note Importante

1. **Textele literare sunt în domeniu public** în România - poți folosi liber
2. **Wikisource** are multe texte deja digitizate
3. **Fragmentarea** trebuie făcută manual pentru flow bun
4. **Notele și comentariile** adaugă valoare mare - nu le sări

---

## ✅ Ce e GATA vs ❌ Ce LIPSEȘTE

| Funcționalitate | Status |
|-----------------|--------|
| Homepage | ✅ Complet |
| Pagina lecturi | ✅ Layout gata, ❌ filtrare nefuncțională |
| Pagina carte individuală | ✅ Complet |
| Pagina despre | ✅ Complet |
| Header/Footer | ✅ Complet |
| Design system | ✅ Complet |
| Schema DB | ✅ Complet |
| API subscribe | ⚠️ Parțial (doar validare) |
| Template email | ✅ Complet |
| Autentificare | ❌ Lipsește |
| CRON trimitere | ❌ Lipsește |
| Conținut literar | ⚠️ Doar 1 exemplu |
| Pagina cont | ❌ Lipsește |
| Dashboard admin | ❌ Lipsește |

---

**Succes cu dezvoltarea în Antigravity! 🚀**

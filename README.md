# 📚 BAC Serial

**Lecturi pentru Bacalaureat livrate ca newsletter zilnic**

Inspirat de [Modern Serial](https://modernserial.com/), BAC Serial îți trimite fragmentele din operele literare obligatorii pentru Bacalaureat direct în inbox, în porții ușor de citit în 10 minute sau mai puțin.

## 🎯 Despre Proiect

BAC Serial transformă pregătirea pentru examenul de Bacalaureat la Limba și Literatura Română într-o experiență accesibilă și plăcută. În loc să te confrunți cu romane întregi și volume de poezie, primești zilnic fragmente scurte, însoțite de comentarii și analize relevante.

### Cum funcționează

1. **Alege operele** - Selectează din lista de lecturi obligatorii pentru BAC
2. **Configurează frecvența** - Zilnic, de 3 ori pe săptămână, sau săptămânal
3. **Primește fragmente** - Fiecare email conține ~10 minute de lectură
4. **Citește și învață** - Fragmentele vin cu note explicative și comentarii

### Opere disponibile

**Proză:**
- Ion - Liviu Rebreanu
- Enigma Otiliei - George Călinescu
- Ultima noapte de dragoste, întâia noapte de război - Camil Petrescu
- Moromeții - Marin Preda
- O scrisoare pierdută - I.L. Caragiale
- Moara cu noroc - Ioan Slavici
- Baltagul - Mihail Sadoveanu

**Poezie:**
- Mihai Eminescu - Luceafărul, Floare albastră, Sara pe deal, etc.
- Tudor Arghezi - Testament, Flori de mucigai
- Lucian Blaga - Eu nu strivesc corola de minuni a lumii
- George Bacovia - Plumb, Lacustră
- Ion Barbu - Riga Crypto și lapona Enigel

**Dramaturgie:**
- O scrisoare pierdută - I.L. Caragiale

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + Prisma ORM
- **Email**: Resend / Nodemailer
- **Deployment**: Vercel / Railway

## 📁 Structura Proiectului

```
bac-serial/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Homepage
│   ├── layout.tsx         # Root layout
│   ├── lecturi/           # Pagina cu toate lecturile
│   ├── lectura/[slug]/    # Pagina individuală pentru fiecare operă
│   ├── despre/            # Despre noi
│   ├── cont/              # Contul utilizatorului
│   └── api/               # API endpoints
├── components/            # Componente React reutilizabile
├── lib/                   # Utilități și configurări
├── prisma/               # Schema bază de date
├── content/              # Conținutul lecturilor (markdown)
├── public/               # Assets statice
└── styles/               # Stiluri globale
```

## 🚀 Instalare și Rulare

```bash
# Clonează repository-ul
git clone https://github.com/username/bac-serial.git
cd bac-serial

# Instalează dependențele
npm install

# Configurează variabilele de mediu
cp .env.example .env.local

# Rulează migrările bazei de date
npx prisma migrate dev

# Pornește serverul de dezvoltare
npm run dev
```

Deschide [http://localhost:3000](http://localhost:3000) în browser.

## 📧 Configurare Email

BAC Serial folosește [Resend](https://resend.com) pentru trimiterea emailurilor. Configurează `RESEND_API_KEY` în `.env.local`.

## 🤝 Contribuții

Contribuțiile sunt binevenite! Vezi [CONTRIBUTING.md](CONTRIBUTING.md) pentru detalii.

## 📄 Licență

Acest proiect este licențiat sub MIT License - vezi fișierul [LICENSE](LICENSE) pentru detalii.

Textele operelor literare sunt în domeniu public în România.

---

Creat cu ❤️ pentru elevii din România

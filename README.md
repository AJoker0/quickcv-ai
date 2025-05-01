# 🚀 QuickCV

**QuickCV.ai** lets developers paste their GitHub & LinkedIn links and instantly generate a polished PDF résumé and a personal mini-site — powered by AI.

### ✨ Features
- 🧠 GPT-4 resume summary generation
- 📄 Auto-generated PDF with @react-pdf/renderer
- 🌐 Shareable profile site (e.g. `quickcv.ai/andrii`)
- 🎨 Free + Pro tiers with themes and custom branding

---

### 💡 How It Works

1. Paste your **GitHub** and **LinkedIn** URLs
2. QuickCV fetches repos, languages, roles
3. GPT generates your **summary** and **skills**
4. You get:
   - 📄 Downloadable PDF résumé
   - 🌍 A personal site at `quickcv.ai/your-name`

---

### 🧱 Tech Stack

| Layer      | Tech                             |
|------------|----------------------------------|
| Frontend   | Next.js 14 (App Router), Tailwind |
| Auth       | NextAuth (GitHub, Google)        |
| AI         | OpenAI GPT-4, DALL·E (optional)  |
| PDF Gen    | React-PDF (or Puppeteer SSR)     |
| DB         | MongoDB Atlas                    |
| Hosting    | Vercel (CI/CD from GitHub)       |

---

### 🛠️ Local Development

```bash
git clone https://github.com/your-username/quickcv.git
cd quickcv
npm install
cp .env.example .env.local
# Fill in your API keys
npm run dev

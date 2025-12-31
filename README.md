# 🔖 Bookmark Manager

A modern, full-stack bookmark management application with real-time synchronization, built with React, Supabase, and TailwindCSS.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.3-blue)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8)

## ✨ Features

- 🔐 **Passwordless Authentication** - Magic link email authentication via Supabase
- ☁️ **Real-Time Sync** - Changes instantly sync across all devices
- ✏️ **Full CRUD Operations** - Create, read, update, and delete bookmarks
- 🔍 **Advanced Search** - Search bookmarks by title or URL
- 🏷️ **Tag System** - Organize with tags and filter by multiple tags
- 🎨 **Favicons** - Automatic favicon display for visual identification
- 🔁 **Smart Sorting** - Sort by newest, oldest, or alphabetically by title
- 🚫 **Duplicate Detection** - Prevents adding the same URL twice
- 📤 **Import/Export** - Import browser bookmarks (HTML) and export to any browser with duplicate filtering
- 🧩 **Browser Extension** - Save bookmarks from any webpage with one click
- 💬 **Toast Notifications** - Clean, non-intrusive feedback for all actions
- 🌙 **Dark Mode** - Modern dark UI optimized for extended use
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- ⚡ **Fast & Lightweight** - Built with Vite for optimal performance
- 🔒 **Secure** - Row-level security (RLS) ensures users only see their own data

## 🚀 Demo

**Live Demo:** [Your Vercel URL here]

**Test Account:** Use any email to receive a magic link

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS 3** - Utility-first CSS framework
- **React Hooks** - State management (useState, useEffect, useMemo)

### Backend
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Authentication (magic links)
  - Real-time subscriptions
  - Row Level Security (RLS)

### Deployment
- **Vercel** - Frontend hosting
- **GitHub** - Version control

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Git

### 1. Clone the repository
```bash
git clone https://github.com/Fred-Pi/Bookmark-Manager.git
cd Bookmark-Manager
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up Supabase

#### Create a Supabase project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to be provisioned

#### Create the database table
Run this SQL in the Supabase SQL Editor:

```sql
-- Create bookmarks table
create table public.bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  url text not null,
  title text not null,
  tags text[] default '{}',
  favicon text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.bookmarks enable row level security;

-- Create policy: Users can only see their own bookmarks
create policy "Users can view their own bookmarks"
  on public.bookmarks for select
  using (auth.uid() = user_id);

-- Create policy: Users can insert their own bookmarks
create policy "Users can insert their own bookmarks"
  on public.bookmarks for insert
  with check (auth.uid() = user_id);

-- Create policy: Users can delete their own bookmarks
create policy "Users can delete their own bookmarks"
  on public.bookmarks for delete
  using (auth.uid() = user_id);

-- Create index for faster queries
create index bookmarks_user_id_idx on public.bookmarks (user_id);
```

#### Configure authentication
1. In Supabase Dashboard → **Authentication** → **Providers**
2. Email provider should be enabled by default
3. Configure email templates if desired

### 4. Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Get these values from: Supabase Dashboard → **Project Settings** → **API**

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

### Post-deployment
Add your Vercel URL to Supabase:
1. Go to Supabase Dashboard → **Authentication** → **URL Configuration**
2. Add your Vercel URL to **Site URL** and **Redirect URLs**

## 📖 Usage

### Adding a Bookmark (Web App)
1. Sign in with your email (you'll receive a magic link)
2. Enter the URL and title
3. Add optional tags (comma-separated)
4. Click "Add Bookmark" - favicon is automatically added

### Adding a Bookmark (Browser Extension)
1. Install the extension from `extension/` folder (see [extension/README.md](extension/README.md))
2. Navigate to any webpage
3. Click the extension icon
4. Click "Save Bookmark" (title and URL are pre-filled!)

### Editing Bookmarks
- Click the edit icon (pencil) on any bookmark
- Update the URL, title, or tags
- Click "Save Changes"

### Searching
- Use the search bar to filter by title or URL
- Search is case-insensitive and instant

### Filtering by Tags
- Click on any tag to filter bookmarks
- Select multiple tags to narrow results (AND logic)
- Click "Clear filters" to reset

### Sorting Bookmarks
- Use the sort dropdown to organize bookmarks
- **Newest First** - Most recently added (default)
- **Oldest First** - Oldest bookmarks first
- **Title (A-Z)** - Alphabetical ascending
- **Title (Z-A)** - Alphabetical descending

### Importing Bookmarks
1. Export bookmarks from your browser:
   - **Chrome/Edge:** Settings → Bookmarks → Bookmark Manager → ⋮ → Export bookmarks
   - **Firefox:** Bookmarks → Manage Bookmarks → Import and Backup → Export Bookmarks to HTML
2. In the web app, click the **Import** button
3. Select your exported HTML file
4. Confirm the import

### Exporting Bookmarks
1. Click the **Export** button in the web app
2. Save the HTML file
3. Import into any browser:
   - **Chrome/Edge:** Settings → Bookmarks → Bookmark Manager → ⋮ → Import bookmarks
   - **Firefox:** Bookmarks → Manage Bookmarks → Import and Backup → Import Bookmarks from HTML

### Deleting Bookmarks
- Click the trash icon on any bookmark
- Confirm deletion

## 🏗️ Project Structure

```
bookmark-manager/
├── src/
│   ├── components/
│   │   ├── BookmarkCard.jsx      # Individual bookmark display
│   │   ├── BookmarkForm.jsx      # Add bookmark form (with metadata fetching)
│   │   ├── BookmarkGrid.jsx      # Grid layout for bookmarks
│   │   ├── EditBookmarkModal.jsx # Edit bookmark modal dialog
│   │   ├── Login.jsx             # Authentication UI
│   │   └── SearchBar.jsx         # Search and filter controls
│   ├── contexts/
│   │   ├── AuthContext.jsx       # Authentication state management
│   │   └── ToastContext.jsx      # Toast notification system
│   ├── supabase/
│   │   └── config.js             # Supabase client configuration
│   ├── utils/
│   │   ├── metadata.js           # Favicon URL generation
│   │   └── bookmarkIO.js         # Import/export utilities
│   ├── App.jsx                   # Main application component
│   ├── main.jsx                  # Application entry point
│   └── index.css                 # Global styles and Tailwind imports
├── extension/                    # Browser extension
│   ├── manifest.json             # Extension configuration
│   ├── popup.html                # Extension popup UI
│   ├── popup.css                 # Extension styles
│   ├── popup.js                  # Extension logic
│   └── README.md                 # Extension installation guide
├── public/                       # Static assets
├── .env.example                  # Environment variable template
├── supabase-migration-favicon.sql # Database migration for favicon support
├── .gitignore
├── package.json
├── tailwind.config.js            # Tailwind configuration
├── vite.config.js                # Vite configuration
└── README.md
```

## 🔑 Key Features Explained

### Real-Time Synchronization
Uses Supabase's real-time subscriptions to listen for database changes:
```javascript
supabase
  .channel('bookmarks_channel')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'bookmarks' },
    () => fetchBookmarks()
  )
  .subscribe()
```

### Tag Filtering
Supports multi-tag filtering with AND logic:
```javascript
filtered.filter(bookmark =>
  selectedTags.every(tag => bookmark.tags.includes(tag))
)
```

### Security
Row Level Security (RLS) ensures users can only access their own bookmarks:
```sql
create policy "Users can view their own bookmarks"
  on public.bookmarks for select
  using (auth.uid() = user_id);
```

## 🧪 Testing Checklist

- [ ] Sign in with magic link email
- [ ] Add a bookmark with tags
- [ ] Edit a bookmark (change title, URL, or tags)
- [ ] Delete a bookmark
- [ ] Search by title
- [ ] Search by URL
- [ ] Filter by single tag
- [ ] Filter by multiple tags
- [ ] Export bookmarks to HTML
- [ ] Import bookmarks from browser HTML export
- [ ] Test browser extension (add bookmark from webpage)
- [ ] Test on mobile device
- [ ] Test real-time sync (open in two tabs)

## 📈 Performance

- **First Load:** ~200kb (gzipped)
- **Time to Interactive:** <1s on 3G
- **Lighthouse Score:** 95+ (Performance, Accessibility, SEO)

## 🤝 Contributing

This is a personal portfolio project, but feedback and suggestions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**Federico Pisani**
- GitHub: [@Fred-Pi](https://github.com/Fred-Pi)
- Email: mail.fpisani@gmail.com

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for the excellent BaaS platform
- [TailwindCSS](https://tailwindcss.com) for the utility-first CSS framework
- [Vite](https://vitejs.dev) for the blazing-fast build tool
- [React](https://react.dev) for the UI library

---

Built with ❤️ using React, Supabase, and TailwindCSS

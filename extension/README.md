# 🔖 Bookmark Manager - Browser Extension

Save bookmarks to your Bookmark Manager with one click from any webpage!

## 🚀 Installation

### For Development/Testing

1. **Generate Icons** (temporary step until you create proper icons):
   - For now, we'll use placeholder icons
   - You can create proper icons later using a tool like [favicon.io](https://favicon.io/)

2. **Load in Chrome:**
   - Open Chrome and go to `chrome://extensions/`
   - Enable **"Developer mode"** (toggle in top-right)
   - Click **"Load unpacked"**
   - Select the `extension/` folder
   - The extension should now appear in your toolbar!

3. **Load in Firefox:**
   - Open Firefox and go to `about:debugging#/runtime/this-firefox`
   - Click **"Load Temporary Add-on"**
   - Select any file in the `extension/` folder
   - The extension will be loaded temporarily

## ⚙️ Setup

1. **First Time Setup:**
   - Click the extension icon
   - Enter your Supabase URL and Anon Key
   - Click "Save Configuration"

2. **Sign In:**
   - Enter your email
   - Click "Send Magic Link"
   - Check your email and click the link
   - Reopen the extension

3. **You're Ready!**
   - Now you can save bookmarks from any page with one click

## 📖 Usage

1. **Navigate to any webpage** you want to bookmark
2. **Click the extension icon**
3. The title and URL are **auto-filled** from the current page
4. Add **tags** (optional, comma-separated)
5. Click **"Save Bookmark"**
6. Done! The bookmark is saved to your account

## 🎨 Creating Custom Icons

For a production version, create icons in these sizes:
- 16x16 pixels
- 48x48 pixels
- 128x128 pixels

Save them as `icon16.png`, `icon48.png`, and `icon128.png` in the `extension/icons/` folder.

You can use:
- [favicon.io](https://favicon.io/) - Generate icons from text or image
- [Figma](https://figma.com) - Design custom icons
- [Canva](https://canva.com) - Simple icon creation

## 🔧 Configuration

The extension stores:
- **Supabase credentials** - Locally in browser storage
- **User session** - Locally in browser storage

All data is stored securely in your browser.

## 🐛 Troubleshooting

**Extension won't load:**
- Make sure you're in Developer Mode
- Check that all files are in the `extension/` folder

**Can't save bookmarks:**
- Make sure you've signed in
- Check that your Supabase credentials are correct
- Verify the database table exists

**Magic link not working:**
- Make sure email provider is enabled in Supabase
- Check your spam folder

## 📦 Publishing (Optional)

To publish to Chrome Web Store:
1. Create proper icons
2. Update `manifest.json` with your deployed app URL
3. Zip the `extension/` folder
4. Go to [Chrome Developer Dashboard](https://chrome.google.com/webstore/devconsole)
5. Pay $5 one-time fee
6. Upload and submit for review

## 🔒 Security

- Credentials are stored locally in browser storage
- All API calls go directly to Supabase
- No data is sent to third parties
- Uses Supabase Row Level Security (RLS)

---

Built as part of the Bookmark Manager project

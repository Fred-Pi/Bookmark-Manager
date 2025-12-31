import { useState } from 'react'
import { getFaviconUrl } from '../utils/metadata'

function BookmarkForm({ onAddBookmark }) {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [tags, setTags] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!url.trim() || !title.trim()) {
      alert('Please fill in both URL and title')
      return
    }

    const newBookmark = {
      url: url.trim(),
      title: title.trim(),
      tags: tags.trim().split(',').map(tag => tag.trim()).filter(tag => tag),
      favicon: getFaviconUrl(url.trim())
    }

    onAddBookmark(newBookmark)

    // Clear form
    setUrl('')
    setTitle('')
    setTags('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* URL Input */}
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-slate-300 mb-1">
          URL *
        </label>
        <input
          type="url"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      {/* Title Input */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-1">
          Title *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My favorite website"
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      {/* Tags Input */}
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-slate-300 mb-1">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="development, react, tutorial"
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-slate-400 mt-1">Separate tags with commas</p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-colors font-medium"
      >
        Add Bookmark
      </button>
    </form>
  )
}

export default BookmarkForm

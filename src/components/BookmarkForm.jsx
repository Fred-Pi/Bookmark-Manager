import { useState, useEffect } from 'react'
import { fetchUrlMetadata, isValidUrl } from '../utils/metadata'

function BookmarkForm({ onAddBookmark }) {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [tags, setTags] = useState('')
  const [favicon, setFavicon] = useState('')
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false)
  const [metadataFetched, setMetadataFetched] = useState(false)

  // Fetch metadata when URL changes
  useEffect(() => {
    // Don't fetch if URL is empty or invalid
    if (!url || !isValidUrl(url)) {
      setMetadataFetched(false)
      return
    }

    // Don't fetch again if user already got metadata and changed title
    if (metadataFetched && title) {
      return
    }

    // Debounce URL changes
    const timer = setTimeout(async () => {
      setIsLoadingMetadata(true)

      try {
        const metadata = await fetchUrlMetadata(url)

        if (metadata.success) {
          // Only auto-fill title if user hasn't entered one
          if (!title || !metadataFetched) {
            setTitle(metadata.title)
          }
          setFavicon(metadata.favicon)
          setMetadataFetched(true)
        }
      } catch (error) {
        console.error('Failed to fetch metadata:', error)
      } finally {
        setIsLoadingMetadata(false)
      }
    }, 800) // Wait 800ms after user stops typing

    return () => clearTimeout(timer)
  }, [url])

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
      favicon: favicon || null
    }

    onAddBookmark(newBookmark)

    // Clear form
    setUrl('')
    setTitle('')
    setTags('')
    setFavicon('')
    setMetadataFetched(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* URL Input */}
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-slate-300 mb-1">
          URL *
        </label>
        <div className="relative">
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value)
              setMetadataFetched(false) // Reset when URL changes
            }}
            placeholder="https://example.com"
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          {isLoadingMetadata && (
            <div className="absolute right-3 top-2.5">
              <svg className="animate-spin h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}
        </div>
        {isLoadingMetadata && (
          <p className="text-xs text-blue-400 mt-1">Fetching page info...</p>
        )}
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
        disabled={isLoadingMetadata}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoadingMetadata ? 'Loading...' : 'Add Bookmark'}
      </button>
    </form>
  )
}

export default BookmarkForm

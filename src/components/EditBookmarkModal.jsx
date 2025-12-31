import { useState, useEffect } from 'react'

function EditBookmarkModal({ bookmark, onClose, onSave }) {
  const [url, setUrl] = useState(bookmark?.url || '')
  const [title, setTitle] = useState(bookmark?.title || '')
  const [tags, setTags] = useState(bookmark?.tags?.join(', ') || '')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (bookmark) {
      setUrl(bookmark.url || '')
      setTitle(bookmark.title || '')
      setTags(bookmark.tags?.join(', ') || '')
    }
  }, [bookmark])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!url.trim() || !title.trim()) {
      alert('URL and title are required')
      return
    }

    setIsSaving(true)

    const updatedBookmark = {
      ...bookmark,
      url: url.trim(),
      title: title.trim(),
      tags: tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag)
    }

    await onSave(updatedBookmark)
    setIsSaving(false)
    onClose()
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!bookmark) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-2xl max-w-2xl w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Edit Bookmark</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* URL Input */}
          <div>
            <label htmlFor="edit-url" className="block text-sm font-medium text-slate-300 mb-2">
              URL
            </label>
            <input
              type="url"
              id="edit-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Title Input */}
          <div>
            <label htmlFor="edit-title" className="block text-sm font-medium text-slate-300 mb-2">
              Title
            </label>
            <input
              type="text"
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Bookmark title"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Tags Input */}
          <div>
            <label htmlFor="edit-tags" className="block text-sm font-medium text-slate-300 mb-2">
              Tags
              <span className="text-slate-500 font-normal ml-2">(comma-separated)</span>
            </label>
            <input
              type="text"
              id="edit-tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="react, tutorial, javascript"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditBookmarkModal

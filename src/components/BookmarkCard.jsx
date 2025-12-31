function BookmarkCard({ bookmark, onDelete }) {
  // Extract domain from URL for display
  const getDomain = (url) => {
    try {
      const domain = new URL(url).hostname
      return domain.replace('www.', '')
    } catch {
      return url
    }
  }

  return (
    <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 hover:bg-slate-700 hover:border-slate-500 transition-all">
      {/* Header with title and delete button */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-slate-100 text-lg flex-1 pr-2">
          {bookmark.title}
        </h3>
        <button
          onClick={() => onDelete(bookmark.id)}
          className="text-slate-400 hover:text-red-400 transition-colors flex-shrink-0"
          aria-label="Delete bookmark"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* URL */}
      <a
        href={bookmark.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:text-blue-300 text-sm mb-3 block truncate"
      >
        {getDomain(bookmark.url)}
      </a>

      {/* Tags */}
      {bookmark.tags && bookmark.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {bookmark.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-block bg-slate-600 text-slate-200 text-xs px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Created date (optional, subtle) */}
      {bookmark.created_at && (
        <p className="text-xs text-slate-500 mt-3">
          Added {new Date(bookmark.created_at).toLocaleDateString()}
        </p>
      )}
    </div>
  )
}

export default BookmarkCard

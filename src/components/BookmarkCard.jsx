function BookmarkCard({ bookmark, onDelete, onEdit }) {
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
      {/* Header with favicon, title and delete button */}
      <div className="flex items-start gap-3 mb-2">
        {/* Favicon */}
        {bookmark.favicon ? (
          <img
            src={bookmark.favicon}
            alt=""
            className="w-6 h-6 mt-0.5 rounded flex-shrink-0"
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
        ) : (
          <div className="w-6 h-6 mt-0.5 bg-slate-600 rounded flex-shrink-0 flex items-center justify-center">
            <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
        )}

        {/* Title */}
        <h3 className="font-semibold text-slate-100 text-lg flex-1">
          {bookmark.title}
        </h3>

        {/* Action buttons */}
        <div className="flex gap-2 flex-shrink-0">
          {/* Edit button */}
          <button
            onClick={() => onEdit(bookmark)}
            className="text-slate-400 hover:text-blue-400 transition-colors"
            aria-label="Edit bookmark"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          {/* Delete button */}
          <button
            onClick={() => onDelete(bookmark.id)}
            className="text-slate-400 hover:text-red-400 transition-colors"
            aria-label="Delete bookmark"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* URL */}
      <a
        href={bookmark.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:text-blue-300 text-sm mb-3 block truncate ml-9"
      >
        {getDomain(bookmark.url)}
      </a>

      {/* Tags */}
      {bookmark.tags && bookmark.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 ml-9">
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
        <p className="text-xs text-slate-500 mt-3 ml-9">
          Added {new Date(bookmark.created_at).toLocaleDateString()}
        </p>
      )}
    </div>
  )
}

export default BookmarkCard

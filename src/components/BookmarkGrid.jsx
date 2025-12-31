import BookmarkCard from './BookmarkCard'

function BookmarkGrid({ bookmarks, onDeleteBookmark, onEditBookmark }) {
  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-slate-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-slate-300">No bookmarks</h3>
        <p className="mt-1 text-sm text-slate-400">Get started by adding your first bookmark.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
      {bookmarks.map((bookmark) => (
        <BookmarkCard
          key={bookmark.id}
          bookmark={bookmark}
          onDelete={onDeleteBookmark}
          onEdit={onEditBookmark}
        />
      ))}
    </div>
  )
}

export default BookmarkGrid
